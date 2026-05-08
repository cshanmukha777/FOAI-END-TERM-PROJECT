import { useState, useMemo } from 'react';
import { Newspaper, Search, RefreshCw } from 'lucide-react';
import { useNews } from '../../hooks/useNews';
import { NewsCard } from './NewsCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export const NewsSection = () => {
  const { articles, loading, error, refreshCategory } = useNews(['technology', 'science']);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'source'

  const allArticles = useMemo(() => {
    let combined = [];
    Object.values(articles).forEach(catArticles => {
      if (catArticles) combined = [...combined, ...catArticles];
    });

    // Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      combined = combined.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.description.toLowerCase().includes(q)
      );
    }

    // Sort
    combined.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      } else {
        return a.source.localeCompare(b.source);
      }
    });

    return combined;
  }, [articles, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white">
          <Newspaper className="w-6 h-6 text-blue-500" />
          Latest Intel
        </h2>
        
        <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-shadow"
            />
          </div>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="py-2 pl-3 pr-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white cursor-pointer"
          >
            <option value="date">Sort by Date</option>
            <option value="source">Sort by Source</option>
          </select>
          
          <div className="flex gap-2 shrink-0">
            <button 
              onClick={() => refreshCategory('technology')}
              className="px-3 py-2 text-sm font-medium flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer text-slate-700 dark:text-slate-300"
              title="Refresh Tech News"
            >
              <RefreshCw className="w-4 h-4" /> Tech
            </button>
            <button 
              onClick={() => refreshCategory('science')}
              className="px-3 py-2 text-sm font-medium flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer text-slate-700 dark:text-slate-300"
              title="Refresh Science News"
            >
              <RefreshCw className="w-4 h-4" /> Science
            </button>
          </div>
        </div>
      </div>

      {loading && Object.keys(articles).length === 0 ? (
        <LoadingSpinner text="Fetching latest headlines..." />
      ) : error ? (
        <div className="p-6 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl text-center border border-rose-100 dark:border-rose-800">
          <p className="font-medium">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {allArticles.map(article => (
            <NewsCard key={article.id} article={article} />
          ))}
          {allArticles.length === 0 && (
            <div className="col-span-full p-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No articles found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
