// ------------------------------------------------------------
// pages/student/StudentDashboard.jsx
// Cards: Total Mentors, Pending Requests, Accepted Connections, Questions Asked
// + Recent Questions + Recommended Mentors
// ------------------------------------------------------------
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { mentorAPI, connectionAPI, questionAPI } from "../../services/api.js";
import { statusByMentor, formatDate, shorten } from "../../services/format.js";
import StatCard from "../../components/StatCard.jsx";
import MentorCard from "../../components/MentorCard.jsx";
import ConnectModal from "../../components/ConnectModal.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [connections, setConnections] = useState([]);
  const [myQuestions, setMyQuestions] = useState([]);
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [connectTarget, setConnectTarget] = useState(null);

  // Load everything the dashboard needs, in parallel
  useEffect(() => {
    Promise.all([
      mentorAPI.getAll(),
      connectionAPI.forStudent(user._id),
      questionAPI.forStudent(user._id),
      questionAPI.getAll(),
    ])
      .then(([m, c, mine, all]) => {
        setMentors(m);
        setConnections(c);
        setMyQuestions(mine);
        setRecentQuestions(all.slice(0, 4));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user._id]);

  if (loading) return <Loader />;

  const statusMap = statusByMentor(connections);
  const pending = connections.filter((c) => c.status === "pending").length;
  const accepted = connections.filter((c) => c.status === "accepted").length;

  // Recommended = mentors who share the most skills with the student
  const mySkills = (user.skills || []).map((s) => s.toLowerCase());
  const recommended = [...mentors]
    .filter((m) => statusMap[m._id] !== "accepted")
    .map((m) => ({
      mentor: m,
      score: (m.skills || []).filter((s) => mySkills.includes(s.toLowerCase())).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.mentor);

  const handleSent = (connection, message) => {
    setConnections((prev) => [...prev.filter((c) => c._id !== connection._id), connection]);
    setSuccess(message);
    setConnectTarget(null);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Hello, {user.name} 👋</h1>
          <p className="muted">Here is what is happening with your mentorship journey.</p>
        </div>
        <Link to="/ask-question" className="btn btn-primary">
          + Ask a Question
        </Link>
      </div>

      <Alert type="error" message={error} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      <div className="grid grid-4">
        <StatCard label="Total Mentors" value={mentors.length} icon="👨‍🏫" color="blue" />
        <StatCard label="Pending Requests" value={pending} icon="⏳" color="orange" />
        <StatCard label="Accepted Connections" value={accepted} icon="🤝" color="green" />
        <StatCard label="Questions Asked" value={myQuestions.length} icon="❓" color="purple" />
      </div>

      <div className="section-head">
        <h2>Recommended Mentors</h2>
        <Link to="/mentors">View all →</Link>
      </div>
      <div className="grid grid-3">
        {recommended.map((m) => (
          <MentorCard key={m._id} mentor={m} status={statusMap[m._id]} onConnect={setConnectTarget} />
        ))}
      </div>

      <div className="section-head">
        <h2>Recent Questions</h2>
        <Link to="/questions">Open forum →</Link>
      </div>
      <div className="card">
        {recentQuestions.length === 0 && <p className="muted">No questions yet.</p>}
        {recentQuestions.map((q) => (
          <div className="list-row" key={q._id}>
            <div>
              <strong>{shorten(q.question, 90)}</strong>
              <div className="small muted">
                {q.studentId?.name} · {q.category} · {formatDate(q.createdAt)}
              </div>
            </div>
            <StatusBadge status={q.answer ? "answered" : "unanswered"} />
          </div>
        ))}
      </div>

      <ConnectModal mentor={connectTarget} onClose={() => setConnectTarget(null)} onSent={handleSent} />
    </div>
  );
}
