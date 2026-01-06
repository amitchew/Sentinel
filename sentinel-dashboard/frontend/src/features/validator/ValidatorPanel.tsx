import { useEffect, useRef } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useValidatorStore } from '../../store/validatorStore';
import { X, Globe, Activity, Clock } from 'lucide-react';
import gsap from 'gsap';

export const ValidatorPanel = () => {
    const { selectedValidatorId, setSelectedValidatorId } = useUIStore();
    const { validators } = useValidatorStore();
    const panelRef = useRef<HTMLDivElement>(null);
    
    const validator = validators.find(v => v.id === selectedValidatorId);

    useEffect(() => {
        if (selectedValidatorId) {
            gsap.to(panelRef.current, {
                x: 0,
                duration: 0.5,
                ease: "power3.out"
            });
        } else {
            gsap.to(panelRef.current, {
                x: "100%",
                duration: 0.5,
                ease: "power3.in"
            });
        }
    }, [selectedValidatorId]);

    if (!selectedValidatorId && !validator) return <div ref={panelRef} className="fixed right-0 top-0 h-screen w-96 bg-surface border-l border-white/10 translate-x-full z-50" />;

    return (
        <div 
            ref={panelRef}
            className="fixed right-0 top-0 h-screen w-96 bg-[#0a0a0b]/95 backdrop-blur-xl border-l border-white/10 translate-x-full z-50 shadow-2xl flex flex-col"
        >
            {validator ? (
                <>
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white">{validator.name}</h2>
                            <span className="text-xs font-mono text-gray-500">{validator.id}</span>
                        </div>
                        <button 
                            onClick={() => setSelectedValidatorId(null)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-400" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8">

                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                validator.status === 'active' 
                                    ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                                {validator.status.toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-400 flex items-center gap-1">
                                <Globe size={14} />
                                {validator.region}
                            </span>
                        </div>


                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-xs text-gray-500 block mb-1">Total Stake</span>
                                <span className="text-lg font-mono font-medium text-white">
                                    {(validator.stake / 1000).toFixed(1)}k
                                </span>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-xs text-gray-500 block mb-1">Commission</span>
                                <span className="text-lg font-mono font-medium text-white">
                                    {validator.commission}%
                                </span>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-xs text-gray-500 block mb-1">Uptime</span>
                                <span className={`text-lg font-mono font-medium ${
                                    validator.uptime > 99 ? 'text-green-400' : 'text-yellow-400'
                                }`}>
                                    {validator.uptime.toFixed(2)}%
                                </span>
                            </div>
                             <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-xs text-gray-500 block mb-1">Peers</span>
                                <span className="text-lg font-mono font-medium text-white">
                                    {validator.peers.length}
                                </span>
                            </div>
                        </div>


                        <div>
                            <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                                <Activity size={16} /> Recent Activity
                            </h3>
                            <div className="space-y-3">
                                <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/10 text-sm text-green-200">
                                    <Clock size={12} className="inline mr-2 opacity-50"/> 
                                    Block Proposed successfully
                                </div>
                                 <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-sm text-gray-400">
                                    <Clock size={12} className="inline mr-2 opacity-50"/> 
                                    Attestation signed
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="p-6 text-gray-500">Select a validator node to view details</div>
            )}
        </div>
    );
};
