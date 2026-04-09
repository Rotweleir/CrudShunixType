import { db } from "../_helpers/db";
import { Department, DepartmentCreationAttributes } from "./department.model";

export const departmentService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};


async function getAll(): Promise<Department[]> {
    return await db.Department.findAll();
}

async function getById(id: number): Promise<Department> {
    const department = await db.Department.findByPk(id);
    if (!department) {
        throw new Error("Department not found");
    }
    return department;
}

async function create(department: DepartmentCreationAttributes): Promise<Department> {
    const newDepartment = await db.Department.create(department);
    return newDepartment;
}


async function update(id: number, department: DepartmentCreationAttributes): Promise<Department> {
    const existingDepartment = await db.Department.findByPk(id);
    if (!existingDepartment) {
        throw new Error("Department not found");
    }
    const { id: _, ...updateData } = department;
    await existingDepartment.update(updateData);
    return existingDepartment;
}



async function _delete(id: number): Promise<void> {
    const deletedRows = await db.Department.destroy({
        where: { id }
    });

    if (deletedRows === 0) {
        throw new Error("Department not found");
    }
}