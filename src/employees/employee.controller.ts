import type { Request, Response, NextFunction } from "express";
import { Router } from "express";
import Joi from "joi";
import { validateRequest } from "../_middleware/validateRequest";
import { employeeService } from "./employee.service";
import { db } from "../_helpers/db";



const router = Router();

// routes
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", createSchema, create);
router.post("/register", createSchema, create); // Alias for HTML compatibility
router.put("/:id", updateSchema, update);
router.delete("/:id", _delete);

function getAll(req: Request, res: Response, next: NextFunction): void {
    console.log("GetAll employees function called");
    console.log("Database Employee model:", db.Employee);
	employeeService.getAll()
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


function getById(req: Request, res: Response, next: NextFunction): void {
    employeeService.getById(Number(req.params.id))
        .then(employee => res.json(employee))
        .catch(err => next(err));
        }

        function create(req: Request, res: Response, next: NextFunction): void {
            console.log("Create employee function called");
            console.log("Request body:", JSON.stringify(req.body, null, 2));
            console.log("Request headers:", req.headers);
            
            employeeService.create(req.body)
                .then(employee => {
                    console.log("Employee created successfully:", employee);
                    res.status(201).json({ message: "Employee created", employee });
                })
                .catch(err => {
                    console.error("Error creating employee:", err.message);
                    next(err);
                });
        }


        function update(req: Request, res: Response, next: NextFunction): void {
            console.log("Update function called");
            console.log("Request body:", req.body);
            console.log("Employee ID:", req.params.id);
            employeeService.update(Number(req.params.id), req.body)
                .then(employee => res.json({ message: "Employee updated" }))
                .catch(err => next(err));
        }

        function _delete(req: Request, res: Response, next: NextFunction): void {
            console.log("Delete function called");
            console.log("Employee ID to delete:", req.params.id);
            employeeService.delete(Number(req.params.id))
                .then(() => res.json({ message: "Employee deleted" }))
                .catch(err => next(err));
        }


        function createSchema(req: Request, res: Response, next: NextFunction): void {
            const schema = Joi.object({
                name: Joi.string().required(),
                position: Joi.string().required(),
                departmentId: Joi.number().integer().required()
            });
            validateRequest(req, next, schema);
        }

        function updateSchema(req: Request, res: Response, next: NextFunction): void {
            const schema = Joi.object({
                name: Joi.string().optional(),
                position: Joi.string().optional(),
                departmentId: Joi.number().integer().optional()
            });
            validateRequest(req, next, schema);
        }

export default router;





