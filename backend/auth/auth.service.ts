
import { Injectable, UnauthorizedException, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(Usuario)
    private userRepo: Repository<Usuario>,
    private dataSource: DataSource,
  ) {}

  async onModuleInit() {
    const tableName = 'SGI_USUARIOS';
    const schema = 'AIN_GRUPO13';
    const fullTableName = `"${schema}"."${tableName}"`;

    console.log(`🛡️ Verificando integridad de tabla de seguridad: ${fullTableName}`);

    try {
      // 1. Verificar si la tabla existe
      await this.dataSource.query(`SELECT 1 FROM ${fullTableName} WHERE ROWNUM = 1`);
    } catch (err) {
      if (err.message.includes('ORA-00942')) {
        console.log(`📝 Creando tabla ${fullTableName} desde cero...`);
        await this.dataSource.query(`
          CREATE TABLE ${fullTableName} (
            "IDUSUARIO" VARCHAR2(36) PRIMARY KEY,
            "USERNAME" VARCHAR2(100) UNIQUE NOT NULL,
            "PASSWORD" VARCHAR2(255) NOT NULL,
            "ROLE" VARCHAR2(20) DEFAULT 'USER',
            "ESTADO" VARCHAR2(20) DEFAULT 'ACTIVO',
            "NOTAS" VARCHAR2(500),
            "FECHA_CREACION" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
      }
    }

    // 2. Verificar y agregar columnas faltantes una por una (Fix para ORA-00904)
    const columnsToFix = [
      { name: 'ESTADO', type: 'VARCHAR2(20) DEFAULT \'ACTIVO\'' },
      { name: 'NOTAS', type: 'VARCHAR2(500)' },
      { name: 'FECHA_CREACION', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
      { name: 'ROLE', type: 'VARCHAR2(20) DEFAULT \'USER\'' }
    ];

    for (const col of columnsToFix) {
      try {
        // Verificamos si la columna existe en el diccionario de datos de Oracle
        const checkCol = await this.dataSource.query(`
          SELECT count(*) as "count" 
          FROM ALL_TAB_COLUMNS 
          WHERE OWNER = '${schema}' 
          AND TABLE_NAME = '${tableName}' 
          AND COLUMN_NAME = '${col.name}'
        `);

        if (checkCol[0].count === 0 || checkCol[0].COUNT === 0) {
          console.log(`➕ Agregando columna faltante [${col.name}] a ${tableName}...`);
          await this.dataSource.query(`ALTER TABLE ${fullTableName} ADD ("${col.name}" ${col.type})`);
        }
      } catch (e) {
        console.warn(`⚠️ Nota sobre columna ${col.name}: ${e.message}`);
      }
    }

    // 3. Seed del administrador
    try {
      const count = await this.userRepo.count();
      if (count === 0) {
        await this.seedAdmin();
        console.log('✅ Usuario administrador "admin" creado.');
      }
    } catch (e) {
      console.error('❌ Error al verificar conteo de usuarios:', e.message);
    }
  }

  async validateUser(username: string, pass: string) {
    try {
      const users = await this.userRepo.find({ where: { USERNAME: username } });
      const user = users[0];
      if (user && await bcrypt.compare(pass, user.PASSWORD_HASH)) {
        const { PASSWORD_HASH, ...result } = user;
        return result;
      }
    } catch (e) {
      console.error('Error en validación:', e.message);
    }
    return null;
  }

  async findAll() {
    return this.userRepo.find({ order: { FECHA_CREACION: 'DESC' } });
  }

  async create(data: any) {
    const users = await this.userRepo.find({ where: { USERNAME: data.username } });
    if (users.length > 0) throw new ConflictException('Usuario ya existe');

    const hash = await bcrypt.hash(data.password, 10);
    const user = this.userRepo.create({
      ID: uuidv4(),
      USERNAME: data.username,
      PASSWORD_HASH: hash,
      ROLE: data.role,
      ESTADO: data.estado || 'ACTIVO',
      NOTAS: data.notas || ''
    });
    return this.userRepo.save(user);
  }

  async remove(id: string) {
    return this.userRepo.delete(id);
  }

  async seedAdmin() {
    const hash = await bcrypt.hash('admin123', 10);
    const admin = this.userRepo.create({ 
      ID: uuidv4(),
      USERNAME: 'admin', 
      PASSWORD_HASH: hash, 
      ROLE: 'ADMIN',
      ESTADO: 'ACTIVO',
      NOTAS: 'Administrador inicial maestro'
    });
    return this.userRepo.save(admin);
  }
}
