// ------------------------------------------------------------
// App.jsx - all page routes of Career Connect (React Router)
// Public pages     : anyone can open
// Protected pages  : need login (and the right role)
// ------------------------------------------------------------
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";

// Public pages
import Home from "./pages/public/Home.jsx";
import About from "./pages/public/About.jsx";
import Login from "./pages/public/Login.jsx";
import Register from "./pages/public/Register.jsx";
import NotFound from "./pages/public/NotFound.jsx";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import MentorDirectory from "./pages/student/MentorDirectory.jsx";
import MentorProfile from "./pages/student/MentorProfile.jsx";
import MyConnections from "./pages/student/MyConnections.jsx";
import ConnectionRequests from "./pages/student/ConnectionRequests.jsx";
import QuestionsForum from "./pages/student/QuestionsForum.jsx";
import AskQuestion from "./pages/student/AskQuestion.jsx";
import MyProfile from "./pages/student/MyProfile.jsx";

// Mentor pages
import MentorDashboard from "./pages/mentor/MentorDashboard.jsx";
import MentorOwnProfile from "./pages/mentor/MentorOwnProfile.jsx";
import StudentRequests from "./pages/mentor/StudentRequests.jsx";
import ConnectedStudents from "./pages/mentor/ConnectedStudents.jsx";
import MentorQuestions from "./pages/mentor/MentorQuestions.jsx";
import AnswerQuestion from "./pages/mentor/AnswerQuestion.jsx";
import EditProfile from "./pages/mentor/EditProfile.jsx";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageUsers from "./pages/admin/ManageUsers.jsx";
import ManageQuestions from "./pages/admin/ManageQuestions.jsx";
import ManageConnections from "./pages/admin/ManageConnections.jsx";

// Small helper so each protected route stays on one line
const only = (roles, page) => <ProtectedRoute roles={roles}>{page}</ProtectedRoute>;

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* ---------- Public ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ---------- Logged-in pages (with sidebar) ---------- */}
        <Route element={only(null, <DashboardLayout />)}>
          {/* Student */}
          <Route path="/student-dashboard" element={only(["student"], <StudentDashboard />)} />
          <Route path="/mentors" element={only(["student"], <MentorDirectory />)} />
          <Route path="/connections" element={only(["student"], <MyConnections />)} />
          <Route path="/connection-requests" element={only(["student"], <ConnectionRequests />)} />
          <Route path="/ask-question" element={only(["student"], <AskQuestion />)} />
          <Route path="/profile" element={only(["student"], <MyProfile />)} />

          {/* Shared: any logged-in user */}
          <Route path="/mentor/:id" element={<MentorProfile />} />
          <Route path="/questions" element={<QuestionsForum />} />

          {/* Mentor */}
          <Route path="/mentor-dashboard" element={only(["mentor"], <MentorDashboard />)} />
          <Route path="/my-mentor-profile" element={only(["mentor"], <MentorOwnProfile />)} />
          <Route path="/requests" element={only(["mentor"], <StudentRequests />)} />
          <Route path="/connected-students" element={only(["mentor"], <ConnectedStudents />)} />
          <Route path="/mentor-questions" element={only(["mentor"], <MentorQuestions />)} />
          <Route path="/answer/:id" element={only(["mentor"], <AnswerQuestion />)} />
          <Route path="/edit-profile" element={only(["mentor"], <EditProfile />)} />

          {/* Admin */}
          <Route path="/admin-dashboard" element={only(["admin"], <AdminDashboard />)} />
          <Route path="/admin/users" element={only(["admin"], <ManageUsers />)} />
          <Route path="/admin/questions" element={only(["admin"], <ManageQuestions />)} />
          <Route path="/admin/connections" element={only(["admin"], <ManageConnections />)} />
        </Route>

        {/* ---------- 404 ---------- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
