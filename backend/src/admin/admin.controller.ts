import { Request, Response } from 'express';
import { AdminService } from './admin.service.js';

export class AdminController {
  static async getOverview(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      // In production, check user role === ADMIN here
      // For prototype, allow any authenticated user
      const overview = await AdminService.getSystemOverview();
      return res.json(overview);
    } catch (error: any) {
      console.error('Admin getOverview error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
