// ------------------------------------------------------------
// pages/mentor/MentorQuestions.jsx
// Tabs: Asked to me | Open questions | Answered by me
// ------------------------------------------------------------
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { questionAPI } from "../../services/api.js";
import { idOf } from "../../services/format.js";
import QuestionCard from "../../components/QuestionCard.jsx";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";
import EmptyState from "../../components/EmptyState.jsx";

export default function MentorQuestions() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState(null);
  const [tab, setTab] = useState("direct");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    questionAPI.categories().then(setCategories).catch(() => {});
    questionAPI
      .getAll()
      .then(setQuestions)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <Alert type="error" message={error} />;
  if (!questions) return <Loader />;

  // Split questions into the three tabs
  const groups = {
    direct: questions.filter((q) => idOf(q.mentorId) === user._id && !q.answer),
    open: questions.filter((q) => !q.mentorId && !q.answer),
    answered: questions.filter((q) => idOf(q.answeredBy) === user._id),
  };
  const labels = { direct: "Asked to me", open: "Open questions", answered: "Answered by me" };
  const shown = groups[tab].filter((q) => !category || q.category === category);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Questions</h1>
          <p className="muted">Answer questions from your connected students and the open forum.</p>
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="tabs">
        {Object.keys(groups).map((t) => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {labels[t]} ({groups[t].length})
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState title="Nothing here" text="No questions in this list right now." />
      ) : (
        shown.map((q) => (
          <QuestionCard
            key={q._id}
            q={q}
            actions={
              <Link to={`/answer/${q._id}`} className="btn btn-primary btn-sm">
                {q.answer ? "Edit Answer" : "Answer"}
              </Link>
            }
          />
        ))
      )}
    </div>
  );
}
