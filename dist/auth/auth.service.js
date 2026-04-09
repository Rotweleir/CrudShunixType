"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../_helpers/db");
exports.authService = {
    login,
    register,
    getProfile
};
async function login(credentials) {
    const { username, password } = credentials;
    // Find user by email (using email as username)
    const user = await db_1.db.User.findOne({ where: { email: username } });
    if (!user) {
        throw new Error("Invalid username or password");
    }
    // Check if user is verified
    if (!user.isverified) {
        throw new Error("Your account is pending verification by an administrator. Please wait for approval.");
    }
    // Check password
    const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
    if (!isValidPassword) {
        throw new Error("Invalid username or password");
    }
    // Determine if admin (you can customize this logic)
    const isAdmin = user.role === 'admin';
    return {
        message: `Welcome back, ${user.firstName || username}!`,
        token: `1234567891011121314151617181920`,
        user: {
            id: user.id,
            username: user.email,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        },
        isAdmin: isAdmin,
        redirectUrl: isAdmin ? 'adminDashboard.html' : 'userDashboard.html'
    };
}
async function register(userData) {
    const { username, password, email, role } = userData;
    // Check if user already exists
    const existingUser = await db_1.db.User.findOne({ where: { email: email || username } });
    if (existingUser) {
        throw new Error("User already exists");
    }
    // Hash password
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    // Create user (isverified defaults to false in model)
    const newUser = await db_1.db.User.create({
        email: email || username,
        password: hashedPassword,
        role: role || 'user',
        firstName: username,
        lastName: '',
        isverified: false // Explicitly set to false - needs admin approval
    });
    return {
        message: "Registration successful! Your account is pending approval by an administrator.",
        user: {
            id: newUser.id,
            username: newUser.email,
            email: newUser.email
        }
    };
}
async function getProfile(userId) {
    const user = await db_1.db.User.findByPk(userId);
    if (!user) {
        throw new Error("User not found");
    }
    return {
        id: user.id,
        username: user.email,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        title: user.title
    };
}
