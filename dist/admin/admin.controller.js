"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_service_1 = require("./admin.service");
const router = (0, express_1.Router)();
// Admin routes
router.get("/accounts", getAllAccounts);
router.put("/accounts/:id", updateAccount);
router.delete("/accounts/:id", deleteAccount);
router.get("/requests", getAllRequests);
router.put("/requests/:id/status", updateRequestStatus);
function getAllAccounts(req, res, next) {
    admin_service_1.adminService.getAllAccounts()
        .then(accounts => res.json(accounts))
        .catch(err => next(err));
}
function updateAccount(req, res, next) {
    admin_service_1.adminService.updateAccount(Number(req.params.id), req.body)
        .then(result => res.json(result))
        .catch(err => next(err));
}
function deleteAccount(req, res, next) {
    admin_service_1.adminService.deleteAccount(Number(req.params.id))
        .then(result => res.json(result))
        .catch(err => next(err));
}
function getAllRequests(req, res, next) {
    // This will connect to your requests controller
    admin_service_1.adminService.getAllRequests()
        .then(requests => res.json(requests))
        .catch(err => next(err));
}
function updateRequestStatus(req, res, next) {
    admin_service_1.adminService.updateRequestStatus(Number(req.params.id), req.body.status)
        .then(result => res.json(result))
        .catch(err => next(err));
}
exports.default = router;
