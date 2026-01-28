📝 SincroERP - Sistema de Gestión de Inventario
SincroERP es una solución integral para la gestión de inventarios, proveedores, facturación y clientes, desarrollada como proyecto académico. El sistema utiliza una arquitectura desacoplada con un backend robusto en NestJS y un frontend moderno en React con TypeScript.
🚀 Características Principales
Gestión de Productos: Control de stock, descripciones y vinculación con proveedores.
Módulo de Facturación: Registro de ventas, cantidades y cálculos de valores totales.
Control de Pedidos: Seguimiento de órdenes y estados.
Administración de Clientes y Proveedores: Directorio completo con información de contacto.
Seguridad y Acceso: Sistema de autenticación con JWT, encriptación de claves y control de roles (Admin/User).
🛠️ Stack Tecnológico
Backend
Framework: NestJS (Node.js)
Lenguaje: TypeScript
Base de Datos: SQLite (Configurado con TypeORM para máxima portabilidad).
Seguridad: BcryptJS para hashing de contraseñas.
Frontend
Librería: React.js con TypeScript
Estilos: Tailwind CSS & Lucide Icons
Estado/Rutas: React Router con protección de rutas privadas.
📂 Estructura del Proyecto
code
Bash
PROYECTO_2P-V1/
├── backend/                # Lógica del servidor (NestJS)
│   ├── src/
│   │   ├── entities/       # Modelos de base de datos (SGI_CLIENTES, SGI_PRODUCTOS, etc.)
│   │   ├── auth/           # Módulo de seguridad y login
│   │   └── config/         # Configuración de base de datos SQLite
├── src/                    # Frontend (React)
│   ├── components/         # Componentes reutilizables
│   └── views/              # Vistas principales (Dashboard, Clientes, Facturas)
└── database.sqlite         # Base de datos local (auto-generada)
⚙️ Configuración e Instalación
1. Requisitos Previos
Node.js (Versión 18 o superior)
Navegador moderno.
2. Instalación del Backend
code
Bash
cd backend
npm install
# Iniciar servidor en http://localhost:4001
npm run start:dev
Nota: Al iniciar por primera vez, TypeORM creará automáticamente el archivo database.sqlite con todas las tablas necesarias.
3. Instalación del Frontend
code
Bash
# En la raíz del proyecto
npm install
# Iniciar frontend
npm run dev
📋 Base de Datos (Esquema SGI)
El proyecto mapea las siguientes entidades de gestión:
SGI_USUARIOS: Gestión de credenciales y roles.
SGI_CLIENTES: Información de compradores.
SGI_PROVEEDORES: Datos de contacto de abastecedores.
SGI_PRODUCTOS: Catálogo de artículos e inventario.
SGI_FACTURAS: Registro histórico de ventas.
SGI_PEDIDOS: Órdenes de compra y seguimiento.
🎓 Notas de Entrega (Universidad)
Portabilidad: Se ha migrado de Oracle a SQLite para asegurar que el proyecto se ejecute de forma inmediata en cualquier entorno (incluyendo StackBlitz) sin necesidad de configurar clientes pesados de base de datos.
Compatibilidad: Todas las entidades mantienen la estructura del esquema original AIN_GRUPO13.
Modo Mock: Los datos se almacenan localmente en el archivo database.sqlite.