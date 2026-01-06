import { useValidatorStore } from '../../store/validatorStore';
import { useUIStore } from '../../store/uiStore';
import { Search } from 'lucide-react';

export const ValidatorsPage = () => {
    const { validators } = useValidatorStore();
    const { setSelectedValidatorId } = useUIStore();

    return (
        <div className="pt-24 px-6 h-screen overflow-y-auto">
             <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Validators</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search validator..." 
                        className="pl-10 pr-4 py-2 bg-surface/50 border border-white/10 rounded-lg text-sm text-white focus:border-primary focus:outline-none w-64"
                    />
                </div>
            </div>

            <div className="bg-surface/50 backdrop-blur border border-white/5 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-white/5 text-gray-400 font-medium">
                            <th className="p-4">Rank</th>
                            <th className="p-4">Validator</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Stake</th>
                            <th className="p-4">Uptime</th>
                            <th className="p-4">Commission</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {[...validators].sort((a,b) => b.stake - a.stake).map((v, i) => (
                            <tr 
                                key={v.id} 
                                className="hover:bg-white/5 cursor-pointer transition-colors"
                                onClick={() => setSelectedValidatorId(v.id)}
                            >
                                <td className="p-4 font-mono text-gray-500">#{i+1}</td>
                                <td className="p-4 font-medium text-white">{v.name}</td>
                                <td className="p-4">
                                     <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                        v.status === 'active' 
                                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                            : v.status === 'jailed'
                                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                    }`}>
                                        {v.status}
                                    </span>
                                </td>
                                <td className="p-4 font-mono text-gray-300">{(v.stake / 1000).toFixed(0)}k</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div style={{ width: `${v.uptime}%` }} className={`h-full ${v.uptime > 99 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                        </div>
                                        <span className="text-xs text-gray-400">{v.uptime.toFixed(1)}%</span>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-300">{v.commission}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
