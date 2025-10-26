import { useNavigate } from "react-router-dom";

export default function LogoutButton({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Do NOT remove the stored user on logout — keep the account so user can log back in later.
    if (setIsAuthenticated) setIsAuthenticated(false);
    navigate("/auth");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 px-3 py-1 rounded-md cursor-pointer hover:bg-red-600 transition"
    >
      Logout
    </button>
  );
}
