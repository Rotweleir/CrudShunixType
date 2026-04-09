"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
exports.default = initializeRequestModel;
const sequelize_1 = require("sequelize");
class Request extends sequelize_1.Model {
}
exports.Request = Request;
function initializeRequestModel(sequelize) {
    Request.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        requestType: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        purpose: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pending'
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE
            // defaultValue: dataTypes.NOW
            // allowNull: false
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE
        }
    }, {
        sequelize,
        tableName: "requests",
        timestamps: true
    });
    return Request;
}
