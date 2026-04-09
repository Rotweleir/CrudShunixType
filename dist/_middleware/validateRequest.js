"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
function validateRequest(req, next, schema) {
    const options = {
        abortEarly: false, // Include all errors
        allowUnknown: true, // Allow unknown properties
        stripUnknown: true, // Remove unknown properties
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        next(`Validation error: ${error.details.map((d) => d.message).join(', ')}`);
    }
    else {
        req.body = value;
        next();
    }
}
