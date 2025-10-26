import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Card = ({ children }) => (
  <div className="bg-white/90 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 backdrop-blur-sm">
    {children}
  </div>
);

const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-70 ${className}`}
  >
    {children}
  </button>
);

const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`w-full px-4 py-2.5 rounded-lg border-none bg-white/80 backdrop-blur-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400 ${className}`}
  />
);

export default function Explore() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [elfsightStatus, setElfsightStatus] = useState("loading"); // 'loading' | 'loaded' | 'error'

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://elfsightcdn.com/platform.js";
  //   script.async = true;
  //   // add load/error handlers so we can surface problems in the UI
  //   script.onload = () => {
  //     console.log("Elfsight platform script loaded");
  //     setElfsightStatus("loaded");
  //     // platform.js initializes widgets automatically when loaded
  //   };
  //   script.onerror = (e) => {
  //     console.error("Failed to load Elfsight platform script", e);
  //     setElfsightStatus("error");
  //   };
  //   document.body.appendChild(script);
  //   const timeout = setTimeout(() => {
  //     if (elfsightStatus === "loading") {
  //       console.warn("Elfsight script still loading after timeout, marking as error");
  //       setElfsightStatus("error");
  //     }
  //   }, 7000);

  //   return () => {
  //     clearTimeout(timeout);
  //     // cleanup: remove injected script if component unmounts
  //     try {
  //       document.body.removeChild(script);
  //     } catch (err) {
  //       // ignore
  //     }
  //   };
  // }, []);

  useEffect(() => {
    // Dynamically load Elfsight script when the component mounts
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20`
      );
      const data = await res.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 flex flex-col items-center py-12 px-4">
      {/* Elfsight Chatbot Widget */}
      <div
        className="elfsight-app-0f6f3ceb-d4b4-4cd1-a66b-311bf7c3f808"
        data-elfsight-app-lazy
      ></div>
      {elfsightStatus === "error" && (
        <div className="mt-6 p-4 bg-white/10 text-white rounded-lg max-w-xl text-center">
          <strong>Assistant unavailable:</strong> The chat widget failed to load. Check your network, disable ad-blockers, or confirm the Elfsight app ID is correct.
        </div>
      )}

      {/* Page Title */}
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-white mb-10 text-center drop-shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Explore Books by Category
      </motion.h1>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row w-full max-w-2xl mb-10 gap-3"
      >
        <Input
          type="text"
          placeholder="Search for books, e.g. Finance, Psychology..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          type="submit"
          className="bg-pink-500 hover:bg-pink-600 text-white shadow-md"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </form>

      {/* Default Text */}
      {books.length === 0 && !loading && (
        <p className="text-white/90 text-center max-w-md text-lg">
          🔍 Start by typing a topic or category to explore amazing books.
        </p>
      )}

      {/* Books Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl mt-6">
        {books.map((book, index) => {
          const info = book.volumeInfo;
          return (
            <motion.div
              key={book.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card>
                <div className="flex flex-col h-full">
                  <img
                    src={
                      info.imageLinks?.thumbnail ||
                      "https://via.placeholder.com/150x200?text=No+Cover"
                    }
                    alt={info.title}
                    className="w-full h-56 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-gray-800 text-lg line-clamp-2 mb-1">
                    {info.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {info.authors?.join(", ") || "Unknown Author"}
                  </p>
                  <Button className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                    <a
                      href={info.infoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Book
                    </a>
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
