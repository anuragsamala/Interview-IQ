"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resumes_controller_js_1 = require("./resumes.controller.js");
const auth_middleware_js_1 = require("../auth/auth.middleware.js");
const multer_js_1 = require("../config/multer.js");
const router = (0, express_1.Router)();
// All resume routes require authentication
router.use(auth_middleware_js_1.requireAuth);
router.post('/upload', multer_js_1.upload.single('resume'), resumes_controller_js_1.ResumesController.uploadResume);
router.get('/', resumes_controller_js_1.ResumesController.getResumes);
router.delete('/:id', resumes_controller_js_1.ResumesController.deleteResume);
exports.default = router;
//# sourceMappingURL=resumes.routes.js.map