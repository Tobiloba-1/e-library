import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Card = ({ children }) => (
  <div className="bg-white/90 rounded-2xl shadow-lg p-4">{children}</div>
);

const CardContent = ({ children }) => <div>{children}</div>;

const Button = ({ children, ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition ${props.className || ""}`}
  >
    {children}
  </button>
);

const Input = (props) => (
  <input
    {...props}
    className={`px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-400 w-full text-gray-700 ${props.className || ""}`}
  />
);

export default function Explore() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Dynamically load Elfsight script when the component mounts
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setBooks([]);

    try {
      const requests = [];

      // ✅ Only add API calls that are active
      if (query.trim()) {
        // Google Books
        const googleAPI = fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20`
        )
          .then((res) => (res.ok ? res.json() : Promise.reject()))
          .then((data) =>
            (data.items || []).map((item) => ({
              id: item.id,
              title: item.volumeInfo.title,
              authors: item.volumeInfo.authors,
              image: item.volumeInfo.imageLinks?.thumbnail,
              link: item.volumeInfo.infoLink,
              source: "Google Books",
            }))
          )
          .catch(() => []);
        requests.push(googleAPI);

        // Open Library
        const openLibAPI = fetch(
          `https://openlibrary.org/search.json?q=${query}&limit=20`
        )
          .then((res) => (res.ok ? res.json() : Promise.reject()))
          .then((data) =>
            (data.docs || []).map((b) => ({
              id: b.key,
              title: b.title,
              authors: b.author_name,
              image: b.cover_i
                ? `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg`
                : null,
              link: `https://openlibrary.org${b.key}`,
              source: "Open Library",
            }))
          )
          .catch(() => []);
        requests.push(openLibAPI);
      }

      if (requests.length === 0) {
        setError("No active API requests. Please try again.");
        setLoading(false);
        return;
      }

      const results = await Promise.allSettled(requests);

      const allBooks = results
        .filter((r) => r.status === "fulfilled")
        .flatMap((r) => r.value || []);

      const uniqueBooks = Array.from(
        new Map(allBooks.map((b) => [b.title.toLowerCase(), b])).values()
      );

      if (uniqueBooks.length === 0) {
        setError("No books found. Try another search term.");
      }

      setBooks(uniqueBooks);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Something went wrong while fetching books.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex flex-col items-center py-12 px-4">
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-white mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Explore Books by Category
      </motion.h1>

      <form onSubmit={handleSearch} className="flex w-full max-w-xl mb-10 gap-3">
        <Input
          type="text"
          placeholder="Search for books, e.g. Finance, Psychology..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-white/80 backdrop-blur-md border-none focus:ring-2 focus:ring-pink-400 text-gray-700 placeholder:text-gray-500"
        />
        <Button
          type="submit"
          className="bg-pink-600 hover:bg-pink-700 cursor-pointer text-white px-6 py-2 rounded-xl"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </form>

      {error && (
        <p className="text-red-100 text-center mb-4 bg-red-500/20 px-4 py-2 rounded-lg max-w-md">
          {error}
        </p>
      )}

      {!loading && books.length === 0 && !error && (
        <p className="text-white/90 text-center max-w-md">
          🔍 Start by typing a topic or category to explore amazing books.
        </p>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {books.map((book, index) => (
          <motion.div
            key={book.id || index}
            className="hover:scale-105 transition-transform"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Card className="rounded-2xl shadow-lg bg-white/90 backdrop-blur-sm border-none overflow-hidden flex flex-col justify-between h-full">
              <CardContent className="p-4 flex flex-col h-full">
                <img
                  src={
                    book.image ||
                    "https://via.placeholder.com/150x200?text=No+Cover"
                  }
                  alt={book.title}
                  className="w-full h-52 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold text-gray-800 text-lg line-clamp-2 mb-1">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {book.authors?.join(", ") || "Unknown Author"}
                </p>
                <p className="text-xs text-gray-500 italic mb-3">
                  Source: {book.source}
                </p>
                <Button className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                  <a href={book.link} target="_blank" rel="noopener noreferrer">
                    View Book
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Elfsight Chatbot container */}
      <div
        className="elfsight-app-0f6f3ceb-d4b4-4cd1-a66b-311bf7c3f808"
        data-elfsight-app-lazy
      ></div>
    </div>
  );
}
