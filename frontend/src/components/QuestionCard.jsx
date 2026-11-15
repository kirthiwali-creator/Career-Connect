// ------------------------------------------------------------
// components/QuestionCard.jsx
// Shows a question, who asked it, its category and the answer.
// "actions" lets each page add its own buttons (Delete / Answer).
// ------------------------------------------------------------
import Avatar from "./Avatar.jsx";
import StatusBadge from "./StatusBadge.jsx";
import { formatDate } from "../services/format.js";

export default function QuestionCard({ q, actions }) {
  const student = q.studentId || { name: "Deleted user" };
  const answered = Boolean(q.answer);

  return (
    <div className="card question-card">
      <div className="q-meta">
        <Avatar name={student.name} src={student.profile} size={32} />
        <span>
          <strong>{student.name}</strong> · {formatDate(q.createdAt)}
        </span>
        <span className="chip chip-cat">{q.category}</span>
        <StatusBadge status={answered ? "answered" : "unanswered"} />
      </div>

      <h4 className="q-text">{q.question}</h4>
      {q.mentorId && <p className="small muted">Asked to: {q.mentorId.name}</p>}

      {answered ? (
        <div className="answer-box">
          <div className="answer-by">
            ✅ Answered by <strong>{q.answeredBy?.name || "a mentor"}</strong>
            {q.answeredBy?.jobTitle && (
              <span className="muted">
                {" "}
                ({q.answeredBy.jobTitle}
                {q.answeredBy.company && `, ${q.answeredBy.company}`})
              </span>
            )}
          </div>
          <p>{q.answer}</p>
        </div>
      ) : (
        <p className="small muted">Waiting for a mentor to answer...</p>
      )}

      {actions && <div className="card-actions">{actions}</div>}
    </div>
  );
}
