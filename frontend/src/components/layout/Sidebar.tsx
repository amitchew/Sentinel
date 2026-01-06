import { useUIStore } from '../../store/uiStore';
import { Activity, BarChart2, Server, Settings, Zap } from 'lucide-react';
import { clsx } from 'clsx';

export const Sidebar = () => {
  const { sidebarOpen, currentView, setCurrentView } = useUIStore();

  const navItems = [
    { icon: Activity, label: 'Overview', id: 'overview' },
    { icon: BarChart2, label: 'Analytics', id: 'analytics' },
    { icon: Server, label: 'Validators', id: 'validators' },
    { icon: Zap, label: 'Events', id: 'events' },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ] as const;

  return (
    <aside 
      className={clsx(
        "h-screen bg-surface border-r border-white/5 transition-all duration-300 flex flex-col fixed left-0 top-0 z-50",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      <div className="p-4 flex items-center gap-3 border-b border-white/5 h-16">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <Activity size={20} />
        </div>
        {sidebarOpen && (
          <span className="font-bold text-lg tracking-tight">SENTINEL</span>
        )}
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id as any)}
            className={clsx(
              "w-full flex items-center gap-3 p-3 rounded-lg transition-colors",
              currentView === item.id
                ? "bg-primary/10 text-primary" 
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon size={20} />
            {sidebarOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500" />
          {sidebarOpen && (
             <div className="flex flex-col">
               <span className="text-sm font-medium">Admin User</span>
               <span className="text-xs text-gray-500">Connected</span>
             </div>
          )}
        </div>
      </div>
    </aside>
  );
};
