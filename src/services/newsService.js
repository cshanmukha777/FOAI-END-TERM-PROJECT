export const fetchNews = async (category = "technology") => {
  try {
    const response = await fetch(`/api/news?category=${category}`);

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("News fetch error:", error);
    throw error;
  }
};