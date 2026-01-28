
import React, { useState } from 'react';
import { api } from '../api';
import { User } from '../types';
import { Lock, User as UserIcon, Loader2, WifiOff } from 'lucide-react';

export default function Login({ onLogin }: { onLogin: (u: User) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await api.post<User>('auth/login', { username, password });
      if (user && user.USERNAME) { 
        localStorage.setItem('sincro_user', JSON.stringify(user));
        onLogin(user);
      } else {
        setError('Error inesperado en la respuesta del servidor');
      }
    } catch (err: any) {
      setError('Error de conexión o credenciales inválidas. Verifique que el servidor NestJS esté activo en el puerto 4000.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-indigo-600 p-8 text-white text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-2">SincroERP</h2>
            <p className="text-indigo-100 text-sm">Autenticación Centralizada Oracle G13</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg flex gap-2 items-center">
                <div className="shrink-0"><WifiOff size={16} /></div>
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="relative">
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block ml-1">Usuario</label>
                <div className="absolute left-3 top-[34px] text-slate-400">
                  <UserIcon size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  placeholder="admin"
                  required
                />
              </div>

              <div className="relative">
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block ml-1">Contraseña</label>
                <div className="absolute left-3 top-[34px] text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:transform active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Verificando...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
