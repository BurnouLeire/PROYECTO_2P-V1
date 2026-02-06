import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('SGI_USUARIOS', { schema: 'AIN_GRUPO13' })
export class Usuario {
  @PrimaryColumn({ name: 'IDUSUARIO', type: 'number' })
  ID: number;

  @Column({ name: 'USERNAME', length: 50, unique: true })
  USERNAME: string;

  @Column({ name: 'PASSWORD', length: 255 })
  PASSWORD: string;

  @Column({ name: 'ROL', length: 20, nullable: true })
  ROL: string;

  @Column({ name: 'ROLE', length: 20, default: 'USER', nullable: true })
  ROLE: string;

  @Column({ name: 'ESTADO', type: 'number', default: 1, nullable: true })
  ESTADO: number; // 1 = ACTIVO, 0 = INACTIVO

  @Column({ name: 'FECHA_CREACION', type: 'date', nullable: true })
  FECHA_CREACION: Date;

  @Column({ name: 'NOTAS', length: 500, nullable: true })
  NOTAS: string;
}