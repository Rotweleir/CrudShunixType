"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeService = void 0;
const db_1 = require("../_helpers/db");
exports.employeeService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};
async function getAll() {
    return await db_1.db.Employee.findAll({
        include: [{
                model: db_1.db.Department,
                as: 'department',
                attributes: ['id', 'name', 'description']
            }]
    });
}
async function getById(id) {
    const employee = await db_1.db.Employee.findByPk(id, {
        include: [{
                model: db_1.db.Department,
                as: 'department',
                attributes: ['id', 'name', 'description']
            }]
    });
    if (!employee) {
        throw new Error("Employee not found");
    }
    return employee;
}
async function create(employee) {
    try {
        const department = await db_1.db.Department.findByPk(employee.departmentId);
        if (!department) {
            throw new Error("Department not found");
        }
        const newEmployee = await db_1.db.Employee.create(employee);
        return newEmployee;
    }
    catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error("Employee with this name already exists");
        }
        throw error;
    }
}
async function update(id, employee) {
    const existingEmployee = await db_1.db.Employee.findByPk(id);
    if (!existingEmployee) {
        throw new Error("Employee not found");
    }
    if (employee.departmentId) {
        const department = await db_1.db.Department.findByPk(employee.departmentId);
        if (!department) {
            throw new Error("Department not found");
        }
    }
    const { id: _, ...updateData } = employee;
    await existingEmployee.update(updateData);
    return existingEmployee;
}
async function _delete(id) {
    const deletedRows = await db_1.db.Employee.destroy({
        where: { id }
    });
    if (deletedRows === 0) {
        throw new Error("Employee not found");
    }
}
