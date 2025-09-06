import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../lib/auth';

export interface AuthenticatedRequest extends NextApiRequest {
  user: {
    id: number;
    username: string;
    role: string;
    email: string;
  };
}

export function withAuth(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, message: 'Token no proporcionado' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Token inválido' });
    }

    (req as AuthenticatedRequest).user = decoded;
    return handler(req as AuthenticatedRequest, res);
  };
}

export function withRole(roles: string[]) {
  return function (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
    return withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ 
          success: false, 
          message: 'No tienes permisos para realizar esta acción' 
        });
      }
      
      return handler(req, res);
    });
  };
}
