export default function Page({ title })
 {
    return (
      <div style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0 }}>{title}</h2>
        <p className="muted">Content goes here…</p>
      </div>
    );
  }
  