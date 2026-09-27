"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const learning_controller_js_1 = require("./learning.controller.js");
const auth_middleware_js_1 = require("../auth/auth.middleware.js");
const router = (0, express_1.Router)();
router.use(auth_middleware_js_1.requireAuth);
router.get('/roadmap', learning_controller_js_1.LearningController.getRoadmap);
router.post('/roadmap', learning_controller_js_1.LearningController.getRoadmap);
exports.default = router;
//# sourceMappingURL=learning.routes.js.map