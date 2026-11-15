# Career Connect: Viva Notes

Short answers you can say in your own words, each with the file to show the examiner.

---

### 1. What is Career Connect?
Career Connect is a MERN-stack web application for career guidance and mentorship. BCA students and freshers can find experienced IT professionals (mentors), send them connection requests, ask career questions and receive answers. It is **not a job portal**: it gives guidance, not job listings.

### 2. Why did we create it?
Many students, especially in smaller cities like Hubli, do not personally know anyone working in the IT industry. When they have doubts about placements, interviews, resumes, certifications or higher studies, they depend on random videos and friends. We wanted one place where students can get guidance from real professionals.

### 3. What problem does it solve?
- **Lack of access to mentors.** Students can search mentors by skill, company, job role and domain.
- **Unorganised guidance.** Questions are organised by category (Placement, Interview, Resume, Higher Studies, Cloud, AI...) and answers are saved for everyone to read.
- **Trust and safety.** Mentors choose whom to accept, and an admin can remove fake users or inappropriate questions.

### 4. What technologies are used?
| Layer | Technology | Role in the project |
|-------|-----------|---------------------|
| Frontend | React.js + Vite | User interface (pages, forms, cards) |
| Routing | React Router | Moving between pages without reloading |
| Backend | Node.js + Express.js | REST API server |
| Database | MongoDB + Mongoose | Stores users, connections, questions |
| Security | bcrypt, JWT | Password hashing, login tokens |
| Styling | Plain CSS | Blue/white responsive design |

### 5. What is React?
React is a JavaScript library by Meta for building user interfaces from **components**, which are small reusable pieces like `MentorCard`, `Navbar` and `StatCard`. Each component keeps its data in **state** (`useState`). When state changes, React updates only that part of the page. We use **Vite** as the build tool because it starts fast and reloads instantly during development.
*Show:* `frontend/src/components/MentorCard.jsx`

### 6. What is Node.js?
Node.js lets us run JavaScript **outside the browser**, on the server. It is built on Chrome's V8 engine and is non-blocking, so it handles many requests efficiently. We use it to run our backend.

### 7. What is Express.js?
Express is a small framework for Node.js that makes building web servers and APIs easy. It gives us:
- **Routing**: `router.post("/login", login)` connects a URL to a function
- **Middleware**: functions that run before the main logic, like `express.json()` (reads the request body), `protect` (checks the login) and `authorize` (checks the role)
*Show:* `backend/server.js`, `backend/routes/connectionRoutes.js`

### 8. What is MongoDB?
MongoDB is a **NoSQL, document-based** database. Data is stored as JSON-like documents inside **collections**, not as rows in tables. We have three collections: `users`, `connections`, `questions`.
**Mongoose** is a library that lets us define a **schema** (the structure, types and validation) for each collection, and gives easy functions like `find()`, `create()` and `findById()`.
*Show:* `backend/models/User.js`

### 9. What is a REST API?
REST (Representational State Transfer) is a way of designing APIs in which each **URL is a resource** and the **HTTP method says the action**:
| Method | Action | Example |
|--------|--------|---------|
| GET | Read | `GET /api/mentors` |
| POST | Create | `POST /api/connections` |
| PUT | Update | `PUT /api/connections/:id` |
| DELETE | Delete | `DELETE /api/questions/:id` |
Data is exchanged as **JSON**, and every request is independent (stateless). The token is sent with each request.

### 10. How does the frontend communicate with the backend?
1. A React page calls a function in `frontend/src/services/api.js`, for example `connectionAPI.send(mentorId)`.
2. That function uses the browser's `fetch()` to send an HTTP request to `/api/connections` with a JSON body and the header `Authorization: Bearer <token>`.
3. During development, Vite's **proxy** forwards `/api/...` to the Express server on port 5000 (`vite.config.js`).
4. Express runs the route, its middleware and the controller. The controller reads or writes MongoDB through Mongoose.
5. Express sends back JSON, React stores it in state, and the page re-renders.
```
React page → api.js (fetch) → Express route → middleware → controller → Mongoose → MongoDB
          ←────────────────────────── JSON response ←──────────────────────────────
```

### 11. How does login work?
**Register:** the password is hashed with `bcrypt.hash(password, 10)` and only the hash is saved in MongoDB, never the plain password.
**Login:**
1. The user enters an email and password, and the frontend sends `POST /api/auth/login`.
2. The backend finds the user by email and checks `bcrypt.compare(typedPassword, savedHash)`.
3. If they match, the backend creates a **JWT (JSON Web Token)** with `jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "7d" })`.
4. The frontend saves the token in `localStorage` and puts the user in `AuthContext`.
5. Every later request sends the token. The `protect` middleware runs `jwt.verify()` to find out who the user is, and `authorize("mentor")` checks the role.
6. Logout deletes the token from `localStorage`.
*Show:* `backend/controllers/authController.js`, `backend/middleware/authMiddleware.js`

