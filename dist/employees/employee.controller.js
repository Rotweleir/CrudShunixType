"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const validateRequest_1 = require("../_middleware/validateRequest");
const employee_service_1 = require("./employee.service");
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
    console.log("GetAll employees function called");
    console.log("Database Employee model:", db_1.db.Employee);
    employee_service_1.employeeService.getAll()
        .then(employees => {
        console.log("Employees found:", employees);
        console.log("Number of employees:", employees.length);
        res.json({ employees }); // Wrap in object for HTML compatibility
    })
        .catch(err => {
        console.log("Error in getAll:", err);
        next(err);
    });
}
function getById(req, res, next) {
    employee_service_1.employeeService.getById(Number(req.params.id))
        .then(employee => res.json(employee))
        .catch(err => next(err));
}
function create(req, res, next) {
    console.log("Create employee function called");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("Request headers:", req.headers);
    employee_service_1.employeeService.create(req.body)
        .then(employee => {
        console.log("Employee created successfully:", employee);
        res.status(201).json({ message: "Employee created", employee });
    })
        .catch(err => {
        console.error("Error creating employee:", err.message);
        next(err);
    });
}
function update(req, res, next) {
    console.log("Update function called");
    console.log("Request body:", req.body);
    console.log("Employee ID:", req.params.id);
    employee_service_1.employeeService.update(Number(req.params.id), req.body)
        .then(employee => res.json({ message: "Employee updated" }))
        .catch(err => next(err));
}
function _delete(req, res, next) {
    console.log("Delete function called");
    console.log("Employee ID to delete:", req.params.id);
    employee_service_1.employeeService.delete(Number(req.params.id))
        .then(() => res.json({ message: "Employee deleted" }))
        .catch(err => next(err));
}
function createSchema(req, res, next) {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required(),
        position: joi_1.default.string().required(),
        departmentId: joi_1.default.number().integer().required()
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
function updateSchema(req, res, next) {
    const schema = joi_1.default.object({
        name: joi_1.default.string().optional(),
        position: joi_1.default.string().optional(),
        departmentId: joi_1.default.number().integer().optional()
    });
    (0, validateRequest_1.validateRequest)(req, next, schema);
}
exports.default = router;
