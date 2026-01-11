import { Request, Response } from 'express';
import { executeQuery } from '../utils/db1';
import jwt from 'jsonwebtoken';

// Middleware to authenticate JWT token
const authenticateJWT = async (req: Request, res: Response, next: Function) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        status: false,
        error: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    const users = await executeQuery(
      'SELECT id, user_code, user_name, role_code, created_at FROM users WHERE id = ? AND is_deleted = false',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({
        status: false,
        error: 'Invalid token. User not found.'
      });
    }

    (req as any).user = users[0];
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      error: 'Invalid token.'
    });
  }
};

export const get = [
  authenticateJWT,
  async (req: Request, res: Response) => {
    const user = (req as any).user;
    res.json({ 
      status: true,
      data: user 
    });
  },
];
