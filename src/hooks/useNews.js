import { useState, useEffect, useCallback } from 'react';
import { fetchNews } from '../services/newsService';
import { safeGetStorage, safeSetStorage } from '../utils/storage';

const CACHE_KEY_PREFIX = 'news_cache_';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export const useNews = (categories = ['technology', 'science']) => {
  const [articles, setArticles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategoryNews = useCallback(async (category, forceRefresh = false) => {
    const cacheKey = `${CACHE_KEY_PREFIX}${category}`;
    
    if (!forceRefresh) {
      const cached = safeGetStorage(cacheKey, null);
      if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
        setArticles(prev => ({ ...prev, [category]: cached.data }));
        return;
      }
    }

    try {
      const data = await fetchNews(category);
      safeSetStorage(cacheKey, { timestamp: Date.now(), data });
      setArticles(prev => ({ ...prev, [category]: data }));
    } catch (err) {
      console.error(`Error fetching news for ${category}:`, err);
      // If error, try to fallback to cache even if expired
      const cached = safeGetStorage(cacheKey, null);
      if (cached) {
        setArticles(prev => ({ ...prev, [category]: cached.data }));
      } else {
        throw err;
      }
    }
  }, []);

  const fetchAllNews = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all(categories.map(cat => fetchCategoryNews(cat, forceRefresh)));
    } catch (err) {
      setError("Failed to load some news categories.");
    } finally {
      setLoading(false);
    }
  }, [categories, fetchCategoryNews]);

  useEffect(() => {
    fetchAllNews();
  }, [fetchAllNews]);

  return {
    articles,
    loading,
    error,
    refreshCategory: (cat) => fetchCategoryNews(cat, true),
    refreshAll: () => fetchAllNews(true)
  };
};
