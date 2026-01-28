
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as oracledb from 'oracledb';

async function bootstrap() {
  const logger = new Logger('SincroERP_Boot');
  
  // 🔥 FORZAR ORACLE THICK MODE (REQUERIMIENTO GRUPO 13)
  try {
    oracledb.initOracleClient({
      libDir: 'C:\\oracle\\instantclient_23_0', // Ruta proporcionada por el usuario
    });
    logger.log('✅ Oracle Thick Mode habilitado exitosamente en: C:\\oracle\\instantclient_23_0');
  } catch (err) {
    logger.error('❌ Error fatal al inicializar Oracle Client. Verifique la ruta y arquitectura (64-bit).');
    logger.error(err.message);
  }

  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para comunicación con React
  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Validaciones globales de DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Cambiado a 4001 para evitar conflictos EADDRINUSE
  const port = 4001;
  await app.listen(port);
  
  console.log('\n====================================================');
  console.log(`🚀 SERVIDOR NESTJS EJECUTÁNDOSE EN: http://localhost:${port}`);
  console.log(`📊 CONECTADO A ESQUEMA: AIN_GRUPO13 (ORACLE G13)`);
  console.log('====================================================\n');
}
bootstrap();
