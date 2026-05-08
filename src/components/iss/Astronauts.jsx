import { Users, User } from 'lucide-react';

export const Astronauts = ({ astronauts }) => {
  if (!astronauts || astronauts.count === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
        <h2 className="text-lg font-semibold flex items-center gap-2 dark:text-white">
          <Users className="w-5 h-5 text-indigo-500" />
          Crew on Board
        </h2>
        <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-3 py-1 rounded-full">
          {astronauts.count} People
        </span>
      </div>
      
      <div className="p-2 overflow-y-auto flex-1 custom-scrollbar">
        <ul className="space-y-1">
          {astronauts.people.map((person, index) => (
            <li key={index} className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
              <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-full text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{person.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">{person.craft}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
