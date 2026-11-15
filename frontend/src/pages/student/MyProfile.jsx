// ------------------------------------------------------------
// pages/student/MyProfile.jsx
// View and edit the student's own profile -> PUT /api/users/:id
// ------------------------------------------------------------
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { userAPI } from "../../services/api.js";
import { formatDate } from "../../services/format.js";
import Avatar from "../../components/Avatar.jsx";
import Alert from "../../components/Alert.jsx";

export default function MyProfile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(toForm(user));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Name is required");
    setSaving(true);
    setError("");
    try {
      const res = await userAPI.update(user._id, form); // skills sent as "a, b, c"
      updateUser(res.user);
      setForm(toForm(res.user));
      setSuccess(res.message);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-narrow">
      <div className="page-header">
        <h1>My Profile</h1>
        {!editing && (
          <button className="btn btn-primary" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>

      <Alert type="success" message={success} onClose={() => setSuccess("")} />
      <Alert type="error" message={error} />

      {!editing ? (
        <div className="card">
          <div className="profile-hero">
            <Avatar name={user.name} src={user.profile} size={88} />
            <div className="profile-hero-info">
              <h2>{user.name}</h2>
              <p className="muted">{user.email}</p>
              <span className="role-tag">{user.role}</span>
            </div>
          </div>
          <dl className="details">
            <dt>Education</dt>
            <dd>{user.education || "-"}</dd>
            <dt>Skills</dt>
            <dd>
              {(user.skills || []).length
                ? user.skills.map((s) => (
                    <span className="chip" key={s}>
                      {s}
                    </span>
                  ))
                : "-"}
            </dd>
            <dt>About me</dt>
            <dd>{user.bio || "-"}</dd>
            <dt>Phone</dt>
            <dd>{user.phone || "-"}</dd>
            <dt>Member since</dt>
            <dd>{formatDate(user.createdAt)}</dd>
          </dl>
        </div>
      ) : (
        <form className="card form" onSubmit={handleSave} noValidate>
          <label>
            Name *
            <input name="name" value={form.name} onChange={handleChange} />
          </label>
          <label>
            Education
            <input name="education" value={form.education} onChange={handleChange} placeholder="BCA 3rd Year, KLE BCA College" />
          </label>
          <label>
            Skills (comma separated)
            <input name="skills" value={form.skills} onChange={handleChange} placeholder="Java, React, SQL" />
          </label>
          <label>
            About me
            <textarea name="bio" rows={3} value={form.bio} onChange={handleChange} />
          </label>
          <div className="form-row">
            <label>
              Phone
              <input name="phone" value={form.phone} onChange={handleChange} />
            </label>
            <label>
              Profile picture URL (optional)
              <input name="profile" value={form.profile} onChange={handleChange} placeholder="https://..." />
            </label>
          </div>
          <div className="card-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setEditing(false);
                setForm(toForm(user));
              }}
            >
              Cancel
            </button>
            <button className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// Convert the user object to simple form values
function toForm(u) {
  return {
    name: u.name || "",
    education: u.education || "",
    skills: (u.skills || []).join(", "),
    bio: u.bio || "",
    phone: u.phone || "",
    profile: u.profile || "",
  };
}
