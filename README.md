# Óptica CRM

Sistema de gestión integral para ópticas que centraliza la administración de clientes, inventario, citas, prescripciones y ventas.

## 🎯 Características principales

- **Gestión de Clientes**: Base de datos completa con historial de compras y prescripciones
- **Control de Inventario**: Seguimiento de marcos, lentes y accesorios
- **Sistema de Citas**: Agenda integrada con recordatorios automáticos
- **Prescripciones**: Registro digital de graduaciones y especificaciones
- **Punto de Venta**: Sistema de ventas con generación de facturas
- **Reportes**: Análisis de ventas, clientes frecuentes y productos más vendidos
- **Dashboard**: Vista general del negocio en tiempo real

## 🚀 Stack Tecnológico

- **Backend**: Node.js + Express.js
- **Frontend**: React + Vite
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT
- **ORM**: Sequelize
- **UI Components**: Material-UI
- **Validación**: Joi

## 📋 Requisitos

- Node.js v18+
- PostgreSQL 12+
- npm o yarn

## 🔧 Instalación

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run migrate
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📁 Estructura del Proyecto

```
optica-crm/
├── backend/              # API Express.js
├── frontend/             # Aplicación React
├── docs/                 # Documentación
├── scripts/              # Scripts de utilidad
└── docker-compose.yml    # Configuración Docker
```

## 🔐 Variables de Entorno

Crear `.env` en la raíz del backend:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=optica_crm
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## 📖 Documentación

Ver `/docs` para documentación detallada de:
- API endpoints
- Modelos de datos
- Guía de instalación
- Casos de uso

## 📝 Licencia

MIT

## 👥 Soporte

Para reportar bugs o sugerencias, crear un issue en el repositorio.
