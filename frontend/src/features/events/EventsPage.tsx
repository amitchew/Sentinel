import { useValidatorStore } from '../../store/validatorStore';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

export const EventsPage = () => {
    const { events } = useValidatorStore();

    const getIcon = (type: string) => {
        switch (type) {
            case 'slash': return <XCircle className="text-red-500" />;
            case 'downtime': return <AlertTriangle className="text-orange-500" />;
            case 'reward': return <CheckCircle className="text-green-500" />;
            default: return <Info className="text-blue-500" />;
        }
    };

    return (
        <div className="pt-24 px-6 h-screen overflow-y-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Network Events</h1>
            <div className="space-y-4 max-w-4xl">
                {events.slice().reverse().map((event) => (
                    <div key={event.id} className="bg-surface/50 backdrop-blur border border-white/5 p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 transition-colors">
                        <div className="p-2 bg-white/5 rounded-lg">
                            {getIcon(event.type)}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-sm text-gray-400">ID: {event.id}</span>
                                <span className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</span>
                            </div>
                            <p className="text-white">{event.message}</p>
                            <span className="text-xs text-primary mt-1 block">Validator: {event.validatorId}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
