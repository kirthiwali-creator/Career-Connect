// ------------------------------------------------------------
// pages/student/AskQuestion.jsx
// Form -> POST /api/questions
// "Ask to" = open forum (any mentor) or one connected mentor
// ------------------------------------------------------------
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { questionAPI, connectionAPI } from "../../services/api.js";
import Alert from "../../components/Alert.jsx";

export default function AskQuestion() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [connectedMentors, setConnectedMentors] = useState([]);
  const [form, setForm] = useState({
    question: "",
    category: "",
    mentorId: searchParams.get("mentor") || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    questionAPI.categories().then(setCategories).catch(() => {});
    connectionAPI
      .forStudent(user._id)
      .then((list) =>
        setConnectedMentors(list.filter((c) => c.status === "accepted" && c.mentorId).map((c) => c.mentorId))
      )
      .catch(() => {});
  }, [user._id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) return setError("Please choose a category");
    if (form.question.trim().length < 10) return setError("Question should be at least 10 characters");

    setError("");
    setLoading(true);
    try {
      const res = await questionAPI.ask({
        question: form.question.trim(),
        category: form.category,
        mentorId: form.mentorId || undefined,
      });
      navigate("/questions", { state: { success: res.message, tab: "mine" } });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="page-narrow">
      <div className="page-header">
        <div>
          <h1>Ask a Question</h1>
          <p className="muted">Ask anything about placements, interviews, resumes, skills or higher studies.</p>
        </div>
      </div>

      <form className="card form" onSubmit={handleSubmit} noValidate>
        <Alert type="error" message={error} />

        <div className="form-row">
          <label>
            Category *
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="">-- Select category --</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Ask to
            <select name="mentorId" value={form.mentorId} onChange={handleChange}>
              <option value="">All mentors (open forum)</option>
              {connectedMentors.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} - {m.jobTitle}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="small muted">You can ask a mentor directly only after they accept your connection request.</p>

        <label>
          Your question *
          <textarea
            name="question"
            rows={6}
            value={form.question}
            onChange={handleChange}
            placeholder="e.g. How should I prepare for a software developer interview as a BCA student?"
          />
        </label>

        <div className="card-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Posting..." : "Post Question"}
          </button>
        </div>
      </form>
    </div>
  );
}
