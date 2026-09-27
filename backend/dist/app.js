"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const db_js_1 = __importDefault(require("./config/db.js"));
const redis_js_1 = __importDefault(require("./config/redis.js"));
const auth_routes_js_1 = __importDefault(require("./auth/auth.routes.js"));
const users_routes_js_1 = __importDefault(require("./users/users.routes.js"));
const resumes_routes_js_1 = __importDefault(require("./resumes/resumes.routes.js"));
const ats_routes_js_1 = __importDefault(require("./ats/ats.routes.js"));
const interview_routes_js_1 = __importDefault(require("./interviews/interview.routes.js"));
const coding_routes_js_1 = __importDefault(require("./coding/coding.routes.js"));
const analytics_routes_js_1 = __importDefault(require("./analytics/analytics.routes.js"));
const learning_routes_js_1 = __importDefault(require("./learning/learning.routes.js"));
const admin_routes_js_1 = __importDefault(require("./admin/admin.routes.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Security Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
// Cookie Parser Middleware
app.use((req, res, next) => {
    const cookieHeader = req.headers.cookie;
    req.cookies = {};
    if (cookieHeader) {
        cookieHeader.split(';').forEach((cookie) => {
            const parts = cookie.split('=');
            const name = parts[0].trim();
            const value = parts.slice(1).join('=');
            req.cookies[name] = decodeURIComponent(value);
        });
    }
    next();
});
// Body Parsing Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve Static Files
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads'), {
    setHeaders: (res) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));
// Mount Routes
app.use('/api/v1/auth', auth_routes_js_1.default);
app.use('/api/v1/users', users_routes_js_1.default);
app.use('/api/v1/resumes', resumes_routes_js_1.default);
app.use('/api/v1/ats', ats_routes_js_1.default);
app.use('/api/v1/interviews', interview_routes_js_1.default);
app.use('/api/v1/coding', coding_routes_js_1.default);
app.use('/api/v1/analytics', analytics_routes_js_1.default);
app.use('/api/v1/learning', learning_routes_js_1.default);
app.use('/api/v1/admin', admin_routes_js_1.default);
// Version Info
const VERSION = '1.0.0';
// Global welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to InterviewIQ AI API',
        version: VERSION,
        status: 'running'
    });
});
// Health Checks
// /health: Basic check to see if the process is alive
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        timestamp: new Date().toISOString(),
    });
});
// /version: API Version endpoint
app.get('/version', (req, res) => {
    res.json({
        version: VERSION,
    });
});
// /ready: Full readiness check evaluating DB and Redis connectivity
app.get('/ready', async (req, res) => {
    const checks = {
        database: 'DOWN',
        redis: 'DOWN',
    };
    let isReady = true;
    // 1. Check Database connection
    try {
        await db_js_1.default.$queryRaw `SELECT 1`;
        checks.database = 'UP';
    }
    catch (error) {
        console.error('Database readiness check failed:', error);
        isReady = false;
    }
    // 2. Check Redis connection
    try {
        const redisStatus = await redis_js_1.default.ping();
        if (redisStatus === 'PONG') {
            checks.redis = 'UP';
        }
        else {
            isReady = false;
        }
    }
    catch (error) {
        console.error('Redis readiness check failed:', error);
        isReady = false;
    }
    res.status(isReady ? 200 : 503).json({
        status: isReady ? 'READY' : 'NOT_READY',
        timestamp: new Date().toISOString(),
        services: checks,
    });
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack || err.message);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map