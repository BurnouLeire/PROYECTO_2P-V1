import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('SGI_PEDIDOS') // Se quita el schema 'AIN_GRUPO13' para SQLite
export class Pedido {
  @PrimaryColumn({ name: 'IDPEDIDOS', length: 50 })
  IDPEDIDOS: string;

  // ✅ CORREGIDO: Se quita type: 'date'
  @Column({ name: 'FECHA_PED', nullable: true })
  FECHA_PED: Date;

  @Column({ name: 'PRODUCTO_PED', length: 100, nullable: true })
  PRODUCTO_PED: string;

  // ✅ CORREGIDO: Se quita type: 'number' y precision
  @Column({ name: 'CANT_PED', nullable: true })
  CANT_PED: number;

  // ✅ CORREGIDO: Se quita type: 'number', precision y scale
  @Column({ name: 'VALOR_PED', nullable: true })
  VALOR_PED: number;
}