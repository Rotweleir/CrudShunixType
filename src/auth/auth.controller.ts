import type { Request, Response, NextFunction } from "express";
import { Router } from "express";
import Joi from "joi";
import { validateRequest } from "../_middleware/validateRequest";
import { authService } from "./auth.service";

const router = Router();

// Routes
router.post("/login", loginSchema, login);
router.post("/register", registerSchema, register);
router.get("/profile", getProfile);

function login(req: Request, res: Response, next: NextFunction): void {
    authService.login(req.body)
        .then((result: any) => res.json(result))
        .catch((err: any) => next(err));
}

function register(req: Request, res: Response, next: NextFunction): void {
    authService.register(req.body)
        .then((result: any) => res.status(201).json(result))
        .catch((err: any) => next(err));
}

function getProfile(req: Request, res: Response, next: NextFunction): void {
    // Extract user ID from token (for now, we'll use a simple approach)
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return next('Unauthorized');
    }
    
    // Extract user ID from fake token (format: fake-jwt-token-{id})
    const userId = token.split('-').pop();
    
    authService.getProfile(Number(userId))
        .then((profile: any) => res.json(profile))
        .catch((err: any) => next(err));
}

function loginSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function registerSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().min(6).required(),
        email: Joi.string().email().optional(),
        role: Joi.string().valid('user', 'admin').default('user')
    });
    validateRequest(req, next, schema);
}

export default router;
