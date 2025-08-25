import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../services/api";

export default function CardDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("idle");   
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      setStatus("loading");
      setError("");
      try {
        const { data } = await api.get(`tickets/${id}/`); 
        if (alive) {
          setTicket(data);
          setStatus("succeeded");
        }
      } catch (e) {
        if (alive) {
          setStatus("failed");
          setError(
            e?.response?.data
              ? JSON.stringify(e.response.data)
              : "Failed to load ticket"
          );
        }
      }
    }

    if (id) load();
    return () => { alive = false; };
  }, [id]);

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <Link to="/dashboard" style={{ textDecoration: "none" }}>← Back to Board</Link>

      <h2 style={{ marginTop: 16, marginBottom: 8 }}>
        {ticket ? `Ticket #${ticket.id}` : `Ticket #${id}`}
      </h2>

      {status === "loading" && <p className="muted">Loading…</p>}
      {status === "failed" && (
        <div className="error" role="alert">{error}</div>
      )}

      {ticket && (
        <div className="card" style={{ padding: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <div className="label">Title</div>
            <div>{ticket.title}</div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div className="label">Description</div>
            <div style={{ whiteSpace: "pre-wrap" }}>
              {ticket.description || "—"}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div className="label">Status</div>
              <div>{prettyStatus(ticket.status)}</div>
            </div>
            <div>
              <div className="label">Reporter</div>
              <div>{ticket.reporter ?? "—"}</div>
            </div>
            <div>
              <div className="label">Assignee</div>
              <div>{ticket.assignee ?? "—"}</div>
            </div>
            <div>
              <div className="label">Created</div>
              <div>{formatDate(ticket.created_at)}</div>
            </div>
            <div>
              <div className="label">Updated</div>
              <div>{formatDate(ticket.updated_at)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function prettyStatus(s) {
  switch (s) {
    case "todo": return "To Do";
    case "in_progress": return "In Progress";
    case "review": return "In Review";
    case "done": return "Done";
    default: return s || " ";
  }
}

function formatDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}
