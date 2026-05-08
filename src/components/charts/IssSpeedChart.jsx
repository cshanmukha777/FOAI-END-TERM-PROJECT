import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

export const IssSpeedChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 h-full flex flex-col">
      <h2 className="text-lg font-semibold flex items-center gap-2 dark:text-white mb-6">
        <Activity className="w-5 h-5 text-rose-500" />
        Speed Velocity History
      </h2>
      
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-slate-700" opacity={0.5} />
            <XAxis 
              dataKey="time" 
              stroke="#64748b" 
              fontSize={12} 
              tickMargin={10}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12}
              domain={['dataMin - 1000', 'dataMax + 1000']} 
              tickFormatter={(val) => `${val/1000}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: 'none',
                borderRadius: '8px',
                color: '#f8fafc',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
              }}
              itemStyle={{ color: '#38bdf8' }}
            />
            <Line 
              type="monotone" 
              dataKey="speed" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
