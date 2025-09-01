import { Link } from "react-router-dom";

export default function Home()
 {
  return (
    <div className="container">
      <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
        <h2>Home</h2>
        <p className="muted">Welcome! Please login or register to continue.</p>

        <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
          <Link to="/register" className="btn btn-secondary">
            Register
          </Link>
        </div>
      </div>
    </div>
  ); 
} 
