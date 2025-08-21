import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/authmodule/actions";
import { selectAuthDisplayName } from "../../features/authmodule/selectors";

export default function Dashboard() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const displayName = useSelector(selectAuthDisplayName);

  async function handleLogout() {
    await dispatch(logoutUser());
    nav("/login", { replace: true });
  }

  return (
    <div className="container">
      <div
        className="card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <h2>Welcome, {displayName ?? "User"} 👋</h2>
          <p className="muted">Choose an option below to get started.</p>
        </div>
        <button className="btn btn-ghost" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <Link
          to="/projects"
          className="card"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <h3>Projects</h3>
          <p className="muted">View and manage projects.</p>
        </Link>

        <Link
          to="/tickets"
          className="card"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <h3>Tickets</h3>
          <p className="muted">Track issues and tasks.</p>
        </Link>

        <Link
          to="/profile"
          className="card"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <h3>Profile</h3>
          <p className="muted">Update your details.</p>
        </Link>
      </div>
    </div>
  );
}
