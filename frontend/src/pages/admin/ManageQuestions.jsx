// ------------------------------------------------------------
// pages/admin/ManageQuestions.jsx
// All questions in a table; admin can delete inappropriate ones.
// ------------------------------------------------------------
import { useEffect, useState } from "react";
import { questionAPI } from "../../services/api.js";
import { formatDate, shorten } from "../../services/format.js";
import StatusBadge from "../../components/StatusBadge.jsx";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";
import Modal from "../../components/Modal.jsx";

export default function ManageQuestions() {
  const [questions, setQuestions] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    questionAPI
      .getAll()
      .then(setQuestions)
      .catch((err) => setError(err.message));
  }, []);

  const confirmDelete = async () => {
    try {
      await questionAPI.remove(toDelete._id);
      setQuestions((prev) => prev.filter((q) => q._id !== toDelete._id));
      setSuccess("Question deleted");
    } catch (err) {
      setError(err.message);
    }
    setToDelete(null);
  };

  if (!questions) return error ? <Alert type="error" message={error} /> : <Loader />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Manage Questions</h1>
          <p className="muted">{questions.length} question(s) on the platform.</p>
        </div>
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      <div className="table-wrap card">
        <table>
          <thead>
            <tr>
              <th>Question</th>
              <th>Category</th>
              <th>Asked by</th>
              <th>Answered by</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q._id}>
                <td title={q.question}>{shorten(q.question, 70)}</td>
                <td>{q.category}</td>
                <td>{q.studentId?.name || "-"}</td>
                <td>{q.answeredBy?.name || "-"}</td>
                <td>{formatDate(q.createdAt)}</td>
                <td>
                  <StatusBadge status={q.answer ? "answered" : "unanswered"} />
                </td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => setToDelete(q)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {questions.length === 0 && <p className="muted center">No questions yet.</p>}
      </div>

      <Modal
        open={Boolean(toDelete)}
        title="Delete question?"
        onClose={() => setToDelete(null)}
        actions={
          <>
            <button className="btn btn-outline" onClick={() => setToDelete(null)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={confirmDelete}>
              Yes, delete
            </button>
          </>
        }
      >
        <p>"{toDelete?.question}"</p>
      </Modal>
    </div>
  );
}
