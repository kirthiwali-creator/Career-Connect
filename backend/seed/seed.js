// ------------------------------------------------------------
// seed/seed.js
// Fills the database with demo data for the practical/viva.
// Run with:  npm run seed
// WARNING: this deletes existing users, connections and questions.
// ------------------------------------------------------------
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const User = require("../models/User");
const Connection = require("../models/Connection");
const Question = require("../models/Question");

// ---------- Demo students ----------
const students = [
  {
    name: "Keerthi",
    email: "keerthi@student.com",
    education: "BCA 3rd Year, KLE BCA College, Hubli",
    skills: ["Java", "HTML", "CSS"],
    bio: "Final-year BCA student interested in full stack development.",
  },
  {
    name: "Shraddha",
    email: "shraddha@student.com",
    education: "BCA 2nd Year, KLE BCA College, Hubli",
    skills: ["Python", "SQL"],
    bio: "Exploring data analytics and AI.",
  },
  {
    name: "Samskruti",
    email: "samskruti@student.com",
    education: "BCA 3rd Year, KLE BCA College, Hubli",
    skills: ["C", "JavaScript", "React"],
    bio: "Love building web apps and want to become a frontend developer.",
  },
  {
    name: "Shreya",
    email: "shreya@student.com",
    education: "BCA 1st Year, KLE BCA College, Hubli",
    skills: ["C", "HTML"],
    bio: "Curious about cyber security and ethical hacking.",
  },
  {
    name: "Sinchana",
    email: "sinchana@student.com",
    education: "BCA 3rd Year, KLE BCA College, Hubli",
    skills: ["Java", "MySQL", "AWS Basics"],
    bio: "Planning to do MCA or start a career in cloud computing.",
  },
];

