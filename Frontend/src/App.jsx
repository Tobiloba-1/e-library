import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Explore from "./pages/Explore";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assessment" element={<Quiz />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </Router>
  );
}
