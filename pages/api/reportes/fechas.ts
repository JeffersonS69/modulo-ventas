import { NextApiResponse } from 'next';
import connection from '../../../lib/db';
import { withAuth, AuthenticatedRequest } from '../../../middleware/auth';

export default withAuth(async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        success: false,
        message: 'fecha_inicio y fecha_fin son requeridas'
      });
    }

    const db = await connection;
    const [rows] = await db.execute(`
      SELECT 
        COUNT(*) as total_ventas,
        SUM(inv_total) as monto_total,
        ? as fecha_inicio,
        ? as fecha_fin
      FROM ventas 
      WHERE date BETWEEN ? AND ? 
        AND deleted = FALSE 
        AND venta_estado != 'Anulada'
    `, [fecha_inicio, fecha_fin, fecha_inicio, fecha_fin]);

    const result = (rows as any[])[0];

    res.status(200).json({
      success: true,
      data: {
        total_ventas: result.total_ventas || 0,
        monto_total: result.monto_total || 0,
        fecha_inicio: result.fecha_inicio,
        fecha_fin: result.fecha_fin
      }
    });

  } catch (error) {
    console.error('Error en reporte por fechas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});
