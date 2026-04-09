import type { Request, Response, NextFunction } from "express";
import { Router } from "express";
import Joi from "joi";
import { validateRequest } from "../_middleware/validateRequest";
import { requestService } from "./requests.service";
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
    console.log("GetAll function called");
    console.log("Database Request model:", db.Request);
    requestService.getAll()
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


function getById(req: Request, res: Response, next: NextFunction): void {
    requestService.getById(Number(req.params.id))
        .then(request => res.json(request))
        .catch(err => next(err));
}

        function create(req: Request, res: Response, next: NextFunction): void {
            console.log("Create request function called");
            console.log("Request body:", JSON.stringify(req.body, null, 2));
            console.log("Request headers:", req.headers);
            requestService.create(req.body)
                .then(request => {
                    console.log("Request created successfully:", request);
                    res.status(201).json({ message: "Request created", request });
                })
                .catch(err => {
                    console.error("Error creating request:", err.message);
                    next(err);
                });
        }


        function update(req: Request, res: Response, next: NextFunction): void {
            console.log("Update function called");
            console.log("Request body:", req.body);
            console.log("Request ID:", req.params.id);
            requestService.update(Number(req.params.id), req.body)
                .then(request => res.json({ message: "Request updated" }))
                .catch(err => next(err));
        }

        function _delete(req: Request, res: Response, next: NextFunction): void {
            console.log("Delete function called");
            console.log("Request ID to delete:", req.params.id);
            requestService.delete(Number(req.params.id))
                .then(() => res.json({ message: "Request deleted" }))
                .catch(err => next(err));
        }


        function createSchema(req: Request, res: Response, next: NextFunction): void {
            const schema = Joi.object({
                userId: Joi.number().integer().required(),
                requestType: Joi.string().required(),
                purpose: Joi.string().required(),
                status: Joi.string().optional()
            });
            validateRequest(req, next, schema);
        }

        function updateSchema(req: Request, res: Response, next: NextFunction): void {
            const schema = Joi.object({
                userId: Joi.number().integer().optional(),
                requestType: Joi.string().optional(),
                purpose: Joi.string().optional(),
                status: Joi.string().optional()
            });
            validateRequest(req, next, schema);
        }
        
export default router;





