"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentService = void 0;
const db_1 = require("../_helpers/db");
exports.departmentService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};
async function getAll() {
    return await db_1.db.Department.findAll();
}
async function getById(id) {
    const department = await db_1.db.Department.findByPk(id);
    if (!department) {
        throw new Error("Department not found");
    }
    return department;
}
async function create(department) {
    const newDepartment = await db_1.db.Department.create(department);
    return newDepartment;
}
async function update(id, department) {
    const existingDepartment = await db_1.db.Department.findByPk(id);
    if (!existingDepartment) {
        throw new Error("Department not found");
    }
    const { id: _, ...updateData } = department;
    await existingDepartment.update(updateData);
    return existingDepartment;
}
async function _delete(id) {
    const deletedRows = await db_1.db.Department.destroy({
        where: { id }
    });
    if (deletedRows === 0) {
        throw new Error("Department not found");
    }
}
