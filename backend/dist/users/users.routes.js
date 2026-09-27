"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_js_1 = require("./users.controller.js");
const auth_middleware_js_1 = require("../auth/auth.middleware.js");
const router = (0, express_1.Router)();
// All user routes require authentication
router.use(auth_middleware_js_1.requireAuth);
router.get('/profile', users_controller_js_1.UsersController.getProfile);
router.put('/profile', users_controller_js_1.UsersController.updateProfile);
router.get('/resumes', users_controller_js_1.UsersController.getResumes);
exports.default = router;
//# sourceMappingURL=users.routes.js.map