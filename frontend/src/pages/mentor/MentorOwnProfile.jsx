// pages/mentor/MentorOwnProfile.jsx
// Shows the mentor's profile exactly as students see it.
import { useAuth } from "../../context/AuthContext.jsx";
import MentorProfile from "../student/MentorProfile.jsx";

export default function MentorOwnProfile() {
  const { user } = useAuth();
  return <MentorProfile mentorId={user._id} />;
}
