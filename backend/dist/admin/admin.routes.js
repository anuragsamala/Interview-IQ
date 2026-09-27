"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_js_1 = require("./admin.controller.js");
const auth_middleware_js_1 = require("../auth/auth.middleware.js");
const router = (0, express_1.Router)();
router.use(auth_middleware_js_1.requireAuth);
router.get('/overview', admin_controller_js_1.AdminController.getOverview);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map