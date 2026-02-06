
# SincroERP - Entrega Final NestJS + React

Este proyecto está dividido en dos partes principales:

## 1. Backend (NestJS) - Carpeta `/backend`
- **ORM**: TypeORM configurado para Oracle.
- **Seguridad**: Autenticación con Bcrypt y Roles.
- **Entidades**: Mapeadas exactamente al DDL `AIN_GRUPO13`.
- **Estructura**: Modular (Controllers, Services, Modules, Entities).

### Instrucciones de Ejecución Backend:
1. Asegúrate de tener instalado el driver de Oracle (`oracledb`) en tu servidor.
    importante aclaracion, el poreycto trabaja con Node 20 debido a que lo requiere la documentacion de Oracle y la ultima version del driver que provee oracle corectamente instalado en el entorno local
2. Ejecuta `npm install` en la carpeta del backend.
3. Ejecuta `npm run start:dev` para iniciar el servidor en el puerto 3000.

## 2. Frontend (React) - Raíz `/`
- **UI**: Tailwind CSS con iconos de Lucide.
- **Navegación**: React Router con rutas privadas.
- **CRUD**: Componentes dinámicos que se conectan al backend NestJS.

### Conexión Frontend -> Backend
El frontend está configurado para consumir los endpoints de NestJS mediante servicios REST. En producción, solo debes cambiar la URL base en tus llamadas de API.
