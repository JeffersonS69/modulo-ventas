import { NextApiResponse } from 'next';
import connection from '../../../lib/db';
import { withAuth, AuthenticatedRequest } from '../../../middleware/auth';
import { Venta } from '../../../types';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return getVentas(req, res);
  } else if (req.method === 'POST') {
    return createVenta(req, res);
  } else if (req.method === 'PUT') {
    return updateVenta(req, res);
  } else if (req.method === 'DELETE') {
    return deleteVenta(req, res);
  } else {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }
}

async function getVentas(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const db = await connection;
    const [rows] = await db.execute(`
      SELECT * FROM ventas 
      WHERE deleted = FALSE 
      ORDER BY created_at DESC
    `);

    res.status(200).json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}

async function createVenta(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.user.role !== 'asesor') {
    return res.status(403).json({
      success: false,
      message: 'Solo los asesores pueden crear ventas'
    });
  }

  try {
    const {
      cli_nombre,
      cli_id,
      cli_fec_nac,
      cli_asesor,
      inv_precio,
      inv_descuento,
      inv_desc_extra,
      inv_promo_desc
    } = req.body;

    if (!cli_nombre || !cli_id || !cli_fec_nac || !cli_asesor || !inv_precio) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos'
      });
    }

    const { generateInvoiceCode } = require('../../../lib/auth');
    let inv_code = generateInvoiceCode();
    
    const db = await connection;
    let codeExists = true;
    while (codeExists) {
      const [existing] = await db.execute(
        'SELECT id FROM ventas WHERE inv_code = ?',
        [inv_code]
      );
      if ((existing as any[]).length === 0) {
        codeExists = false;
      } else {
        inv_code = generateInvoiceCode();
      }
    }

    const inv_total = inv_precio - (inv_descuento || 0) - (inv_desc_extra || 0) - (inv_promo_desc || 0);

    const [result] = await db.execute(`
      INSERT INTO ventas (
        cli_nombre, cli_id, cli_fec_nac, cli_asesor, inv_code, 
        inv_precio, inv_descuento, inv_desc_extra, inv_promo_desc, 
        inv_total, date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())
    `, [
      cli_nombre, cli_id, cli_fec_nac, cli_asesor, inv_code,
      inv_precio, inv_descuento || 0, inv_desc_extra || 0, inv_promo_desc || 0,
      inv_total
    ]);

    res.status(201).json({
      success: true,
      message: 'Venta creada exitosamente',
      data: { id: (result as any).insertId, inv_code }
    });

  } catch (error) {
    console.error('Error al crear venta:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}

async function updateVenta(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.user.role !== 'supervisor') {
    return res.status(403).json({
      success: false,
      message: 'Solo los supervisores pueden editar ventas'
    });
  }

  try {
    const { id, venta_estado, ...otherFields } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID de venta requerido'
      });
    }

    const db = await connection;

    const [existing] = await db.execute(
      'SELECT * FROM ventas WHERE id = ? AND deleted = FALSE',
      [id]
    );

    if ((existing as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada'
      });
    }

    const updates = [];
    const values = [];

    Object.entries(otherFields).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (venta_estado) {
      updates.push('venta_estado = ?');
      values.push(venta_estado);
    }

    if (otherFields.inv_precio || otherFields.inv_descuento || 
        otherFields.inv_desc_extra || otherFields.inv_promo_desc) {
      
      const currentVenta = (existing as Venta[])[0];
      const newPrecio = otherFields.inv_precio || currentVenta.inv_precio;
      const newDescuento = otherFields.inv_descuento || currentVenta.inv_descuento;
      const newDescExtra = otherFields.inv_desc_extra || currentVenta.inv_desc_extra;
      const newPromoDesc = otherFields.inv_promo_desc || currentVenta.inv_promo_desc;
      
      const newTotal = newPrecio - newDescuento - newDescExtra - newPromoDesc;
      updates.push('inv_total = ?');
      values.push(newTotal);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay campos para actualizar'
      });
    }

    values.push(id);

    await db.execute(
      `UPDATE ventas SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.status(200).json({
      success: true,
      message: 'Venta actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error al actualizar venta:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}

async function deleteVenta(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Solo los administradores pueden eliminar ventas'
    });
  }

  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID de venta requerido'
      });
    }

    const db = await connection;

    const [result] = await db.execute(
      'UPDATE ventas SET deleted = TRUE WHERE id = ? AND deleted = FALSE',
      [id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Venta eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar venta:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}

export default withAuth(handler);
