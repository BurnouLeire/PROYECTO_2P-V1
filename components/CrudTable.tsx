
import React from 'react';
// Added Package to the imports from lucide-react
import { Edit2, Trash2, PlusCircle, Search, Package } from 'lucide-react';

interface Column<T> {
  header: string;
  key: keyof T | string;
  render?: (item: T) => React.ReactNode;
}

interface CrudTableProps<T> {
  title: string;
  subtitle: string;
  data: T[];
  columns: Column<T>[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onAdd: () => void;
  idField: keyof T;
}

export default function CrudTable<T>({ 
  title, 
  subtitle, 
  data, 
  columns, 
  onEdit, 
  onDelete, 
  onAdd, 
  idField 
}: CrudTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredData = data.filter(item => {
    const searchStr = searchTerm.toLowerCase();
    return Object.values(item as any).some(val => 
      String(val).toLowerCase().includes(searchStr)
    );
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={onAdd}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 shadow-sm transition-all active:scale-95"
          >
            <PlusCircle size={18} />
            Agregar
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.length > 0 ? filteredData.map((item, idx) => (
              <tr key={String(item[idField])} className="hover:bg-slate-50/80 transition-colors group">
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className="px-6 py-4 text-sm text-slate-600">
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </td>
                ))}
                <td className="px-6 py-4 text-sm text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center">
                    <Package size={40} className="mb-2 opacity-20" />
                    <p>No se encontraron registros</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between text-xs text-slate-400 font-medium">
        <span>Mostrando {filteredData.length} de {data.length} registros</span>
        <div className="flex items-center gap-1">
          <button className="px-2 py-1 rounded border border-slate-200 disabled:opacity-50" disabled>Anterior</button>
          <button className="px-2 py-1 rounded bg-indigo-600 text-white border border-indigo-600">1</button>
          <button className="px-2 py-1 rounded border border-slate-200 disabled:opacity-50" disabled>Siguiente</button>
        </div>
      </div>
    </div>
  );
}
