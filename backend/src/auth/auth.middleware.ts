import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import prisma from '../config/db.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-access-token-key-change-this-in-production';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'GUEST' | 'USER' | 'ADMIN';
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Access token required' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Access token empty' });
    }

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Unauthorized', message: 'Token expired', code: 'TOKEN_EXPIRED' });
      }
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid access token' });
    }

    const payload = decoded as TokenPayload;

    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, isEmailVerified: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'User no longer exists' });
    }

    // Attach user information to request
    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role as 'GUEST' | 'USER' | 'ADMIN',
    };

    next();
  } catch (error) {
    console.error('requireAuth middleware error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Authentication verification failure' });
  }
}

export function requireRole(allowedRoles: ('GUEST' | 'USER' | 'ADMIN')[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden', message: 'Insufficient access privileges' });
    }

    next();
  };
}
