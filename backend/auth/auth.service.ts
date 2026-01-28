// src/auth/auth.service.ts
import { Injectable, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(Usuario)
    private userRepo: Repository<Usuario>,
  ) {}

  async onModuleInit() {
    const adminExists = await this.userRepo.findOne({ 
      where: { USERNAME: 'admin' } 
    });

    if (!adminExists) {
      await this.seedAdmin();
      console.log('✅ Admin creado: admin / admin123');
    }
  }

  async validateUser(username: string, pass: string) {
    const user = await this.userRepo.findOne({ where: { USERNAME: username } });
    if (user && await bcrypt.compare(pass, user.PASSWORD_HASH)) {
      const { PASSWORD_HASH, ...result } = user;
      return result;
    }
    return null;
  }

  async findAll() {
    return this.userRepo.find();
  }

  async create(data: any) {
    const exists = await this.userRepo.findOne({ where: { USERNAME: data.username } });
    if (exists) throw new ConflictException('Usuario ya existe');

    const hash = await bcrypt.hash(data.password, 10);
    return this.userRepo.save({
      ID: uuidv4(),
      USERNAME: data.username,
      PASSWORD_HASH: hash,
      ROLE: data.role || 'USER',
      ESTADO: 'ACTIVO',
    });
  }

  async remove(id: string) {
    return this.userRepo.delete(id);
  }

  async seedAdmin() {
    const hash = await bcrypt.hash('admin123', 10);
    return this.userRepo.save({
      ID: uuidv4(),
      USERNAME: 'admin',
      PASSWORD_HASH: hash,
      ROLE: 'ADMIN',
      ESTADO: 'ACTIVO',
    });
  }
}