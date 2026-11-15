// ------------------------------------------------------------
// components/MentorCard.jsx
// One mentor card: avatar, name, role, company, experience,
// skills, short bio + "View Profile" and "Connect" buttons.
// status = connection status with this mentor (for students)
// ------------------------------------------------------------
import { Link } from "react-router-dom";
import Avatar from "./Avatar.jsx";
import { shorten } from "../services/format.js";

export default function MentorCard({ mentor, status, onConnect, showConnect = true, busy }) {
  // Button text depends on the current connection status
  let label = "Connect";
  let disabled = false;
  if (status === "pending") {
    label = "Request Pending";
    disabled = true;
  } else if (status === "accepted") {
    label = "Connected ✓";
    disabled = true;
  } else if (status === "rejected") {
    label = "Request Again";
  }

  return (
    <div className="card mentor-card">
      <div className="mentor-card-top">
        <Avatar name={mentor.name} src={mentor.profile} size={56} />
        <div>
          <h3>{mentor.name}</h3>
          <p className="muted">
            {mentor.jobTitle || "Mentor"}
            {mentor.company && <> @ <strong>{mentor.company}</strong></>}
          </p>
          <p className="small">
            {mentor.experience || 0} yrs experience
            {mentor.domain && <> · {mentor.domain}</>}
          </p>
        </div>
      </div>

      {mentor.bio && <p className="mentor-bio">{shorten(mentor.bio)}</p>}

      <div className="skills">
        {(mentor.skills || []).slice(0, 5).map((s) => (
          <span className="chip" key={s}>
            {s}
          </span>
        ))}
      </div>

      <div className="card-actions">
        <Link to={`/mentor/${mentor._id}`} className="btn btn-outline">
          View Profile
        </Link>
        {showConnect && (
          <button
            className={`btn ${status === "accepted" ? "btn-success" : "btn-primary"}`}
            disabled={disabled || busy}
            onClick={() => onConnect && onConnect(mentor)}
          >
            {busy ? "Sending..." : label}
          </button>
        )}
      </div>
    </div>
  );
}
