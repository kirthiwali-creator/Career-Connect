// ------------------------------------------------------------
// components/DashboardLayout.jsx
// Sidebar on the left + the current page on the right.
// The sidebar links change depending on the user's role.
// <Outlet /> is where React Router shows the child page.
// ------------------------------------------------------------
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const LINKS = {
  student: [
    { to: "/student-dashboard", label: "Dashboard", icon: "🏠" },
    { to: "/mentors", label: "Find Mentors", icon: "🔍" },
    { to: "/connections", label: "My Connections", icon: "🤝" },
    { to: "/connection-requests", label: "Connection Requests", icon: "📨" },
    { to: "/questions", label: "Questions Forum", icon: "💬" },
    { to: "/ask-question", label: "Ask Question", icon: "❓" },
    { to: "/profile", label: "My Profile", icon: "👤" },
  ],
  mentor: [
    { to: "/mentor-dashboard", label: "Dashboard", icon: "🏠" },
    { to: "/requests", label: "Student Requests", icon: "📨" },
    { to: "/connected-students", label: "Connected Students", icon: "🤝" },
    { to: "/mentor-questions", label: "Questions", icon: "💬" },
    { to: "/my-mentor-profile", label: "My Profile", icon: "👤" },
    { to: "/edit-profile", label: "Edit Profile", icon: "✏️" },
  ],
  admin: [
    { to: "/admin-dashboard", label: "Dashboard", icon: "📊" },
    { to: "/admin/users", label: "Manage Users", icon: "👥" },
    { to: "/admin/questions", label: "Manage Questions", icon: "💬" },
    { to: "/admin/connections", label: "Manage Connections", icon: "🔗" },
  ],
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = LINKS[user?.role] || [];

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-title">{user?.role} panel</div>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className="side-link">
            <span className="side-icon">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
        <button
          className="side-link side-logout"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <span className="side-icon">🚪</span>
          <span>Logout</span>
        </button>
      </aside>
      <main className="dash-content">
        <Outlet />
      </main>
    </div>
  );
}
