import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Factura } from '../types';
import CrudTable from '../components/CrudTable';
import CrudForm, { FieldConfig } from '../components/CrudForm';
import PaginationControls from '../components/PaginationControls';
import { usePagination } from '../hooks/usePagination';
import { Loader2 } from 'lucide-react';

export default function FacturasView() {
  const [data, setData] = useState<Factura[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Factura | undefined>();
  const [loading, setLoading] = useState(true);

  const pagination = usePagination(data, 20);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get<Factura[]>('facturas');
      setData(res);
      pagination.goToPage(1);
    } catch (err) { 
      console.error(err); 
    }
    finally { 
      setLoading(false); 
    }
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
    
    { name: 'FECHA_FACT', label: 'Fecha Emisión', type: 'date', required: true },
    { name: 'CANT_FACT', label: 'Cantidad', type: 'number', required: true },
    { name: 'PROD_FACT', label: 'Producto', type: 'text', required: true },
    { name: 'VALOR_UNI', label: 'Precio Unitario', type: 'number', required: true },
    { name: 'VALOR_TOTAL', label: 'Total Bruto', type: 'number', required: true },
    { name: 'VALOR_PAGR', label: 'Neto a Pagar', type: 'number', required: true },
  ];

  const handleSave = async (item: Factura) => {
  try {
    if (editingItem) {
      // USAMOS editingItem.IDFACTURAS porque es el que tiene el valor real
      await api.put('facturas', editingItem.IDFACTURAS, item);
    } else {
      await api.post('facturas', item);
    }
    loadData();
    setIsFormOpen(false);
  } catch (err) {
    console.error("Error al guardar factura:", err);
    alert("Error al procesar la factura. Verifique los datos.");
  }
};

  if (loading) return (
    <div className="p-20 flex justify-center">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="p-8 space-y-6">
      <CrudTable
        title="Módulo Transaccional: Facturación"
        subtitle="Registro de ventas en AIN_GRUPO13.FACTURAS"
        data={pagination.paginatedData}
        columns={columns}
        idField="IDFACTURAS"
        onAdd={() => { setEditingItem(undefined); setIsFormOpen(true); }}
        onEdit={(i) => { setEditingItem(i); setIsFormOpen(true); }}
        onDelete={async (i) => { if(confirm('¿Eliminar factura?')) { await api.delete('facturas', i.IDFACTURAS); loadData(); } }}
      />

      {data.length > 0 && (
        <PaginationControls
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={20}
          onPrevPage={pagination.prevPage}
          onNextPage={pagination.nextPage}
          onGoToPage={pagination.goToPage}
        />
      )}

      {isFormOpen && (
        <CrudForm
          title={editingItem ? "Modificar Factura" : "Nueva Factura"}
          fields={fields}
          initialData={editingItem}
          onSubmit={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}