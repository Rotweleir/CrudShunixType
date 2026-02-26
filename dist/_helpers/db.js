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
exports.db = {};
async function initialize() {
    const { host, port, user, password, database } = config_json_1.default.database;
    // #region agent log
    fetch('http://127.0.0.1:7506/ingest/e08b6a06-9f18-47eb-a7a0-f0df4bacadf2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Debug-Session-Id': '94852d',
        },
        body: JSON.stringify({
            sessionId: '94852d',
            runId: 'pre-fix',
            hypothesisId: 'H1',
            location: 'src/_helpers/db.ts:20',
            message: 'initialize called with database config',
            data: { host, port, user, database },
            timestamp: Date.now(),
        }),
    }).catch(() => { });
    // #endregion agent log
    // Create database if it doesn't exist
    const connection = await promise_1.default.createConnection({ host, port: Number(port), user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();
    // Connect to database with Sequelize
    const sequelize = new sequelize_1.Sequelize(database, user, password, { dialect: 'mysql' });
    // Initialize models
    exports.db.User = (0, user_model_1.default)(sequelize);
    // #region agent log
    fetch('http://127.0.0.1:7506/ingest/e08b6a06-9f18-47eb-a7a0-f0df4bacadf2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Debug-Session-Id': '94852d',
        },
        body: JSON.stringify({
            sessionId: '94852d',
            runId: 'pre-fix',
            hypothesisId: 'H2',
            location: 'src/_helpers/db.ts:45',
            message: 'user model initialized',
            data: { modelDefined: !!exports.db.User },
            timestamp: Date.now(),
        }),
    }).catch(() => { });
    // #endregion agent log
    // Sync models with database
    await sequelize.sync({ alter: true });
    // #region agent log
    fetch('http://127.0.0.1:7506/ingest/e08b6a06-9f18-47eb-a7a0-f0df4bacadf2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Debug-Session-Id': '94852d',
        },
        body: JSON.stringify({
            sessionId: '94852d',
            runId: 'pre-fix',
            hypothesisId: 'H3',
            location: 'src/_helpers/db.ts:57',
            message: 'sequelize sync completed',
            data: {},
            timestamp: Date.now(),
        }),
    }).catch(() => { });
    // #endregion agent log
    console.log('Database initialized and models synced');
}
