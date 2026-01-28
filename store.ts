
import { Cliente, Proveedor, Producto, Factura, Pedido, User, Role } from './types';

const INITIAL_CLIENTES: Cliente[] = [
  { IDCLIENTE: 'CLI-001', NOM_CLIEN: 'Carlos', APEL_CLIEN: 'Mendoza', DIR_CLIEN: 'Quito, Av. Amazonas', TEL_CLIEN: 998877665 },
];

const INITIAL_PROVEEDORES: Proveedor[] = [
  { IDPROVEEDORES: 'PROV-13', NOM_PROVEEDOR: 'Suministros Industriales G13', DIR_PROVEEDOR: 'Guayaquil, Zona Ind.', TEL_PROVEEDOR: 42334455 },
];

const INITIAL_USERS: (User & { passwordHash: string })[] = [
  // Fixed: removed 'createdAt' property as it is not defined in the User interface in types.ts
  { ID: 'U01', USERNAME: 'admin', ROLE: Role.ADMIN, passwordHash: 'admin123' },
  { ID: 'U02', USERNAME: 'operador', ROLE: Role.USER, passwordHash: 'user123' },
];

class MockDB {
  private clientes: Cliente[] = [...INITIAL_CLIENTES];
  private proveedores: Proveedor[] = [...INITIAL_PROVEEDORES];
  private productos: Producto[] = [];
  private facturas: Factura[] = [];
  private pedidos: Pedido[] = [];
  private users = [...INITIAL_USERS];

  getAll<T>(entity: string): T[] {
    const list = (this as any)[entity];
    return Array.isArray(list) ? [...list] : [];
  }

  save<T>(entity: string, item: any): void {
    const list = (this as any)[entity] as any[];
    if (!list) return;
    const idField = this.getIdField(entity);
    const index = list.findIndex(i => i[idField] === item[idField]);
    
    if (index >= 0) {
      list[index] = { ...list[index], ...item };
    } else {
      list.push(item);
    }
  }

  delete(entity: string, id: string): void {
    const list = (this as any)[entity] as any[];
    if (!list) return;
    const idField = this.getIdField(entity);
    (this as any)[entity] = list.filter(i => i[idField] !== id);
  }

  private getIdField(entity: string): string {
    switch(entity) {
      case 'clientes': return 'IDCLIENTE';
      case 'proveedores': return 'IDPROVEEDORES';
      case 'productos': return 'IDPRODUCTOS';
      case 'facturas': return 'IDFACTURAS';
      case 'pedidos': return 'IDPEDIDOS';
      case 'users': return 'ID';
      default: return 'ID';
    }
  }

  authenticate(username: string, pass: string): User | null {
    const user = this.users.find(u => u.USERNAME === username && u.passwordHash === pass);
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser as User;
  }
}

export const db = new MockDB();
