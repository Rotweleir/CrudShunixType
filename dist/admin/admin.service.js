"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
const db_1 = require("../_helpers/db");
exports.adminService = {
    getAllAccounts,
    updateAccount,
    deleteAccount,
    getAllRequests,
    updateRequestStatus
};
async function getAllAccounts() {
    const users = await db_1.db.User.findAll({
        attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'isverified', 'createdAt', 'updatedAt']
    });
    // Map to match your HTML expectations
    return users.map((user) => ({
        id: user.id,
        username: user.email,
        role: user.role,
        is_verified: user.isverified, // Map isverified to is_verified
        created_at: user.createdAt
    }));
}
async function updateAccount(id, data) {
    const { username, role, is_verified } = data;
    const updateData = {};
    if (username)
        updateData.email = username;
    if (role)
        updateData.role = role;
    if (is_verified !== undefined)
        updateData.isverified = is_verified;
    const [affectedRows] = await db_1.db.User.update(updateData, { where: { id } });
    if (affectedRows === 0) {
        throw new Error("Account not found");
    }
    return { message: "Account updated successfully" };
}
async function deleteAccount(id) {
    const deleted = await db_1.db.User.destroy({ where: { id } });
    if (deleted === 0) {
        throw new Error("Account not found");
    }
    return { message: "Account deleted successfully" };
}
async function getAllRequests() {
    // Get all requests with user information
    const requests = await db_1.db.Request.findAll({
        include: [{
                model: db_1.db.User,
                as: 'user',
                attributes: ['id', 'email', 'firstName', 'lastName']
            }],
        order: [['createdAt', 'DESC']]
    });
    // Map to match HTML expectations
    return requests.map((req) => ({
        id: req.id,
        userId: req.userId,
        requestType: req.requestType,
        purpose: req.purpose,
        status: req.status.toLowerCase(), // Ensure lowercase for HTML filter
        created_at: req.createdAt,
        user: req.user ? {
            id: req.user.id,
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName
        } : null
    }));
}
async function updateRequestStatus(requestId, status) {
    const [affectedRows] = await db_1.db.Request.update({ status }, { where: { id: requestId } });
    if (affectedRows === 0) {
        throw new Error("Request not found");
    }
    return { message: "Request status updated successfully" };
}
