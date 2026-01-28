
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Factura } from '../types';
import CrudTable from '../components/CrudTable';
import CrudForm, { FieldConfig } from '../components/CrudForm';
import { Loader2 } from 'lucide-react';

export default function FacturasView() {
  const [data, setData] = useState<Factura[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Factura | undefined>();
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get<Factura[]>('facturas');
      setData(res);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const columns = [
    { header: 'ID FACTURA', key: 'IDFACTURAS' },
    { header: 'FECHA', key: 'FECHA_FACT', render: (f: any) => new Date(f.FECHA_FACT).toLocaleDateString() },
    { header: 'PRODUCTO', key: 'PROD_FACT' },
    { header: 'VALOR UNI.', key: 'VALOR_UNI' },
    { header: 'A PAGAR', key: 'VALOR_PAGR', render: (f: Factura) => <span className="font-bold text-indigo-600">${f.VALOR_PAGR}</span> },
  ];

  const fields: FieldConfig[] = [
    { name: 'IDFACTURAS', label: 'ID Factura', type: 'text', required: true },
    { name: 'FECHA_FACT', label: 'Fecha Emisión', type: 'date', required: true },
    { name: 'CANT_FACT', label: 'Cantidad', type: 'number', required: true },
    { name: 'PROD_FACT', label: 'Producto', type: 'text', required: true },
    { name: 'VALOR_UNI', label: 'Precio Unitario', type: 'number', required: true },
    { name: 'VALOR_TOTAL', label: 'Total Bruto', type: 'number', required: true },
    { name: 'VALOR_PAGR', label: 'Neto a Pagar', type: 'number', required: true },
  ];

  const handleSave = async (item: Factura) => {
    if (editingItem) await api.put('facturas', item.IDFACTURAS, item);
    else await api.post('facturas', item);
    loadData();
    setIsFormOpen(false);
  };

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-8">
      <CrudTable
        title="Módulo Transaccional: Facturación"
        subtitle="Registro de ventas en AIN_GRUPO13.FACTURAS"
        data={data}
        columns={columns}
        idField="IDFACTURAS"
        onAdd={() => { setEditingItem(undefined); setIsFormOpen(true); }}
        onEdit={(i) => { setEditingItem(i); setIsFormOpen(true); }}
        onDelete={async (i) => { if(confirm('¿Eliminar factura?')) { await api.delete('facturas', i.IDFACTURAS); loadData(); } }}
      />
      {isFormOpen && (
        <CrudForm
          title="Procesar Factura"
          fields={fields}
          initialData={editingItem}
          onSubmit={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
