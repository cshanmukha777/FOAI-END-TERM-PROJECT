export default async function handler(req, res) {
  const { category = "technology" } = req.query;

  try {
    const response = await fetch(
      `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&max=5&apikey=${process.env.GNEWS_API_KEY}`
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    const articles = data.articles.map((article, index) => ({
      id: `${category}-${index}-${Date.now()}`,
      title: article.title || "Untitled",
      source: article.source?.name || "Unknown Source",
      author: article.author || "Unknown author",
      publishedAt: article.publishedAt || new Date().toISOString(),
      image:
        article.image ||
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
      description: article.description || "No description available.",
      url: article.url || "#",
      category,
    }));

    res.status(200).json(articles);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch news",
    });
  }
}