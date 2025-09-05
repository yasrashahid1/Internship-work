import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTicket, selectTicketCreating, selectTicketCreateError } from "../../features/tickets";
import { api } from "../../services/api";


export default function CreateTicketModal({ onClose }) {
  const dispatch = useDispatch();
  const creating = useSelector(selectTicketCreating);
  const createError = useSelector(selectTicketCreateError);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [assigneeId, setAssigneeId] = useState("");   
  const [users, setUsers] = useState([]); 


  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data } = await api.get("users/"); 
        setUsers(data);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    }
    fetchUsers();
  }, []);

  async function submit(e) {
    e.preventDefault();
    if (!title.trim() || creating === "loading") return;

    const res = await dispatch(
      createTicket({ title: title.trim(), description, status, priority, assignee_id: assigneeId || null, })
    );

    if (createTicket.fulfilled.match(res)) onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0 }}>Create ticket</h2>

        
        <form onSubmit={submit}>
          <label className="lbl">Title</label>
          <input
            className="input mt-8"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder=" "
            required
          />

          <label className="lbl mt-12">Description</label>
          <textarea
            className="input mt-8"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add Details "
          />

          <label className="lbl mt-12">Status</label>
          <select
            className="input mt-8"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">In Review</option>
            <option value="done">Done</option>
          </select>

           <label className="lbl mt-12">Priority</label>
          <select
            className="input mt-8"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <label className="lbl mt-12">Assign To</label>
          <select
            className="input mt-8"
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>

          {createError && (
            <div className="error mt-12">{String(createError)}</div>
          )}

          <div className="mt-16" 
          style={{ display: "flex", justifyContent:"space-between", alignItems:"center" }}>
            <button className="btn btn-primary" disabled={creating === "loading"}>
              {creating === "loading" ? "Creating…" : "Create"}
              </button>
              <button
              type="button"
              className="btn btn-danger"
              onClick={onClose}
              >
              Close
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
