import { Injectable, UnauthorizedException, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import * as bcrypt from 'bcrypt';

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
      await this.dataSource.query(`SELECT 1 FROM ${fullTableName} WHERE ROWNUM = 1`);
    } catch (err) {
      if (err.message.includes('ORA-00942')) {
        console.log(`📝 Creando tabla ${fullTableName} desde cero...`);
        await this.dataSource.query(`
          CREATE TABLE ${fullTableName} (
            "IDUSUARIO" NUMBER PRIMARY KEY,
            "USERNAME" VARCHAR2(50) UNIQUE NOT NULL,
            "PASSWORD" VARCHAR2(255) NOT NULL,
            "ROL" VARCHAR2(20),
            "ROLE" VARCHAR2(20) DEFAULT 'USER',
            "ESTADO" NUMBER DEFAULT 1,
            "NOTAS" VARCHAR2(500),
            "FECHA_CREACION" DATE DEFAULT SYSDATE
          )
        `);
      }
    }

    // Verificar y agregar columnas faltantes
    const columnsToFix = [
      { name: 'ESTADO', type: 'NUMBER DEFAULT 1' },
      { name: 'NOTAS', type: 'VARCHAR2(500)' },
      { name: 'FECHA_CREACION', type: 'DATE DEFAULT SYSDATE' },
      { name: 'ROLE', type: 'VARCHAR2(20) DEFAULT \'USER\'' },
      { name: 'ROL', type: 'VARCHAR2(20)' }
    ];

    for (const col of columnsToFix) {
      try {
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

    // Seed del administrador
    try {
      const count = await this.userRepo.count();
      if (count === 0) {
        await this.seedAdmin();
        console.log('✅ Usuario administrador "ADMIN" creado.');
      }
    } catch (e) {
      console.error('❌ Error al verificar conteo de usuarios:', e.message);
    }
  }

  async validateUser(username: string, pass: string) {
    try {
      if (!username || !pass) return null;
      
      const normalizedUsername = (username || '').toUpperCase().trim();
      const users = await this.userRepo.find({ 
        where: { USERNAME: normalizedUsername } 
      });
      
      const user = users[0];
      if (user && await bcrypt.compare(pass, user.PASSWORD)) {
        const { PASSWORD, ...result } = user;
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
    // Validar datos requeridos
    if (!data.USERNAME && !data.username) {
      throw new ConflictException('El usuario es requerido');
    }
    if (!data.PASSWORD && !data.password) {
      throw new ConflictException('La contraseña es requerida');
    }

    // Normalizar a mayúsculas para consistencia con Oracle
    const normalizedUsername = (data.USERNAME || data.username || '').toUpperCase().trim();
    
    const users = await this.userRepo.find({ 
      where: { USERNAME: normalizedUsername } 
    });
    
    if (users.length > 0) {
      throw new ConflictException(`Usuario "${normalizedUsername}" ya existe`);
    }

    const hash = await bcrypt.hash(data.PASSWORD || data.password, 10);
    const role = (data.ROLE || data.role || 'USER').toUpperCase();
    
    // Convertir ESTADO a número (1 = ACTIVO, 0 = INACTIVO)
    let estado = 1;
    if (data.ESTADO) {
      estado = data.ESTADO === 'INACTIVO' || data.ESTADO === '0' ? 0 : 1;
    }

    const user = this.userRepo.create({
      // NO generar ID, Oracle lo genera automáticamente con la secuencia
      USERNAME: normalizedUsername,
      PASSWORD: hash,
      ROL: role,
      ROLE: role,
      ESTADO: estado,
      NOTAS: data.NOTAS || data.notas || '',
      FECHA_CREACION: new Date()
    });
    
    return this.userRepo.save(user);
  }

  async remove(id: string) {
    return this.userRepo.delete(id);
  }

  async seedAdmin() {
    const hash = await bcrypt.hash('admin123', 10);
    const admin = this.userRepo.create({ 
      // NO generar ID, Oracle lo genera
      USERNAME: 'ADMIN',
      PASSWORD: hash,
      ROL: 'ADMIN',
      ROLE: 'ADMIN',
      ESTADO: 1, // 1 = ACTIVO
      NOTAS: 'Administrador inicial maestro',
      FECHA_CREACION: new Date()
    });
    return this.userRepo.save(admin);
  }
}