"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const analytics_service_js_1 = require("./analytics.service.js");
class AnalyticsController {
    static async getDashboard(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId)
                return res.status(401).json({ error: 'Unauthorized' });
            const data = await analytics_service_js_1.AnalyticsService.getDashboardData(userId);
            return res.json(data);
        }
        catch (error) {
            console.error('Analytics getDashboard error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.AnalyticsController = AnalyticsController;
//# sourceMappingURL=analytics.controller.js.map