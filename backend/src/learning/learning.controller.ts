import { Request, Response } from 'express';
import { LearningService } from './learning.service.js';

export class LearningController {
  static async getRoadmap(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const goal = (req.query.goal as string) || (req.body && req.body.goal) || 'Full Stack Engineer';
      const roadmap = await LearningService.generateRoadmap(userId, goal);
      return res.json(roadmap);
    } catch (error: any) {
      console.error('Learning getRoadmap error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
