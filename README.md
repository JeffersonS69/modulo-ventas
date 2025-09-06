# Módulo de Ventas - Next.js + TypeScript + MySQL

Sistema de gestión de ventas con CRUD completo desarrollado con Next.js 14, TypeScript, MySQL y Tailwind CSS.

## 🚀 Características

- **Gestión de Ventas CRUD completo**
  - Crear nuevas ventas (rol: asesor)
  - Editar y aprobar ventas existentes (rol: supervisor)  
  - Eliminar ventas con soft delete (rol: admin)
  - Listar todas las ventas con filtros

- **Sistema de Reportes**
  - Total de ventas por rango de fechas
  - Ventas por asesor
  - Ventas por estado

- **Autenticación y Autorización**
  - Sistema de login con JWT
  - Roles: asesor, supervisor, admin
  - Permisos específicos por rol

- **Interfaz de Usuario Moderna**
  - Diseño responsivo con Tailwind CSS
  - Formularios intuitivos
  - Tablas y reportes visuales

## 🛠️ Tecnologías

- **Frontend**: Next.js 14 (App Router + Pages Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js 20.x.x
- **Base de Datos**: MySQL
- **Autenticación**: JWT, bcryptjs
- **Estilos**: Tailwind CSS

## 📋 Requisitos Previos

- Node.js 20.x.x o superior
- MySQL 8.0 o superior
- npm o yarn

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd prueba-tecnica
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar la base de datos**
   
   Crear una base de datos MySQL y ejecutar el script de inicialización:
   ```sql
   -- El script se encuentra en database/init.sql
   mysql -u root -p < database/init.sql
   ```

4. **Configurar variables de entorno**
   
   Copiar y editar el archivo `.env.local`:
   ```bash
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_password_mysql
   DB_NAME=ventas_db
   DB_PORT=3306

   # JWT Secret
   JWT_SECRET=tu_secret_key_super_seguro_cambialo_en_produccion
   ```

5. **Ejecutar el proyecto**
   ```bash
   npm run dev
   ```

   El proyecto estará disponible en `http://localhost:3000`

## 👥 Usuarios de Prueba

El sistema incluye usuarios pre-configurados para pruebas:

| Usuario | Contraseña | Rol | Permisos |
|---------|------------|-----|----------|
| `asesor1` | `password123` | Asesor | Crear ventas |
| `supervisor1` | `password123` | Supervisor | Editar y aprobar ventas |
| `admin1` | `password123` | Admin | Eliminar ventas |

## 🗂️ Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── Dashboard.tsx      # Dashboard principal
│   ├── LoginForm.tsx      # Formulario de login
│   ├── Navbar.tsx         # Barra de navegación
│   ├── Reportes.tsx       # Componente de reportes
│   ├── VentaForm.tsx      # Formulario de ventas
│   └── VentasList.tsx     # Lista de ventas
├── contexts/              # React Context
│   └── AuthContext.tsx    # Context de autenticación
├── database/              # Scripts de base de datos
│   └── init.sql          # Script de inicialización
├── lib/                   # Utilidades
│   ├── auth.ts           # Funciones de autenticación
│   └── db.ts             # Conexión a base de datos
├── middleware/            # Middleware de autenticación
│   └── auth.ts           # Middleware JWT
├── pages/api/            # API Routes
│   ├── auth/
│   │   └── login.ts      # Endpoint de login
│   ├── reportes/         # Endpoints de reportes
│   │   ├── asesor.ts
│   │   ├── estado.ts
│   │   └── fechas.ts
│   └── ventas/
│       └── index.ts      # CRUD de ventas
└── types/                # Definiciones TypeScript
    └── index.ts          # Tipos de datos
```

## 🔐 Roles y Permisos

### Asesor
- ✅ Crear nuevas ventas
- ❌ Editar ventas existentes
- ❌ Aprobar ventas
- ❌ Eliminar ventas

### Supervisor  
- ❌ Crear ventas
- ✅ Editar ventas existentes
- ✅ Aprobar/rechazar ventas
- ❌ Eliminar ventas

### Admin
- ❌ Crear ventas
- ❌ Editar ventas
- ✅ Eliminar ventas (soft delete)
- ✅ Acceso completo al sistema

## 📊 Modelo de Datos

### Tabla `ventas`
```sql
- id: INTEGER (PK)
- cli_nombre: VARCHAR (Nombre del cliente)
- cli_id: VARCHAR (ID del cliente)
- cli_fec_nac: DATE (Fecha de nacimiento)
- cli_asesor: VARCHAR (Nombre del asesor)
- inv_code: VARCHAR (Código de factura F-M1-001 a F-M1-999)
- inv_precio: DOUBLE (Precio base)
- inv_descuento: DOUBLE (Descuento)
- inv_desc_extra: DOUBLE (Descuento extra)
- inv_promo_desc: DOUBLE (Descuento promocional)
- inv_total: DOUBLE (Total calculado)
- venta_estado: ENUM ('Ingresada', 'Aprobada', 'Anulada')
- deleted: BOOLEAN (Soft delete)
- date: DATE (Fecha de venta)
- created_at: DATETIME
- updated_at: DATETIME
```

### Tabla `users`
```sql
- id: INTEGER (PK)
- user_name: VARCHAR (Nombre completo)
- user_username: VARCHAR (Usuario único)
- user_role: ENUM ('asesor', 'supervisor', 'admin')
- user_email: VARCHAR (Email único)
- user_password: VARCHAR (Hash de contraseña)
- created_at: DATETIME
- updated_at: DATETIME
```

## 🔄 Flujo del Proceso

1. **Ingreso de Venta** (Asesor)
   - El asesor completa el formulario de nueva venta
   - Se genera automáticamente un código de factura único
   - Se calcula el total basado en precio y descuentos
   - La venta queda en estado "Ingresada"

2. **Aprobación** (Supervisor)
   - El supervisor revisa las ventas ingresadas
   - Puede editar datos si es necesario
   - Cambia el estado a "Aprobada" o "Anulada"

3. **Gestión** (Admin)
   - El admin puede eliminar ventas (soft delete)
   - Acceso completo para auditoría

## 📈 Reportes Disponibles

1. **Por Fechas**: Total de ventas y monto en un rango de fechas
2. **Por Asesor**: Rendimiento de cada asesor de ventas
3. **Por Estado**: Distribución de ventas por estado

---
