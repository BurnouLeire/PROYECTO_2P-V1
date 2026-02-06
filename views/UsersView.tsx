import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { User, Role } from '../types';
import CrudTable from '../components/CrudTable';
import CrudForm, { FieldConfig } from '../components/CrudForm';
import { ShieldCheck, UserPlus, ShieldAlert, Calendar, Loader2, Info } from 'lucide-react';

export default function UsersView() {
  const [data, setData] = useState<User[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get<User[]>('auth/users');
      setData(res);
    } catch (e) { 
      console.error("Error cargando usuarios:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const columns = [
    { 
      header: 'USUARIO', 
      key: 'USERNAME',
      render: (u: User) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
            {u.USERNAME ? u.USERNAME[0].toUpperCase() : '?'}
          </div>
          <span className="font-semibold">{u.USERNAME || 'N/A'}</span>
        </div>
      )
    },
    { 
      header: 'ROL', 
      key: 'ROLE', 
      render: (u: User) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          u.ROLE === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
        }`}>
          {u.ROLE || 'USER'}
        </span>
      )
    },
    { 
      header: 'ESTADO', 
      key: 'ESTADO',
      render: (u: User) => (
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${u.ESTADO === 1 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
          <span className="text-xs">{u.ESTADO === 1 ? 'ACTIVO' : 'INACTIVO'}</span>
        </div>
      )
    },
    { 
      header: 'CREACIÓN', 
      key: 'FECHA_CREACION',
      render: (u: User) => (
        <span className="text-xs text-slate-400">
          {u.FECHA_CREACION ? new Date(u.FECHA_CREACION).toLocaleDateString() : 'N/A'}
        </span>
      )
    }
  ];

  // Configuración de campos - TODOS EN MAYÚSCULAS para coincidir con el BD
  const fields: FieldConfig[] = [
    { 
      name: 'USERNAME',
      label: 'Nombre de Acceso (TextField)', 
      type: 'text', 
      required: true,
      placeholder: 'ej. juan.perez'
    },
    { 
      name: 'PASSWORD',
      label: 'Contraseña de Seguridad (TextField)', 
      type: 'password',
      required: true,
      placeholder: 'Mínimo 8 caracteres'
    },
    { 
      name: 'ROLE',
      label: 'Nivel de Acceso (RadioButtons)', 
      type: 'radio', 
      options: [
        { label: 'Administrador del Sistema', value: 'ADMIN' },
        { label: 'Operador de Ventas/Inventario', value: 'USER' }
      ],
      required: true 
    },
    { 
      name: 'ESTADO',
      label: 'Estado de Cuenta (Select)', 
      type: 'select', 
      options: [
        { label: 'Usuario Activo', value: 'ACTIVO' },
        { label: 'Usuario Suspendido', value: 'INACTIVO' }
      ],
      required: true 
    },
    { 
      name: 'NOTAS',
      label: 'Descripción o Perfil del Usuario (TextArea)', 
      type: 'textarea',
      placeholder: 'Indique el departamento o motivo de creación...'
    }
  ];

  const handleSave = async (item: any) => {
    try {
      await api.post('auth/users', item);
      loadUsers();
      setIsFormOpen(false);
    } catch (e: any) { 
      alert(e.message || 'Error al crear el usuario en Oracle');
    }
  };

  const handleDelete = async (u: User) => {
    if (u.USERNAME === 'ADMIN') return alert('No se puede eliminar el administrador maestro.');
    if (confirm(`¿Está seguro de revocar permanentemente el acceso a "${u.USERNAME}"?`)) {
      try {
        await api.delete('auth/users', u.ID);
        loadUsers();
      } catch (e) { alert('Error al eliminar'); }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
      <p className="text-slate-500 font-medium">Cargando Módulo de Acceso...</p>
    </div>
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Control de Usuarios</h1>
            <p className="text-slate-500 text-sm">Administración de credenciales encriptadas con Bcrypt</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
            <Calendar className="text-slate-400" size={16} />
            <span className="text-xs font-bold text-slate-600 uppercase">Período: 2do Parcial</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CrudTable
            title="Usuarios del Sistema"
            subtitle="Listado de accesos autorizados en AIN_GRUPO13"
            data={data}
            columns={columns}
            idField="ID"
            onAdd={() => setIsFormOpen(true)}
            onEdit={() => alert('Por seguridad, elimine y cree un nuevo usuario para cambiar permisos.')}
            onDelete={handleDelete}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold flex items-center gap-2 mb-4">
                <ShieldAlert className="text-indigo-400" />
                Seguridad Oracle
              </h3>
              <p className="text-sm text-indigo-100 leading-relaxed mb-4">
                Todas las contraseñas se almacenan mediante el algoritmo de hash <strong>Bcrypt</strong>. 
                El sistema de auditoría registra la fecha exacta de alta.
              </p>
              <div className="p-3 bg-white/10 rounded-xl border border-white/20">
                <div className="flex justify-between text-xs mb-1">
                  <span>Esquema:</span>
                  <span className="font-mono">AIN_GRUPO13</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Encriptación:</span>
                  <span className="font-mono">AES/BCRYPT</span>
                </div>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <ShieldCheck size={140} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Info size={18} className="text-indigo-600" />
              Guía de Administración
            </h4>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1 shrink-0"></span>
                Los administradores pueden crear nuevos perfiles.
              </li>
              <li className="flex gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1 shrink-0"></span>
                El campo de "Notas" permite auditar el propósito del usuario.
              </li>
              <li className="flex gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1 shrink-0"></span>
                Un usuario suspendido (Inactivo) no podrá iniciar sesión.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <CrudForm
          title="Registro de Nuevo Operador"
          fields={fields}
          onSubmit={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}