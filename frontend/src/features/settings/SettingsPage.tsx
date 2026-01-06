import { Save } from 'lucide-react';

export const SettingsPage = () => {
    return (
        <div className="pt-24 px-6 h-screen overflow-y-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
            
            <div className="max-w-2xl space-y-8">
                <div className="bg-surface/50 backdrop-blur border border-white/5 p-6 rounded-xl">
                    <h2 className="text-lg font-medium text-white mb-4">General Configuration</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Node Endpoint</label>
                            <input type="text" value="wss://rpc.sentinel.network/ws" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none" readOnly />
                        </div>
                        <div className="flex items-center justify-between py-2">
                             <span className="text-gray-300">Auto-connect on startup</span>
                             <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                             </div>
                        </div>
                        <div className="flex items-center justify-between py-2">
                             <span className="text-gray-300">Notifications</span>
                             <div className="w-10 h-5 bg-white/10 rounded-full relative cursor-pointer">
                                <div className="absolute left-1 top-1 w-3 h-3 bg-gray-400 rounded-full"></div>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="bg-surface/50 backdrop-blur border border-white/5 p-6 rounded-xl">
                    <h2 className="text-lg font-medium text-white mb-4">Display</h2>
                     <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Theme</label>
                            <div className="grid grid-cols-3 gap-3">
                                <button className="p-3 rounded-lg border border-primary bg-primary/10 text-primary">Cyber Dark</button>
                                <button className="p-3 rounded-lg border border-white/10 bg-black/20 text-gray-400">Midnight</button>
                                <button className="p-3 rounded-lg border border-white/10 bg-black/20 text-gray-400">Nebula</button>
                            </div>
                        </div>
                    </div>
                </div>

                <button className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium">
                    <Save size={18} />
                    Save Changes
                </button>
            </div>
        </div>
    );
};
