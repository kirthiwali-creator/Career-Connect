// ------------------------------------------------------------
// pages/public/Home.jsx - Landing page
// ------------------------------------------------------------
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { mentorAPI } from "../../services/api.js";
import { useAuth, dashboardPath } from "../../context/AuthContext.jsx";
import Avatar from "../../components/Avatar.jsx";

const FEATURES = [
  { icon: "🔍", title: "Find the right mentor", text: "Search mentors by skill, job role, company or domain." },
  { icon: "🤝", title: "Connect", text: "Send a connection request. Mentors accept or reject it." },
  { icon: "💬", title: "Ask questions", text: "Ask about placements, interviews, resumes and higher studies." },
  { icon: "✅", title: "Get real answers", text: "Experienced professionals answer from real industry experience." },
];

const STEPS = ["Register as a student", "Find a mentor", "Send connection request", "Ask & get guidance"];

export default function Home() {
  const { user } = useAuth();
  const [mentors, setMentors] = useState([]);

  // Load a few mentors from the backend to show on the home page
  useEffect(() => {
    mentorAPI
      .getAll()
      .then((data) => setMentors(data.slice(0, 3)))
      .catch(() => setMentors([])); // home page still works if the API is down
  }, []);

  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <span className="hero-tag">Career guidance · Not a job portal</span>
            <h1>
              Connect with experienced mentors. <span>Shape your career.</span>
            </h1>
            <p>
              Career Connect helps BCA students and freshers get honest career guidance from
              professionals working in the IT industry.
            </p>
            <div className="hero-actions">
              {user ? (
                <Link to={dashboardPath(user.role)} className="btn btn-primary btn-lg">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-lg">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hero-card card">
            <p className="small muted">Example question</p>
            <h4>"How should I prepare for a software developer interview as a BCA student?"</h4>
            <div className="answer-box">
              <div className="answer-by">✅ Answered by a Senior Software Engineer</div>
              <p>Master one language, practise DSA daily and be ready to explain your project...</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section className="container section">
        <h2 className="section-title">What you can do</h2>
        <div className="grid grid-4">
          {FEATURES.map((f) => (
            <div className="card feature" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p className="muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">How it works</h2>
          <div className="steps">
            {STEPS.map((s, i) => (
              <div className="step" key={s}>
                <div className="step-num">{i + 1}</div>
                <p>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Mentors preview ---------- */}
      {mentors.length > 0 && (
        <section className="container section">
          <h2 className="section-title">Meet some of our mentors</h2>
          <div className="grid grid-3">
            {mentors.map((m) => (
              <div className="card mentor-preview" key={m._id}>
                <Avatar name={m.name} src={m.profile} size={64} />
                <h3>{m.name}</h3>
                <p className="muted">
                  {m.jobTitle} @ {m.company}
                </p>
                <p className="small">{m.experience} yrs experience</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="footer">
        © {new Date().getFullYear()} Career Connect · BCA Full Stack Project
      </footer>
    </div>
  );
}
