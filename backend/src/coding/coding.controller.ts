import { Request, Response } from 'express';
import { CodingService } from './coding.service.js';

export class CodingController {
  static async getProblems(req: Request, res: Response) {
    try {
      const problems = await CodingService.getProblems();
      return res.json(problems);
    } catch (error: any) {
      console.error('Get problems error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async submit(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { problemId, code, language } = req.body;
      if (!problemId || !code) {
        return res.status(400).json({ error: 'Missing problemId or code' });
      }

      const result = await CodingService.submitCode(userId, problemId, code, language || 'javascript');
      return res.json(result);
    } catch (error: any) {
      console.error('Submit code error:', error);
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async getHistory(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const history = await CodingService.getHistory(userId);
      return res.json(history);
    } catch (error: any) {
      console.error('Get coding history error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
