// ------------------------------------------------------------
// pages/student/MyConnections.jsx
// Mentors who ACCEPTED the student's request.
// ------------------------------------------------------------
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { connectionAPI } from "../../services/api.js";
import { formatDate } from "../../services/format.js";
import Avatar from "../../components/Avatar.jsx";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";
import EmptyState from "../../components/EmptyState.jsx";

export default function MyConnections() {
  const { user } = useAuth();
  const [connections, setConnections] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    connectionAPI
      .forStudent(user._id)
      .then((list) => setConnections(list.filter((c) => c.status === "accepted" && c.mentorId)))
      .catch((err) => setError(err.message));
  }, [user._id]);

  if (error) return <Alert type="error" message={error} />;
  if (!connections) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Connections</h1>
          <p className="muted">Mentors who accepted your request. You can ask them questions directly.</p>
        </div>
      </div>

      {connections.length === 0 ? (
        <EmptyState title="No connections yet" text="Send a request to a mentor to get started.">
          <Link to="/mentors" className="btn btn-primary">
            Find Mentors
          </Link>
        </EmptyState>
      ) : (
        <div className="grid grid-3">
          {connections.map((c) => {
            const m = c.mentorId;
            return (
              <div className="card mentor-card" key={c._id}>
                <div className="mentor-card-top">
                  <Avatar name={m.name} src={m.profile} size={56} />
                  <div>
                    <h3>{m.name}</h3>
                    <p className="muted">
                      {m.jobTitle} @ {m.company}
                    </p>
                    <p className="small">Connected since {formatDate(c.updatedAt)}</p>
                  </div>
                </div>
                <p className="small">📧 {m.email}</p>
                <div className="card-actions">
                  <Link to={`/mentor/${m._id}`} className="btn btn-outline">
                    View Profile
                  </Link>
                  <Link to={`/ask-question?mentor=${m._id}`} className="btn btn-primary">
                    Ask Question
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
