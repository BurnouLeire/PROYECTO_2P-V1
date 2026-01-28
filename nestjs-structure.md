
# Arquitectura del Servidor NestJS para Oracle G13

## 1. Configuración de Base de Datos (Oracle 21c)
En `app.module.ts`, utilizar el driver `oracledb`:

```typescript
TypeOrmModule.forRoot({
  type: 'oracle',
  host: 'oracle-host',
  port: 1521,
  username: 'AIN_GRUPO13',
  password: 'tu_password',
  sid: 'xe',
  schema: 'AIN_GRUPO13',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false, // Usar las tablas ya creadas del DDL
  logging: true,
})
```

## 2. Entidad Usuario (Módulo de Autenticación)
Ubicada en `src/auth/entities/user.entity.ts`:

```typescript
@Entity('USUARIOS') // Tabla para control de acceso
export class User {
  @PrimaryGeneratedColumn('uuid')
  ID: string;

  @Column({ unique: true })
  USERNAME: string;

  @Column({ select: false }) // Cifrado con bcrypt
  PASSWORD_HASH: string;

  @Column({ type: 'varchar2', default: 'USER' })
  ROLE: string;

  @CreateDateColumn()
  CREATED_AT: Date;
}
```

## 3. Lógica Transaccional (TypeORM)
Para las tablas `HAS` (N:M), se pueden usar decoradores `@ManyToMany` o entidades intermedias manuales.

Ejemplo Entity Cliente:
```typescript
@Entity('CLIENTES')
export class Cliente {
  @PrimaryColumn({ name: 'IDCLIENTE' })
  IDCLIENTE: string;

  @Column({ name: 'NOM_CLIEN' })
  NOM_CLIEN: string;

  @Column({ name: 'APEL_CLIEN' })
  APEL_CLIEN: string;

  @Column({ name: 'DIR_CLIEN' })
  DIR_CLIEN: string;

  @Column({ name: 'TEL_CLIEN', type: 'number' })
  TEL_CLIEN: number;
}
```

## 4. Auditoría y Cifrado
- **Bcrypt**: Para guardar la clave de forma cifrada en la base de datos Oracle.
- **JWT**: Para sesiones seguras entre React y NestJS.
- **Guards**: `@UseGuards(RolesGuard)` para restringir acceso al módulo de Usuarios solo a administradores.
