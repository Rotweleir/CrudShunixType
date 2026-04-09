// src/server.ts
import path from 'path';
import express, { Application } from 'express';
import cors from 'cors';
import { errorHandler } from './_middleware/errorHandler';
import { initialize } from './_helpers/db';
import usersController from './users/users.controller';
import departmentController from './department/department.controller';
import employeeController from './employees/employee.controller';
import requestController from './requests/requests.controller';
import authController from './auth/auth.controller';
import adminController from './admin/admin.controller';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

// Serve static frontend from /src/public
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Root -> home.html
app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'home.html'));
});

// API Routes (non-prefixed)
app.use('/users', usersController);
app.use('/auth', authController);
app.use('/admin', adminController);
app.use('/departments', departmentController);
app.use('/employees', employeeController);
app.use('/requests', requestController);

// API Routes with /api prefix to match frontend fetch URLs
app.use('/api', authController);              // /api/login, /api/register, /api/profile
app.use('/api/admin', adminController);       // /api/admin/accounts, /api/admin/requests
app.use('/api/departments', departmentController); // /api/departments, /api/departments/list, etc.
app.use('/api/employees', employeeController);     // /api/employees, /api/employees/register, etc.
app.use('/api/requests', requestController);       // /api/requests, /api/requests/register, etc.

// Global Error Handler (must be last)
app.use(errorHandler);

// Start server + initialize database
const PORT = process.env.PORT || 4000;

initialize()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})
.catch ((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});