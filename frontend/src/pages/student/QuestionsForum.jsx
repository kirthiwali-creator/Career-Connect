// ------------------------------------------------------------
// pages/student/QuestionsForum.jsx   (route: /questions)
// Shared forum for all roles.
// Student: see all / my questions, delete own questions
// Mentor : answer button    Admin: delete button
// ------------------------------------------------------------
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { questionAPI } from "../../services/api.js";
import { idOf } from "../../services/format.js";
import QuestionCard from "../../components/QuestionCard.jsx";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";
import EmptyState from "../../components/EmptyState.jsx";

export default function QuestionsForum() {
  const { user } = useAuth();
  const location = useLocation();
  const [tab, setTab] = useState(location.state?.tab || "all"); // "all" | "mine"
  const [filters, setFilters] = useState({ category: "", status: "", search: "" });
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(location.state?.success || "");

  useEffect(() => {
    questionAPI.categories().then(setCategories).catch(() => {});
  }, []);

  // Load questions whenever the tab or filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      const request =
        tab === "mine" ? questionAPI.forStudent(user._id) : questionAPI.getAll(filters);
      request.then(setQuestions).catch((err) => setError(err.message));
    }, 300);
    return () => clearTimeout(timer);
  }, [tab, filters, user._id]);

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await questionAPI.remove(id);
      setQuestions((prev) => prev.filter((q) => q._id !== id));
      setSuccess("Question deleted");
    } catch (err) {
      setError(err.message);
    }
  };

  // Can the logged-in mentor answer this question?
  const canAnswer = (q) =>
    user.role === "mentor" &&
    (!q.mentorId || idOf(q.mentorId) === user._id) &&
    (!q.answeredBy || idOf(q.answeredBy) === user._id);

  const actionsFor = (q) => {
    const buttons = [];
    if (canAnswer(q)) {
      buttons.push(
        <Link key="answer" to={`/answer/${q._id}`} className="btn btn-primary btn-sm">
          {q.answer ? "Edit Answer" : "Answer"}
        </Link>
      );
    }
    if (user.role === "admin" || idOf(q.studentId) === user._id) {
      buttons.push(
        <button key="delete" className="btn btn-danger btn-sm" onClick={() => handleDelete(q._id)}>
          Delete
        </button>
      );
    }
    return buttons.length ? buttons : null;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Questions Forum</h1>
          <p className="muted">Career questions from students, answered by mentors.</p>
        </div>
        {user.role === "student" && (
          <Link to="/ask-question" className="btn btn-primary">
            + Ask Question
          </Link>
        )}
      </div>

      <Alert type="success" message={success} onClose={() => setSuccess("")} />
      <Alert type="error" message={error} onClose={() => setError("")} />

      {user.role === "student" && (
        <div className="tabs">
          <button className={`tab ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>
            All Questions
          </button>
          <button className={`tab ${tab === "mine" ? "active" : ""}`} onClick={() => setTab("mine")}>
            My Questions
          </button>
        </div>
      )}

      {tab === "all" && (
        <div className="card filter-bar">
          <input
            className="search-input"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="🔍 Search questions..."
          />
          <select name="category" value={filters.category} onChange={handleChange}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select name="status" value={filters.status} onChange={handleChange}>
            <option value="">All</option>
            <option value="answered">Answered</option>
            <option value="unanswered">Unanswered</option>
          </select>
        </div>
      )}

      {!questions ? (
        <Loader />
      ) : questions.length === 0 ? (
        <EmptyState title="No questions found" />
      ) : (
        questions.map((q) => <QuestionCard key={q._id} q={q} actions={actionsFor(q)} />)
      )}
    </div>
  );
}
