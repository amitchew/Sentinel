import { Calendar, Download, Filter } from 'lucide-react';

export const Filters = () => {
    return (
        <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-white/10 hover:bg-white/5 text-sm text-gray-300 transition-colors">
                <Calendar size={16} />
                <span>Last 24h</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-white/10 hover:bg-white/5 text-sm text-gray-300 transition-colors">
                <Filter size={16} />
                <span>All Validators</span>
            </button>
             <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 text-sm text-primary transition-colors">
                <Download size={16} />
                <span>Export CSV</span>
            </button>
        </div>
    );
};
