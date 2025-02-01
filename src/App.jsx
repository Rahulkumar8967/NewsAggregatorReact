import React, { useState, useEffect } from "react";

const App = () => {
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("India"); // Default search term set to 'India'
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("search"); // Default mode is 'search'

  const API_KEY = "04e14cac817d4883809a3d94de1723d9"; // Replace with your actual API key

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    let url;
    if (mode === "search" && searchTerm.trim() !== "") {
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        searchTerm
      )}&apiKey=${API_KEY}`;
    } else {
      url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${API_KEY}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setNews(result.articles || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [mode, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setMode("search");
      setSearchTerm(searchInput.trim());
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">News Aggregator</h1>

        {/* Search Bar */}
        {mode === "search" && (
          <form
            onSubmit={handleSearch}
            className="mt-6 flex justify-center gap-4"
          >
            <input
              type="text"
              placeholder="Search for news..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full sm:w-96 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
              Search
            </button>
          </form>
        )}
      </div>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {/* News Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {news.length > 0 ? (
          news.map((item, index) => (
            <div
              key={index}
              className="rounded-lg shadow-md bg-white overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
            >
              {item.urlToImage && (
                <img
                  className="w-full h-48 object-cover"
                  src={item.urlToImage}
                  alt="News"
                />
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h4 className="text-lg font-semibold text-blue-600">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600 mt-2 flex-grow">
                  {item.description}
                </p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-auto px-4 py-2 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 text-center"
                >
                  Read more
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No news articles found.</p>
        )}
      </div>
    </div>
  );
};

export default App;
