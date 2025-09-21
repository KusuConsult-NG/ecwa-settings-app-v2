export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <section id="home" className="card hero">
      <div className="container">
        <h1 style={{fontSize:"2.2rem",margin:".25rem 0"}}>Comprehensive Church Management System</h1>
        <p className="muted">Financial management, member tracking, event planning, and administration—all in one integrated platform.</p>
        <div style={{marginTop:"1rem",display:"flex",gap:".5rem",justifyContent:"center"}}>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className="btn primary" href="/signup-final">Get Started</a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className="btn secondary" href="/login-final">Log In</a>
        </div>
        <div style={{marginTop:"2rem"}} className="grid cols-3">
          <div className="card" style={{padding:"1rem"}}><small className="muted">Transparency</small><h3>Financial Tracking</h3><div className="muted">Complete offering and expense management</div></div>
          <div className="card" style={{padding:"1rem"}}><small className="muted">Efficiency</small><h3>Member Management</h3><div className="muted">Organized member database and communication</div></div>
          <div className="card" style={{padding:"1rem"}}><small className="muted">Growth</small><h3>Event Planning</h3><div className="muted">Schedule services and track attendance</div></div>
        </div>
      </div>
    </section>
  )
}