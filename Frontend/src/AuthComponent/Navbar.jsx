import { Link, useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();

  return (
    <nav className=" sticky top-0 z-50 flex justify-between items-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white px-6 py-3">
      <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate("/")}>
        E-Library
      </h1>

      <div className="space-x-4">
        {isAuthenticated && <Link to="/" className="hover:underline">Home</Link>}

        {isAuthenticated ? (
          <>
            <Link to="/assessment" className="hover:underline">Quiz</Link>
            <Link to="/explore" className="hover:underline">Explore</Link>
            <LogoutButton setIsAuthenticated={setIsAuthenticated} />
          </>
        ) : (
          <Link
            to="/auth"
            className="bg-white text-blue-600 px-3 py-1 rounded-md font-semibold"
          >
            Login / Sign Up
          </Link>
        )}
      </div>
    </nav>
  );
}
