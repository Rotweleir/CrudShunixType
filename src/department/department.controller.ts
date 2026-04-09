import type { Request, Response, NextFunction } from "express";
import { Router } from "express";
import Joi from "joi";
import { validateRequest } from "../_middleware/validateRequest";
import { departmentService } from "./department.service";
import { db } from "../_helpers/db";



const router = Router();

// routes
router.get("/", getAll);
router.get("/list", getDepartmentsList); // For dropdown
router.get("/:id", getById);
router.post("/", createSchema, create);
router.post("/register", createSchema, create); // Alias for HTML compatibility
router.put("/:id", updateSchema, update);
router.delete("/:id", _delete);

function getAll(req: Request, res: Response, next: NextFunction): void {
    console.log("GetAll departments function called");
    console.log("Database Department model:", db.Department);
	departmentService.getAll()
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

function getDepartmentsList(req: Request, res: Response, next: NextFunction): void {
    // Simple list for dropdown - just id and name
    departmentService.getAll()
        .then(departments => {
            const list = departments.map((dept: any) => ({
                id: dept.id,
                name: dept.name
            }));
            res.json(list);
        })
        .catch(err => next(err));
}


function getById(req: Request, res: Response, next: NextFunction): void {
    departmentService.getById(Number(req.params.id))
        .then(department => res.json(department))
        .catch(err => next(err));
}


function create(req: Request, res: Response, next: NextFunction): void {
    console.log("Create department function called");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("Request headers:", req.headers);
    departmentService.create(req.body)
        .then(department => {
            console.log("Department created successfully:", department);
            res.status(201).json({ message: "Department created", department });
        })
        .catch(err => {
            console.error("Error creating department:", err.message);
            next(err);
        });
}


function update(req: Request, res: Response, next: NextFunction): void {
    console.log("Update function called");
    console.log("Request body:", req.body);
    console.log("Department ID:", req.params.id);
    departmentService.update(Number(req.params.id), req.body)
        .then(department => res.json({ message: "Department updated" }))
        .catch(err => next(err));
}

function _delete(req: Request, res: Response, next: NextFunction): void {
    console.log("Delete function called");
    console.log("Department ID to delete:", req.params.id);
    departmentService.delete(Number(req.params.id))
        .then(() => res.json({ message: "Department deleted" }))
        .catch(err => next(err));
}


function createSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        name: Joi.string().optional(),
        description: Joi.string().optional(),
        createdAt: Joi.date().optional(),
        updatedAt: Joi.date().optional(),
    });
    validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        name: Joi.string().optional(),
        description: Joi.string().optional(),
        createdAt: Joi.date().optional(),
        updatedAt: Joi.date().optional(),
    });
    validateRequest(req, next, schema);
}

export default router;





