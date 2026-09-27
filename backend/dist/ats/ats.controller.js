"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtsController = void 0;
const db_js_1 = __importDefault(require("../config/db.js"));
const gemini_service_js_1 = require("../ai/gemini.service.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pdf_parser_js_1 = require("../utils/pdf-parser.js");
class AtsController {
    static async scanResume(req, res) {
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
            const currentResume = await db_js_1.default.resume.findFirst({
                where: { userId, isCurrent: true },
                orderBy: { createdAt: 'desc' },
            });
            if (!currentResume) {
                return res.status(404).json({ error: 'No active resume found. Please upload a resume first.' });
            }
            // Check if we already have the raw text cached in ResumeAnalysis
            let rawText = '';
            const analysis = await db_js_1.default.resumeAnalysis.findFirst({
                where: { resumeId: currentResume.id }
            });
            if (analysis && analysis.parsedDetails && typeof analysis.parsedDetails === 'object') {
                const details = analysis.parsedDetails;
                if (details.rawText) {
                    rawText = details.rawText;
                }
            }
            // Fallback: Parse PDF file directly from disk if not yet parsed
            if (!rawText && currentResume.fileUrl) {
                try {
                    const relativePath = currentResume.fileUrl.replace(/^\//, '');
                    const absolutePath = path_1.default.join(process.cwd(), relativePath);
                    if (fs_1.default.existsSync(absolutePath)) {
                        const buffer = fs_1.default.readFileSync(absolutePath);
                        rawText = await (0, pdf_parser_js_1.parsePdfBuffer)(buffer);
                        if (rawText) {
                            await db_js_1.default.resumeAnalysis.create({
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
                }
                catch (parseErr) {
                    console.warn('On-the-fly PDF parse error:', parseErr.message);
                }
            }
            if (!rawText) {
                return res.status(400).json({ error: 'Resume text could not be parsed. Please re-upload your resume in PDF format.' });
            }
            // Generate ATS Report via Gemini
            const reportData = await gemini_service_js_1.GeminiService.generateAtsReport(rawText, jobDescription);
            // Save the report
            const atsReport = await db_js_1.default.atsReport.create({
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
        }
        catch (error) {
            console.error('ATS Scan Error:', error);
            return res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    static async getHistory(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const reports = await db_js_1.default.atsReport.findMany({
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
        }
        catch (error) {
            console.error('Get ATS History Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.AtsController = AtsController;
//# sourceMappingURL=ats.controller.js.map