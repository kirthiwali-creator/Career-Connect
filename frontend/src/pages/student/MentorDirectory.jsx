// ------------------------------------------------------------
// pages/student/MentorDirectory.jsx
// Search mentors by name / skill / job role / company
// Filter by skill, experience and domain
// The search runs on the backend: GET /api/mentors?search=..&skill=..
// ------------------------------------------------------------
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { mentorAPI, connectionAPI } from "../../services/api.js";
import { statusByMentor } from "../../services/format.js";
import MentorCard from "../../components/MentorCard.jsx";
import ConnectModal from "../../components/ConnectModal.jsx";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";
import EmptyState from "../../components/EmptyState.jsx";

const EMPTY_FILTERS = { search: "", skill: "", minExp: "", domain: "" };

export default function MentorDirectory() {
  const { user } = useAuth();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [options, setOptions] = useState({ skills: [], domains: [] });
  const [mentors, setMentors] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [connectTarget, setConnectTarget] = useState(null);

  // Load filter dropdown values + my connections once
  useEffect(() => {
    mentorAPI.filters().then(setOptions).catch(() => {});
    connectionAPI.forStudent(user._id).then(setConnections).catch(() => {});
  }, [user._id]);

  // Re-load mentors whenever a filter changes (small delay while typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      mentorAPI
        .getAll(filters)
        .then((data) => {
          setMentors(data);
          setError("");
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSent = (connection, message) => {
    setConnections((prev) => [...prev.filter((c) => c._id !== connection._id), connection]);
    setSuccess(message);
    setConnectTarget(null);
  };

  const statusMap = statusByMentor(connections);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Mentor Directory</h1>
          <p className="muted">Find professionals who can guide your career.</p>
        </div>
      </div>

      <Alert type="success" message={success} onClose={() => setSuccess("")} />
      <Alert type="error" message={error} />

      {/* ---------- Search + filters ---------- */}
      <div className="card filter-bar">
        <input
          className="search-input"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="🔍 Search by name, skill, job role or company..."
        />
        <select name="skill" value={filters.skill} onChange={handleChange}>
          <option value="">All skills</option>
          {options.skills.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select name="minExp" value={filters.minExp} onChange={handleChange}>
          <option value="">Any experience</option>
          <option value="3">3+ years</option>
          <option value="5">5+ years</option>
          <option value="10">10+ years</option>
        </select>
        <select name="domain" value={filters.domain} onChange={handleChange}>
          <option value="">All domains</option>
          {options.domains.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <button className="btn btn-outline" onClick={() => setFilters(EMPTY_FILTERS)}>
          Clear
        </button>
      </div>

      {loading ? (
        <Loader text="Searching mentors..." />
      ) : mentors.length === 0 ? (
        <EmptyState title="No mentors found" text="Try a different search or clear the filters." />
      ) : (
        <>
          <p className="small muted">{mentors.length} mentor(s) found</p>
          <div className="grid grid-3">
            {mentors.map((m) => (
              <MentorCard key={m._id} mentor={m} status={statusMap[m._id]} onConnect={setConnectTarget} />
            ))}
          </div>
        </>
      )}

      <ConnectModal mentor={connectTarget} onClose={() => setConnectTarget(null)} onSent={handleSent} />
    </div>
  );
}
