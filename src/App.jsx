import React, { useState, useEffect } from "react";

const App = () => {
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("cricket");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async (query) => {
    setLoading(true);
    setError(null);
    try {
      let response = await fetch(
        `https://newsapi.org/v2/everything?q=${query}&apiKey=2fa1039c7cbe45baa0f93b35233a6252`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      let result = await response.json();
      setNews(result.articles || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(searchTerm);
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-semibold mb-4">News-Aggregator</h1>
          <form onSubmit={handleSearch}>
            <div className="text-2xl flex justify-center items-center">
              <input
                type="text"
                placeholder="Search for news..."
                value={searchInput}
                onChange={handleInputChange}
                className="py-4 px-56 mr-2 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 mt-4"
              />
              <button
                type="submit"
                className="py-4 px-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none mt-4"
              >
                Search
              </button>
            </div>
          </form>
        </div>
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        <div className="grid gap-4 lg:grid-cols-4">
          {news.length > 0 ? (
            news.map((item, index) => (
              <div className="w-full rounded-lg shadow-md" key={index}>
                <img
                  className="object-cover w-full h-48"
                  src={item.urlToImage}
                  alt="News"
                />
                <div className="p-4">
                  <h4 className="text-xl font-semibold text-blue-600">
                    {item.title}
                  </h4>
                  <p className="mb-2 leading-normal">{item.description}</p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm text-blue-100 bg-blue-500 rounded shadow hover:bg-blue-600"
                  >
                    Read more
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No news articles found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
