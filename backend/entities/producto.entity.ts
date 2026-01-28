
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Proveedor } from './proveedor.entity';

@Entity('SGI_PRODUCTOS', { schema: 'AIN_GRUPO13' })
export class Producto {
  @PrimaryColumn({ name: 'IDPRODUCTOS', length: 50 })
  IDPRODUCTOS: string;

  @Column({ name: 'NOM_PROD', length: 100, nullable: true })
  NOM_PROD: string;

  @Column({ name: 'DESC_PROD', length: 200, nullable: true })
  DESC_PROD: string;

  @Column({ name: 'PROVEEDORES_IDPROVEEDORES', length: 50 })
  PROVEEDORES_IDPROVEEDORES: string;

  @ManyToOne(() => Proveedor)
  @JoinColumn({ name: 'PROVEEDORES_IDPROVEEDORES' })
  proveedor: Proveedor;
}
