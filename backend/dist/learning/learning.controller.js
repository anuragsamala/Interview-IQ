"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearningController = void 0;
const learning_service_js_1 = require("./learning.service.js");
class LearningController {
    static async getRoadmap(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId)
                return res.status(401).json({ error: 'Unauthorized' });
            const goal = req.query.goal || (req.body && req.body.goal) || 'Full Stack Engineer';
            const roadmap = await learning_service_js_1.LearningService.generateRoadmap(userId, goal);
            return res.json(roadmap);
        }
        catch (error) {
            console.error('Learning getRoadmap error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.LearningController = LearningController;
//# sourceMappingURL=learning.controller.js.map