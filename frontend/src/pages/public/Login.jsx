// ------------------------------------------------------------
// pages/public/Login.jsx
// Sends email + password to POST /api/auth/login.
// On success the token is saved and the user goes to their dashboard.
// ------------------------------------------------------------
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth, dashboardPath } from "../../context/AuthContext.jsx";
import Alert from "../../components/Alert.jsx";

// Demo accounts created by "npm run seed" in the backend
const DEMO = [
  { label: "Student", email: "keerthi@student.com", password: "student123" },
  { label: "Mentor", email: "ramesh@mentor.com", password: "mentor123" },
  { label: "Admin", email: "admin@careerconnect.com", password: "admin123" },
];

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Already logged in? go to dashboard
  if (user) return <Navigate to={dashboardPath(user.role)} replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the page from reloading
    setError("");
    if (!form.email || !form.password) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const loggedIn = await login(form.email, form.password);
      // Go back to the page the user wanted, or to their dashboard
      navigate(location.state?.from || dashboardPath(loggedIn.role), { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit} noValidate>
        <h2>Welcome back</h2>
        <p className="muted">Login to continue to Career Connect</p>

        <Alert type="error" message={error} />

        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Your password" />
        </label>

        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="small center">
          New here? <Link to="/register">Create an account</Link>
        </p>

        <div className="demo-box">
          <p className="small muted">Demo accounts (click to fill):</p>
          <div className="demo-buttons">
            {DEMO.map((d) => (
              <button
                type="button"
                key={d.label}
                className="btn btn-outline btn-sm"
                onClick={() => setForm({ email: d.email, password: d.password })}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
