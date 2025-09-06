import jwt from 'jsonwebtoken';
import { User } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export function generateToken(user: Omit<User, 'user_password'>): string {
  return jwt.sign(
    {
      id: user.id,
      username: user.user_username,
      role: user.user_role,
      email: user.user_email
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function generateInvoiceCode(): string {
  const randomNum = Math.floor(Math.random() * 999) + 1;
  return `F-M1-${randomNum.toString().padStart(3, '0')}`;
}
