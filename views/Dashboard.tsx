
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Database, Users, Truck, Package, ShoppingCart, FileText, Wifi, WifiOff, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ clientes: 0, proveedores: 0, productos: 0, facturas: 0, pedidos: 0 });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'online' | 'offline'>('offline');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [c, pr, pd, f, pe] = await Promise.all([
          api.get<any[]>('clientes'),
          api.get<any[]>('proveedores'),
          api.get<any[]>('productos'),
          api.get<any[]>('facturas'),
          api.get<any[]>('pedidos')
        ]);
        setStats({
          clientes: Array.isArray(c) ? c.length : 0,
          proveedores: Array.isArray(pr) ? pr.length : 0,
          productos: Array.isArray(pd) ? pd.length : 0,
          facturas: Array.isArray(f) ? f.length : 0,
          pedidos: Array.isArray(pe) ? pe.length : 0
        });
        setStatus('online');
      } catch (e) {
        setStatus('offline');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Clientes', val: stats.clientes, icon: <Users size={24} />, color: 'bg-blue-500' },
    { label: 'Proveedores', val: stats.proveedores, icon: <Truck size={24} />, color: 'bg-emerald-500' },
    { label: 'Productos', val: stats.productos, icon: <Package size={24} />, color: 'bg-amber-500' },
    { label: 'Facturación', val: stats.facturas, icon: <FileText size={24} />, color: 'bg-indigo-500' },
    { label: 'Pedidos', val: stats.pedidos, icon: <ShoppingCart size={24} />, color: 'bg-rose-500' },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Dashboard Sistema Gestion de Inventario</h1>
          <p className="text-slate-500">Monitor de operaciones - AIN_GRUPO13</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${status === 'online' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
          {status === 'online' ? <Wifi size={16} /> : <WifiOff size={16} />}
          Oracle {status === 'online' ? 'Conectado' : 'Desconectado'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg`}>
              {card.icon}
            </div>
            <p className="text-slate-500 text-sm font-medium">{card.label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{loading ? '...' : card.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Database className="text-indigo-400" />
            Infraestructura Transaccional
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 opacity-80 text-sm">
              <p>Base de Datos: <span className="text-indigo-300 font-mono">Oracle 21c (XE)</span></p>
              <p>Host: <span className="text-indigo-300 font-mono">108.181.157.248</span></p>
              <p>Puerto: <span className="text-indigo-300 font-mono">10011</span></p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
              <h4 className="font-bold text-indigo-300 mb-2">Estado del Backend NestJS</h4>
              <p className="text-xs text-slate-400">Escuchando en puerto 4000. Gestionando ORM TypeORM con driver oracledb.</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
      </div>
    </div>
  );
}
