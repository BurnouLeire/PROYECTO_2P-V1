
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Pedido } from '../types';
import CrudTable from '../components/CrudTable';
import CrudForm, { FieldConfig } from '../components/CrudForm';
import { Loader2 } from 'lucide-react';

export default function PedidosView() {
  const [data, setData] = useState<Pedido[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Pedido | undefined>();
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get<Pedido[]>('pedidos');
      setData(res);
    } catch (err) {
      console.error('Error cargando pedidos', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const columns = [
    { header: 'ID PEDIDO', key: 'IDPEDIDOS' },
    { header: 'FECHA', key: 'FECHA_PED', render: (p: any) => new Date(p.FECHA_PED).toLocaleDateString() },
    { header: 'PRODUCTO', key: 'PRODUCTO_PED' },
    { header: 'CANTIDAD', key: 'CANT_PED' },
    { header: 'VALOR EST.', key: 'VALOR_PED', render: (p: Pedido) => <span className="font-medium text-emerald-600">${p.VALOR_PED}</span> },
  ];

  const fields: FieldConfig[] = [
    { name: 'IDPEDIDOS', label: 'Código Pedido', type: 'text', required: true },
    { name: 'FECHA_PED', label: 'Fecha de Requerimiento', type: 'date', required: true },
    { name: 'PRODUCTO_PED', label: 'Nombre Producto Solicitado', type: 'text', required: true },
    { name: 'CANT_PED', label: 'Cantidad a Pedir', type: 'number', required: true },
    { name: 'VALOR_PED', label: 'Valor Presupuestado', type: 'number', required: true },
  ];

  const handleSave = async (item: Pedido) => {
    try {
      if (editingItem) await api.put('pedidos', item.IDPEDIDOS, item);
      else await api.post('pedidos', item);
      loadData();
      setIsFormOpen(false);
    } catch (e) { alert('Error al guardar en Oracle'); }
  };

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  return (
    <div className="p-8">
      <CrudTable
        title="Transacciones: Pedidos"
        subtitle="Administración de AIN_GRUPO13.PEDIDOS"
        data={data}
        columns={columns}
        idField="IDPEDIDOS"
        onAdd={() => { setEditingItem(undefined); setIsFormOpen(true); }}
        onEdit={(i) => { setEditingItem(i); setIsFormOpen(true); }}
        onDelete={async (i) => { if(confirm('¿Eliminar pedido?')) { await api.delete('pedidos', i.IDPEDIDOS); loadData(); } }}
      />
      {isFormOpen && (
        <CrudForm
          title="Nueva Orden de Pedido"
          fields={fields}
          initialData={editingItem}
          onSubmit={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
