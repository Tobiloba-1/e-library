import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-100 to-indigo-200 p-6">
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-indigo-800 mb-6 drop-shadow-sm">
          📚 Welcome to <span className="text-indigo-500">E-Library</span>
        </h1>

        <p className="text-gray-700 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Discover books that match your personality or explore collections by topic.  
          Let’s help you grow your mind — your way!
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
            className="bg-indigo-600 text-white px-8 py-3.5 cursor-pointer rounded-xl font-semibold shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-300"
            onClick={() => navigate("/assessment")}
          >
            Take Personality Assessment
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white text-indigo-700 border cursor-pointer border-indigo-600 px-8 py-3.5 rounded-xl font-semibold shadow-sm hover:bg-indigo-50 hover:shadow-md transition-all duration-300"
            onClick={() => navigate("/explore")}
          >
            Explore Books by Category
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
