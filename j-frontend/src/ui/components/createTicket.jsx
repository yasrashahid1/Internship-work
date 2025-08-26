import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTicket, selectTicketCreating, selectTicketCreateError } from "../../features/tickets";


export default function CreateTicketModal({ onClose }) {
  const dispatch = useDispatch();
  const creating = useSelector(selectTicketCreating);
  const createError = useSelector(selectTicketCreateError);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");

  async function submit(e) {
    e.preventDefault();
    if (!title.trim() || creating === "loading") return;

    const res = await dispatch(
      createTicket({ title: title.trim(), description, status, priority })
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

          {createError && (
            <div className="error mt-12">{String(createError)}</div>
          )}

          <div className="mt-16" style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" disabled={creating === "loading"}>
              {creating === "loading" ? "Creating…" : "Create"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
