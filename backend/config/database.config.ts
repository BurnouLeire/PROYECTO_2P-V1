import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  // Se creará un archivo llamado "database.sqlite" en la raíz de la carpeta backend
  database: 'database.sqlite', 
  
  // Busca todas las entidades automáticamente
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  
  // ✅ ACTIVADO: Esto es lo que crea las tablas automáticamente en SQLite 
  // basándose en tus archivos .entity.ts
  synchronize: true, 
  
  logging: false,
  
  // SQLite no usa pools de Oracle ni SIDs, así que simplificamos
};