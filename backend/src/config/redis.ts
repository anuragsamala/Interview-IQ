import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// In-memory fallback cache for when Redis server is not running locally
class InMemoryCache {
  private store = new Map<string, { value: string; expiresAt?: number }>();

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, ...args: any[]): Promise<'OK'> {
    let expiresAt: number | undefined;
    if (args[0] === 'EX' && typeof args[1] === 'number') {
      expiresAt = Date.now() + args[1] * 1000;
    }
    this.store.set(key, { value, expiresAt });
    return 'OK';
  }

  async del(key: string): Promise<number> {
    return this.store.delete(key) ? 1 : 0;
  }
}

const memoryCache = new InMemoryCache();
let isRedisAvailable = false;
let hasWarned = false;

// Create ioredis client with limited reconnect attempts
const client = new Redis(redisUrl, {
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
  async get(key: string): Promise<string | null> {
    if (isRedisAvailable) {
      try {
        return await client.get(key);
      } catch {
        return await memoryCache.get(key);
      }
    }
    return await memoryCache.get(key);
  },

  async set(key: string, value: string, ...args: any[]): Promise<'OK'> {
    if (isRedisAvailable) {
      try {
        // @ts-ignore
        return await client.set(key, value, ...args);
      } catch {
        return await memoryCache.set(key, value, ...args);
      }
    }
    return await memoryCache.set(key, value, ...args);
  },

  async del(key: string): Promise<number> {
    if (isRedisAvailable) {
      try {
        return await client.del(key);
      } catch {
        return await memoryCache.del(key);
      }
    }
    return await memoryCache.del(key);
  },

  on(event: string, listener: (...args: any[]) => void) {
    return client.on(event, listener);
  },
};

export default redisProxy as unknown as Redis;
