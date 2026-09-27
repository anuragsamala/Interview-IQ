import { Request, Response } from 'express';
import { AnalyticsService } from './analytics.service.js';

export class AnalyticsController {
  static async getDashboard(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const data = await AnalyticsService.getDashboardData(userId);
      return res.json(data);
    } catch (error: any) {
      console.error('Analytics getDashboard error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
