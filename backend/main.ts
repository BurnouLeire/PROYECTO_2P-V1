import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('SincroERP_Boot');
  
  // 🚫 SE ELIMINÓ LA INICIALIZACIÓN DE ORACLE (No funciona en StackBlitz)

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
  
  const port = 4001;
  await app.listen(port);
  
  console.log('\n====================================================');
  console.log(`🚀 SERVIDOR NESTJS CORRIENDO (MOCK SQLITE)`);
  console.log(`📡 URL: http://localhost:${port}`);
  console.log('====================================================\n');
}
bootstrap();