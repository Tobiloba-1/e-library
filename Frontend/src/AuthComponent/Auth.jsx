import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth({ setIsAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    confirmEmail: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!isLogin && !formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!isLogin && formData.confirmEmail !== formData.email) {
      newErrors.confirmEmail = "Emails do not match";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const endpoint = isLogin
        ? "http://127.0.0.1:8000/api/login"
        : "http://127.0.0.1:8000/api/register";

      const payload = isLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Something went wrong ❌");
        setLoading(false);
        return;
      }

      // ✅ Successful login or signup
      alert(data.message || "Success ✅");

      // Extract key details from response
      const userData = {
        username: data.username || formData.username || "User",
        email: data.email || formData.email,
        token: data.token || null, // if backend sends a token
      };

      // ✅ Save to localStorage for persistence
      localStorage.setItem("user", JSON.stringify(userData));

      // ✅ Update app state
      if (setIsAuthenticated) setIsAuthenticated(true);

      // ✅ Redirect user to home
      navigate("/");

    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please check your connection ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <input
                type="text"
                name="username"
                autoComplete="off"
                placeholder="Username"
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>
          )}

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {!isLogin && (
            <div>
              <input
                type="email"
                name="confirmEmail"
                placeholder="Confirm Email"
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
              {errors.confirmEmail && (
                <p className="text-red-500 text-sm">{errors.confirmEmail}</p>
              )}
            </div>
          )}

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 cursor-pointer text-white py-2 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
              setFormData({
                username: "",
                email: "",
                confirmEmail: "",
                password: "",
              });
            }}
            className="text-blue-600 cursor-pointer underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
