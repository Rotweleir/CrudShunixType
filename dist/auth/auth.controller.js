"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const validateRequest_1 = require("../_middleware/validateRequest");
const auth_service_1 = require("./auth.service");
const router = (0, express_1.Router)();
// Routes
router.post("/login", loginSchema, login);
router.post("/register", registerSchema, register);
router.get("/profile", getProfile);
function login(req, res, next) {
    auth_service_1.authService.login(req.body)
        .then((result) => res.json(result))
        .catch((err) => next(err));
}
function register(req, res, next) {
    auth_service_1.authService.register(req.body)
        .then((result) => res.status(201).json(result))
        .catch((err) => next(err));
}
function getProfile(req, res, next) {
    // Extract user ID from token (for now, we'll use a simple approach)
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return next('Unauthorized');
    }
    // Extract user ID from fake token (format: fake-jwt-token-{id})
    const userId = token.split('-').pop();
    auth_service_1.authService.getProfile(Number(userId))
        .then((profile) => res.json(profile))
        .catch((err) => next(err));
}
function loginSchema(req, res, next) {
    const schema = joi_1.default.object({
        username: joi_1.default.string().required(),
        password: joi_1.default.string().required()
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
function registerSchema(req, res, next) {
    const schema = joi_1.default.object({
        username: joi_1.default.string().required(),
        password: joi_1.default.string().min(6).required(),
        email: joi_1.default.string().email().optional(),
        role: joi_1.default.string().valid('user', 'admin').default('user')
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
exports.default = router;
