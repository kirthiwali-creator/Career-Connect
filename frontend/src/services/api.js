// ------------------------------------------------------------
// services/api.js
// ALL communication with the backend happens here.
// We use the browser's built-in fetch() to call our REST API.
// The JWT token is sent in the "Authorization" header.
// ------------------------------------------------------------

// "/api" works through the Vite proxy (see vite.config.js)
const BASE_URL = import.meta.env.VITE_API_URL || "/api";

// Generic helper used by every API call below
async function request(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem("cc_token");

  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(BASE_URL + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Is the backend running on port 5000?");
  }

  // Read the JSON sent by Express (may be empty on some errors)
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Token expired -> log out automatically
    if (response.status === 401 && token) {
      localStorage.removeItem("cc_token");
      localStorage.removeItem("cc_user");
      window.dispatchEvent(new Event("cc-logout")); // AuthContext listens for this
    }
    throw new Error(data.message || `Request failed (${response.status})`);
  }
  return data;
}

// Builds "?search=react&skill=Java" from an object, skipping empty values
function toQuery(params = {}) {
  const clean = Object.entries(params).filter(([, v]) => v !== "" && v !== undefined && v !== null);
  return clean.length ? "?" + new URLSearchParams(clean).toString() : "";
}

// ---------------- Auth ----------------
export const authAPI = {
  register: (data) => request("/auth/register", { method: "POST", body: data }),
  login: (data) => request("/auth/login", { method: "POST", body: data }),
  me: () => request("/auth/me"),
};

// ---------------- Users ----------------
export const userAPI = {
  getAll: (role) => request("/users" + toQuery({ role })),
  getById: (id) => request(`/users/${id}`),
  update: (id, data) => request(`/users/${id}`, { method: "PUT", body: data }),
  remove: (id) => request(`/users/${id}`, { method: "DELETE" }),
  stats: () => request("/users/admin/stats"),
};

// ---------------- Mentors ----------------
export const mentorAPI = {
  getAll: (params) => request("/mentors" + toQuery(params)),
  getById: (id) => request(`/mentors/${id}`),
  filters: () => request("/mentors/filters"),
};

// ---------------- Connections ----------------
export const connectionAPI = {
  send: (mentorId, message) => request("/connections", { method: "POST", body: { mentorId, message } }),
  getAll: () => request("/connections"),
  forStudent: (studentId) => request(`/connections/student/${studentId}`),
  forMentor: (mentorId) => request(`/connections/mentor/${mentorId}`),
  updateStatus: (id, status) => request(`/connections/${id}`, { method: "PUT", body: { status } }),
  remove: (id) => request(`/connections/${id}`, { method: "DELETE" }),
};

// ---------------- Questions ----------------
export const questionAPI = {
  ask: (data) => request("/questions", { method: "POST", body: data }),
  getAll: (params) => request("/questions" + toQuery(params)),
  getById: (id) => request(`/questions/${id}`),
  forStudent: (studentId) => request(`/questions/student/${studentId}`),
  answer: (id, answer) => request(`/questions/${id}/answer`, { method: "PUT", body: { answer } }),
  remove: (id) => request(`/questions/${id}`, { method: "DELETE" }),
  categories: () => request("/questions/categories"),
};
