import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { ClientesModule } from './clientes/clientes.module';
import { FacturasModule } from './facturas/facturas.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { ProductosModule } from './productos/productos.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    ClientesModule,
    FacturasModule,
    PedidosModule,
    ProductosModule,
    ProveedoresModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  onModuleInit() {
    const dbType = this.dataSource.driver.database;
    
    if (this.dataSource.isInitialized) {
      console.log('✅ [DATABASE] Conexión establecida exitosamente');
      console.log(`📂 [CONFIG] Base de datos: ${dbType || 'SQLite'}`);
      console.log('🚀 Servidor listo para recibir peticiones');
    } else {
      console.error('❌ [DATABASE] Error crítico: No se pudo conectar a la base de datos');
    }
  }
}