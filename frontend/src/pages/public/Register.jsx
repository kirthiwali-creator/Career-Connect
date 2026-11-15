// ------------------------------------------------------------
// pages/public/Register.jsx
// Sends name, email, password, role to POST /api/auth/register.
// ------------------------------------------------------------
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth, dashboardPath } from "../../context/AuthContext.jsx";
import Alert from "../../components/Alert.jsx";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={dashboardPath(user.role)} replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Frontend validation (the backend validates again)
  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.password) return "All fields are required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email address";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirm) return "Passwords do not match";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { name, email, password, role } = form;
      const newUser = await register({ name, email, password, role });
      // New mentors should fill their profile first
      navigate(newUser.role === "mentor" ? "/edit-profile" : dashboardPath(newUser.role), {
        replace: true,
        state: { welcome: true },
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit} noValidate>
        <h2>Create your account</h2>
        <p className="muted">Join Career Connect as a student or a mentor</p>

        <Alert type="error" message={error} />

        <div className="role-picker">
          {["student", "mentor"].map((r) => (
            <label key={r} className={`role-option ${form.role === r ? "active" : ""}`}>
              <input type="radio" name="role" value={r} checked={form.role === r} onChange={handleChange} />
              {r === "student" ? "🎓 I am a Student" : "💼 I am a Mentor"}
            </label>
          ))}
        </div>

        <label>
          Full name
          <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
        </label>
        <div className="form-row">
          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" />
          </label>
          <label>
            Confirm password
            <input type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="Repeat password" />
          </label>
        </div>

        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="small center">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
