const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://gnews.io/api/v4';

export const fetchNews = async (category = 'technology') => {
  if (!API_KEY || API_KEY.includes('your_gnews_api_key')) {
    console.warn('GNews API key is missing or invalid.');
    throw new Error('API Key configuration error');
  }

  try {
    // using top-headlines endpoint as requested
    const url = `${BASE_URL}/top-headlines?category=${category}&lang=en&max=5&apikey=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }
    const data = await response.json();
    
    // Normalize article shapes
    return data.articles.map((article, index) => ({
      id: `${category}-${index}-${Date.now()}`,
      title: article.title || 'Untitled',
      source: article.source?.name || 'Unknown Source',
      author: article.author || 'Unknown author',
      publishedAt: article.publishedAt || new Date().toISOString(),
      image: article.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
      description: article.description || 'No description available.',
      url: article.url || '#',
      category: category
    }));
  } catch (error) {
    console.error('News fetch error:', error);
    throw error;
  }
};
