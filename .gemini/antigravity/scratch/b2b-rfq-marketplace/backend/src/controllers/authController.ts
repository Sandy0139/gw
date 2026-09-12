import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { prisma } from '../prisma';
import { registerSchema, loginSchema } from '../validations/authSchemas';
import { AppError } from '../middleware/errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    });

    if (existingUser) {
      throw new AppError('Email is already registered', 400);
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const user = await prisma.user.create({
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

    const signOptions: SignOptions = { expiresIn: '7d' };
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      signOptions
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(validatedData.password, user.password);

    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const signOptions: SignOptions = { expiresIn: '7d' };
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      signOptions
    );

    const { password, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const user = await prisma.user.findUnique({
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
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
