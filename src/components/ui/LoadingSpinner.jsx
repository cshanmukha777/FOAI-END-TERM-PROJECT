import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-slate-500 dark:text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      <p className="text-sm font-medium animate-pulse">{text}</p>
    </div>
  );
};
