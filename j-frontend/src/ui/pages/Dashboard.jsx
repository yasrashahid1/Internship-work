import { api } from "../../services/api";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { logoutUser } from "../../features/authmodule/actions";
import { selectAuthDisplayName } from "../../features/authmodule/selectors";
import { bulkUploadTickets } from "../../features/tickets/actions";

import {
  fetchTickets,
  updateTicket,            
  selectTickets,
  selectTicketsStatus,
} from "../../features/tickets";

import CreateTicketModal from "../components/createTicket";
import "./dashboard.css";

const STATUSES = ["todo", "in_progress", "review", "done"];

export default function Board()
 {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const name   = useSelector(selectAuthDisplayName) ?? "User";
  const tickets = useSelector(selectTickets) || [];
  const status  = useSelector(selectTicketsStatus) || "idle";

  const [openCreate, setOpenCreate] = useState(false);

  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(fetchTickets(""));  
  }, [dispatch]);

  function handleSearch(e) 
  {
    const value = e.target.value;
    setQuery(value);
    dispatch(fetchTickets(value));
    }

  async function handleLogout()
   {
    await dispatch(logoutUser());
    nav("/login", { replace: true });
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
  
    try {
      await dispatch(bulkUploadTickets(file));
      alert("File uploaded successfully ");
      dispatch(fetchTickets());
    } catch (err) {
      alert("Upload failed ");
      console.error(err);
    }
  }
  
  
  const grouped = useMemo(() => {
    const map = Object.fromEntries(STATUSES.map((s) => [s, []]));
    for (const t of tickets) {
      const s = t?.status || "todo";
      (map[s] ?? map["todo"]).push(t);
    }
    return map;
  }, [tickets]);

  
  async function onDragEnd(result) {
    const { destination, source, draggableId } = result || {};
    if (!destination || !source) return;

    const from = source.droppableId;
    const to   = destination.droppableId;
    if (from === to && destination.index === source.index) return;

    const idNum = Number(draggableId);
    if (!Number.isFinite(idNum)) return;

    try {
      await dispatch(updateTicket({ id: idNum, data: { status: to } }));
    } catch (e) {
      console.error("Failed to move ticket", e);
    }
  }

 
  const markDone = (id) => async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await dispatch(updateTicket({ id, data: { status: "done" } }));
    } catch (err) {
      console.error("Failed to complete ticket", err);
    }
  };

  return (
    <div className="jb-root">
      <aside className="jb-sidebar">
        <div className="jb-team">
          <div className="jb-avatar" aria-hidden />
          <div>
            <div className="jb-team-name">jiraclone</div>
            <div className="jb-team-sub">Software project</div>
          </div>
        </div>

       <nav className="jb-nav">
          <SidebarLink to="/backlog"   label="Backlog" />
          <SidebarLink to="/dashboard" label="Board" active />
          <SidebarLink to="/reports"   label="Reports" />
          <SidebarLink to="/releases"  label="Releases" />
          <SidebarLink to="/components" label="Components" />
          <SidebarLink to="/issues"    label="Issues" />
          <SidebarLink to="/repository" label="Repository" />
          <SidebarLink to="/add-item"  label="Add item" />
          <SidebarLink to="/settings"  label="Settings" />

        </nav>   

        <div className="jb-user">
          <div className="jb-avatar sm" aria-hidden />
          <div>
            <div className="jb-user-name">{name}</div>
            <div className="jb-user-email">Signed in</div>
          </div>
          <button className="jb-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="jb-main">

      <header className="jb-top">
  <div className="jb-left">
    <h1>Tickets Board</h1>
    <div className="jb-search-wrap">
      <input
        className="jb-search"
        placeholder="Search tickets..."
        value={query}
        onChange={handleSearch}
      />
    </div>

    <label className="jb-btn upload" style={{ marginLeft: "10px", cursor: "pointer" }}>
        Upload Tickets from a file
        <input
          type="file"
          accept=".xlsx,.csv"
          onChange={handleFileUpload}
          style={{ display: "none" }} 
        />
      </label>
    </div>

  <div className="jb-right">
    <button className="jb-btn create" onClick={() => setOpenCreate(true)}>
      Create Ticket
    </button>
  </div>
</header>


        {status === "loading" ? (
          <div style={{ padding: 25 }}>Loading…</div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <section className="jb-columns">
              {STATUSES.map((statusKey) => (
                <Droppable droppableId={statusKey} key={statusKey}>
                  {(provided) => (
                    <div className="jb-col" ref={provided.innerRef} {...provided.droppableProps}>
                      <div className="jb-col-head">
                        <span className="jb-col-title">
                          {pretty(statusKey)}{" "}
                          <span className="jb-count">{(grouped[statusKey] || []).length}</span>
                        </span>
                        <button className="jb-col-menu" aria-label="Column actions">⋯</button>
                      </div>

                      <div className="jb-col-body">
                        {(grouped[statusKey] || []).map((t, index) => (
                          <Draggable 
                          key={t.id || `temp-${index}`} 
                          draggableId={String(t.id || `temp-${index}`)} 
                          index={index}
                        >                        
                            {(drag) => (
                              <Link
                                to={`/cards/${t.id}`}
                                className="jb-card"
                                ref={drag.innerRef}
                                {...drag.draggableProps}
                                {...drag.dragHandleProps}
                                style={{ ...drag.draggableProps.style }}
                              >
                             
                                <div className="jb-label-row">
                                  <span className="jb-chip">{truncate(t?.title || "Untitled", 28)}</span>
                                </div>

                              
                                <p className="jb-card-title" style={{ marginTop: 6 }}>
                                  {truncate(t?.description || "—", 140)}
                                </p>


                                <div className="jb-card-meta">
                                  <div className="jb-id">{t?.key ?? `JCT-${t?.id}`}</div>
                                  {t?.status !== "done" && (
                                    <button
                                      className="jb-btn tiny"
                                      onClick={markDone(t.id)}
                                      title="Mark complete"
                                    >
                                      Complete
                                    </button>
                                  )}
                                </div>
                              </Link>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </section>
          </DragDropContext>
        )}
      </main>

      {openCreate && <CreateTicketModal onClose={() => setOpenCreate(false)} />}
    </div>
  );
}

function SidebarLink({ to, label, active }) {
  return (
    <Link to={to} className={`jb-nav-link ${active ? "active" : ""}`}>
      {label}
    </Link>
  );
}

function pretty(s) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

function truncate(s, n) {
  s = s || "";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
