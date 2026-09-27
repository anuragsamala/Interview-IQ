"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodingController = void 0;
const coding_service_js_1 = require("./coding.service.js");
class CodingController {
    static async getProblems(req, res) {
        try {
            const problems = await coding_service_js_1.CodingService.getProblems();
            return res.json(problems);
        }
        catch (error) {
            console.error('Get problems error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    static async submit(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId)
                return res.status(401).json({ error: 'Unauthorized' });
            const { problemId, code, language } = req.body;
            if (!problemId || !code) {
                return res.status(400).json({ error: 'Missing problemId or code' });
            }
            const result = await coding_service_js_1.CodingService.submitCode(userId, problemId, code, language || 'javascript');
            return res.json(result);
        }
        catch (error) {
            console.error('Submit code error:', error);
            return res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    static async getHistory(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId)
                return res.status(401).json({ error: 'Unauthorized' });
            const history = await coding_service_js_1.CodingService.getHistory(userId);
            return res.json(history);
        }
        catch (error) {
            console.error('Get coding history error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.CodingController = CodingController;
//# sourceMappingURL=coding.controller.js.map