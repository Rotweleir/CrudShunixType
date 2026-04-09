"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Department = void 0;
exports.default = initializeDepartmentModel;
const sequelize_1 = require("sequelize");
class Department extends sequelize_1.Model {
}
exports.Department = Department;
function initializeDepartmentModel(sequelize) {
    Department.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
        },
    }, {
        sequelize,
        tableName: "departments",
        timestamps: true,
    });
    return Department;
}
