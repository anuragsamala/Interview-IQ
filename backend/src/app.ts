import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import prisma from './config/db.js';
import redis from './config/redis.js';
import authRoutes from './auth/auth.routes.js';
import usersRoutes from './users/users.routes.js';
import resumesRoutes from './resumes/resumes.routes.js';
import atsRoutes from './ats/ats.routes.js';
import interviewRoutes from './interviews/interview.routes.js';
import codingRoutes from './coding/coding.routes.js';
import analyticsRoutes from './analytics/analytics.routes.js';
import learningRoutes from './learning/learning.routes.js';
import adminRoutes from './admin/admin.routes.js';

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      cookies?: any;
    }
  }
}

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Cookie Parser Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const cookieHeader = req.headers.cookie;
  req.cookies = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach((cookie: string) => {
      const parts = cookie.split('=');
      const name = parts[0].trim();
      const value = parts.slice(1).join('=');
      req.cookies[name] = decodeURIComponent(value);
    });
  }
  next();
});

// Body Parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/resumes', resumesRoutes);
app.use('/api/v1/ats', atsRoutes);
app.use('/api/v1/interviews', interviewRoutes);
app.use('/api/v1/coding', codingRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/learning', learningRoutes);
app.use('/api/v1/admin', adminRoutes);

// Version Info
const VERSION = '1.0.0';

// Global welcome route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to InterviewIQ AI API',
    version: VERSION,
    status: 'running'
  });
});

// Health Checks
// /health: Basic check to see if the process is alive
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
  });
});

// /version: API Version endpoint
app.get('/version', (req: Request, res: Response) => {
  res.json({
    version: VERSION,
  });
});

// /ready: Full readiness check evaluating DB and Redis connectivity
app.get('/ready', async (req: Request, res: Response) => {
  const checks: Record<string, 'UP' | 'DOWN'> = {
    database: 'DOWN',
    redis: 'DOWN',
  };

  let isReady = true;

  // 1. Check Database connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = 'UP';
  } catch (error) {
    console.error('Database readiness check failed:', error);
    isReady = false;
  }

  // 2. Check Redis connection
  try {
    const redisStatus = await redis.ping();
    if (redisStatus === 'PONG') {
      checks.redis = 'UP';
    } else {
      isReady = false;
    }
  } catch (error) {
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
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err.stack || err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
  });
});

export default app;
