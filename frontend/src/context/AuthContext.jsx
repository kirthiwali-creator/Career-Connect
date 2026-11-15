// ------------------------------------------------------------
// context/AuthContext.jsx
// Keeps track of WHO is logged in, for the whole app.
// The token and user are saved in localStorage so the user
// stays logged in after refreshing the page.
// ------------------------------------------------------------
import { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../services/api.js";

const AuthContext = createContext(null);

// Reads the saved user from localStorage (if any)
function loadUser() {
  try {
    const saved = localStorage.getItem("cc_user");
    return saved && localStorage.getItem("cc_token") ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

// Which dashboard each role should open after login
export function dashboardPath(role) {
  if (role === "mentor") return "/mentor-dashboard";
  if (role === "admin") return "/admin-dashboard";
  return "/student-dashboard";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  // If the server says the token is invalid, api.js fires "cc-logout"
  useEffect(() => {
    const onLogout = () => setUser(null);
    window.addEventListener("cc-logout", onLogout);
    return () => window.removeEventListener("cc-logout", onLogout);
  }, []);

  // Save token + user after login/register
  const saveSession = ({ token, user }) => {
    localStorage.setItem("cc_token", token);
    localStorage.setItem("cc_user", JSON.stringify(user));
    setUser(user);
    return user;
  };

  const login = async (email, password) => saveSession(await authAPI.login({ email, password }));

  const register = async (form) => saveSession(await authAPI.register(form));

  const logout = () => {
    localStorage.removeItem("cc_token");
    localStorage.removeItem("cc_user");
    setUser(null);
  };

  // Called after the profile is edited so the navbar shows new data
  const updateUser = (newUser) => {
    localStorage.setItem("cc_user", JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook: const { user, logout } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
