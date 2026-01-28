import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('SGI_CLIENTES') // Quitamos el schema para evitar líos en SQLite
export class Cliente {
  @PrimaryColumn({ name: 'IDCLIENTE', length: 50 })
  IDCLIENTE: string;

  @Column({ name: 'NOM_CLIEN', length: 100, nullable: true })
  NOM_CLIEN: string;

  @Column({ name: 'APEL_CLIEN', length: 100, nullable: true })
  APEL_CLIEN: string;

  @Column({ name: 'DIR_CLIEN', length: 200, nullable: true })
  DIR_CLIEN: string;

  // ✅ CORREGIDO: Eliminamos type: 'number'
  @Column({ name: 'TEL_CLIEN', nullable: true })
  TEL_CLIEN: number;
}