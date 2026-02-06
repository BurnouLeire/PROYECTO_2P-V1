import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Producto, Proveedor } from '../types';
import CrudTable from '../components/CrudTable';
import CrudForm, { FieldConfig } from '../components/CrudForm';
import PaginationControls from '../components/PaginationControls';
import { usePagination } from '../hooks/usePagination';
import { Loader2, UserPlus, PackagePlus } from 'lucide-react';

export default function ProductosView() {
  const [data, setData] = useState<Producto[]>([]);
  const [providers, setProviders] = useState<Proveedor[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Producto | undefined>();
  const [loading, setLoading] = useState(true);

  const pagination = usePagination(data, 20);

  // 1. CARGA INICIAL (PRODUCTOS Y PROVEEDORES)
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [prods, provs] = await Promise.all([
        api.get<Producto[]>('productos'),
        api.get<Proveedor[]>('proveedores')
      ]);
      setData(prods);
      setProviders(provs);
      pagination.goToPage(1);
    } catch (err) {
      console.error('Error cargando datos de Oracle', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadInitialData(); }, []);

  // 2. COLUMNAS DE LA TABLA (Mapeo de ID a Nombre de Proveedor)
  const columns = [
    { header: 'ID PRODUCTO', key: 'IDPRODUCTOS' },
    { header: 'NOMBRE', key: 'NOM_PROD' },
    { header: 'DESCRIPCIÓN', key: 'DESC_PROD' },
    { 
      header: 'PROVEEDOR', 
      key: 'PROVEEDORES_IDPROVEEDORES',
      render: (p: Producto) => {
        const prov = providers.find(pr => pr.IDPROVEEDORES === p.PROVEEDORES_IDPROVEEDORES);
        return (
          <span className="px-2 py-1 bg-gray-100 rounded text-sm border border-gray-200">
            {prov ? prov.NOM_PROVEEDOR : p.PROVEEDORES_IDPROVEEDORES}
          </span>
        );
      }
    },
  ];

  // 3. CAMPOS DEL FORMULARIO DE PRODUCTO
  const fields: FieldConfig[] = [
    { 
      name: 'IDPRODUCTOS', 
      label: 'ID Producto (Oracle Key)', 
      type: 'text', 
      required: !editingItem, 
      disabled: !!editingItem 
    },
    { name: 'NOM_PROD', label: 'Nombre Comercial', type: 'text', required: true },
    { name: 'DESC_PROD', label: 'Descripción Técnica', type: 'textarea' },
    { 
      name: 'PROVEEDORES_IDPROVEEDORES', 
      label: 'Seleccionar Proveedor', 
      type: 'select',
      options: providers.map((p) => ({ label: p.NOM_PROVEEDOR, value: p.IDPROVEEDORES })),
      required: true 
    },
  ];

  // 4. GUARDAR PRODUCTO (EDITAR O CREAR)
  const handleSaveProduct = async (item: Producto) => {
    try {
      if (editingItem) {
        // Usamos el ID del registro que estamos editando
        await api.put('productos', editingItem.IDPRODUCTOS, item);
      } else {
        await api.post('productos', item);
      }
      await loadInitialData();
      setIsFormOpen(false);
    } catch (e) {
      alert('Error al procesar el producto en Oracle');
    }
  };

  // 5. GUARDAR PROVEEDOR RÁPIDO (Desde el modal extra)
  const handleQuickAddProvider = async (newProv: any) => {
    try {
      await api.post('proveedores', newProv);
      // Recargar solo proveedores para que aparezca en la lista
      const updatedProvs = await api.get<Proveedor[]>('proveedores');
      setProviders(updatedProvs);
      setIsProviderModalOpen(false);
      alert('Proveedor agregado correctamente');
    } catch (e) {
      alert('Error al crear el nuevo proveedor');
    }
  };

  if (loading) return (
    <div className="p-20 flex flex-col items-center gap-4">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
      <p className="text-gray-500 font-medium">Sincronizando con Oracle DB...</p>
    </div>
  );

  return (
    <div className="p-8 space-y-6">
      {/* CABECERA CON BOTONES ACCIÓN */}
      <div className="flex justify-between items-end border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Maestro de Productos</h1>
          <p className="text-gray-500 text-sm">Gestión de catálogo y vínculos con proveedores</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsProviderModalOpen(true)}
            className="flex items-center gap-2 bg-white border border-emerald-600 text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors shadow-sm"
          >
            <UserPlus size={18} /> Nuevo Proveedor
          </button>
          <button 
            onClick={() => { setEditingItem(undefined); setIsFormOpen(true); }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PackagePlus size={18} /> Agregar Producto
          </button>
        </div>
      </div>

      {/* TABLA PRINCIPAL */}
      <CrudTable
        title="Productos Existentes"
        subtitle="Listado de AIN_GRUPO13.PRODUCTOS"
        data={pagination.paginatedData}
        columns={columns}
        idField="IDPRODUCTOS"
        onAdd={() => { setEditingItem(undefined); setIsFormOpen(true); }}
        onEdit={(i) => { setEditingItem(i); setIsFormOpen(true); }}
        onDelete={async (i) => { 
          if(confirm('¿Eliminar producto?')) { 
            await api.delete('productos', i.IDPRODUCTOS); 
            loadInitialData(); 
          } 
        }}
      />

      <PaginationControls
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        itemsPerPage={20}
        onPrevPage={pagination.prevPage}
        onNextPage={pagination.nextPage}
        onGoToPage={pagination.goToPage}
      />

      {/* MODAL PARA PRODUCTO */}
      {isFormOpen && (
        <CrudForm
          title={editingItem ? "Editar Ficha de Producto" : "Registrar Nuevo Producto"}
          fields={fields}
          initialData={editingItem}
          onSubmit={handleSaveProduct}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {/* MODAL PARA PROVEEDOR RÁPIDO */}
      {isProviderModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-1">
              <CrudForm
                title="Alta Rápida de Proveedor"
                fields={[
                  { name: 'IDPROVEEDORES', label: 'ID/RUC Proveedor', type: 'text', required: true },
                  { name: 'NOM_PROVEEDOR', label: 'Nombre o Razón Social', type: 'text', required: true },
                  { name: 'DIR_PROVEEDOR', label: 'Dirección', type: 'text' },
                  { name: 'TEL_PROVEEDOR', label: 'Teléfono', type: 'text' },
                ]}
                onSubmit={handleQuickAddProvider}
                onCancel={() => setIsProviderModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}