// ------------------------------------------------------------
// pages/admin/AdminDashboard.jsx
// Platform numbers (GET /api/users/admin/stats) + newest users
// ------------------------------------------------------------
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userAPI } from "../../services/api.js";
import { formatDate } from "../../services/format.js";
import StatCard from "../../components/StatCard.jsx";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([userAPI.stats(), userAPI.getAll()])
      .then(([s, u]) => {
        setStats(s);
        setUsers(u.slice(0, 6));
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <Alert type="error" message={error} />;
  if (!stats) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="muted">Overview of the Career Connect platform.</p>
        </div>
      </div>

      <div className="grid grid-4">
        <StatCard label="Total Students" value={stats.students} icon="🎓" color="blue" />
        <StatCard label="Total Mentors" value={stats.mentors} icon="💼" color="green" />
        <StatCard label="Connection Requests" value={stats.totalConnections} icon="🔗" color="orange" />
        <StatCard label="Questions" value={stats.questions} icon="💬" color="purple" />
      </div>

      <div className="grid grid-3 mt">
        <div className="card mini-stat">
          <span className="muted">Pending requests</span>
          <strong>{stats.pending}</strong>
        </div>
        <div className="card mini-stat">
          <span className="muted">Accepted connections</span>
          <strong>{stats.accepted}</strong>
        </div>
        <div className="card mini-stat">
          <span className="muted">Answered questions</span>
          <strong>
            {stats.answered} / {stats.questions}
          </strong>
        </div>
      </div>

      <div className="section-head">
        <h2>Newest Users</h2>
        <Link to="/admin/users">Manage users →</Link>
      </div>
      <div className="table-wrap card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className="role-tag">{u.role}</span>
                </td>
                <td>{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
