import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/authmodule/actions";
import { selectAuthDisplayName } from "../../features/authmodule/selectors";
import {
  fetchTickets,
  selectTickets,
  selectTicketsStatus,
} from "../../features/tickets";
import CreateTicketModal from "../components/createTicket";
import "./dashboard.css";

const STATUSES = ["todo", "in_progress", "review", "done"];

export default function Board() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const name = useSelector(selectAuthDisplayName) ?? "User";


  const tickets = useSelector(selectTickets);
  const status = useSelector(selectTicketsStatus);

  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  async function handleLogout() {
    await dispatch(logoutUser());
    nav("/login", { replace: true });
  }

  const grouped = useMemo(() => {
    const map = Object.fromEntries(STATUSES.map(s => [s, []]));
    for (const t of tickets) {
      const s = t.status || "todo";
      (map[s] ?? map["todo"]).push(t);
    }
    return map;
  }, [tickets]);

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
          <SidebarLink to="/backlog" label="Backlog" />
          <SidebarLink to="/dashboard" label="Board" active />
          <SidebarLink to="/reports" label="Reports" />
          <SidebarLink to="/releases" label="Releases" />
          <SidebarLink to="/components" label="Components" />
          <SidebarLink to="/issues" label="Issues" />
          <SidebarLink to="/repository" label="Repository" />
          <SidebarLink to="/add-item" label="Add item" />
          <SidebarLink to="/settings" label="Settings" />
        </nav>

        <div className="jb-user">
          <div className="jb-avatar sm" aria-hidden />
          <div>
            <div className="jb-user-name">{name}</div>
            <div className="jb-user-email">Signed in</div>
          </div>
          <button className="jb-logout" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      
      <main className="jb-main">
        <header className="jb-top">
          <h1>Tickets Board</h1>
          <div className="jb-actions">
            <div className="jb-search-wrap">
              <input className="jb-search" placeholder="Search" />
            </div>
          {/*  <button className="jb-btn">Quick Filters</button> */}
            <button className="jb-btn create" onClick={() => setOpenCreate(true)}>
              Create Ticket
            </button>
          </div>
        </header>

        {status === "loading" ? (
          <div style={{ padding: 25 }}>Loading…</div>
        ) : (
          <section className="jb-columns">
            {STATUSES.map((statusKey) => (
              <div className="jb-col" key={statusKey}>
                <div className="jb-col-head">
                  <span className="jb-col-title">
                    {pretty(statusKey)}{" " }
                    <span className="jb-count">{grouped[statusKey].length}</span>
                  </span>
                  <button className="jb-col-menu" aria-label="Column actions">⋯</button>
                </div>

                <div className="jb-col-body">
                  {grouped[statusKey].map((t) => (
                    <Link to={`/cards/${t.id}`} key={t.id} className="jb-card">
                      <div className="jb-label-row">
                        <span className="jb-chip" />
                        <span className="jb-chip neutral" />
                      </div>
                      <p className="jb-card-title">{t.title}</p>
                      <div className="jb-card-meta">
                        <div className="jb-id">{t.key ?? `Ticket-${t.id}`}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      {openCreate && (
        <CreateTicketModal onClose={() => setOpenCreate(false)} />
      )}
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
