import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('SGI_PROVEEDORES')
export class Proveedor {
  @PrimaryColumn({ name: 'IDPROVEEDORES', length: 50 })
  IDPROVEEDORES: string;

  @Column({ name: 'NOM_PROVEEDOR', length: 100, nullable: true })
  NOM_PROVEEDOR: string;

  @Column({ name: 'DIR_PROVEEDOR', length: 200, nullable: true })
  DIR_PROVEEDOR: string;

  // ✅ CORREGIDO: Eliminamos type: 'number'
  @Column({ name: 'TEL_PROVEEDOR', nullable: true })
  TEL_PROVEEDOR: number;
}