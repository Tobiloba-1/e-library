import React, { useState } from "react";

function Quiz() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const questions = [
    { id: 1, text: "When faced with a problem, how do you usually respond?", options: ["Analyze it logically", "Look for creative alternatives", "Ask others for input", "Trust my intuition"] },
    { id: 2, text: "Which statement best describes you at work or school?", options: ["I like structure and clear plans", "I thrive in spontaneous environments", "I enjoy leading and organizing", "I prefer exploring and experimenting"] },
    { id: 3, text: "How do you make important decisions?", options: ["Data-driven", "Gut feeling", "Discussing with people", "Visualizing future outcomes"] },
    { id: 4, text: "What motivates you the most?", options: ["Achieving goals efficiently", "Discovering new ideas", "Inspiring others", "Turning dreams into reality"] },
    { id: 5, text: "Which describes your communication style?", options: ["Clear and factual", "Empathetic and expressive", "Strategic and persuasive", "Casual and flexible"] },
    { id: 6, text: "When working in a team, you are...", options: ["The planner", "The creative thinker", "The motivator", "The problem solver"] },
    { id: 7, text: "How do you handle unexpected changes?", options: ["Stay calm and adapt", "Think of a new creative route", "Reassess the plan carefully", "Take a break to rethink"] },
    { id: 8, text: "Which best describes your focus in life?", options: ["Growth and mastery", "Freedom and creativity", "Stability and clarity", "Impact and innovation"] },
  ];

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    setBooks([]);

    try {
      // backend expects keys like 'q1', 'q2', ... so map numeric keys to that format
      const payloadAnswers = {};
      Object.keys(answers).forEach((k) => {
        // ensure we don't double-prefix if key already starts with 'q'
        const key = String(k).startsWith("q") ? String(k) : `q${k}`;
        payloadAnswers[key] = answers[k];
      });

      const res = await fetch("http://127.0.0.1:8000/api/personality/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: payloadAnswers }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Server responded ${res.status}: ${text}`);
      }

      const data = await res.json();
      setResult(data);

      if (data.type) {
        const recRes = await fetch(
          `http://127.0.0.1:8000/api/books/recommend/${encodeURIComponent(data.type)}`
        );
        const recData = await recRes.json();
        setBooks(recData.books);
      }
    } catch (error) {
      console.error("Error sending quiz:", error);
      setResult({ error: "Failed to reach backend" });
    } finally {
      setLoading(false);
    }
  };

  const descriptions = {
    "The Thinker": "You are logical, analytical, and love solving complex problems.",
    "The Explorer": "You are adventurous, curious, and open to new experiences.",
    "The Dreamer": "You are imaginative, creative, and thrive on inspiration.",
    "The Strategist": "You plan carefully, think ahead, and enjoy mastering systems.",
    "General": "You have a balanced mix of curiosity and logic!",
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-blue-100 to-indigo-200 flex flex-col items-center justify-center py-10 px-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-8 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 text-center mb-8">
          🧠 Personality Quiz
        </h1>

        {questions.map((q) => (
          <div key={q.id} className="mb-8">
            <p className="text-lg font-semibold text-gray-800 mb-4">{q.text}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(q.id, opt)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200
                    ${
                      answers[q.id] === opt
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-50 hover:border-indigo-400"
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-center mt-10">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>

        {result && !result.error && (
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-indigo-700">{result.type}</h2>
            <p className="text-gray-600 mt-3 mb-8">
              {descriptions[result.type] || descriptions.General}
            </p>

            {books.length > 0 && (
              <>
                <h3 className="text-lg font-semibold text-indigo-600 mb-5">
                  📚 Recommended Reads
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {books.map((b, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl shadow hover:shadow-lg transition-transform transform hover:scale-105 overflow-hidden"
                    >
                      {b.thumbnail && (
                        <img
                          src={b.thumbnail}
                          alt={b.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4 text-left">
                        <a
                          href={b.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-indigo-600 font-semibold hover:underline text-lg"
                        >
                          {b.title}
                        </a>
                        <p className="text-gray-600 text-sm mt-1">
                          {b.author || "Unknown Author"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {result?.error && (
          <p className="text-red-600 font-medium text-center mt-6">{result.error}</p>
        )}
      </div>
    </div>
  );
}

export default Quiz;
