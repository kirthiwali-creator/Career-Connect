# Career Connect

A **career guidance and mentorship platform** (not a job portal) where BCA students and freshers find experienced IT professionals, send connection requests, ask career questions and get answers.

**Stack:** React + Vite + React Router (frontend) · Node.js + Express (REST API) · MongoDB + Mongoose (database) · JWT + bcrypt (authentication)

```
Student → finds mentor → sends request (pending) → mentor accepts (accepted)
        → student asks question → mentor answers → student sees the answer
```

---

## 1. Requirements

- **Node.js 18 or newer** (check with `node -v`)
- **MongoDB**: either
  - **MongoDB Community Server** installed locally (runs on `mongodb://127.0.0.1:27017`), or
  - a free **MongoDB Atlas** cluster (cloud)

## 2. Install dependencies

From the `career-connect` folder:

```bash
cd backend
npm install

cd ../frontend
npm install
```

(Or run `npm run install-all` from the `career-connect` folder.)

## 3. Configure MongoDB and the `.env` file

In the `backend` folder, copy `.env.example` to `.env`:

```bash
cd backend
copy .env.example .env      # Windows
cp .env.example .env        # Mac / Linux
```

`.env` variables:

| Variable     | Example                                         | Meaning                               |
|--------------|-------------------------------------------------|---------------------------------------|
| `PORT`       | `5000`                                          | Port for the Express server           |
| `MONGO_URI`  | `mongodb://127.0.0.1:27017/career_connect`      | MongoDB connection string             |
| `JWT_SECRET` | `career_connect_secret_key_change_me`           | Secret used to sign login tokens      |
| `CLIENT_URL` | `http://localhost:5173`                         | React app URL (allowed by CORS)       |

**Local MongoDB:** keep `MONGO_URI=mongodb://127.0.0.1:27017/career_connect`. The `career_connect` database is created automatically.

**MongoDB Atlas:** create a free cluster → *Database Access* → add a user → *Network Access* → allow your IP → *Connect → Drivers* → copy the string and add the database name:
`MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/career_connect`

The frontend needs no `.env`. Vite forwards every `/api` request to `http://localhost:5000` (see `frontend/vite.config.js`).

## 4. Load demo data

```bash
cd backend
npm run seed
```

This **clears** the users, connections and questions collections and adds the demo data.

## 5. Start the backend (terminal 1)

```bash
cd backend
npm run dev        # auto-restarts on changes (nodemon)
# or: npm start
```

You should see:
```
MongoDB connected: 127.0.0.1/career_connect
Server running on http://localhost:5000
```

## 6. Start the frontend (terminal 2)

```bash
cd frontend
npm run dev
```

Open **http://localhost:5173**

## 7. Demo login credentials

| Role    | Email                     | Password     |
|---------|---------------------------|--------------|
| Admin   | admin@careerconnect.com   | admin123     |
| Student | keerthi@student.com       | student123   |
| Student | shraddha@student.com      | student123   |
| Student | samskruti@student.com     | student123   |
| Student | shreya@student.com        | student123   |
| Student | sinchana@student.com      | student123   |
| Mentor  | ramesh@mentor.com         | mentor123    |
| Mentor  | suresh@mentor.com         | mentor123    |
| Mentor  | priya@mentor.com          | mentor123    |
| Mentor  | nayana@mentor.com         | mentor123    |
| Mentor  | vani@mentor.com           | mentor123    |

The login page also has **Student / Mentor / Admin** buttons that fill these in for you.

Demo state after seeding: Keerthi is connected to Ramesh and has a pending request to Vani. Shraddha is connected to Priya. Samskruti and Shreya have pending requests. Sinchana's request to Suresh was rejected. Five questions exist, and two are answered.

---

## 8. Main features

**Student**
- Register / login / logout
- Dashboard: Total Mentors, Pending Requests, Accepted Connections, Questions Asked, Recommended Mentors (matched on skills), Recent Questions
- Mentor Directory: search by name, skill, job role or company; filter by skill, experience and domain
- Mentor Profile: about, education, skills, career journey, areas of guidance, Connect and Ask Question buttons
- Connect with a message (popup); status goes **pending → accepted / rejected**
- Connection Requests page (track and cancel) and My Connections page
- Ask Question: to the open forum (any mentor can answer) or directly to a connected mentor
- Questions Forum: search and filter by category or status; view answers; delete own questions
- My Profile: view and edit

**Mentor**
- Dashboard: pending requests (accept or reject on the page), connected students, questions waiting, answers given
- Student Requests (accept or reject), Connected Students
- Questions page with tabs: *Asked to me*, *Open questions*, *Answered by me*
- Answer Question and Edit Answer
- Edit Profile: job title, company, experience, domain, skills, education, bio, career journey, areas of guidance

