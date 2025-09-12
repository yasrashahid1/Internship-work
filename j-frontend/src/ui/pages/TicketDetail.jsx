import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { api } from "../../services/api";
import "./TicketDetail.css";
import { updateTicket, deleteTicket } from "../../features/tickets/actions";

export default function TicketDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const dispatch = useDispatch();

  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);


  const [newComment, setNewComment] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setStatus("loading");
      try {
        const { data } = await api.get(`tickets/${id}/`);
        if (alive) {
          setTicket(data);
          setStatus("succeeded");
        }
      } catch (e) {
        if (alive) {
          setStatus("failed");
          setError("Failed to load ticket");
        }
      }
    })();
    return () => { alive = false; };
  }, [id]);

  async function markComplete() {
    if (!ticket || ticket.status === "done") return;
    setSaving(true);
    try {
      const updated = await dispatch(
        updateTicket({ id: ticket.id, data: { status: "done" } })
      ).unwrap();
      setTicket(updated); 
      alert(" Ticket completed");
    } catch {
      alert(" Failed to complete ticket");
    } finally {
      setSaving(false);
    }
  }


  async function handleDelete() {
    if (!ticket) return;
    if (!confirm("Delete this ticket? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await dispatch(deleteTicket(ticket.id)).unwrap();
      nav("/dashboard", { replace: true });
    } catch {
      alert("Failed to delete ticket");
      setDeleting(false);
    }
  }

  async function handleAddComment(e) {
    e.preventDefault();
    if (!newComment.trim()) return;
    setAdding(true);
    try {
      const { data } = await api.post(`tickets/${id}/comment/`, { text: newComment });
      setTicket((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), data],
      }));
      setNewComment("");
    } catch (err) {
      alert("Failed to add comment");
      console.error(err);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="ticket-container">
      <Link to="/dashboard" className="ticket-back">
        ← Back to Board
      </Link>
  
      {status === "loading" && <p>Loading…</p>}
      {status === "failed" && <div style={{ color: "red", fontWeight: 500 }}>{error}</div>}
  
      {ticket && (
        <div className="ticket-card">
         
          <div className="ticket-header">
            <h2 className="ticket-title">
              {ticket.title || "Untitled"}{" "}
              <span className="ticket-id">#{ticket.id}</span>
            </h2>
            <span className={`ticket-status ${ticket.status}`}>
              {prettyStatus(ticket.status)}
            </span>
          </div>
  
          
          <p className="ticket-description">
            {ticket.description || "No description provided."}
          </p>

          {/* 🔹 Tags Section */}
{ticket.tags?.length > 0 && (
  <div className="ticket-tags" style={{ margin: "12px 0", display: "flex", flexWrap: "wrap", gap: "6px" }}>
    {ticket.tags.map((tag) => (
      <span
        key={tag.id}
        className="ticket-tag"
        style={{
          background: "yellow",
          color: "blue",
          fontSize: "13px",
          padding: "3px 8px",
          borderRadius: "14px",
          fontWeight: 500,
        }}
      >
        {tag.name}
      </span>
    ))}
  </div>
)}

  
        
          <div className="ticket-grid">
            <Item label="Priority" value={prettyPriority(ticket.priority)} />
            <Item label="Reporter" value={ticket.reporter ?? "—"} />
            <Item label="Assignee" value={ticket.assignee ?? "—"} />
            <Item label="Created" value={fmt(ticket.created_at)} />
            <Item label="Updated" value={fmt(ticket.updated_at)} />
          </div>
  
         
          <div className="ticket-actions">
            <button
              className={`btn ${ticket.status === "done" ? "btn-success" : "btn-primary"}`}
              onClick={markComplete}
              disabled={saving || ticket.status === "done"}
            >
              {ticket.status === "done"
                ? "Completed ✓"
                : saving
                ? "Completing…"
                : "Mark Complete"}
            </button>
  
            <button
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>

          <div className="ticket-comments">
            <h3>Comments</h3>
            {ticket.comments?.length > 0 ? (
              <ul>
                {ticket.comments.map((c) => (
                  <li key={c.id}>
                    <strong>{c.user.username}:</strong> {c.text}{" "}
                    <em>({fmt(c.created_at)})</em>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No comments yet.</p>
            )}

            <form onSubmit={handleAddComment} style={{ marginTop: "12px" }}>
              <textarea
                className="input"
                rows={2}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
              />
              <button className="btn btn-primary mt-8" disabled={adding}>
                {adding ? "Adding…" : "Add Comment"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


function Item({ label, value }) {
  return (
    <div>
      <div className="ticket-label">{label}</div>
      <div className="ticket-value">{value}</div>
    </div>
  );
}

function fmt(iso) {
  return iso ? new Date(iso).toLocaleString() : "—";
}

function prettyStatus(s) {
  switch (s) {
    case "in_progress": return "In Progress";
    case "todo": return "To Do";
    case "review": return "In Review";
    case "done": return "Done";
    default: return s || "—";
  }
}

function prettyPriority(p) {
  switch (p) {
    case "high": return "High";
    case "medium": return "Medium";
    case "low": return "Low";
    default: return p || "—";
  }
}


