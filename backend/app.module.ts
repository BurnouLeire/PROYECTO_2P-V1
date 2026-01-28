
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
    if (this.dataSource.isInitialized) {
      console.log('✅ [DATABASE] Conexión establecida con éxito a Oracle (108.181.157.248:10011)');
      console.log('📂 [SCHEMA] Trabajando sobre el esquema: AIN_GRUPO13');
    } else {
      console.error('❌ [DATABASE] Error crítico: No se pudo conectar a la base de datos Oracle.');
    }
  }
}