// ---------- Demo mentors ----------
const mentors = [
  {
    name: "Ramesh Kulkarni",
    email: "ramesh@mentor.com",
    jobTitle: "Senior Software Engineer",
    company: "Infosys",
    experience: 9,
    domain: "Full Stack Development",
    skills: ["Java", "Spring Boot", "React", "MySQL"],
    education: "MCA, Visvesvaraya Technological University",
    bio: "9 years of building enterprise web applications. I help freshers crack their first developer job.",
    careerJourney:
      "Started as a trainee after BCA and MCA, moved from support to Java development, and now lead a team of 8 developers building banking applications.",
    areasOfGuidance: ["Placement preparation", "Java interviews", "Resume review", "Project ideas"],
  },
  {
    name: "Suresh Patil",
    email: "suresh@mentor.com",
    jobTitle: "Cloud Solutions Architect",
    company: "TCS",
    experience: 12,
    domain: "Cloud Computing",
    skills: ["AWS", "Azure", "Docker", "Kubernetes", "Linux"],
    education: "B.E. Computer Science, KLE Technological University",
    bio: "Cloud architect helping companies move to AWS and Azure. Happy to guide students entering cloud and DevOps.",
    careerJourney:
      "Began as a Linux system administrator, learned AWS on the job, earned AWS and Azure certifications and moved into architecture roles.",
    areasOfGuidance: ["Cloud certifications", "DevOps roadmap", "Career switch"],
  },
  {
    name: "Priya Deshpande",
    email: "priya@mentor.com",
    jobTitle: "Data Scientist",
    company: "Wipro",
    experience: 6,
    domain: "Artificial Intelligence",
    skills: ["Python", "Machine Learning", "SQL", "Power BI"],
    education: "M.Sc. Data Science, Christ University, Bengaluru",
    bio: "I build ML models for retail clients. I enjoy guiding students who want to start in data science and AI.",
    careerJourney:
      "Did BCA, then M.Sc. in Data Science. Joined Wipro as a data analyst and moved to data scientist in 3 years.",
    areasOfGuidance: ["Higher studies", "Data science roadmap", "Python projects"],
  },
  {
    name: "Nayana Hegde",
    email: "nayana@mentor.com",
    jobTitle: "Cyber Security Analyst",
    company: "Accenture",
    experience: 5,
    domain: "Cyber Security",
    skills: ["Network Security", "Ethical Hacking", "SIEM", "Python"],
    education: "BCA, Karnatak University Dharwad; CEH certified",
    bio: "Security analyst in a 24x7 SOC team. I guide students on certifications and building a security career.",
    careerJourney:
      "Started with networking basics during BCA, completed CEH, joined Accenture's Security Operations Center as a fresher.",
    areasOfGuidance: ["Cyber security careers", "Certifications", "Interview preparation"],
  },
  {
    name: "Vani Joshi",
    email: "vani@mentor.com",
    jobTitle: "Frontend Developer",
    company: "Zoho",
    experience: 3,
    domain: "Web Development",
    skills: ["JavaScript", "React", "HTML", "CSS", "Figma"],
    education: "BCA, KLE BCA College, Hubli",
    bio: "BCA graduate from Hubli, now a frontend developer. I know exactly how it feels to search for the first job.",
    careerJourney:
      "Built a portfolio of 5 React projects during final year, got selected by Zoho through an off-campus drive.",
    areasOfGuidance: ["Portfolio building", "Off-campus jobs", "Frontend roadmap", "Resume review"],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB. Seeding...");

    // 1. Clear old data
    await Promise.all([User.deleteMany(), Connection.deleteMany(), Question.deleteMany()]);

    // 2. Hash demo passwords
    const adminPass = await bcrypt.hash("admin123", 10);
    const studentPass = await bcrypt.hash("student123", 10);
    const mentorPass = await bcrypt.hash("mentor123", 10);

    // 3. Create users
    await User.create({
      name: "Admin",
      email: "admin@careerconnect.com",
      password: adminPass,
      role: "admin",
    });

    const studentDocs = await User.insertMany(
      students.map((s) => ({ ...s, password: studentPass, role: "student" }))
    );
    const mentorDocs = await User.insertMany(
      mentors.map((m) => ({ ...m, password: mentorPass, role: "mentor" }))
    );

    const [keerthi, shraddha, samskruti, shreya, sinchana] = studentDocs;
    const [ramesh, suresh, priya, nayana, vani] = mentorDocs;

    // 4. Some connection requests in different states
    await Connection.insertMany([
      { studentId: keerthi._id, mentorId: ramesh._id, status: "accepted" },
      { studentId: keerthi._id, mentorId: vani._id, status: "pending" },
      { studentId: shraddha._id, mentorId: priya._id, status: "accepted" },
      { studentId: samskruti._id, mentorId: vani._id, status: "pending" },
      { studentId: shreya._id, mentorId: nayana._id, status: "pending" },
      { studentId: sinchana._id, mentorId: suresh._id, status: "rejected" },
    ]);

    // 5. Some questions (some answered, some open)
    await Question.insertMany([
      {
        studentId: keerthi._id,
        question: "How should I prepare for a software developer interview as a BCA student?",
        category: "Interview",
        mentorId: ramesh._id,
        answer:
          "Focus on one language deeply (Java is a good choice), practise 2-3 DSA problems daily, revise DBMS, OOP and OS basics, and be ready to explain every line of your final-year project. Do at least 3 mock interviews before placements.",
        answeredBy: ramesh._id,
        answeredAt: new Date(),
      },
      {
        studentId: shraddha._id,
        question: "Should I do M.Sc. Data Science or start working after BCA?",
        category: "Higher Studies",
        answer:
          "If you enjoy maths and statistics, an M.Sc. gives a strong base. Otherwise, join as a data analyst, build experience, and study part-time. Both paths work - build Python and SQL projects either way.",
        answeredBy: priya._id,
        answeredAt: new Date(),
      },
      {
        studentId: samskruti._id,
        question: "What projects should I put on my resume to get a frontend developer job?",
        category: "Resume",
      },
      {
        studentId: shreya._id,
        question: "Which certification is best to start a career in cyber security?",
        category: "Cyber Security",
      },
      {
        studentId: sinchana._id,
        question: "Is AWS Cloud Practitioner enough to get a fresher cloud job?",
        category: "Cloud",
      },
    ]);

    console.log("Demo data created successfully!");
    console.log("Admin   : admin@careerconnect.com / admin123");
    console.log("Student : keerthi@student.com / student123");
    console.log("Mentor  : ramesh@mentor.com / mentor123");
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
