import { Request, Response } from 'express';
import { InterviewService } from './interview.service.js';
import { GeminiService } from '../ai/gemini.service.js';
import prisma from '../config/db.js';

export class InterviewController {
  static async start(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { type, company, role, difficulty } = req.body;
      const result = await InterviewService.startInterview(userId, type, company || 'Tech', role || 'Software Engineer', difficulty || 'MEDIUM');
      return res.json(result);
    } catch (error: any) {
      console.error('Interview start error:', error);
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async answer(req: Request, res: Response) {
    try {
      const { id } = req.params; // interviewId
      const { questionId, answerText } = req.body;

      const result = await InterviewService.submitAnswer(id, questionId, answerText);
      return res.json(result);
    } catch (error: any) {
      console.error('Interview answer error:', error);
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async complete(req: Request, res: Response) {
    try {
      const { id } = req.params; // interviewId
      const result = await InterviewService.completeInterview(id);
      return res.json(result);
    } catch (error: any) {
      console.error('Interview complete error:', error);
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async getInterview(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const interview = await prisma.interview.findUnique({
        where: { id },
        include: {
          questions: {
            include: { answer: true },
            orderBy: { order: 'asc' }
          },
          feedbacks: true,
          transcripts: true
        }
      });

      if (!interview) return res.status(404).json({ error: 'Interview not found' });
      if (interview.userId !== userId) return res.status(403).json({ error: 'Forbidden' });

      return res.json(interview);
    } catch (error: any) {
      console.error('Get interview error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getHistory(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const interviews = await prisma.interview.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      return res.json(interviews);
    } catch (error: any) {
      console.error('Get interviews error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async evaluateSpeechX(req: Request, res: Response) {
    try {
      const { responses } = req.body;
      const evaluation = await GeminiService.evaluateSpeechXAssessment(responses || []);
      return res.json(evaluation);
    } catch (error: any) {
      console.error('SpeechX evaluation error:', error);
      return res.status(500).json({ error: 'Failed to evaluate SpeechX assessment' });
    }
  }
}
