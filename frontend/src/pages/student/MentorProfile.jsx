// ------------------------------------------------------------
// pages/student/MentorProfile.jsx   (route: /mentor/:id)
// Full mentor profile with "Connect" and "Ask Question" buttons.
// Also reused by mentors to see their own profile (mentorId prop).
// ------------------------------------------------------------
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { mentorAPI, connectionAPI } from "../../services/api.js";
import { idOf } from "../../services/format.js";
import Avatar from "../../components/Avatar.jsx";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";
import Modal from "../../components/Modal.jsx";
import ConnectModal from "../../components/ConnectModal.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";

export default function MentorProfile({ mentorId }) {
  const params = useParams();
  const id = mentorId || params.id;
  const { user } = useAuth();
  const navigate = useNavigate();

  const [mentor, setMentor] = useState(null);
  const [status, setStatus] = useState(null); // my connection status with this mentor
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConnect, setShowConnect] = useState(false);
  const [showAskInfo, setShowAskInfo] = useState(false);

  const isStudent = user.role === "student";
  const isMe = user._id === id;

  useEffect(() => {
    mentorAPI
      .getById(id)
      .then(setMentor)
      .catch((err) => setError(err.message));

    if (isStudent) {
      connectionAPI
        .forStudent(user._id)
        .then((list) => {
          const found = list.find((c) => idOf(c.mentorId) === id);
          setStatus(found ? found.status : null);
        })
        .catch(() => {});
    }
  }, [id, isStudent, user._id]);

  if (error) return <Alert type="error" message={error} />;
  if (!mentor) return <Loader />;

  // Direct questions are allowed only after the mentor accepts the request
  const handleAsk = () => {
    if (status === "accepted") navigate(`/ask-question?mentor=${mentor._id}`);
    else setShowAskInfo(true);
  };

  return (
    <div>
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      <div className="card profile-hero">
        <Avatar name={mentor.name} src={mentor.profile} size={96} />
        <div className="profile-hero-info">
          <h1>{mentor.name}</h1>
          <p className="lead">
            {mentor.jobTitle || "Mentor"} {mentor.company && <>@ <strong>{mentor.company}</strong></>}
          </p>
          <p className="muted">
            {mentor.experience || 0} years experience {mentor.domain && `· ${mentor.domain}`}
          </p>
          {status && (
            <p>
              Connection status: <StatusBadge status={status} />
            </p>
          )}
        </div>

        <div className="profile-hero-actions">
          {isStudent && (
            <>
              <button
                className="btn btn-primary"
                disabled={status === "pending" || status === "accepted"}
                onClick={() => setShowConnect(true)}
              >
                {status === "accepted" ? "Connected ✓" : status === "pending" ? "Request Pending" : "Connect"}
              </button>
              <button className="btn btn-outline" onClick={handleAsk}>
                Ask Question
              </button>
            </>
          )}
          {isMe && (
            <Link to="/edit-profile" className="btn btn-primary">
              Edit Profile
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>About</h3>
          <p>{mentor.bio || "Not added yet."}</p>
        </div>
        <div className="card">
          <h3>Education</h3>
          <p>{mentor.education || "Not added yet."}</p>
        </div>
        <div className="card">
          <h3>Skills</h3>
          <div className="skills">
            {(mentor.skills || []).length === 0 && <p className="muted">Not added yet.</p>}
            {(mentor.skills || []).map((s) => (
              <span className="chip" key={s}>
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="card">
          <h3>Areas of Guidance</h3>
          {(mentor.areasOfGuidance || []).length === 0 ? (
            <p className="muted">Not added yet.</p>
          ) : (
            <ul>
              {mentor.areasOfGuidance.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card">
        <h3>Career Journey</h3>
        <p>{mentor.careerJourney || "Not added yet."}</p>
      </div>

      <ConnectModal
        mentor={showConnect ? mentor : null}
        onClose={() => setShowConnect(false)}
        onSent={(connection, message) => {
          setStatus(connection.status);
          setSuccess(message);
          setShowConnect(false);
        }}
      />

      <Modal
        open={showAskInfo}
        title="Connect first"
        onClose={() => setShowAskInfo(false)}
        actions={
          <>
            <button className="btn btn-outline" onClick={() => setShowAskInfo(false)}>
              Close
            </button>
            <Link to="/ask-question" className="btn btn-primary">
              Ask in Open Forum
            </Link>
          </>
        }
      >
        <p>
          You can ask <strong>{mentor.name}</strong> directly after they accept your connection
          request. Until then, you can post your question in the open forum where any mentor can
          answer it.
        </p>
      </Modal>
    </div>
  );
}
