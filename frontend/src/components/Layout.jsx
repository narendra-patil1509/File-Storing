import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, HardDrive, LogOut, Menu, X } from 'lucide-react';
import clsx from 'clsx';

export default function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menu = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'My Files', path: '/files', icon: HardDrive },
    { name: 'Notes', path: '/notes', icon: FileText },
  ];

  return (
    <div className="min-h-screen flex bg-solar-base text-solar-text overflow-x-hidden">
      <div className="md:hidden fixed top-0 w-full h-16 bg-solar-surface border-b border-solar-surfaceHighlight flex items-center justify-between px-4 z-40 shadow-md">
        <h1 className="text-xl font-bold bg-gradient-to-r from-solar-cyan to-solar-blue bg-clip-text text-transparent">FileSTO</h1>
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-solar-cyan p-2 bg-solar-base rounded-lg border border-solar-surfaceHighlight">
          <Menu size={20} />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={clsx(
        "fixed md:static inset-y-0 left-0 z-50 w-64 bg-solar-surface flex flex-col border-r border-solar-surfaceHighlight shadow-xl shadow-black/20 transform transition-transform duration-300 ease-in-out shrink-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-solar-surfaceHighlight">
          <h1 className="text-xl font-bold bg-gradient-to-r from-solar-cyan to-solar-blue bg-clip-text text-transparent truncate pr-2">Vault</h1>
          <button className="md:hidden text-solar-textMuted hover:text-solar-red rotate-icon transition-transform" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
          {menu.map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-solar-surfaceHighlight text-solar-cyan shadow-md"
                    : "text-solar-text hover:bg-solar-base/50 hover:text-solar-textBright"
                )}
              >
                <Icon size={18} className={clsx("transition-transform duration-200", active ? "scale-110" : "opacity-70")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-solar-surfaceHighlight">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-solar-red hover:bg-solar-red/10 transition-colors"
          >
            <LogOut size={18} className="opacity-80" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto w-full p-4 pt-20 md:p-8 md:pt-8 min-w-0 pb-10">
        {children}
      </main>
    </div>
  );
}
