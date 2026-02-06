import React from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface ColumnConfig<T = any> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface CrudTableProps {
  title: string;
  subtitle?: string;
  data: any[];
  columns: ColumnConfig[];
  idField: string;
  onAdd: () => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}

export default function CrudTable({
  title,
  subtitle,
  data,
  columns,
  idField,
  onAdd,
  onEdit,
  onDelete
}: CrudTableProps) {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="p-6 flex justify-between items-center border-b">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          {subtitle && (
            <p className="text-sm text-slate-500">{subtitle}</p>
          )}
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <Plus size={18} />
          Nuevo
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-100">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="text-left p-3 text-sm font-semibold text-slate-700 border-b"
                >
                  {col.header}
                </th>
              ))}
              <th className="p-3 border-b text-sm font-semibold text-slate-700">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center p-6 text-slate-500"
                >
                  No hay registros
                </td>
              </tr>
            )}

            {data.map(item => (
              <tr key={item[idField]} className="hover:bg-slate-50">
                {columns.map(col => (
                  <td key={col.key} className="p-3 border-b text-sm">
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
                <td className="p-3 border-b flex gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
