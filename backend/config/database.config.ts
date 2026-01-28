
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'oracle',
  host: '108.181.157.248',
  port: 10011,
  username: 'AIN_GRUPO13',
  password: 'grupo13207',
  sid: 'XE',
  // @ts-ignore
  version: '11.2',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  // 🛑 DESACTIVADO: Evita que TypeORM intente borrar índices/restricciones existentes
  synchronize: false, 
  logging: ['query', 'error'],
  extra: {
    poolMin: 1,
    poolMax: 10,
    connectTimeout: 60000,
  }
};
