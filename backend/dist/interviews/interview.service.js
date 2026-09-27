"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewService = void 0;
const db_js_1 = __importDefault(require("../config/db.js"));
const gemini_service_js_1 = require("../ai/gemini.service.js");
class InterviewService {
    static async startInterview(userId, type, company, role, difficulty) {
        const interview = await db_js_1.default.interview.create({
            data: {
                userId,
                type: type,
                company,
                role,
                difficulty,
                status: 'IN_PROGRESS',
            }
        });
        // Generate first question
        const questionText = await gemini_service_js_1.GeminiService.generateInterviewQuestion(type, role, company, difficulty, []);
        const question = await db_js_1.default.interviewQuestion.create({
            data: {
                interviewId: interview.id,
                questionText,
                order: 1
            }
        });
        return { interview, question };
    }
    static async submitAnswer(interviewId, questionId, answerText) {
        // Save the answer
        await db_js_1.default.interviewAnswer.create({
            data: {
                questionId,
                answerText,
                transcript: answerText, // for text-based, transcript is the answer
                speechDuration: 0,
                fillerWordCount: 0,
                speakingSpeed: 0,
                grammarScore: 0,
                communicationScore: 0,
                relevanceScore: 0
            }
        });
        // Fetch the interview to get context for next question
        const interview = await db_js_1.default.interview.findUnique({
            where: { id: interviewId },
            include: {
                questions: {
                    include: { answer: true },
                    orderBy: { order: 'asc' }
                }
            }
        });
        if (!interview)
            throw new Error("Interview not found");
        // Build conversation history
        const history = [];
        for (const q of interview.questions) {
            history.push({ role: 'interviewer', text: q.questionText });
            if (q.answer) {
                history.push({ role: 'candidate', text: q.answer.answerText });
            }
        }
        // Check if we hit a limit (e.g., 5 questions for mock)
        if (interview.questions.length >= 5) {
            return { completed: true };
        }
        // Generate next question
        const nextQuestionText = await gemini_service_js_1.GeminiService.generateInterviewQuestion(interview.type, interview.role || 'General', interview.company || 'Tech', interview.difficulty, history);
        const nextQuestion = await db_js_1.default.interviewQuestion.create({
            data: {
                interviewId: interview.id,
                questionText: nextQuestionText,
                order: interview.questions.length + 1
            }
        });
        return { completed: false, nextQuestion };
    }
    static async completeInterview(interviewId) {
        const interview = await db_js_1.default.interview.findUnique({
            where: { id: interviewId },
            include: {
                questions: {
                    include: { answer: true },
                    orderBy: { order: 'asc' }
                }
            }
        });
        if (!interview)
            throw new Error("Interview not found");
        // Build full transcript
        let transcriptText = '';
        for (const q of interview.questions) {
            transcriptText += `Interviewer: ${q.questionText}\n`;
            if (q.answer) {
                transcriptText += `Candidate: ${q.answer.answerText}\n\n`;
            }
        }
        // Generate feedback
        const feedbackData = await gemini_service_js_1.GeminiService.generateInterviewFeedback(interview.type, interview.role || 'General', interview.difficulty, transcriptText);
        // Save Transcript
        await db_js_1.default.interviewTranscript.create({
            data: {
                interviewId,
                fullText: transcriptText
            }
        });
        // Save Feedback
        await db_js_1.default.interviewFeedback.create({
            data: {
                interviewId,
                generalFeedback: feedbackData.generalFeedback,
                technicalFeedback: feedbackData.technicalFeedback,
                communicationFeedback: feedbackData.communicationFeedback
            }
        });
        // Update Interview status
        const updatedInterview = await db_js_1.default.interview.update({
            where: { id: interviewId },
            data: {
                status: 'COMPLETED',
                score: feedbackData.score,
                overallRating: feedbackData.overallRating,
                hiringRecommendation: feedbackData.hiringRecommendation,
                strengths: feedbackData.strengths,
                weaknesses: feedbackData.weaknesses
            }
        });
        return updatedInterview;
    }
}
exports.InterviewService = InterviewService;
//# sourceMappingURL=interview.service.js.map