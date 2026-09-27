"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewController = void 0;
const interview_service_js_1 = require("./interview.service.js");
const gemini_service_js_1 = require("../ai/gemini.service.js");
const db_js_1 = __importDefault(require("../config/db.js"));
class InterviewController {
    static async start(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId)
                return res.status(401).json({ error: 'Unauthorized' });
            const { type, company, role, difficulty } = req.body;
            const result = await interview_service_js_1.InterviewService.startInterview(userId, type, company || 'Tech', role || 'Software Engineer', difficulty || 'MEDIUM');
            return res.json(result);
        }
        catch (error) {
            console.error('Interview start error:', error);
            return res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    static async answer(req, res) {
        try {
            const { id } = req.params; // interviewId
            const { questionId, answerText } = req.body;
            const result = await interview_service_js_1.InterviewService.submitAnswer(id, questionId, answerText);
            return res.json(result);
        }
        catch (error) {
            console.error('Interview answer error:', error);
            return res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    static async complete(req, res) {
        try {
            const { id } = req.params; // interviewId
            const result = await interview_service_js_1.InterviewService.completeInterview(id);
            return res.json(result);
        }
        catch (error) {
            console.error('Interview complete error:', error);
            return res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    static async getInterview(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId)
                return res.status(401).json({ error: 'Unauthorized' });
            const interview = await db_js_1.default.interview.findUnique({
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
            if (!interview)
                return res.status(404).json({ error: 'Interview not found' });
            if (interview.userId !== userId)
                return res.status(403).json({ error: 'Forbidden' });
            return res.json(interview);
        }
        catch (error) {
            console.error('Get interview error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    static async getHistory(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId)
                return res.status(401).json({ error: 'Unauthorized' });
            const interviews = await db_js_1.default.interview.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' }
            });
            return res.json(interviews);
        }
        catch (error) {
            console.error('Get interviews error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    static async evaluateSpeechX(req, res) {
        try {
            const { responses } = req.body;
            const evaluation = await gemini_service_js_1.GeminiService.evaluateSpeechXAssessment(responses || []);
            return res.json(evaluation);
        }
        catch (error) {
            console.error('SpeechX evaluation error:', error);
            return res.status(500).json({ error: 'Failed to evaluate SpeechX assessment' });
        }
    }
}
exports.InterviewController = InterviewController;
//# sourceMappingURL=interview.controller.js.map