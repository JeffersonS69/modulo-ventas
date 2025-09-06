'use client';

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { HiMenu, HiX, HiUser, HiLogout } from 'react-icons/hi';

interface NavbarProps {
  readonly onNavigate: (page: 'ventas' | 'reportes') => void;
  readonly currentPage: 'ventas' | 'reportes';
}

export default function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigate = (page: 'ventas' | 'reportes') => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Módulo de Ventas</h1>
            
            <div className="hidden lg:flex space-x-4">
              <button
                onClick={() => onNavigate('ventas')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'ventas'
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'
                }`}
              >
                Ventas
              </button>
              <button
                onClick={() => onNavigate('reportes')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'reportes'
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'
                }`}
              >
                Reportes
              </button>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <HiUser className="w-4 h-4" />
              <span className="font-medium">{user?.user_name}</span>
              <span className="px-2 py-1 bg-indigo-800 rounded text-xs">
                {user?.user_role}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <HiLogout className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>

          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMobileMenuOpen ? (
                <HiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <HiMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-indigo-700">
              <button
                onClick={() => handleNavigate('ventas')}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  currentPage === 'ventas'
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'
                }`}
              >
                Ventas
              </button>
              <button
                onClick={() => handleNavigate('reportes')}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  currentPage === 'reportes'
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'
                }`}
              >
                Reportes
              </button>
            </div>
            
            <div className="pt-4 pb-3 border-t border-indigo-700">
              <div className="flex items-center px-5">
                <HiUser className="w-8 h-8 rounded-full bg-indigo-500 p-1" />
                <div className="ml-3">
                  <div className="text-base font-medium text-white">{user?.user_name}</div>
                  <div className="text-sm font-medium text-indigo-200">{user?.user_email}</div>
                </div>
                <span className="ml-auto px-2 py-1 bg-indigo-800 rounded text-xs">
                  {user?.user_role}
                </span>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-indigo-100 hover:bg-indigo-500 hover:text-white transition-colors"
                >
                  <HiLogout className="w-5 h-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
