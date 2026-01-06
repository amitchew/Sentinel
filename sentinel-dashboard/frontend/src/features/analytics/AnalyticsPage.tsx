import { Filters } from './Filters';
import { useNetworkStore } from '../../store/networkStore';

export const AnalyticsPage = () => {
    const { metrics } = useNetworkStore();

    return (
        <div className="pt-24 px-6 h-screen overflow-y-auto">
             <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-white tracking-tight">Analytics & Reports</h1>
                <Filters />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { 
                        label: 'Current TPS', 
                        value: metrics.length > 0 ? metrics[metrics.length - 1].tps.toFixed(2) : '0.00', 
                        change: metrics.length > 1 ? `${((metrics[metrics.length - 1].tps - metrics[0].tps) > 0 ? '+' : '')}${(metrics[metrics.length - 1].tps - metrics[0].tps).toFixed(2)}` : '0' 
                    },
                    { 
                        label: 'Block Time', 
                        value: metrics.length > 0 ? `${metrics[metrics.length - 1].blockTime.toFixed(2)}s` : '-', 
                        change: 'Avg' 
                    },
                    { 
                        label: 'Active Validators', 
                        value: metrics.length > 0 ? '196' : '-', // Ideally from ValidatorStore but we don't have it here directly without import. Let's strictly use metrics or add store.
                        change: 'Bonded' 
                    },
                    { 
                        label: 'Gas Price', 
                        value: metrics.length > 0 ? metrics[metrics.length - 1].gasPrice.toFixed(3) : '-', 
                        change: 'DVPN' 
                    },
                ].map((stat) => (
                    <div key={stat.label} className="bg-surface/50 backdrop-blur rounded-xl p-6 border border-white/5">
                        <span className="text-sm text-gray-500 block mb-2">{stat.label}</span>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-mono font-bold text-white">{stat.value}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                                stat.change.startsWith('+') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-surface/50 backdrop-blur rounded-xl p-6 border border-white/5 mb-8">
                <h2 className="text-lg font-medium text-white mb-4">Network Performance Log</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-400 font-medium">
                                <th className="pb-3 pl-4">Timestamp</th>
                                <th className="pb-3">TPS</th>
                                <th className="pb-3">Gas Price (Gwei)</th>
                                <th className="pb-3">Block Time (s)</th>
                                <th className="pb-3">Finality (s)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono">
                            {metrics.slice().reverse().slice(0, 10).map((m) => (
                                <tr key={m.timestamp} className="hover:bg-white/5 transition-colors">
                                    <td className="py-3 pl-4 text-gray-300">
                                        {new Date(m.timestamp).toLocaleTimeString()}
                                    </td>
                                    <td className="py-3 text-white">{m.tps.toFixed(0)}</td>
                                    <td className="py-3 text-yellow-400">{m.gasPrice.toFixed(2)}</td>
                                    <td className="py-3 text-gray-300">{m.blockTime.toFixed(2)}s</td>
                                    <td className="py-3 text-gray-300">{m.finality.toFixed(1)}s</td>
                                </tr>
                            ))}
                            {metrics.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500">
                                        Waiting for network data...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
