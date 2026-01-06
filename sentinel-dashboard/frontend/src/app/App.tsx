import { useEffect } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { Router } from './Router';
import { wsClient } from '../services/websocket';
import { api } from '../services/api';
import { useUIStore } from '../store/uiStore';
import { useNetworkStore } from '../store/networkStore';
import { clsx } from 'clsx';


function App() {
  const { sidebarOpen } = useUIStore();
  const { setMetrics } = useNetworkStore();

  useEffect(() => {
    wsClient.connect();
    

    api.fetchMetrics().then(data => {
        setMetrics(data);
    }).catch(console.error);

    return () => wsClient.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30">
      <Sidebar />
      <div 
        className={clsx(
          "transition-all duration-300 min-h-screen",
          sidebarOpen ? "pl-64" : "pl-16"
        )}
      >
        <TopBar />
        <main className="pb-10">
          <Router />
        </main>
      </div>
    </div>
  );
}

export default App;
