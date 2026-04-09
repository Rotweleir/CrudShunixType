"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestService = void 0;
const db_1 = require("../_helpers/db");
exports.requestService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};
async function getAll() {
    return await db_1.db.Request.findAll({
        include: [{
                model: db_1.db.User,
                as: 'user',
                attributes: ['id', 'email', 'firstName', 'lastName']
            }],
        order: [['createdAt', 'DESC']]
    });
}
async function getById(id) {
    const request = await db_1.db.Request.findByPk(id);
    if (!request) {
        throw new Error("Request not found");
    }
    return request;
}
async function create(request) {
    try {
        const user = await db_1.db.User.findByPk(request.userId);
        if (!user) {
            throw new Error("User not found");
        }
        const newRequest = await db_1.db.Request.create(request);
        return newRequest;
    }
    catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            throw new Error("Invalid user ID. Please log out and log in again.");
        }
        throw error;
    }
}
async function update(id, request) {
    const existingRequest = await db_1.db.Request.findByPk(id);
    if (!existingRequest) {
        throw new Error("Request not found");
    }
    if (request.userId) {
        const user = await db_1.db.User.findByPk(request.userId);
        if (!user) {
            throw new Error("User not found");
        }
    }
    const { id: _, ...updateData } = request;
    await existingRequest.update(updateData);
    return existingRequest;
}
async function _delete(id) {
    const deletedRows = await db_1.db.Request.destroy({
        where: { id }
    });
    if (deletedRows === 0) {
        throw new Error("Request not found");
    }
}
