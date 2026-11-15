// ------------------------------------------------------------
// pages/student/ConnectionRequests.jsx
// All requests the student has sent, with their status.
// Pending requests can be cancelled.
// ------------------------------------------------------------
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { connectionAPI } from "../../services/api.js";
import { formatDate } from "../../services/format.js";
import StatusBadge from "../../components/StatusBadge.jsx";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";
import EmptyState from "../../components/EmptyState.jsx";

export default function ConnectionRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState(null);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    connectionAPI
      .forStudent(user._id)
      .then(setRequests)
      .catch((err) => setError(err.message));
  }, [user._id]);

  const cancel = async (id) => {
    if (!window.confirm("Cancel this request?")) return;
    try {
      await connectionAPI.remove(id);
      setRequests((prev) => prev.filter((r) => r._id !== id));
      setSuccess("Request cancelled");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!requests) return error ? <Alert type="error" message={error} /> : <Loader />;

  const shown = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Connection Requests</h1>
          <p className="muted">Track the status of requests you have sent to mentors.</p>
        </div>
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      <div className="tabs">
        {["all", "pending", "accepted", "rejected"].map((t) => (
          <button key={t} className={`tab ${filter === t ? "active" : ""}`} onClick={() => setFilter(t)}>
            {t} ({t === "all" ? requests.length : requests.filter((r) => r.status === t).length})
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState title="No requests here">
          <Link to="/mentors" className="btn btn-primary">
            Find Mentors
          </Link>
        </EmptyState>
      ) : (
        <div className="table-wrap card">
          <table>
            <thead>
              <tr>
                <th>Mentor</th>
                <th>Company</th>
                <th>Sent on</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r._id}>
                  <td>
                    {r.mentorId ? <Link to={`/mentor/${r.mentorId._id}`}>{r.mentorId.name}</Link> : "Deleted mentor"}
                  </td>
                  <td>{r.mentorId?.company}</td>
                  <td>{formatDate(r.createdAt)}</td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td>
                    {r.status === "pending" && (
                      <button className="btn btn-danger btn-sm" onClick={() => cancel(r._id)}>
                        Cancel
                      </button>
                    )}
                    {r.status === "accepted" && r.mentorId && (
                      <Link to={`/ask-question?mentor=${r.mentorId._id}`} className="btn btn-primary btn-sm">
                        Ask
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
