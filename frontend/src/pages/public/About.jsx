// pages/public/About.jsx - explains the project
export default function About() {
  return (
    <div className="container page-narrow">
      <h1>About Career Connect</h1>
      <p className="lead">
        Career Connect is a career guidance and mentorship platform where BCA students and
        freshers connect with experienced IT professionals.
      </p>

      <div className="card">
        <h3>The problem</h3>
        <p>
          Many students, especially in smaller cities, do not know anyone working in the IT
          industry. They get confused about placements, interviews, resumes, certifications and
          higher studies, and often depend on random internet videos.
        </p>
      </div>

      <div className="card">
        <h3>Our solution</h3>
        <ul>
          <li>Students can search mentors by skill, company, job role and domain.</li>
          <li>Students send a connection request; mentors accept or reject it.</li>
          <li>Students ask career questions and mentors answer them.</li>
          <li>An admin keeps the platform clean by removing inappropriate users or questions.</li>
        </ul>
      </div>

      <div className="card">
        <h3>Technologies used (MERN stack)</h3>
        <ul>
          <li>
            <strong>React + Vite</strong> - frontend user interface
          </li>
          <li>
            <strong>Node.js + Express.js</strong> - backend REST API
          </li>
          <li>
            <strong>MongoDB + Mongoose</strong> - database
          </li>
          <li>
            <strong>JWT + bcrypt</strong> - secure login and password hashing
          </li>
        </ul>
      </div>

      <div className="card">
        <h3>User roles</h3>
        <ul>
          <li>
            <strong>Student</strong> - finds mentors, sends requests, asks questions.
          </li>
          <li>
            <strong>Mentor</strong> - manages profile, accepts requests, answers questions.
          </li>
          <li>
            <strong>Admin</strong> - monitors users, connections and questions.
          </li>
        </ul>
      </div>
    </div>
  );
}
