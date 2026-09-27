"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
// In-memory fallback cache for when Redis server is not running locally
class InMemoryCache {
    store = new Map();
    async get(key) {
        const item = this.store.get(key);
        if (!item)
            return null;
        if (item.expiresAt && Date.now() > item.expiresAt) {
            this.store.delete(key);
            return null;
        }
        return item.value;
    }
    async set(key, value, ...args) {
        let expiresAt;
        if (args[0] === 'EX' && typeof args[1] === 'number') {
            expiresAt = Date.now() + args[1] * 1000;
        }
        this.store.set(key, { value, expiresAt });
        return 'OK';
    }
    async del(key) {
        return this.store.delete(key) ? 1 : 0;
    }
}
const memoryCache = new InMemoryCache();
let isRedisAvailable = false;
let hasWarned = false;
// Create ioredis client with limited reconnect attempts
const client = new ioredis_1.default(redisUrl, {
    maxRetriesPerRequest: 1,
    lazyConnect: true,
    retryStrategy(times) {
        if (times > 2) {
            if (!hasWarned) {
                hasWarned = true;
                console.warn('⚠️  Redis server is not running locally. Using graceful in-memory cache fallback.');
            }
            return null; // Stop reconnecting
        }
        return 1000;
    },
});
client.on('connect', () => {
    isRedisAvailable = true;
    console.log('Redis connected successfully.');
});
client.on('error', (err) => {
    isRedisAvailable = false;
    if (!hasWarned) {
        hasWarned = true;
        console.warn('⚠️  Redis connection unavailable. Using in-memory cache fallback for OTP & sessions.');
    }
});
// Try to connect once in background without crashing
client.connect().catch(() => {
    isRedisAvailable = false;
});
// Unified Redis proxy that delegates to real Redis when online, or in-memory cache when offline
const redisProxy = {
    async get(key) {
        if (isRedisAvailable) {
            try {
                return await client.get(key);
            }
            catch {
                return await memoryCache.get(key);
            }
        }
        return await memoryCache.get(key);
    },
    async set(key, value, ...args) {
        if (isRedisAvailable) {
            try {
                // @ts-ignore
                return await client.set(key, value, ...args);
            }
            catch {
                return await memoryCache.set(key, value, ...args);
            }
        }
        return await memoryCache.set(key, value, ...args);
    },
    async del(key) {
        if (isRedisAvailable) {
            try {
                return await client.del(key);
            }
            catch {
                return await memoryCache.del(key);
            }
        }
        return await memoryCache.del(key);
    },
    on(event, listener) {
        return client.on(event, listener);
    },
};
exports.default = redisProxy;
//# sourceMappingURL=redis.js.map