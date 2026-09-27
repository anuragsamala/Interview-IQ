"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearningService = void 0;
const analytics_service_js_1 = require("../analytics/analytics.service.js");
const gemini_service_js_1 = require("../ai/gemini.service.js");
const db_js_1 = __importDefault(require("../config/db.js"));
class LearningService {
    static async generateRoadmap(userId, goal = 'Full Stack Engineer') {
        // 1. Fetch user analytics to find weaknesses
        const dashboard = await analytics_service_js_1.AnalyticsService.getDashboardData(userId);
        let weaknesses = [];
        if (dashboard.modules.interviews.topWeaknesses) {
            weaknesses = [...dashboard.modules.interviews.topWeaknesses];
        }
        // 2. Fetch user active resume text if available
        let resumeText = '';
        const currentResume = await db_js_1.default.resume.findFirst({
            where: { userId, isCurrent: true },
            orderBy: { createdAt: 'desc' },
        });
        if (currentResume) {
            const analysis = await db_js_1.default.resumeAnalysis.findFirst({
                where: { resumeId: currentResume.id }
            });
            if (analysis && analysis.parsedDetails && typeof analysis.parsedDetails === 'object') {
                const details = analysis.parsedDetails;
                if (details.rawText) {
                    resumeText = details.rawText;
                }
            }
        }
        // 3. Ask Gemini to generate a goal-driven, resume-analyzed roadmap
        const roadmap = await gemini_service_js_1.GeminiService.generateGoalBasedRoadmap(goal, resumeText, weaknesses);
        return {
            ...roadmap,
            resumeFileName: currentResume?.fileName || null,
        };
    }
}
exports.LearningService = LearningService;
//# sourceMappingURL=learning.service.js.map