import { NextApiResponse } from 'next';
import connection from '../../../lib/db';
import { withAuth, AuthenticatedRequest } from '../../../middleware/auth';

export default withAuth(async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  try {
    const db = await connection;
    const [rows] = await db.execute(`
      SELECT 
        cli_asesor,
        COUNT(*) as total_ventas,
        SUM(inv_total) as monto_total
      FROM ventas 
      WHERE deleted = FALSE 
        AND venta_estado != 'Anulada'
      GROUP BY cli_asesor
      ORDER BY monto_total DESC
    `);

    res.status(200).json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error('Error en reporte por asesor:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});
