"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_js_1 = require("./auth.controller.js");
const router = (0, express_1.Router)();
router.post('/register', auth_controller_js_1.AuthController.register);
router.post('/verify-email', auth_controller_js_1.AuthController.verifyEmail);
router.post('/login', auth_controller_js_1.AuthController.login);
router.post('/login-otp', auth_controller_js_1.AuthController.requestLoginOtp);
router.post('/oauth', auth_controller_js_1.AuthController.oauth);
router.post('/refresh', auth_controller_js_1.AuthController.refresh);
router.post('/logout', auth_controller_js_1.AuthController.logout);
router.post('/forgot-password', auth_controller_js_1.AuthController.forgotPassword);
router.post('/reset-password', auth_controller_js_1.AuthController.resetPassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map