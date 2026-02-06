
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { User, Role } from './types';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import ClientesView from './views/ClientesView';
import ProveedoresView from './views/ProveedoresView';
import ProductosView from './views/ProductosView';
import FacturasView from './views/FacturasView';
import PedidosView from './views/PedidosView';
import UsersView from './views/UsersView';
import { 
  Users, 
  Truck, 
  Package, 
  FileText, 
  ShoppingCart, 
  LogOut, 
  LayoutDashboard,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

const PrivateRoute = ({ children, role }: { children: React.ReactNode, role?: Role }) => {
  const userStr = localStorage.getItem('sincro_user');
  if (!userStr) return <Navigate to="/login" />;
  
  const user = JSON.parse(userStr) as User;
  if (role && user.ROLE !== role) return <Navigate to="/" />;
  
  return <>{children}</>;
};

const Navigation = ({ user, onLogout }: { user: User, onLogout: () => void }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/clientes', label: 'Clientes', icon: <Users size={20} /> },
    { to: '/proveedores', label: 'Proveedores', icon: <Truck size={20} /> },
    { to: '/productos', label: 'Productos', icon: <Package size={20} /> },
    { to: '/facturas', label: 'Facturas', icon: <FileText size={20} /> },
    { to: '/pedidos', label: 'Pedidos', icon: <ShoppingCart size={20} /> },
  ];

  if (user.ROLE === Role.ADMIN) {
    links.push({ to: '/usuarios', label: 'Usuarios', icon: <ShieldCheck size={20} /> });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <div className="lg:hidden flex items-center justify-between p-4 bg-indigo-700 text-white shadow-md sticky top-0 z-50">
        <h1 className="text-xl font-bold tracking-tight">SGI</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 hidden lg:block">
            <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">SGI</h1>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Sistema de Gestión v2.0</p>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <nav className="space-y-1">
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to) 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                {user.USERNAME ? user.USERNAME[0].toUpperCase() : '?'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 truncate">{user.USERNAME}</p>
                <p className="text-xs text-slate-500 capitalize">{user.ROLE}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sincro_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sincro_user');
    setUser(null);
  };

  return (
    <HashRouter>
      <div className="flex flex-col lg:flex-row min-h-screen">
        {user && <Navigation user={user} onLogout={handleLogout} />}
        
        <main className="flex-1 overflow-x-hidden">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={setUser} />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/clientes" element={<PrivateRoute><ClientesView /></PrivateRoute>} />
            <Route path="/proveedores" element={<PrivateRoute><ProveedoresView /></PrivateRoute>} />
            <Route path="/productos" element={<PrivateRoute><ProductosView /></PrivateRoute>} />
            <Route path="/facturas" element={<PrivateRoute><FacturasView /></PrivateRoute>} />
            <Route path="/pedidos" element={<PrivateRoute><PedidosView /></PrivateRoute>} />
            <Route path="/usuarios" element={<PrivateRoute role={Role.ADMIN}><UsersView /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
