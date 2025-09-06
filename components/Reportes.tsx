"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  ReporteTotalVentas,
  ReporteVentasAsesor,
  ReporteVentasEstado,
} from "../types";
import { TbReportMedical } from "react-icons/tb";
import { FaSpinner } from "react-icons/fa";

export default function Reportes() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<"fechas" | "asesor" | "estado">(
    "fechas"
  );
  const [isLoading, setIsLoading] = useState(false);

  const [reporteFechas, setReporteFechas] = useState<ReporteTotalVentas | null>(
    null
  );
  const [reporteAsesor, setReporteAsesor] = useState<ReporteVentasAsesor[]>([]);
  const [reporteEstado, setReporteEstado] = useState<ReporteVentasEstado[]>([]);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const fetchReporteFechas = async () => {
    if (!fechaInicio || !fechaFin) {
      alert("Por favor selecciona ambas fechas");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/reportes/fechas?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setReporteFechas(data.data);
      } else {
        alert(data.message || "Error al generar reporte");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReporteAsesor = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/reportes/asesor", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setReporteAsesor(data.data);
      } else {
        alert(data.message || "Error al generar reporte");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchReporteEstado = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/reportes/estado", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setReporteEstado(data.data);
      } else {
        alert(data.message || "Error al generar reporte");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      if (activeTab === "asesor") {
        fetchReporteAsesor();
      } else if (activeTab === "estado") {
        fetchReporteEstado();
      }
    }
  }, [token, activeTab, fetchReporteAsesor, fetchReporteEstado]);

  const renderReporteFechas = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label
              htmlFor="fecha-inicio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fecha Inicio:
            </label>
            <input
              id="fecha-inicio"
              type="date"
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="fecha-fin"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fecha Fin:
            </label>
            <input
              id="fecha-fin"
              type="date"
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>

          <div>
            <button
              onClick={fetchReporteFechas}
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <TbReportMedical className="size-" />
              )}
              <span>{isLoading ? "Generando..." : "Generar Reporte"}</span>
            </button>
          </div>
        </div>
      </div>

      {reporteFechas && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            Resultados del Reporte
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600">Total de Ventas</div>
              <div className="text-2xl font-bold text-blue-900">
                {reporteFechas.total_ventas}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600">Monto Total</div>
              <div className="text-2xl font-bold text-green-900">
                {reporteFechas.monto_total?.toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 0,
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderReporteAsesor = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        {reporteAsesor.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asesor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Ventas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reporteAsesor.map((asesor) => (
                  <tr key={asesor.cli_asesor}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {asesor.cli_asesor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {asesor.total_ventas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      $
                      {asesor.monto_total?.toLocaleString("es-CO", {
                        minimumFractionDigits: 2,
                      }) || "0.00"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            {isLoading ? "Cargando datos..." : "No hay datos disponibles"}
          </p>
        )}
      </div>
    </div>
  );

  const renderReporteEstado = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        {reporteEstado.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reporteEstado.map((estado) => {
              const getStatusColor = () => {
                if (estado.venta_estado === "Aprobada")
                  return "bg-green-50 border-green-200 text-green-800";
                if (estado.venta_estado === "Ingresada")
                  return "bg-yellow-50 border-yellow-200 text-yellow-800";
                return "bg-red-50 border-red-200 text-red-800";
              };

              return (
                <div
                  key={estado.venta_estado}
                  className={`p-4 rounded-lg border ${getStatusColor()}`}
                >
                  <h4 className="font-medium text-lg">{estado.venta_estado}</h4>
                  <p className="text-sm mt-1">
                    Cantidad: {estado.total_ventas}
                  </p>
                  <p className="text-sm">
                    Monto: $
                    {estado.monto_total?.toLocaleString("es-CO", {
                      minimumFractionDigits: 2,
                    }) || "0.00"}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            {isLoading ? "Cargando datos..." : "No hay datos disponibles"}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
        <p className="text-gray-600 mt-2">
          Visualiza estadísticas y reportes de ventas
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("fechas")}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === "fechas"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Por Fechas
            </button>
            <button
              onClick={() => setActiveTab("asesor")}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === "asesor"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Por Asesor
            </button>
            <button
              onClick={() => setActiveTab("estado")}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === "estado"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Por Estado
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "fechas" && renderReporteFechas()}
          {activeTab === "asesor" && renderReporteAsesor()}
          {activeTab === "estado" && renderReporteEstado()}
        </div>
      </div>
    </div>
  );
}
