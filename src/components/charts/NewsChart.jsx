import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export const NewsChart = ({ articles }) => {
  // Compute distribution
  const dataMap = {};
  Object.values(articles).forEach(catArticles => {
    if (catArticles) {
      catArticles.forEach(article => {
        dataMap[article.category] = (dataMap[article.category] || 0) + 1;
      });
    }
  });

  const data = Object.keys(dataMap).map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: dataMap[key]
  }));

  if (data.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 h-full flex flex-col">
      <h2 className="text-lg font-semibold flex items-center gap-2 dark:text-white mb-6">
        <PieChartIcon className="w-5 h-5 text-indigo-500" />
        News Distribution
      </h2>
      
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: 'none',
                borderRadius: '8px',
                color: '#f8fafc',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
