import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload, Role } from '../types/express';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required. Token missing.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    return;
  }
};

export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
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
