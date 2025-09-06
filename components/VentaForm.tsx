'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Venta } from '../types';

interface VentaFormProps {
  readonly venta?: Venta | null;
  readonly onSave: () => void;
  readonly onCancel: () => void;
}

export default function VentaForm({ venta, onSave, onCancel }: VentaFormProps) {
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    cli_nombre: '',
    cli_id: '',
    cli_fec_nac: '',
    cli_asesor: user?.user_name || '',
    inv_precio: 0,
    inv_descuento: 0,
    inv_desc_extra: 0,
    inv_promo_desc: 0,
    venta_estado: 'Ingresada' as 'Ingresada' | 'Aprobada' | 'Anulada'
  });

  useEffect(() => {
    if (venta) {
      setFormData({
        cli_nombre: venta.cli_nombre,
        cli_id: venta.cli_id,
        cli_fec_nac: new Date(venta.cli_fec_nac).toISOString().split('T')[0],
        cli_asesor: venta.cli_asesor,
        inv_precio: venta.inv_precio,
        inv_descuento: venta.inv_descuento,
        inv_desc_extra: venta.inv_desc_extra,
        inv_promo_desc: venta.inv_promo_desc,
        venta_estado: venta.venta_estado
      });
    } else {
      setFormData(prev => ({
        ...prev,
        cli_asesor: user?.user_name || ''
      }));
    }
  }, [venta, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const url = '/api/ventas';
      const method = venta ? 'PUT' : 'POST';
      const body = venta ? { ...formData, id: venta.id } : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        onSave();
      } else {
        setError(data.message || 'Error al guardar la venta');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const calcularTotal = () => {
    return formData.inv_precio - formData.inv_descuento - formData.inv_desc_extra - formData.inv_promo_desc;
  };

  const isEditMode = !!venta;
  const isAsesor = user?.user_role === 'asesor';
  const isSupervisor = user?.user_role === 'supervisor';
  const canEdit = isAsesor && !isEditMode || isSupervisor && isEditMode;

  if (!canEdit) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        No tienes permisos para {isEditMode ? 'editar' : 'crear'} ventas.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 lg:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        {isEditMode ? 'Editar Venta' : 'Nueva Venta'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Datos del Cliente</h3>
          </div>

          <div>
            <label htmlFor="cli_nombre" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Nombre del Cliente *
            </label>
            <input
              type="text"
              id="cli_nombre"
              name="cli_nombre"
              required
              value={formData.cli_nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
            />
          </div>

          <div>
            <label htmlFor="cli_id" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              ID del Cliente *
            </label>
            <input
              type="text"
              id="cli_id"
              name="cli_id"
              required
              value={formData.cli_id}
              onChange={handleChange}
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
            />
          </div>

          <div>
            <label htmlFor="cli_fec_nac" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Fecha de Nacimiento *
            </label>
            <input
              type="date"
              id="cli_fec_nac"
              name="cli_fec_nac"
              required
              value={formData.cli_fec_nac}
              onChange={handleChange}
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
            />
          </div>

          <div>
            <label htmlFor="cli_asesor" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Asesor *
            </label>
            <input
              type="text"
              id="cli_asesor"
              name="cli_asesor"
              required
              value={formData.cli_asesor}
              onChange={handleChange}
              disabled={isAsesor && !isEditMode}
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 text-sm sm:text-base"
            />
          </div>

          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4 mt-4 sm:mt-6">Datos de la Venta</h3>
          </div>

          <div>
            <label htmlFor="inv_precio" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Precio Base *
            </label>
            <input
              type="number"
              id="inv_precio"
              name="inv_precio"
              step="0.01"
              min="0"
              required
              value={formData.inv_precio}
              onChange={handleChange}
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
            />
          </div>

          <div>
            <label htmlFor="inv_descuento" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Descuento
            </label>
            <input
              type="number"
              id="inv_descuento"
              name="inv_descuento"
              step="0.01"
              min="0"
              value={formData.inv_descuento}
              onChange={handleChange}
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
            />
          </div>

          <div>
            <label htmlFor="inv_desc_extra" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Descuento Extra
            </label>
            <input
              type="number"
              id="inv_desc_extra"
              name="inv_desc_extra"
              step="0.01"
              min="0"
              value={formData.inv_desc_extra}
              onChange={handleChange}
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
            />
          </div>

          <div>
            <label htmlFor="inv_promo_desc" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Descuento Promocional
            </label>
            <input
              type="number"
              id="inv_promo_desc"
              name="inv_promo_desc"
              step="0.01"
              min="0"
              value={formData.inv_promo_desc}
              onChange={handleChange}
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
            />
          </div>

          {isSupervisor && isEditMode && (
            <div className="col-span-1 lg:col-span-2">
              <label htmlFor="venta_estado" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Estado de la Venta
              </label>
              <select
                id="venta_estado"
                name="venta_estado"
                value={formData.venta_estado}
                onChange={handleChange}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
              >
                <option value="Ingresada">Ingresada</option>
                <option value="Aprobada">Aprobada</option>
                <option value="Anulada">Anulada</option>
              </select>
            </div>
          )}

          <div className="col-span-1 lg:col-span-2">
            <div className="bg-indigo-50 border border-indigo-200 p-3 sm:p-4 rounded-md">
              <p className="text-base sm:text-lg font-semibold text-indigo-800">
                Total: ${calcularTotal().toLocaleString('es-CO', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm sm:text-base">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm sm:text-base font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 text-sm sm:text-base font-medium"
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
