// ------------------------------------------------------------
// pages/admin/ManageUsers.jsx
// List all users, filter by role, delete (with confirm modal)
// ------------------------------------------------------------
import { useEffect, useState } from "react";
import { userAPI } from "../../services/api.js";
import { formatDate } from "../../services/format.js";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";
import Modal from "../../components/Modal.jsx";

export default function ManageUsers() {
  const [users, setUsers] = useState(null);
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    userAPI
      .getAll(role)
      .then(setUsers)
      .catch((err) => setError(err.message));
  }, [role]);

  const confirmDelete = async () => {
    try {
      const res = await userAPI.remove(toDelete._id);
      setUsers((prev) => prev.filter((u) => u._id !== toDelete._id));
      setSuccess(res.message);
    } catch (err) {
      setError(err.message);
    }
    setToDelete(null);
  };

  if (!users) return error ? <Alert type="error" message={error} /> : <Loader />;

  const text = search.toLowerCase();
  const shown = users.filter(
    (u) => u.name.toLowerCase().includes(text) || u.email.toLowerCase().includes(text)
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Manage Users</h1>
          <p className="muted">Remove fake or inappropriate accounts.</p>
        </div>
      </div>

      <Alert type="error" message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      <div className="card filter-bar">
        <input
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search by name or email"
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All roles</option>
          <option value="student">Students</option>
          <option value="mentor">Mentors</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="table-wrap card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Details</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className="role-tag">{u.role}</span>
                </td>
                <td className="small">
                  {u.role === "mentor" ? `${u.jobTitle || "-"} @ ${u.company || "-"}` : u.education || "-"}
                </td>
                <td>{formatDate(u.createdAt)}</td>
                <td>
                  {u.role !== "admin" && (
                    <button className="btn btn-danger btn-sm" onClick={() => setToDelete(u)}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && <p className="muted center">No users found.</p>}
      </div>

      <Modal
        open={Boolean(toDelete)}
        title="Delete user?"
        onClose={() => setToDelete(null)}
        actions={
          <>
            <button className="btn btn-outline" onClick={() => setToDelete(null)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={confirmDelete}>
              Yes, delete
            </button>
          </>
        }
      >
        <p>
          This will permanently delete <strong>{toDelete?.name}</strong> ({toDelete?.email}) along
          with their connection requests and questions.
        </p>
      </Modal>
    </div>
  );
}
