import { useRef } from 'react';
import { NetworkScene } from '../../components/three/NetworkScene';
import { TPSChart } from '../../components/charts/TPSChart';
import { ValidatorUptimeChart } from '../../components/charts/ValidatorUptimeChart';
import { GasPriceChart } from '../../components/charts/GasPriceChart';
import { ValidatorPanel } from '../validator/ValidatorPanel';
import { LoadingOverlay, LoadingShimmer } from '../../components/ui/Loading';
import { useValidatorStore } from '../../store/validatorStore';
import { useNetworkStore } from '../../store/networkStore';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export const OverviewPage = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(".dashboard-card", {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
        });
    }, { scope: containerRef });

    const { validators } = useValidatorStore();
    const { metrics } = useNetworkStore();
    const isLoading = validators.length === 0 || metrics.length === 0;

    return (
        <div ref={containerRef} className="pt-24 px-6 h-screen overflow-y-auto">
            <h1 className="text-2xl font-bold mb-6 text-white tracking-tight">Network Overview</h1>
            <div className="grid grid-cols-12 gap-6 pb-10">

                <div className="dashboard-card col-span-12 lg:col-span-8 bg-surface/50 backdrop-blur rounded-xl border border-white/5 h-[500px] relative overflow-hidden group">
                    <div className="absolute top-4 left-4 z-10">
                        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Live Topology</h2>
                    </div>
                    {isLoading && <LoadingOverlay message="Synchronizing with Network..." />}
                    <NetworkScene />
                </div>
                

                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="dashboard-card bg-surface/50 backdrop-blur rounded-xl p-6 border border-white/5 h-[240px] relative">
                        <h2 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">TPS History</h2>
                        <div className="h-[160px] w-full">
                            {isLoading ? <LoadingShimmer /> : <TPSChart />}
                        </div>
                    </div>
                    
                    <div className="dashboard-card bg-surface/50 backdrop-blur rounded-xl p-6 border border-white/5 h-[240px] relative">
                         <h2 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Gas Price</h2>
                        <div className="h-[160px] w-full">
                            {isLoading ? <LoadingShimmer /> : <GasPriceChart />}
                        </div>
                    </div>
                </div>


                <div className="dashboard-card col-span-12 bg-surface/50 backdrop-blur rounded-xl p-6 border border-white/5 h-[300px] relative">
                     <h2 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Top Validators by Uptime</h2>
                     <div className="h-[220px] w-full">
                        {isLoading ? <LoadingShimmer /> : <ValidatorUptimeChart />}
                     </div>
                </div>
            </div>
            
            <ValidatorPanel />
        </div>
    )
}
