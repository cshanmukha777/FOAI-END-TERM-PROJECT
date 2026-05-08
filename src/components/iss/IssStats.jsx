import { RefreshCw, Navigation, MapPin, Gauge, Clock } from 'lucide-react';

export const IssStats = ({ position, speed, place, lastUpdate, refreshData, loading }) => {
  if (!position) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2 dark:text-white">
          <Navigation className="w-5 h-5 text-blue-500" />
          Live Telemetry
        </h2>
        <button 
          onClick={refreshData} 
          disabled={loading}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          title="Manual Refresh"
        >
          <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5">
        <StatCard 
          icon={<MapPin className="w-5 h-5 text-indigo-500" />}
          label="Coordinates"
          value={`${position.lat.toFixed(4)}°, ${position.lng.toFixed(4)}°`}
        />
        <StatCard 
          icon={<Gauge className="w-5 h-5 text-rose-500" />}
          label="Velocity"
          value={`${speed.toLocaleString()} km/h`}
        />
        <StatCard 
          icon={<Navigation className="w-5 h-5 text-emerald-500" />}
          label="Location"
          value={place}
        />
        <StatCard 
          icon={<Clock className="w-5 h-5 text-amber-500" />}
          label="Last Update"
          value={lastUpdate ? new Date(lastUpdate * 1000).toLocaleTimeString() : '--'}
        />
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex flex-col gap-2 border border-slate-100 dark:border-slate-800">
    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
      {icon} {label}
    </div>
    <div className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate">
      {value}
    </div>
  </div>
);
