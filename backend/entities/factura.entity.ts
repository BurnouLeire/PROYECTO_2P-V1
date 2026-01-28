import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('SGI_FACTURAS')
export class Factura {
  @PrimaryColumn({ name: 'IDFACTURAS', length: 50 })
  IDFACTURAS: string;

  // ✅ CORREGIDO: Quitamos type: 'date' para que SQLite no se confunda
  @Column({ name: 'FECHA_FACT', nullable: true })
  FECHA_FACT: Date;

  @Column({ name: 'CANT_FACT', nullable: true })
  CANT_FACT: number;

  @Column({ name: 'PROD_FACT', length: 100, nullable: true })
  PROD_FACT: string;

  @Column({ name: 'VALOR_UNI', nullable: true })
  VALOR_UNI: number;

  @Column({ name: 'VALOR_TOTAL', nullable: true })
  VALOR_TOTAL: number;

  @Column({ name: 'VALOR_PAGR', nullable: true })
  VALOR_PAGR: number;
}