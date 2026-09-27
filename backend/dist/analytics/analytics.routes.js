"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_js_1 = require("./analytics.controller.js");
const auth_middleware_js_1 = require("../auth/auth.middleware.js");
const router = (0, express_1.Router)();
router.use(auth_middleware_js_1.requireAuth);
router.get('/', analytics_controller_js_1.AnalyticsController.getDashboard);
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map