import { AnalyticsService } from '../analytics/analytics.service.js';
import { GeminiService } from '../ai/gemini.service.js';
import prisma from '../config/db.js';

export class LearningService {
  static async generateRoadmap(userId: string, goal: string = 'Full Stack Engineer') {
    // 1. Fetch user analytics to find weaknesses
    const dashboard = await AnalyticsService.getDashboardData(userId);
    
    let weaknesses: string[] = [];
    if (dashboard.modules.interviews.topWeaknesses) {
      weaknesses = [...dashboard.modules.interviews.topWeaknesses];
    }
    
    // 2. Fetch user active resume text if available
    let resumeText = '';
    const currentResume = await prisma.resume.findFirst({
      where: { userId, isCurrent: true },
      orderBy: { createdAt: 'desc' },
    });

    if (currentResume) {
      const analysis = await prisma.resumeAnalysis.findFirst({
        where: { resumeId: currentResume.id }
      });
      if (analysis && analysis.parsedDetails && typeof analysis.parsedDetails === 'object') {
        const details = analysis.parsedDetails as any;
        if (details.rawText) {
          resumeText = details.rawText;
        }
      }
    }

    // 3. Ask Gemini to generate a goal-driven, resume-analyzed roadmap
    const roadmap = await GeminiService.generateGoalBasedRoadmap(goal, resumeText, weaknesses);
    
    return {
      ...roadmap,
      resumeFileName: currentResume?.fileName || null,
    };
  }
}
