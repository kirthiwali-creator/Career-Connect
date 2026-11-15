// ------------------------------------------------------------
// pages/mentor/EditProfile.jsx
// Mentor adds job role, company, experience, skills, etc.
// -> PUT /api/users/:id
// ------------------------------------------------------------
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { userAPI } from "../../services/api.js";
import Alert from "../../components/Alert.jsx";

const DOMAINS = [
  "Web Development",
  "Full Stack Development",
  "Mobile Development",
  "Cloud Computing",
  "Artificial Intelligence",
  "Data Science",
  "Cyber Security",
  "Software Testing",
  "UI/UX Design",
];

export default function EditProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    name: user.name || "",
    jobTitle: user.jobTitle || "",
    company: user.company || "",
    experience: user.experience || 0,
    domain: user.domain || "",
    skills: (user.skills || []).join(", "),
    education: user.education || "",
    bio: user.bio || "",
    careerJourney: user.careerJourney || "",
    areasOfGuidance: (user.areasOfGuidance || []).join(", "),
    profile: user.profile || "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.jobTitle.trim() || !form.company.trim()) {
      return setError("Name, job title and company are required");
    }
    if (Number(form.experience) < 0) return setError("Experience cannot be negative");

    setSaving(true);
    setError("");
    try {
      const res = await userAPI.update(user._id, form);
      updateUser(res.user);
      navigate("/my-mentor-profile");
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="page-narrow">
      <h1>Edit Profile</h1>
      {location.state?.welcome && (
        <Alert type="success" message="Welcome to Career Connect! Please complete your mentor profile so students can find you." />
      )}

      <form className="card form" onSubmit={handleSubmit} noValidate>
        <Alert type="error" message={error} />

        <div className="form-row">
          <label>
            Full name *
            <input name="name" value={form.name} onChange={handleChange} />
          </label>
          <label>
            Profile picture URL (optional)
            <input name="profile" value={form.profile} onChange={handleChange} placeholder="https://..." />
          </label>
        </div>

        <div className="form-row">
          <label>
            Job title *
            <input name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="Senior Software Engineer" />
          </label>
          <label>
            Company *
            <input name="company" value={form.company} onChange={handleChange} placeholder="Infosys" />
          </label>
        </div>

        <div className="form-row">
          <label>
            Experience (years)
            <input type="number" min="0" max="50" name="experience" value={form.experience} onChange={handleChange} />
          </label>
          <label>
            Domain
            <select name="domain" value={form.domain} onChange={handleChange}>
              <option value="">-- Select domain --</option>
              {DOMAINS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Skills (comma separated)
          <input name="skills" value={form.skills} onChange={handleChange} placeholder="Java, React, AWS" />
        </label>
        <label>
          Education
          <input name="education" value={form.education} onChange={handleChange} placeholder="MCA, VTU" />
        </label>
        <label>
          About / short bio
          <textarea name="bio" rows={3} value={form.bio} onChange={handleChange} />
        </label>
        <label>
          Career journey
          <textarea name="careerJourney" rows={4} value={form.careerJourney} onChange={handleChange} />
        </label>
        <label>
          Areas of guidance (comma separated)
          <input
            name="areasOfGuidance"
            value={form.areasOfGuidance}
            onChange={handleChange}
            placeholder="Resume review, Interview preparation"
          />
        </label>

        <div className="card-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
