"use client";

import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "./Navbar";
import VentasList from "./VentasList";
import VentaForm from "./VentaForm";
import Reportes from "./Reportes";
import { Venta } from "../types";

type ViewMode = "list" | "form" | "reportes";

export default function Dashboard() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<"ventas" | "reportes">(
    "ventas"
  );
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleNavigate = (page: "ventas" | "reportes") => {
    setCurrentPage(page);
    if (page === "ventas") {
      setViewMode("list");
      setSelectedVenta(null);
    }
  };

  const handleNewVenta = () => {
    setSelectedVenta(null);
    setViewMode("form");
  };

  const handleEditVenta = (venta: Venta) => {
    setSelectedVenta(venta);
    setViewMode("form");
  };

  const handleSaveVenta = () => {
    setViewMode("list");
    setSelectedVenta(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCancelForm = () => {
    setViewMode("list");
    setSelectedVenta(null);
  };

  const renderContent = () => {
    if (currentPage === "reportes") {
      return <Reportes />;
    }

    if (currentPage === "ventas") {
      if (viewMode === "form") {
        return (
          <VentaForm
            venta={selectedVenta}
            onSave={handleSaveVenta}
            onCancel={handleCancelForm}
          />
        );
      }

      return (
        <VentasList
          onEditVenta={handleEditVenta}
          onNewVenta={handleNewVenta}
          refreshTrigger={refreshTrigger}
        />
      );
    }

    return null;
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />

      <main className="flex-1 max-w-7xl mx-auto w-full py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">{renderContent()}</div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2025 Módulo de Ventas - Usuario: {user.user_name} (
            {user.user_role})
          </p>
        </div>
      </footer>
    </div>
  );
}
