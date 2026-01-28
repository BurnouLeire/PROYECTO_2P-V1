
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('SGI_PROVEEDORES', { schema: 'AIN_GRUPO13' })
export class Proveedor {
  @PrimaryColumn({ name: 'IDPROVEEDORES', length: 50 })
  IDPROVEEDORES: string;

  @Column({ name: 'NOM_PROVEEDOR', length: 100, nullable: true })
  NOM_PROVEEDOR: string;

  @Column({ name: 'DIR_PROVEEDOR', length: 200, nullable: true })
  DIR_PROVEEDOR: string;

  @Column({ name: 'TEL_PROVEEDOR', type: 'number', precision: 15, nullable: true })
  TEL_PROVEEDOR: number;
}
