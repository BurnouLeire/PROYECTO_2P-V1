
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('SGI_CLIENTES', { schema: 'AIN_GRUPO13' })
export class Cliente {
  @PrimaryColumn({ name: 'IDCLIENTE', length: 50 })
  IDCLIENTE: string;

  @Column({ name: 'NOM_CLIEN', length: 100, nullable: true })
  NOM_CLIEN: string;

  @Column({ name: 'APEL_CLIEN', length: 100, nullable: true })
  APEL_CLIEN: string;

  @Column({ name: 'DIR_CLIEN', length: 200, nullable: true })
  DIR_CLIEN: string;

  @Column({ name: 'TEL_CLIEN', type: 'number', precision: 15, nullable: true })
  TEL_CLIEN: number;
}
