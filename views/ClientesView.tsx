
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Cliente } from '../types';
import CrudTable from '../components/CrudTable';
import CrudForm, { FieldConfig } from '../components/CrudForm';
import { Loader2, AlertTriangle } from 'lucide-react';

export default function ClientesView() {
  const [data, setData] = useState<Cliente[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Cliente | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await api.get<Cliente[]>('clientes');
      setData(result);
      setError(null);
    } catch (err) {
      setError('⚠️ Servidor NestJS Offline. Inicie el backend en el puerto 4000 (npm run start:dev).');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns = [
    { header: 'ID CLIENTE', key: 'IDCLIENTE' },
    { header: 'NOMBRE', key: 'NOM_CLIEN' },
    { header: 'APELLIDO', key: 'APEL_CLIEN' },
    { header: 'DIRECCIÓN', key: 'DIR_CLIEN' },
    { header: 'TELÉFONO', key: 'TEL_CLIEN' },
  ];

  const fields: FieldConfig[] = [
    { name: 'IDCLIENTE', label: 'ID Cliente (Oracle PK)', type: 'text', required: true },
    { name: 'NOM_CLIEN', label: 'Nombre Cliente', type: 'text', required: true },
    { name: 'APEL_CLIEN', label: 'Apellido Cliente', type: 'text', required: true },
    { name: 'DIR_CLIEN', label: 'Dirección Residencia', type: 'textarea' },
    { name: 'TEL_CLIEN', label: 'Teléfono (Number)', type: 'number', required: true },
  ];

  const handleSave = async (item: Cliente) => {
    try {
      if (editingItem) {
        await api.put('clientes', item.IDCLIENTE, item);
      } else {
        await api.post('clientes', item);
      }
      loadData();
      setIsFormOpen(false);
    } catch (err) {
      alert('Error al guardar en la base de datos Oracle');
    }
  };

  const handleDelete = async (item: Cliente) => {
    if (confirm(`¿Desea eliminar al cliente ${item.NOM_CLIEN} de Oracle?`)) {
      try {
        await api.delete('clientes', item.IDCLIENTE);
        loadData();
      } catch (err) {
        alert('Error al eliminar registro');
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full p-20 gap-4 text-slate-500">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
      <p className="font-medium">Consultando tablas en AIN_GRUPO13...</p>
    </div>
  );

  return (
    <div className="p-8">
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 animate-in fade-in">
          <AlertTriangle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <CrudTable
        title="Maestro de Clientes (Real DB)"
        subtitle="Conexión en vivo con AIN_GRUPO13.CLIENTES"
        data={data}
        columns={columns}
        idField="IDCLIENTE"
        onAdd={() => { setEditingItem(undefined); setIsFormOpen(true); }}
        onEdit={(item) => { setEditingItem(item); setIsFormOpen(true); }}
        onDelete={handleDelete}
      />
      {isFormOpen && (
        <CrudForm
          title={editingItem ? "Modificar Cliente en Oracle" : "Sincronizar Nuevo Cliente"}
          fields={fields}
          initialData={editingItem}
          onSubmit={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
