"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ats_controller_js_1 = require("./ats.controller.js");
const auth_middleware_js_1 = require("../auth/auth.middleware.js");
const router = (0, express_1.Router)();
router.use(auth_middleware_js_1.requireAuth);
router.post('/scan', ats_controller_js_1.AtsController.scanResume);
router.get('/history', ats_controller_js_1.AtsController.getHistory);
exports.default = router;
//# sourceMappingURL=ats.routes.js.map