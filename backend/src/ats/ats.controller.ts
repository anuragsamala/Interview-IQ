import { Request, Response } from 'express';
import prisma from '../config/db.js';
import { GeminiService } from '../ai/gemini.service.js';
import fs from 'fs';
import path from 'path';
import { parsePdfBuffer } from '../utils/pdf-parser.js';

export class AtsController {
  static async scanResume(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { jobDescription } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!jobDescription || jobDescription.trim().length < 50) {
        return res.status(400).json({ error: 'Please provide a valid job description (min 50 chars).' });
      }

      // Find the user's active resume
      const currentResume = await prisma.resume.findFirst({
        where: { userId, isCurrent: true },
        orderBy: { createdAt: 'desc' },
      });

      if (!currentResume) {
        return res.status(404).json({ error: 'No active resume found. Please upload a resume first.' });
      }

      // Check if we already have the raw text cached in ResumeAnalysis
      let rawText = '';
      const analysis = await prisma.resumeAnalysis.findFirst({
        where: { resumeId: currentResume.id }
      });

      if (analysis && analysis.parsedDetails && typeof analysis.parsedDetails === 'object') {
        const details = analysis.parsedDetails as any;
        if (details.rawText) {
          rawText = details.rawText;
        }
      }

      // Fallback: Parse PDF file directly from disk if not yet parsed
      if (!rawText && currentResume.fileUrl) {
        try {
          const relativePath = currentResume.fileUrl.replace(/^\//, '');
          const absolutePath = path.join(process.cwd(), relativePath);
          if (fs.existsSync(absolutePath)) {
            const buffer = fs.readFileSync(absolutePath);
            rawText = await parsePdfBuffer(buffer);
            if (rawText) {
              await prisma.resumeAnalysis.create({
                data: {
                  resumeId: currentResume.id,
                  score: 0,
                  parsedDetails: { rawText },
                  weaknesses: [],
                  improvements: []
                }
              });
            }
          }
        } catch (parseErr: any) {
          console.warn('On-the-fly PDF parse error:', parseErr.message);
        }
      }

      if (!rawText) {
        return res.status(400).json({ error: 'Resume text could not be parsed. Please re-upload your resume in PDF format.' });
      }

      // Generate ATS Report via Gemini
      const reportData = await GeminiService.generateAtsReport(rawText, jobDescription);

      // Save the report
      const atsReport = await prisma.atsReport.create({
        data: {
          resumeId: currentResume.id,
          jobDescription,
          matchPercentage: reportData.score,
          missingSkills: reportData.missingKeywords || [],
          missingKeywords: reportData.missingKeywords || [],
          grammarSuggestions: { notes: reportData.improvements || [] },
          formattingSuggestions: { weaknesses: reportData.weaknesses || [] },
        }
      });

      return res.json({
        id: atsReport.id,
        score: reportData.score,
        recruiterScore: reportData.recruiterScore,
        matchedKeywords: reportData.matchedKeywords,
        missingKeywords: reportData.missingKeywords,
        weaknesses: reportData.weaknesses,
        improvements: reportData.improvements,
      });

    } catch (error: any) {
      console.error('ATS Scan Error:', error);
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async getHistory(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const reports = await prisma.atsReport.findMany({
        where: {
          resume: {
            userId
          }
        },
        orderBy: { createdAt: 'desc' },
        include: {
          resume: {
            select: { fileName: true }
          }
        }
      });

      return res.json(reports);
    } catch (error: any) {
      console.error('Get ATS History Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
