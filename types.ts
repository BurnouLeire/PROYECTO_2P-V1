
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  ID: string;
  USERNAME: string;
  ROLE: Role;
  ESTADO?: string;
  FECHA_CREACION?: string;
  NOTAS?: string;
}

export interface Cliente {
  IDCLIENTE: string;
  NOM_CLIEN: string;
  APEL_CLIEN: string;
  DIR_CLIEN: string;
  TEL_CLIEN: number;
}

export interface Proveedor {
  IDPROVEEDORES: string;
  NOM_PROVEEDOR: string;
  DIR_PROVEEDOR: string;
  TEL_PROVEEDOR: number;
}

export interface Producto {
  IDPRODUCTOS: string;
  NOM_PROD: string;
  DESC_PROD: string;
  PROVEEDORES_IDPROVEEDORES: string;
}

export interface Factura {
  IDFACTURAS: string;
  FECHA_FACT: string;
  CANT_FACT: number;
  PROD_FACT: string;
  VALOR_UNI: number;
  VALOR_TOTAL: number;
  VALOR_PAGR: number;
}

export interface Pedido {
  IDPEDIDOS: string;
  FECHA_PED: string;
  PRODUCTO_PED: string;
  CANT_PED: number;
  VALOR_PED: number;
}
