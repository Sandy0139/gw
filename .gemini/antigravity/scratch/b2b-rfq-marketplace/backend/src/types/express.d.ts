export type Role = 'BUYER' | 'SUPPLIER';

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
