// ------------------------------------------------------------
// pages/mentor/AnswerQuestion.jsx   (route: /answer/:id)
// Mentor writes an answer -> PUT /api/questions/:id/answer
// ------------------------------------------------------------
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { questionAPI } from "../../services/api.js";
import { formatDate } from "../../services/format.js";
import Alert from "../../components/Alert.jsx";
import Loader from "../../components/Loader.jsx";

export default function AnswerQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    questionAPI
      .getById(id)
      .then((q) => {
        setQuestion(q);
        setAnswer(q.answer || "");
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (answer.trim().length < 5) return setError("Please write a proper answer");
    setSaving(true);
    setError("");
    try {
      const res = await questionAPI.answer(id, answer);
      setQuestion(res.question);
      setSuccess(res.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!question) return error ? <Alert type="error" message={error} /> : <Loader />;

  return (
    <div className="page-narrow">
      <button className="btn btn-link" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h1>Answer Question</h1>

      <div className="card">
        <div className="q-meta">
          <span className="chip chip-cat">{question.category}</span>
          <span className="small muted">
            Asked by <strong>{question.studentId?.name}</strong> on {formatDate(question.createdAt)}
          </span>
        </div>
        <h3 className="q-text">{question.question}</h3>
      </div>

      <form className="card form" onSubmit={handleSubmit} noValidate>
        <Alert type="error" message={error} />
        <Alert type="success" message={success} />
        <label>
          Your answer
          <textarea
            rows={8}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Share practical advice from your experience..."
          />
        </label>
        <div className="card-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate("/mentor-questions")}>
            Back to Questions
          </button>
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Submitting..." : question.answer ? "Update Answer" : "Submit Answer"}
          </button>
        </div>
      </form>
    </div>
  );
}
