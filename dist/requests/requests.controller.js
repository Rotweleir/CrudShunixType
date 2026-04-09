"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const validateRequest_1 = require("../_middleware/validateRequest");
const requests_service_1 = require("./requests.service");
const db_1 = require("../_helpers/db");
const router = (0, express_1.Router)();
// routes
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", createSchema, create);
router.post("/register", createSchema, create); // Alias for HTML compatibility
router.put("/:id", updateSchema, update);
router.delete("/:id", _delete);
function getAll(req, res, next) {
    console.log("GetAll function called");
    console.log("Database Request model:", db_1.db.Request);
    requests_service_1.requestService.getAll()
        .then(requests => {
        console.log("Requests found:", requests);
        console.log("Number of requests:", requests.length);
        res.json(requests);
    })
        .catch(err => {
        console.log("Error in getAll:", err);
        next(err);
    });
}
function getById(req, res, next) {
    requests_service_1.requestService.getById(Number(req.params.id))
        .then(request => res.json(request))
        .catch(err => next(err));
}
function create(req, res, next) {
    console.log("Create request function called");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("Request headers:", req.headers);
    requests_service_1.requestService.create(req.body)
        .then(request => {
        console.log("Request created successfully:", request);
        res.status(201).json({ message: "Request created", request });
    })
        .catch(err => {
        console.error("Error creating request:", err.message);
        next(err);
    });
}
function update(req, res, next) {
    console.log("Update function called");
    console.log("Request body:", req.body);
    console.log("Request ID:", req.params.id);
    requests_service_1.requestService.update(Number(req.params.id), req.body)
        .then(request => res.json({ message: "Request updated" }))
        .catch(err => next(err));
}
function _delete(req, res, next) {
    console.log("Delete function called");
    console.log("Request ID to delete:", req.params.id);
    requests_service_1.requestService.delete(Number(req.params.id))
        .then(() => res.json({ message: "Request deleted" }))
        .catch(err => next(err));
}
function createSchema(req, res, next) {
    const schema = joi_1.default.object({
        userId: joi_1.default.number().integer().required(),
        requestType: joi_1.default.string().required(),
        purpose: joi_1.default.string().required(),
        status: joi_1.default.string().optional()
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
function updateSchema(req, res, next) {
    const schema = joi_1.default.object({
        userId: joi_1.default.number().integer().optional(),
        requestType: joi_1.default.string().optional(),
        purpose: joi_1.default.string().optional(),
        status: joi_1.default.string().optional()
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
exports.default = router;
