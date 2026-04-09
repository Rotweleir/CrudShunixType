import type { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { adminService } from "./admin.service";

const router = Router();

// Admin routes
router.get("/accounts", getAllAccounts);
router.put("/accounts/:id", updateAccount);
router.delete("/accounts/:id", deleteAccount);
router.get("/requests", getAllRequests);
router.put("/requests/:id/status", updateRequestStatus);

function getAllAccounts(req: Request, res: Response, next: NextFunction): void {
    adminService.getAllAccounts()
        .then(accounts => res.json(accounts))
        .catch(err => next(err));
}

function updateAccount(req: Request, res: Response, next: NextFunction): void {
    adminService.updateAccount(Number(req.params.id), req.body)
        .then(result => res.json(result))
        .catch(err => next(err));
}

function deleteAccount(req: Request, res: Response, next: NextFunction): void {
    adminService.deleteAccount(Number(req.params.id))
        .then(result => res.json(result))
        .catch(err => next(err));
}

function getAllRequests(req: Request, res: Response, next: NextFunction): void {
    // This will connect to your requests controller
    adminService.getAllRequests()
        .then(requests => res.json(requests))
        .catch(err => next(err));
}

function updateRequestStatus(req: Request, res: Response, next: NextFunction): void {
    adminService.updateRequestStatus(Number(req.params.id), req.body.status)
        .then(result => res.json(result))
        .catch(err => next(err));
}

export default router;
