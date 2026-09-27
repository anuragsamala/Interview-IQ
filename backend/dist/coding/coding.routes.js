"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const coding_controller_js_1 = require("./coding.controller.js");
const auth_middleware_js_1 = require("../auth/auth.middleware.js");
const router = (0, express_1.Router)();
router.use(auth_middleware_js_1.requireAuth);
router.get('/problems', coding_controller_js_1.CodingController.getProblems);
router.post('/submit', coding_controller_js_1.CodingController.submit);
router.get('/history', coding_controller_js_1.CodingController.getHistory);
exports.default = router;
//# sourceMappingURL=coding.routes.js.map