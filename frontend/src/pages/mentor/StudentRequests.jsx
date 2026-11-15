// ------------------------------------------------------------
// pages/mentor/StudentRequests.jsx
// All connection requests received by this mentor.
// Accept / Reject -> PUT /api/connections/:id
// ------------------------------------------------------------
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { connectionAPI } from "../../services/api.js";
import { formatDate } from "../../services/format.js";
import StatusBadge from "../../components/StatusBadge.jsx";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";
import EmptyState from "../../components/EmptyState.jsx";

export default function StudentRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    connectionAPI
      .forMentor(user._id)
      .then(setRequests)
      .catch((err) => setError(err.message));
  }, [user._id]);

  const respond = async (id, status) => {
    try {
      const res = await connectionAPI.updateStatus(id, status);
      setRequests((prev) => prev.map((r) => (r._id === id ? res.connection : r)));
      setSuccess(res.message);
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
          <h1>Student Requests</h1>
          <p className="muted">Students who want your guidance.</p>
        </div>
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      <div className="tabs">
        {["pending", "accepted", "rejected", "all"].map((t) => (
          <button key={t} className={`tab ${filter === t ? "active" : ""}`} onClick={() => setFilter(t)}>
            {t} ({t === "all" ? requests.length : requests.filter((r) => r.status === t).length})
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState title="No requests here" />
      ) : (
        <div className="table-wrap card">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Education</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r._id}>
                  <td>
                    <strong>{r.studentId?.name || "Deleted user"}</strong>
                    <div className="small muted">{r.studentId?.email}</div>
                  </td>
                  <td>{r.studentId?.education || "-"}</td>
                  <td className="small">{r.message || "-"}</td>
                  <td>{formatDate(r.createdAt)}</td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="row-actions">
                    {r.status !== "accepted" && (
                      <button className="btn btn-success btn-sm" onClick={() => respond(r._id, "accepted")}>
                        Accept
                      </button>
                    )}
                    {r.status === "pending" && (
                      <button className="btn btn-danger btn-sm" onClick={() => respond(r._id, "rejected")}>
                        Reject
                      </button>
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
