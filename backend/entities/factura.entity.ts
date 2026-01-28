
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('SGI_FACTURAS', { schema: 'AIN_GRUPO13' })
export class Factura {
  @PrimaryColumn({ name: 'IDFACTURAS', length: 50 })
  IDFACTURAS: string;

  @Column({ name: 'FECHA_FACT', type: 'date', nullable: true })
  FECHA_FACT: Date;

  @Column({ name: 'CANT_FACT', type: 'number', precision: 10, nullable: true })
  CANT_FACT: number;

  @Column({ name: 'PROD_FACT', length: 100, nullable: true })
  PROD_FACT: string;

  @Column({ name: 'VALOR_UNI', type: 'number', precision: 10, scale: 2, nullable: true })
  VALOR_UNI: number;

  @Column({ name: 'VALOR_TOTAL', type: 'number', precision: 12, scale: 2, nullable: true })
  VALOR_TOTAL: number;

  @Column({ name: 'VALOR_PAGR', type: 'number', precision: 12, scale: 2, nullable: true })
  VALOR_PAGR: number;
}