**Admin**
- Dashboard with platform statistics
- Manage Users: search, filter by role, delete (also removes that user's requests and questions)
- Manage Questions: delete inappropriate questions
- Manage Connections: view all requests, filter by status, remove

**Validation and security**
- Required fields, valid email, password of at least 6 characters, duplicate email blocked
- Passwords hashed with **bcrypt**; login returns a **JWT** that expires in 7 days
- Duplicate connection requests blocked (in code and by a unique database index)
- Only the mentor who received a request can accept or reject it
- A question asked to one mentor can be answered only by that mentor. Direct questions are allowed only after the mentor accepts the connection
- Role checks on every protected API and every protected page
- Clear success and error messages on every form

---

## 9. REST API

| Method | Endpoint                               | Who            | Purpose                                 |
|--------|----------------------------------------|----------------|-----------------------------------------|
| POST   | `/api/auth/register`                   | Public         | Create account                          |
| POST   | `/api/auth/login`                      | Public         | Login and get JWT                       |
| GET    | `/api/auth/me`                         | Logged in      | Current user                            |
| GET    | `/api/users`                           | Admin          | All users (`?role=student`)             |
| GET    | `/api/users/:id`                       | Logged in      | One user                                |
| PUT    | `/api/users/:id`                       | Self / Admin   | Update profile                          |
| DELETE | `/api/users/:id`                       | Admin          | Delete user                             |
| GET    | `/api/users/admin/stats`               | Admin          | Dashboard numbers                       |
| GET    | `/api/mentors`                         | Public         | List + `?search=&skill=&minExp=&domain=`|
| GET    | `/api/mentors/filters`                 | Public         | Skills and domains for dropdowns        |
| GET    | `/api/mentors/:id`                     | Public         | Mentor profile                          |
| POST   | `/api/connections`                     | Student        | Send request `{ mentorId, message }`    |
| GET    | `/api/connections`                     | Admin          | All requests                            |
| GET    | `/api/connections/student/:studentId`  | Self / Admin   | Student's requests                      |
| GET    | `/api/connections/mentor/:mentorId`    | Self / Admin   | Mentor's received requests              |
| PUT    | `/api/connections/:id`                 | Mentor         | `{ status: "accepted" \| "rejected" }`  |
| DELETE | `/api/connections/:id`                 | Student/Admin  | Cancel or remove                        |
| POST   | `/api/questions`                       | Student        | Ask `{ question, category, mentorId? }` |
| GET    | `/api/questions`                       | Logged in      | Forum `?category=&status=&search=`      |
| GET    | `/api/questions/categories`            | Public         | Category list                           |
| GET    | `/api/questions/student/:studentId`    | Self / Admin   | Student's questions                     |
| GET    | `/api/questions/:id`                   | Logged in      | One question                            |
| PUT    | `/api/questions/:id/answer`            | Mentor         | Answer `{ answer }`                     |
| DELETE | `/api/questions/:id`                   | Owner / Admin  | Delete                                  |

Protected requests send the header `Authorization: Bearer <token>`.

---

## 10. Folder structure

```
career-connect/
├── package.json              helper scripts (install-all, seed, server, client)
├── README.md
├── VIVA_NOTES.md             viva questions and answers
├── backend/
│   ├── server.js             starts Express, connects DB, mounts routes
│   ├── .env.example
│   ├── config/db.js          MongoDB connection (Mongoose)
│   ├── models/               User, Connection, Question schemas
│   ├── controllers/          logic for auth, users, mentors, connections, questions
│   ├── routes/               URL → controller mapping
│   ├── middleware/           JWT check (protect), role check (authorize), errors
│   └── seed/seed.js          demo data
└── frontend/
    ├── index.html
    ├── vite.config.js        dev server + /api proxy
    └── src/
        ├── main.jsx          entry point
        ├── App.jsx           all routes
        ├── index.css         styles (blue/white theme, responsive)
        ├── context/          AuthContext (logged-in user)
        ├── services/         api.js (all fetch calls), format.js (helpers)
        ├── components/       Navbar, Sidebar layout, cards, modal, alerts...
        └── pages/
            ├── public/       Home, About, Login, Register
            ├── student/      Dashboard, Directory, Mentor Profile, Connections, Requests, Forum, Ask, Profile
            ├── mentor/       Dashboard, Profile, Requests, Connected Students, Questions, Answer, Edit Profile
            └── admin/        Dashboard, Users, Questions, Connections
```

## 11. Frontend routes

| Path | Page | Role |
|------|------|------|
| `/` `/about` `/login` `/register` | Public pages | anyone |
| `/student-dashboard` `/mentors` `/connections` `/connection-requests` `/ask-question` `/profile` | Student pages | student |
| `/mentor/:id` `/questions` | Mentor profile, Questions forum | any logged-in user |
| `/mentor-dashboard` `/my-mentor-profile` `/requests` `/connected-students` `/mentor-questions` `/answer/:id` `/edit-profile` | Mentor pages | mentor |
| `/admin-dashboard` `/admin/users` `/admin/questions` `/admin/connections` | Admin pages | admin |

## 12. Troubleshooting

- **"MongoDB connection failed"**: MongoDB is not running, or `MONGO_URI` is wrong. On Windows, start the *MongoDB* service from Services. On Atlas, check the password and allow your IP.
- **"Cannot reach the server" on the website**: the backend is not running on port 5000.
- **"Missing MONGO_URI or JWT_SECRET"**: you have not created `backend/.env`.
- **Login stopped working after re-seeding**: log out and log in again. The old token belongs to a deleted user.
