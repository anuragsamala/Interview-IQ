import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { 
  registerSchema, 
  verifyOtpSchema, 
  loginSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema,
  oauthSchema
} from './auth.validation.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const validated = registerSchema.parse(req.body);
      const result = await AuthService.register(validated.email, validated.password, validated.name);
      res.status(201).json(result);
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation Error', details: err.errors });
      }
      res.status(400).json({ error: err.message || 'Registration failed' });
    }
  }

  static async verifyEmail(req: Request, res: Response) {
    try {
      const validated = verifyOtpSchema.parse({ ...req.body, purpose: 'EMAIL_VERIFICATION' });
      const user = await AuthService.verifyOtp(validated.email, validated.code, 'EMAIL_VERIFICATION');
      
      // Auto login on successful verification
      const session = await AuthService.createSession(user.id, user.email, user.role);
      
      res.cookie('refreshToken', session.refreshToken, COOKIE_OPTIONS);
      res.status(200).json({
        user: session.user,
        accessToken: session.accessToken,
        message: 'Email verified and logged in successfully',
      });
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation Error', details: err.errors });
      }
      res.status(400).json({ error: err.message || 'OTP verification failed' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const validated = loginSchema.parse(req.body);

      if (validated.code) {
        // OTP Login
        const session = await AuthService.loginWithOtp(validated.email, validated.code);
        res.cookie('refreshToken', session.refreshToken, COOKIE_OPTIONS);
        return res.status(200).json({
          user: session.user,
          accessToken: session.accessToken,
          message: 'Logged in successfully via OTP',
        });
      } else if (validated.password) {
        // Password Login
        const session = await AuthService.loginWithCredentials(validated.email, validated.password);
        res.cookie('refreshToken', session.refreshToken, COOKIE_OPTIONS);
        return res.status(200).json({
          user: session.user,
          accessToken: session.accessToken,
          message: 'Logged in successfully',
        });
      } else {
        // Passwordless OTP Login request
        const user = await AuthService.verifyOtp(validated.email, '', 'LOGIN').catch(() => null);
        await AuthService.sendVerificationOtp(user ? user.id : null, validated.email, 'LOGIN');
        return res.status(200).json({
          message: 'OTP login code dispatched to your email.',
        });
      }
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation Error', details: err.errors });
      }
      res.status(400).json({ error: err.message || 'Login failed' });
    }
  }

  static async requestLoginOtp(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      await AuthService.sendVerificationOtp(null, email, 'LOGIN');
      res.status(200).json({ message: 'Login OTP sent successfully' });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to dispatch login OTP' });
    }
  }

  static async oauth(req: Request, res: Response) {
    try {
      const validated = oauthSchema.parse(req.body);
      const session = await AuthService.authenticateOAuth(
        validated.email,
        validated.name,
        validated.provider,
        validated.providerUserId
      );

      res.cookie('refreshToken', session.refreshToken, COOKIE_OPTIONS);
      res.status(200).json({
        user: session.user,
        accessToken: session.accessToken,
        message: `Logged in successfully via ${validated.provider}`,
      });
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation Error', details: err.errors });
      }
      res.status(400).json({ error: err.message || 'OAuth authentication failed' });
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const oldRefreshToken = req.cookies?.refreshToken;
      if (!oldRefreshToken) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Refresh token cookie missing' });
      }

      const session = await AuthService.refreshSession(oldRefreshToken);
      
      res.cookie('refreshToken', session.refreshToken, COOKIE_OPTIONS);
      res.status(200).json({
        user: session.user,
        accessToken: session.accessToken,
      });
    } catch (err: any) {
      res.status(401).json({ error: 'Unauthorized', message: err.message || 'Session renewal failed' });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : '';
      const refreshToken = req.cookies?.refreshToken;

      if (accessToken) {
        await AuthService.logout(accessToken, refreshToken);
      }

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error', message: err.message || 'Logout failed' });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const validated = forgotPasswordSchema.parse(req.body);
      await AuthService.forgotPassword(validated.email);
      res.status(200).json({
        message: 'If the email matches an active account, a password reset OTP code has been dispatched.',
      });
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation Error', details: err.errors });
      }
      res.status(400).json({ error: err.message || 'Request failed' });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const validated = resetPasswordSchema.parse(req.body);
      await AuthService.resetPassword(validated.email, validated.code, validated.newPassword);
      res.status(200).json({ message: 'Password has been successfully updated' });
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation Error', details: err.errors });
      }
      res.status(400).json({ error: err.message || 'Password reset failed' });
    }
  }
}
