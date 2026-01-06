import { useNetworkStore } from '../../store/networkStore';
import { Menu, Wifi } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export const TopBar = () => {
  const { toggleSidebar } = useUIStore();
  const { latestMetric } = useNetworkStore();

  return (
    <header className="h-16 bg-surface/50 backdrop-blur border-b border-white/5 fixed top-0 right-0 left-0 z-40 flex items-center justify-between px-4 pl-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white"
        >
          <Menu size={20} />
        </button>
        
        <div className="flex items-center gap-6 text-sm">
          <div className="flex flex-col">
             <span className="text-xs text-gray-500">Network Status</span>
             <div className="flex items-center gap-2 text-green-400">
               <Wifi size={14} />
               <span className="font-medium">Online</span>
             </div>
          </div>
          
          <div className="h-8 w-px bg-white/10" />

          <div className="flex flex-col">
             <span className="text-xs text-gray-500">TPS</span>
             <span className="font-medium font-mono">
               {latestMetric?.tps.toFixed(0) ?? '-'}
             </span>
          </div>

          <div className="flex flex-col">
             <span className="text-xs text-gray-500">Block Height</span>
             <span className="font-medium font-mono text-primary">#14,242,502</span>
          </div>
          
          <div className="flex flex-col">
             <span className="text-xs text-gray-500">Gas Price</span>
             <span className="font-medium font-mono text-warning">
               {latestMetric?.gasPrice.toFixed(2) ?? '-'} Gwei
             </span>
          </div>
        </div>
      </div>
    </header>
  );
};
