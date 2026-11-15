// ------------------------------------------------------------
// components/ConnectModal.jsx
// Popup shown when a student clicks "Connect" on a mentor.
// It calls POST /api/connections and tells the parent page.
// ------------------------------------------------------------
import { useState } from "react";
import Modal from "./Modal.jsx";
import Alert from "./Alert.jsx";
import { connectionAPI } from "../services/api.js";

export default function ConnectModal({ mentor, onClose, onSent }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  if (!mentor) return null;

  const send = async () => {
    setSending(true);
    setError("");
    try {
      const res = await connectionAPI.send(mentor._id, message);
      onSent(res.connection, res.message); // parent updates its list + shows success
      setMessage("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      open={Boolean(mentor)}
      title={`Connect with ${mentor.name}`}
      onClose={onClose}
      actions={
        <>
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={send} disabled={sending}>
            {sending ? "Sending..." : "Send Request"}
          </button>
        </>
      }
    >
      <Alert type="error" message={error} />
      <p className="muted">
        {mentor.jobTitle} {mentor.company && `@ ${mentor.company}`}
      </p>
      <label>
        Message (optional)
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Hi, I am a BCA student and would like your guidance on..."
        />
      </label>
    </Modal>
  );
}
