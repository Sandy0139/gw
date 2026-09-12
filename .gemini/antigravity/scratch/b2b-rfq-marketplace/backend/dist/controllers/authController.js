"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../prisma");
const authSchemas_1 = require("../validations/authSchemas");
const errorHandler_1 = require("../middleware/errorHandler");
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const register = async (req, res, next) => {
    try {
        const validatedData = authSchemas_1.registerSchema.parse(req.body);
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email: validatedData.email.toLowerCase() },
        });
        if (existingUser) {
            throw new errorHandler_1.AppError('Email is already registered', 400);
        }
        const hashedPassword = await bcryptjs_1.default.hash(validatedData.password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                email: validatedData.email.toLowerCase(),
                password: hashedPassword,
                name: validatedData.name,
                companyName: validatedData.companyName || null,
                role: validatedData.role,
            },
            select: {
                id: true,
                email: true,
                name: true,
                companyName: true,
                role: true,
                createdAt: true,
            },
        });
        const signOptions = { expiresIn: '7d' };
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, signOptions);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user,
                token,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const validatedData = authSchemas_1.loginSchema.parse(req.body);
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: validatedData.email.toLowerCase() },
        });
        if (!user) {
            throw new errorHandler_1.AppError('Invalid email or password', 401);
        }
        const isMatch = await bcryptjs_1.default.compare(validatedData.password, user.password);
        if (!isMatch) {
            throw new errorHandler_1.AppError('Invalid email or password', 401);
        }
        const signOptions = { expiresIn: '7d' };
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, signOptions);
        const { password, ...userWithoutPassword } = user;
        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            data: {
                user: userWithoutPassword,
                token,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const getMe = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new errorHandler_1.AppError('Unauthorized', 401);
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                email: true,
                name: true,
                companyName: true,
                role: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
