import { Request, Response } from 'express';
import prisma from '../config/db.js';
import fs from 'fs';
import { parsePdfBuffer } from '../utils/pdf-parser.js';

export class ResumesController {
  static async uploadResume(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { originalname, filename, size, path: filepath, mimetype } = req.file;

      // Parse PDF
      let extractedText = '';
      try {
        const dataBuffer = fs.readFileSync(filepath);
        extractedText = await parsePdfBuffer(dataBuffer);
      } catch (err: any) {
        console.warn(`Failed to parse PDF: ${err.message}`);
      }

      // Inside a transaction, deactivate previous resumes and insert the new one
      const newResume = await prisma.$transaction(async (tx) => {
        // Mark previous resumes as not current
        await tx.resume.updateMany({
          where: { userId, isCurrent: true },
          data: { isCurrent: false },
        });

        // Insert new resume
        const resume = await tx.resume.create({
          data: {
            userId,
            fileName: originalname,
            fileUrl: `/uploads/resumes/${filename}`,
            fileType: mimetype,
            fileSize: size,
            isCurrent: true,
          },
        });

        if (extractedText) {
          await tx.resumeAnalysis.create({
            data: {
              resumeId: resume.id,
              score: 0,
              parsedDetails: { rawText: extractedText },
              weaknesses: [],
              improvements: []
            }
          });
        }

        return resume;
      });

      return res.status(201).json({
        message: 'Resume uploaded successfully',
        resume: {
          id: newResume.id,
          fileName: newResume.fileName,
          fileUrl: newResume.fileUrl,
          fileType: newResume.fileType,
          fileSize: newResume.fileSize,
          isCurrent: newResume.isCurrent,
          createdAt: newResume.createdAt,
        },
      });
    } catch (error: any) {
      console.error('Upload Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getResumes(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const resumes = await prisma.resume.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fileName: true,
          fileUrl: true,
          fileType: true,
          fileSize: true,
          isCurrent: true,
          createdAt: true,
        },
      });

      return res.json(resumes);
    } catch (error: any) {
      console.error('Get Resumes Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteResume(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const resume = await prisma.resume.findUnique({
        where: { id },
      });

      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ error: 'Resume not found' });
      }

      // Hard delete from database
      await prisma.resume.delete({
        where: { id },
      });

      // Try to remove file from disk
      try {
        // fileUrl is like /uploads/resumes/filename.pdf
        const relativePath = resume.fileUrl.replace(/^\//, ''); // uploads/resumes/filename.pdf
        const absolutePath = process.cwd() + '/' + relativePath;
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath);
        }
      } catch (err) {
        console.warn(`Failed to delete file from disk: ${resume.fileUrl}`);
      }

      return res.json({ message: 'Resume deleted successfully' });
    } catch (error: any) {
      console.error('Delete Resume Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
