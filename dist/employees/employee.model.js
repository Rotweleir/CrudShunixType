"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
exports.default = initializeEmployeeModel;
const sequelize_1 = require("sequelize");
class Employee extends sequelize_1.Model {
}
exports.Employee = Employee;
function initializeEmployeeModel(sequelize) {
    Employee.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        position: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        departmentId: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: "departments",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
        },
    }, {
        sequelize,
        tableName: "employees",
        timestamps: true,
    });
    return Employee;
}
