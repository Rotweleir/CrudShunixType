import { db } from "../_helpers/db";

export const adminService = {
    getAllAccounts,
    updateAccount,
    deleteAccount,
    getAllRequests,
    updateRequestStatus
};

async function getAllAccounts() {
    const users = await db.User.findAll({
        attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'isverified', 'createdAt', 'updatedAt']
    });
    
    // Map to match your HTML expectations
    return users.map((user: any) => ({
        id: user.id,
        username: user.email,
        role: user.role,
        is_verified: user.isverified, // Map isverified to is_verified
        created_at: user.createdAt
    }));
}

async function updateAccount(id: number, data: any) {
    const { username, role, is_verified } = data;
    
    const updateData: any = {};
    
    if (username) updateData.email = username;
    if (role) updateData.role = role;
    if (is_verified !== undefined) updateData.isverified = is_verified;
    
    const [affectedRows] = await db.User.update(updateData, { where: { id } });
    
    if (affectedRows === 0) {
        throw new Error("Account not found");
    }
    
    return { message: "Account updated successfully" };
}

async function deleteAccount(id: number) {
    const deleted = await db.User.destroy({ where: { id } });
    
    if (deleted === 0) {
        throw new Error("Account not found");
    }
    
    return { message: "Account deleted successfully" };
}

async function getAllRequests() {
    // Get all requests with user information
    const requests = await db.Request.findAll({
        include: [{
            model: db.User,
            as: 'user',
            attributes: ['id', 'email', 'firstName', 'lastName']
        }],
        order: [['createdAt', 'DESC']]
    });
    
    // Map to match HTML expectations
    return requests.map((req: any) => ({
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

async function updateRequestStatus(requestId: number, status: string) {
    const [affectedRows] = await db.Request.update(
        { status },
        { where: { id: requestId } }
    );
    
    if (affectedRows === 0) {
        throw new Error("Request not found");
    }
    
    return { message: "Request status updated successfully" };
}
