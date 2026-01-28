
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Producto, Proveedor } from '../types';
import CrudTable from '../components/CrudTable';
import CrudForm, { FieldConfig } from '../components/CrudForm';
import { Loader2 } from 'lucide-react';

export default function ProductosView() {
  const [data, setData] = useState<Producto[]>([]);
  const [providers, setProviders] = useState<Proveedor[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Producto | undefined>();
  const [loading, setLoading] = useState(true);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [prods, provs] = await Promise.all([
        api.get<Producto[]>('productos'),
        api.get<Proveedor[]>('proveedores')
      ]);
      setData(prods);
      setProviders(provs);
    } catch (err) {
      console.error('Error cargando datos de Oracle', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadInitialData(); }, []);

  const columns = [
    { header: 'ID PRODUCTO', key: 'IDPRODUCTOS' },
    { header: 'NOMBRE', key: 'NOM_PROD' },
    { header: 'DESCRIPCIÓN', key: 'DESC_PROD' },
    { 
      header: 'PROVEEDOR', 
      key: 'PROVEEDORES_IDPROVEEDORES',
      render: (p: Producto) => providers.find((pr: Proveedor) => pr.IDPROVEEDORES === p.PROVEEDORES_IDPROVEEDORES)?.NOM_PROVEEDOR || p.PROVEEDORES_IDPROVEEDORES
    },
  ];

  const fields: FieldConfig[] = [
    { name: 'IDPRODUCTOS', label: 'ID Producto', type: 'text', required: true },
    { name: 'NOM_PROD', label: 'Nombre Comercial', type: 'text', required: true },
    { name: 'DESC_PROD', label: 'Descripción Técnica', type: 'textarea' },
    { 
      name: 'PROVEEDORES_IDPROVEEDORES', 
      label: 'Proveedor (Vínculo Oracle)', 
      type: 'select',
      options: providers.map((p: Proveedor) => ({ label: p.NOM_PROVEEDOR, value: p.IDPROVEEDORES })),
      required: true 
    },
  ];

  const handleSave = async (item: Producto) => {
    try {
      if (editingItem) await api.put('productos', item.IDPRODUCTOS, item);
      else await api.post('productos', item);
      loadInitialData();
      setIsFormOpen(false);
    } catch (e) { alert('Error al procesar en Oracle'); }
  };

  if (loading) return (
    <div className="p-20 flex flex-col items-center gap-4">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
      <p>Cargando Catálogo Oracle...</p>
    </div>
  );

  return (
    <div className="p-8">
      <CrudTable
        title="Maestro de Productos"
        subtitle="Catálogo sincronizado con AIN_GRUPO13.PRODUCTOS"
        data={data}
        columns={columns}
        idField="IDPRODUCTOS"
        onAdd={() => { setEditingItem(undefined); setIsFormOpen(true); }}
        onEdit={(i: Producto) => { setEditingItem(i); setIsFormOpen(true); }}
        onDelete={async (i: Producto) => { if(confirm('¿Eliminar producto?')) { await api.delete('productos', i.IDPRODUCTOS); loadInitialData(); } }}
      />
      {isFormOpen && (
        <CrudForm
          title="Ficha Técnica de Producto"
          fields={fields}
          initialData={editingItem}
          onSubmit={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
