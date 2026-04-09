import { db } from "../_helpers/db";
import { Request, RequestCreationAttributes } from "./requests.model";

export const requestService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};


async function getAll(): Promise<Request[]> {
    return await db.Request.findAll({
        include: [{
            model: db.User,
            as: 'user',
            attributes: ['id', 'email', 'firstName', 'lastName']
        }],
        order: [['createdAt', 'DESC']]
    });
}

async function getById(id: number): Promise<Request> {
    const request = await db.Request.findByPk(id);
    if (!request) {
        throw new Error("Request not found");
    }
    return request;
}

async function create(request: RequestCreationAttributes): Promise<Request> {
    try {
        const user = await db.User.findByPk(request.userId);
        if (!user) {
            throw new Error("User not found");
        }
        const newRequest = await db.Request.create(request);
        return newRequest;
    } catch (error: any) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            throw new Error("Invalid user ID. Please log out and log in again.");
        }
        throw error;
    }
}


async function update(id: number, request: RequestCreationAttributes): Promise<Request> {    
    const existingRequest = await db.Request.findByPk(id);
    if (!existingRequest) {
        throw new Error("Request not found");
    }

    if (request.userId) {
        const user = await db.User.findByPk(request.userId);
        if (!user) {
            throw new Error("User not found");
        }
    }

    const { id: _, ...updateData } = request;
    await existingRequest.update(updateData);
    return existingRequest;
}



async function _delete(id: number): Promise<void> {
    const deletedRows = await db.Request.destroy({
        where: { id }
    });

    if (deletedRows === 0) {
        throw new Error("Request not found");
    }
}   
