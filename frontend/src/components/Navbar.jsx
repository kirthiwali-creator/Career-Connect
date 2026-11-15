// ------------------------------------------------------------
// components/Navbar.jsx - top navigation bar (all pages)
// ------------------------------------------------------------
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth, dashboardPath } from "../context/AuthContext.jsx";
import Avatar from "./Avatar.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-logo">CC</span> Career Connect
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          ☰
        </button>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)}>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/about">About</NavLink>
          {user ? (
            <>
              <NavLink to={dashboardPath(user.role)}>Dashboard</NavLink>
              <span className="nav-user">
                <Avatar name={user.name} src={user.profile} size={30} />
                <span>
                  {user.name} <small className="role-tag">{user.role}</small>
                </span>
              </span>
              <button className="btn btn-light btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <Link to="/register" className="btn btn-light btn-sm">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
