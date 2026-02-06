import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Proveedor } from '../types';
import CrudTable from '../components/CrudTable';
import CrudForm, { FieldConfig } from '../components/CrudForm';
import PaginationControls from '../components/PaginationControls';
import { usePagination } from '../hooks/usePagination';
import { Loader2 } from 'lucide-react';

export default function ProveedoresView() {
  const [data, setData] = useState<Proveedor[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Proveedor | undefined>();
  const [loading, setLoading] = useState(true);

  const pagination = usePagination(data, 20);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get<Proveedor[]>('proveedores');
      setData(res);
      pagination.goToPage(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const columns = [
    { header: 'ID PROVEEDOR', key: 'IDPROVEEDORES' },
    { header: 'RAZÓN SOCIAL', key: 'NOM_PROVEEDOR' },
    { header: 'DIRECCIÓN', key: 'DIR_PROVEEDOR' },
    { header: 'TELÉFONO', key: 'TEL_PROVEEDOR' },
  ];

  const fields: FieldConfig[] = [
    
    { name: 'NOM_PROVEEDOR', label: 'Nombre Comercial', type: 'text', required: true },
    { name: 'DIR_PROVEEDOR', label: 'Dirección Principal', type: 'text' },
    { name: 'TEL_PROVEEDOR', label: 'Teléfono Contacto', type: 'number', required: true },
  ];

  const handleSave = async (item: Proveedor) => {
  try {
    if (editingItem) {
      // Usamos el ID original que guardamos al presionar "Editar"
      await api.put('proveedores', editingItem.IDPROVEEDORES, item);
    } else {
      await api.post('proveedores', item);
    }
    loadData();
    setIsFormOpen(false);
  } catch (error) {
    console.error("Error al guardar:", error);
    alert("No se pudo guardar el proveedor");
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
        title="Maestro de Proveedores (Real)"
        subtitle="Proveedores de Oracle"
        data={pagination.paginatedData}
        columns={columns}
        idField="IDPROVEEDORES"
        onAdd={() => { setEditingItem(undefined); setIsFormOpen(true); }}
        onEdit={(i) => { setEditingItem(i); setIsFormOpen(true); }}
        onDelete={async (i) => { if(confirm('¿Eliminar?')) { await api.delete('proveedores', i.IDPROVEEDORES); loadData(); } }}
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
          title="Ficha de Proveedor"
          fields={fields}
          initialData={editingItem}
          onSubmit={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}