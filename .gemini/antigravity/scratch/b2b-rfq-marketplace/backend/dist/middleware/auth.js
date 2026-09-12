"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) {
        res.status(401).json({ success: false, message: 'Authentication required. Token missing.' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(403).json({ success: false, message: 'Invalid or expired token.' });
        return;
    }
};
exports.authenticateToken = authenticateToken;
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Authentication required.' });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`,
            });
            return;
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
