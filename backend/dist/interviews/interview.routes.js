"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const interview_controller_js_1 = require("./interview.controller.js");
const auth_middleware_js_1 = require("../auth/auth.middleware.js");
const router = (0, express_1.Router)();
router.use(auth_middleware_js_1.requireAuth);
router.post('/start', interview_controller_js_1.InterviewController.start);
router.post('/speechx/evaluate', interview_controller_js_1.InterviewController.evaluateSpeechX);
router.post('/:id/answer', interview_controller_js_1.InterviewController.answer);
router.post('/:id/complete', interview_controller_js_1.InterviewController.complete);
router.get('/', interview_controller_js_1.InterviewController.getHistory);
router.get('/:id', interview_controller_js_1.InterviewController.getInterview);
exports.default = router;
//# sourceMappingURL=interview.routes.js.map