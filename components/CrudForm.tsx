import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'textarea' | 'radio' | 'select' | 'password';
  options?: { label: string; value: string | number }[];
  placeholder?: string;
  required?: boolean;
  hidden?: boolean;
}

interface CrudFormProps {
  title: string;
  fields: FieldConfig[];
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function CrudForm({ title, fields, initialData, onSubmit, onCancel }: CrudFormProps) {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      const defaults = fields.reduce((acc, f) => {
        // Establecer primer valor por defecto para select y radio si son requeridos
        acc[f.name] = (f.type === 'select' || f.type === 'radio') && f.options ? f.options[0].value : '';
        return acc;
      }, {} as any);
      setFormData(defaults);
    }
  }, [initialData, fields]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const renderField = (field: FieldConfig) => {
    const commonProps = {
      name: field.name,
      value: formData[field.name] || '',
      onChange: handleChange,
      required: field.required,
      placeholder: field.placeholder,
      className: "w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
    };

    switch (field.type) {
      case 'textarea':
        return <textarea {...commonProps} rows={3} />;
      
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Seleccione una opción...</option>
            {field.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2 pt-1">
            {field.options?.map(opt => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name={field.name}
                  value={opt.value}
                  checked={formData[field.name] === opt.value}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700 group-hover:text-indigo-600">{opt.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return <input type={field.type} {...commonProps} />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = fields.filter(f => f.required && !f.hidden && !formData[f.name]).map(f => f.label);
    if (missing.length > 0) {
      setErrors([`Campos requeridos: ${missing.join(', ')}`]);
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 bg-indigo-600 text-white">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onCancel} className="hover:bg-white/20 p-1 rounded-full transition-colors"><X size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errors.length > 0 && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg flex gap-2 items-center text-sm border border-red-100">
              <AlertCircle size={18} /> {errors[0]}
            </div>
          )}

          {fields.map(field => !field.hidden && (
            <div key={field.name} className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}

          <div className="flex gap-3 pt-4 border-t">
            <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all">
              <Save size={18} /> Guardar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}