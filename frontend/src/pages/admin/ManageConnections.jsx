// ------------------------------------------------------------
// pages/admin/ManageConnections.jsx
// All connection requests (GET /api/connections)
// ------------------------------------------------------------
import { useEffect, useState } from "react";
import { connectionAPI } from "../../services/api.js";
import { formatDate } from "../../services/format.js";
import StatusBadge from "../../components/StatusBadge.jsx";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";

export default function ManageConnections() {
  const [connections, setConnections] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    connectionAPI
      .getAll()
      .then(setConnections)
      .catch((err) => setError(err.message));
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Remove this connection?")) return;
    try {
      await connectionAPI.remove(id);
      setConnections((prev) => prev.filter((c) => c._id !== id));
      setSuccess("Connection removed");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!connections) return error ? <Alert type="error" message={error} /> : <Loader />;

  const shown = status ? connections.filter((c) => c.status === status) : connections;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Manage Connections</h1>
          <p className="muted">All student-mentor connection requests.</p>
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      <div className="table-wrap card">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Mentor</th>
              <th>Requested on</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((c) => (
              <tr key={c._id}>
                <td>
                  {c.studentId?.name || "-"}
                  <div className="small muted">{c.studentId?.email}</div>
                </td>
                <td>
                  {c.mentorId?.name || "-"}
                  <div className="small muted">{c.mentorId?.company}</div>
                </td>
                <td>{formatDate(c.createdAt)}</td>
                <td>
                  <StatusBadge status={c.status} />
                </td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => remove(c._id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && <p className="muted center">No connections found.</p>}
      </div>
    </div>
  );
}
