
import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('SGI_USUARIOS', { schema: 'AIN_GRUPO13' })
export class Usuario {
  @PrimaryColumn({ name: 'IDUSUARIO', length: 36 })
  ID: string;

  @Column({ name: 'USERNAME', unique: true, length: 100 })
  USERNAME: string;

  @Column({ name: 'PASSWORD', length: 255 })
  PASSWORD_HASH: string;

  @Column({ name: 'ROLE', length: 20, default: 'USER' })
  ROLE: string; 

  @Column({ name: 'ESTADO', length: 20, default: 'ACTIVO' })
  ESTADO: string;

  @Column({ name: 'NOTAS', length: 500, nullable: true })
  NOTAS: string;

  @CreateDateColumn({ name: 'FECHA_CREACION' })
  FECHA_CREACION: Date;
}
