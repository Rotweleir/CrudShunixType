// src/_helpers/db.ts
import config from '../../config.json';
import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import userModel from '../users/user.model';
import departmentModel from '../department/department.model';
import employeeModel from '../employees/employee.model';
import requestModel from '../requests/requests.model';

export interface Database {
  User: any;
  Department: any;
  Employee: any;
  Request: any;
}

export const db: Database = {} as Database;

export async function initialize(): Promise<void> {
  const { host, port, user, password, database } = config.database;

  // Create database if it doesn't exist
  const connection = await mysql.createConnection({
    host,
    port: Number(port),
    user,
    password,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
  await connection.end();

  // Connect to database with Sequelize
  const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

  // Initialize models
  db.User = userModel(sequelize);
  db.Department = departmentModel(sequelize);
  db.Employee = employeeModel(sequelize);
  db.Request = requestModel(sequelize);

  // Associations
  db.Department.hasMany(db.Employee, { foreignKey: 'departmentId', as: 'employees' });
  db.Employee.belongsTo(db.Department, { foreignKey: 'departmentId', as: 'department' });

  db.User.hasMany(db.Request, { foreignKey: 'userId', as: 'requests' });
  db.Request.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

  // Sync models with database
  await sequelize.sync({ alter: true });

  console.log('Database initialized and models synced');
}