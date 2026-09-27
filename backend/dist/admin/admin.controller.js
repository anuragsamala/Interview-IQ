"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_js_1 = require("./admin.service.js");
class AdminController {
    static async getOverview(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId)
                return res.status(401).json({ error: 'Unauthorized' });
            // In production, check user role === ADMIN here
            // For prototype, allow any authenticated user
            const overview = await admin_service_js_1.AdminService.getSystemOverview();
            return res.json(overview);
        }
        catch (error) {
            console.error('Admin getOverview error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map