export interface User {
  id: number;
  user_name: string;
  user_username: string;
  user_role: 'asesor' | 'supervisor' | 'admin';
  user_email: string;
  user_password?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Venta {
  id: number;
  cli_nombre: string;
  cli_id: string;
  cli_fec_nac: Date;
  cli_asesor: string;
  inv_code: string;
  inv_precio: number;
  inv_descuento: number;
  inv_desc_extra: number;
  inv_promo_desc: number;
  inv_total: number;
  venta_estado: 'Ingresada' | 'Aprobada' | 'Anulada';
  deleted: boolean;
  date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateVentaRequest {
  cli_nombre: string;
  cli_id: string;
  cli_fec_nac: string;
  cli_asesor: string;
  inv_precio: number;
  inv_descuento: number;
  inv_desc_extra: number;
  inv_promo_desc: number;
}

export interface UpdateVentaRequest {
  id: number;
  cli_nombre?: string;
  cli_id?: string;
  cli_fec_nac?: string;
  cli_asesor?: string;
  inv_precio?: number;
  inv_descuento?: number;
  inv_desc_extra?: number;
  inv_promo_desc?: number;
  venta_estado?: 'Ingresada' | 'Aprobada' | 'Anulada';
}

export interface ReporteTotalVentas {
  total_ventas: number;
  monto_total: number;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface ReporteVentasAsesor {
  cli_asesor: string;
  total_ventas: number;
  monto_total: number;
}

export interface ReporteVentasEstado {
  venta_estado: string;
  total_ventas: number;
  monto_total: number;
}

export interface LoginRequest {
  user_username: string;
  user_password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: Omit<User, 'user_password'>;
  token?: string;
  message?: string;
}
