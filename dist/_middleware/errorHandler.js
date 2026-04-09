"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    if (typeof err === 'string') {
        // Custom application error
        const is404 = err.toLowerCase().endsWith('not found');
        const statusCode = is404 ? 404 : 400;
        return res.status(statusCode).json({ message: err });
    }
    if (err instanceof Error) {
        const is404 = err.message.toLowerCase().endsWith('not found');
        const statusCode = is404 ? 404 : 500;
        return res.status(statusCode).json({ message: err.message });
    }
    // Fallback
    return res.status(500).json({ message: 'Internal Server Error' });
}
