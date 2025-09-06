import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import connection from '../../../lib/db';
import { generateToken } from '../../../lib/auth';
import { LoginRequest, AuthResponse, User } from '../../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse<AuthResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  try {
    const { user_username, user_password }: LoginRequest = req.body;

    if (!user_username || !user_password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Usuario y contraseña son requeridos' 
      });
    }

    const db = await connection;
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE user_username = ?',
      [user_username]
    );

    const users = rows as User[];
    const user = users[0];

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    const isPasswordValid = await bcrypt.compare(user_password, user.user_password!);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    const { user_password: _, ...userWithoutPassword } = user;
    const token = generateToken(userWithoutPassword);

    res.status(200).json({
      success: true,
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
}
