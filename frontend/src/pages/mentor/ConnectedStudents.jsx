// ------------------------------------------------------------
// pages/mentor/ConnectedStudents.jsx
// Students whose request this mentor accepted.
// ------------------------------------------------------------
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { connectionAPI } from "../../services/api.js";
import { formatDate } from "../../services/format.js";
import Avatar from "../../components/Avatar.jsx";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";
import EmptyState from "../../components/EmptyState.jsx";

export default function ConnectedStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    connectionAPI
      .forMentor(user._id)
      .then((list) => setStudents(list.filter((c) => c.status === "accepted" && c.studentId)))
      .catch((err) => setError(err.message));
  }, [user._id]);

  if (error) return <Alert type="error" message={error} />;
  if (!students) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Connected Students</h1>
          <p className="muted">Students you are currently mentoring.</p>
        </div>
      </div>

      {students.length === 0 ? (
        <EmptyState title="No connected students yet" text="Accept requests to see students here." />
      ) : (
        <div className="grid grid-3">
          {students.map((c) => {
            const s = c.studentId;
            return (
              <div className="card mentor-card" key={c._id}>
                <div className="mentor-card-top">
                  <Avatar name={s.name} src={s.profile} size={56} />
                  <div>
                    <h3>{s.name}</h3>
                    <p className="muted small">{s.education || "Student"}</p>
                    <p className="small">Connected {formatDate(c.updatedAt)}</p>
                  </div>
                </div>
                {s.bio && <p className="mentor-bio">{s.bio}</p>}
                <div className="skills">
                  {(s.skills || []).map((sk) => (
                    <span className="chip" key={sk}>
                      {sk}
                    </span>
                  ))}
                </div>
                <p className="small">📧 {s.email}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