### 12. How are connection requests stored?
In the `connections` collection. Each document looks like:
```json
{ "studentId": ObjectId, "mentorId": ObjectId, "status": "pending", "message": "...", "createdAt": ..., "updatedAt": ... }
```
- `studentId` and `mentorId` are **references** to the `users` collection. `.populate()` replaces them with the user's name, company and other details.
- `status` can only be `pending`, `accepted` or `rejected` (a Mongoose `enum`).
- A **unique index** on `{ studentId, mentorId }` means one student cannot send two requests to the same mentor, and the controller also checks this before saving.
- Only the mentor whose id matches `mentorId` can change the status.
*Show:* `backend/models/Connection.js`, `backend/controllers/connectionController.js`

### 13. How does CRUD work?
CRUD = Create, Read, Update, Delete. In Career Connect:
| Operation | Example in project | HTTP | Mongoose |
|-----------|--------------------|------|----------|
| **Create** | Register, send request, ask question | POST | `User.create()`, `Connection.create()` |
| **Read** | Mentor directory, my connections, forum | GET | `find()`, `findById()` |
| **Update** | Accept request, answer question, edit profile | PUT | `save()`, `findByIdAndUpdate()` |
| **Delete** | Admin deletes user, student deletes question | DELETE | `deleteOne()`, `deleteMany()` |

### 14. What are the different user roles?
| Role | Can do |
|------|--------|
| **Student** | Register, browse, search and filter mentors, send connection requests, ask questions (open or to a connected mentor), see answers, edit profile |
| **Mentor** | Register, complete profile (job title, company, experience, skills...), accept or reject requests, see connected students, answer questions |
| **Admin** | See platform statistics, view all users, questions and connections, delete inappropriate users and questions, remove connections |
Admins cannot be created from the Register page. The demo admin comes from the seed script.
Roles are checked **twice**: on the frontend by `ProtectedRoute.jsx` (hides pages) and on the backend by `authorize()` (the real security).

---

## Demo script for the practical (about 5 minutes)

1. **Home page**: explain the idea (career guidance, not a job portal).
2. **Register** a new student and show a validation error (wrong email, or passwords that don't match).
3. **Student dashboard**: point out the 4 stat cards, recommended mentors and recent questions.
4. **Find Mentors**: search "react", then filter by *5+ years*.
5. Click **Connect** on Ramesh, write a message and send it. The button changes to **Request Pending**.
6. Open Ramesh's **profile** and click *Ask Question*. A popup says you must be connected first.
7. **Logout**, then log in as **Mentor** (Ramesh). The dashboard shows the new request. Click **Accept**.
8. Log in as the student again. **My Connections** shows Ramesh. Click *Ask Question* and post it.
9. Log in as the mentor. Open **Questions → Asked to me**, click *Answer* and submit.
10. Log in as the student. The **Questions Forum → My Questions** shows the answer.
11. Log in as **Admin**. Show the dashboard numbers, and delete a user or question in **Manage Users** or **Manage Questions**.
12. Optional: open **MongoDB Compass** to show the `users`, `connections` and `questions` collections changing.

## Likely extra questions

- **What is middleware?** A function that runs between the request and the controller, for example `protect` checks the JWT.
- **What is `populate()`?** It replaces a stored ObjectId with the full referenced document, like a JOIN in SQL.
- **Why hash passwords?** If the database leaks, the attacker cannot read the real passwords. bcrypt adds a salt and is slow on purpose.
- **What is CORS?** A browser rule that blocks requests to a different origin (port). The `cors` package allows our React app (port 5173) to call the API (port 5000).
- **What is `.env`?** A file for secrets and settings (DB URL, JWT secret) that are kept out of the code.
- **What is `useEffect`?** A React hook that runs code after the page renders. We use it to load data from the API.
- **What is Context API?** It shares data (the logged-in user) with all components without passing props down manually.
- **SQL vs NoSQL?** SQL uses fixed tables and rows. MongoDB stores flexible JSON documents, which suits different profile fields for students and mentors.
- **What does the HTTP status code mean?** 200 OK, 201 Created, 400 Bad request (validation), 401 Not logged in, 403 Not allowed (wrong role), 404 Not found, 500 Server error.
