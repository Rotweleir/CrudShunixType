"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.initialize = initialize;
// src/_helpers/db.ts
const config_json_1 = __importDefault(require("../../config.json"));
const promise_1 = __importDefault(require("mysql2/promise"));
const sequelize_1 = require("sequelize");
const user_model_1 = __importDefault(require("../users/user.model"));
const department_model_1 = __importDefault(require("../department/department.model"));
const employee_model_1 = __importDefault(require("../employees/employee.model"));
const requests_model_1 = __importDefault(require("../requests/requests.model"));
exports.db = {};
async function initialize() {
    const { host, port, user, password, database } = config_json_1.default.database;
    // Create database if it doesn't exist
    const connection = await promise_1.default.createConnection({
        host,
        port: Number(port),
        user,
        password,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();
    // Connect to database with Sequelize
    const sequelize = new sequelize_1.Sequelize(database, user, password, { dialect: 'mysql' });
    // Initialize models
    exports.db.User = (0, user_model_1.default)(sequelize);
    exports.db.Department = (0, department_model_1.default)(sequelize);
    exports.db.Employee = (0, employee_model_1.default)(sequelize);
    exports.db.Request = (0, requests_model_1.default)(sequelize);
    // Associations
    exports.db.Department.hasMany(exports.db.Employee, { foreignKey: 'departmentId', as: 'employees' });
    exports.db.Employee.belongsTo(exports.db.Department, { foreignKey: 'departmentId', as: 'department' });
    exports.db.User.hasMany(exports.db.Request, { foreignKey: 'userId', as: 'requests' });
    exports.db.Request.belongsTo(exports.db.User, { foreignKey: 'userId', as: 'user' });
    // Sync models with database
    await sequelize.sync({ alter: true });
    console.log('Database initialized and models synced');
}
