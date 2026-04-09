"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const validateRequest_1 = require("../_middleware/validateRequest");
const department_service_1 = require("./department.service");
const db_1 = require("../_helpers/db");
const router = (0, express_1.Router)();
// routes
router.get("/", getAll);
router.get("/list", getDepartmentsList); // For dropdown
router.get("/:id", getById);
router.post("/", createSchema, create);
router.post("/register", createSchema, create); // Alias for HTML compatibility
router.put("/:id", updateSchema, update);
router.delete("/:id", _delete);
function getAll(req, res, next) {
    console.log("GetAll departments function called");
    console.log("Database Department model:", db_1.db.Department);
    department_service_1.departmentService.getAll()
        .then(departments => {
        console.log("Departments found:", departments);
        console.log("Number of departments:", departments.length);
        res.json({ departments }); // Wrap in object for HTML compatibility
    })
        .catch(err => {
        console.log("Error in getAll:", err);
        next(err);
    });
}
function getDepartmentsList(req, res, next) {
    // Simple list for dropdown - just id and name
    department_service_1.departmentService.getAll()
        .then(departments => {
        const list = departments.map((dept) => ({
            id: dept.id,
            name: dept.name
        }));
        res.json(list);
    })
        .catch(err => next(err));
}
function getById(req, res, next) {
    department_service_1.departmentService.getById(Number(req.params.id))
        .then(department => res.json(department))
        .catch(err => next(err));
}
function create(req, res, next) {
    console.log("Create department function called");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("Request headers:", req.headers);
    department_service_1.departmentService.create(req.body)
        .then(department => {
        console.log("Department created successfully:", department);
        res.status(201).json({ message: "Department created", department });
    })
        .catch(err => {
        console.error("Error creating department:", err.message);
        next(err);
    });
}
function update(req, res, next) {
    console.log("Update function called");
    console.log("Request body:", req.body);
    console.log("Department ID:", req.params.id);
    department_service_1.departmentService.update(Number(req.params.id), req.body)
        .then(department => res.json({ message: "Department updated" }))
        .catch(err => next(err));
}
function _delete(req, res, next) {
    console.log("Delete function called");
    console.log("Department ID to delete:", req.params.id);
    department_service_1.departmentService.delete(Number(req.params.id))
        .then(() => res.json({ message: "Department deleted" }))
        .catch(err => next(err));
}
function createSchema(req, res, next) {
    const schema = joi_1.default.object({
        name: joi_1.default.string().optional(),
        description: joi_1.default.string().optional(),
        createdAt: joi_1.default.date().optional(),
        updatedAt: joi_1.default.date().optional(),
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
function updateSchema(req, res, next) {
    const schema = joi_1.default.object({
        name: joi_1.default.string().optional(),
        description: joi_1.default.string().optional(),
        createdAt: joi_1.default.date().optional(),
        updatedAt: joi_1.default.date().optional(),
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
exports.default = router;
