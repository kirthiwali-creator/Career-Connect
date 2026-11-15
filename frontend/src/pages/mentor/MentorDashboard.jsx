// ------------------------------------------------------------
// pages/mentor/MentorDashboard.jsx
// Numbers + latest pending requests (accept / reject right here)
// ------------------------------------------------------------
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { connectionAPI, questionAPI } from "../../services/api.js";
import { formatDate, idOf, shorten } from "../../services/format.js";
import StatCard from "../../components/StatCard.jsx";
import Avatar from "../../components/Avatar.jsx";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";

export default function MentorDashboard() {
  const { user } = useAuth();
  const [connections, setConnections] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    Promise.all([connectionAPI.forMentor(user._id), questionAPI.getAll()])
      .then(([c, q]) => {
        setConnections(c);
        setQuestions(q);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user._id]);

  // Accept or reject -> PUT /api/connections/:id
  const respond = async (id, status) => {
    try {
      const res = await connectionAPI.updateStatus(id, status);
      setConnections((prev) => prev.map((c) => (c._id === id ? res.connection : c)));
      setSuccess(res.message);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loader />;

  const pending = connections.filter((c) => c.status === "pending");
  const accepted = connections.filter((c) => c.status === "accepted");
  const askedToMe = questions.filter((q) => idOf(q.mentorId) === user._id && !q.answer);
  const openQuestions = questions.filter((q) => !q.mentorId && !q.answer);
  const answeredByMe = questions.filter((q) => idOf(q.answeredBy) === user._id);
  const profileIncomplete = !user.jobTitle || !user.company || (user.skills || []).length === 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Welcome, {user.name} 👋</h1>
          <p className="muted">Help students grow by sharing your experience.</p>
        </div>
      </div>

      {profileIncomplete && (
        <div className="alert alert-info">
          <span>Your profile is incomplete. Students search by job role, company and skills.</span>
          <Link to="/edit-profile" className="btn btn-primary btn-sm">
            Complete Profile
          </Link>
        </div>
      )}
      <Alert type="error" message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      <div className="grid grid-4">
        <StatCard label="Pending Requests" value={pending.length} icon="⏳" color="orange" />
        <StatCard label="Connected Students" value={accepted.length} icon="🤝" color="green" />
        <StatCard label="Questions to Answer" value={askedToMe.length + openQuestions.length} icon="❓" color="blue" />
        <StatCard label="Answers Given" value={answeredByMe.length} icon="✅" color="purple" />
      </div>

      <div className="section-head">
        <h2>New Connection Requests</h2>
        <Link to="/requests">View all →</Link>
      </div>
      <div className="card">
        {pending.length === 0 && <p className="muted">No pending requests right now.</p>}
        {pending.slice(0, 5).map((c) => (
          <div className="list-row" key={c._id}>
            <div className="list-person">
              <Avatar name={c.studentId?.name || "?"} size={40} />
              <div>
                <strong>{c.studentId?.name}</strong>
                <div className="small muted">
                  {c.studentId?.education || c.studentId?.email} · {formatDate(c.createdAt)}
                </div>
                {c.message && <div className="small">"{c.message}"</div>}
              </div>
            </div>
            <div className="row-actions">
              <button className="btn btn-success btn-sm" onClick={() => respond(c._id, "accepted")}>
                Accept
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => respond(c._id, "rejected")}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="section-head">
        <h2>Questions Waiting for You</h2>
        <Link to="/mentor-questions">View all →</Link>
      </div>
      <div className="card">
        {[...askedToMe, ...openQuestions].length === 0 && <p className="muted">No unanswered questions. 🎉</p>}
        {[...askedToMe, ...openQuestions].slice(0, 5).map((q) => (
          <div className="list-row" key={q._id}>
            <div>
              <strong>{shorten(q.question, 90)}</strong>
              <div className="small muted">
                {q.studentId?.name} · {q.category} {q.mentorId && "· asked to you"}
              </div>
            </div>
            <Link to={`/answer/${q._id}`} className="btn btn-primary btn-sm">
              Answer
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
