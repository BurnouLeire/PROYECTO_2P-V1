
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('SGI_PEDIDOS', { schema: 'AIN_GRUPO13' })
export class Pedido {
  @PrimaryColumn({ name: 'IDPEDIDOS', length: 50 })
  IDPEDIDOS: string;

  @Column({ name: 'FECHA_PED', type: 'date', nullable: true })
  FECHA_PED: Date;

  @Column({ name: 'PRODUCTO_PED', length: 100, nullable: true })
  PRODUCTO_PED: string;

  @Column({ name: 'CANT_PED', type: 'number', precision: 10, nullable: true })
  CANT_PED: number;

  @Column({ name: 'VALOR_PED', type: 'number', precision: 12, scale: 2, nullable: true })
  VALOR_PED: number;
}
