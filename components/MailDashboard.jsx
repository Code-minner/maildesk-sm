"use client";
import { useState, useEffect, useCallback } from "react";
import styles from "./MailDashboard.module.css";

const TAG_COLORS = {
  Order:   { bg: "#eff6ff", color: "#1d4ed8" },
  Payment: { bg: "#fffbeb", color: "#92400e" },
  Account: { bg: "#ecfdf5", color: "#065f46" },
  Sales:   { bg: "#f5f3ff", color: "#5b21b6" },
  Refund:  { bg: "#fff7ed", color: "#9a3412" },
  Reply:   { bg: "#ecfdf5", color: "#065f46" },
  Sent:    { bg: "#f9fafb", color: "#374151" },
  Inbound: { bg: "#eff6ff", color: "#1d4ed8" },
  Bulk:    { bg: "#fdf4ff", color: "#7e22ce" },
};

const AVATAR_COLORS = [
  { bg: "#dbeafe", color: "#1e40af" },
  { bg: "#dcfce7", color: "#166534" },
  { bg: "#fce7f3", color: "#9d174d" },
  { bg: "#fef9c3", color: "#854d0e" },
  { bg: "#ede9fe", color: "#5b21b6" },
  { bg: "#fee2e2", color: "#991b1b" },
];

const Icons = {
  Inbox: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M1.5 6L7 9.5a2 2 0 002 0L14.5 6" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  ),
  Sent: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M14 2L8.5 13.5a.4.4 0 01-.74-.06L5.9 8.7a.4.4 0 00-.22-.22L1.1 6.54a.4.4 0 01-.06-.74L14 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M14 2L5.9 8.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  Compose: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8.5 2.5H4a1.5 1.5 0 00-1.5 1.5v8A1.5 1.5 0 004 13.5h8A1.5 1.5 0 0013.5 12V7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M10.5 1.5l4 4-5.5 5.5H5.5v-3.5l5-5.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  ),
  Bulk: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1.5 4.5h13M1.5 8h8M1.5 11.5h5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="13" cy="11.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M12 11.5l.8.8 1.4-1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Send: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M12.5 1.5L7 8M12.5 1.5l-4 11-1.5-4.5L2 5l10.5-3.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Back: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Search: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  User: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M2.5 13c0-2.5 2-4 5-4s5 1.5 5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  EmptyInbox: () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 18l15.5 9a5 5 0 005 0L42 18" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1.5 3.5h11M4.5 3.5V2.5A1 1 0 015.5 1.5h3a1 1 0 011 1v1M11.5 3.5l-.8 8.5a1 1 0 01-1 .9H4.3a1 1 0 01-1-.9L2.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Menu: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3 4.5h12M3 9h12M3 13.5h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  Close: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  Warning: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{flexShrink:0,marginTop:1}}>
      <path d="M8 2L14.5 13.5H1.5L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M8 6.5v3M8 11.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
};

function initials(name = "") {
  return name.trim().split(/\s+/).map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";
}

function avatarColor(name = "") {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function MailDashboard() {
  const [view, setView]           = useState("inbox");
  const [emails, setEmails]       = useState([]);
  const [unread, setUnread]       = useState(0);
  const [selected, setSelected]   = useState(null);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);
  const [dbError, setDbError]     = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobilePane, setMobilePane]   = useState("list");

  const [compose, setCompose]             = useState({ to: "", toName: "", subject: "", message: "" });
  const [composeStatus, setComposeStatus] = useState(null);
  const [bulk, setBulk]                   = useState({ recipients: "", subject: "", message: "" });
  const [bulkStatus, setBulkStatus]       = useState(null);
  const [deleteStatus, setDeleteStatus]   = useState(null);

  const [inboxTotal, setInboxTotal] = useState(0);
  const [sentTotal, setSentTotal]   = useState(0);

  const fetchEmails = useCallback(async () => {
    const type = view === "inbox" ? "inbound" : view === "sent" ? "outbound" : null;
    if (!type) return;
    setLoading(true);
    setDbError(null);
    try {
      // Fetch current view emails + both totals in parallel
      const [res, inboxRes, sentRes] = await Promise.all([
        fetch(`/api/emails?type=${type}`),
        fetch("/api/emails?type=inbound"),
        fetch("/api/emails?type=outbound"),
      ]);
      const data       = await res.json();
      const inboxData  = await inboxRes.json();
      const sentData   = await sentRes.json();
      if (!res.ok) throw new Error(data.error || "Failed to load emails");
      setEmails(data.emails || []);
      setUnread(data.unreadCount || 0);
      setInboxTotal(inboxData.emails?.length || 0);
      setSentTotal(sentData.emails?.length || 0);
    } catch (e) {
      setDbError(e.message);
      setEmails([]);
    } finally {
      setLoading(false);
    }
  }, [view]);

  useEffect(() => {
    fetchEmails();
    setSelected(null);
    setMobilePane("list");
  }, [fetchEmails]);

  async function openEmail(email) {
    setSelected(email);
    setReplyText("");
    setReplyStatus(null);
    setMobilePane("read");
    if (email.unread) {
      await fetch(`/api/emails/${email.id}`, { method: "PATCH" });
      setEmails((prev) => prev.map((e) => (e.id === email.id ? { ...e, unread: false } : e)));
      setUnread((n) => Math.max(0, n - 1));
    }
  }

  async function sendReply() {
    if (!replyText.trim() || !selected) return;
    setReplyStatus("sending");
    try {
      const res  = await fetch("/api/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: selected.fromEmail, toName: selected.fromName, subject: selected.subject, message: replyText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReplyStatus(data.warning ? "warning" : "sent");
      setReplyText("");
      // Add the reply to local sent list immediately
      const newEmail = {
        id: data.id || Date.now().toString(),
        type: "outbound",
        fromEmail: "",
        fromName: "",
        toEmail: selected.fromEmail,
        toName: selected.fromName || selected.fromEmail,
        subject: selected.subject.startsWith("Re:") ? selected.subject : `Re: ${selected.subject}`,
        body: replyText,
        tag: "Reply",
        unread: false,
        createdAt: new Date().toISOString(),
      };
      setEmails((prev) => [newEmail, ...prev]);
      setTimeout(() => setReplyStatus(null), 3000);
    } catch {
      setReplyStatus("error");
    }
  }

  async function sendCompose() {
    if (!compose.to || !compose.subject || !compose.message) { setComposeStatus("Please fill in all fields."); return; }
    setComposeStatus("sending");
    try {
      const res  = await fetch("/api/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(compose) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setComposeStatus("sent");
      setCompose({ to: "", toName: "", subject: "", message: "" });
      setTimeout(() => setComposeStatus(null), 3000);
    } catch (e) { setComposeStatus("error: " + e.message); }
  }

  async function sendBulk() {
    const lines = bulk.recipients.split("\n").filter(Boolean);
    if (!lines.length || !bulk.subject || !bulk.message) { setBulkStatus("Please fill in all fields."); return; }
    const recipients = lines.map((line) => { const [to, toName] = line.split(",").map((s) => s.trim()); return { to, toName: toName || to }; });
    setBulkStatus("sending");
    try {
      const res  = await fetch("/api/bulk", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ recipients, subject: bulk.subject, message: bulk.message }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBulkStatus(`✓ ${data.succeeded} sent${data.failed ? `, ${data.failed} failed` : ""}`);
      setBulk({ recipients: "", subject: "", message: "" });
    } catch (e) { setBulkStatus("error: " + e.message); }
  }

  async function deleteEmail(id) {
    if (!confirm("Delete this email? This cannot be undone.")) return;
    setDeleteStatus("deleting");
    try {
      await fetch(`/api/emails/${id}`, { method: "DELETE" });
      setEmails((prev) => prev.filter((e) => e.id !== id));
      setSelected(null);
      setMobilePane("list");
    } finally {
      setDeleteStatus(null);
    }
  }

  async function clearAllEmails() {
    if (!confirm("Delete ALL emails from the database? This cannot be undone.")) return;
    await fetch("/api/emails/clear", { method: "DELETE" });
    setEmails([]);
    setSelected(null);
    setUnread(0);
  }

  const filtered = emails.filter((e) =>
    e.subject?.toLowerCase().includes(search.toLowerCase()) ||
    e.fromName?.toLowerCase().includes(search.toLowerCase()) ||
    e.fromEmail?.toLowerCase().includes(search.toLowerCase()) ||
    e.toEmail?.toLowerCase().includes(search.toLowerCase())
  );

  const sentCount = emails.filter(e => e.type === "outbound").length;
  const inboxCount = emails.filter(e => e.type === "inbound").length;
  const isListView = view === "inbox" || view === "sent";

  function switchView(key) { setView(key); setSidebarOpen(false); }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    window.location.href = "/login";
  }

  const navItems = [
    { key: "inbox",   label: "Inbox",     Icon: Icons.Inbox },
    { key: "sent",    label: "Sent",      Icon: Icons.Sent },
    { key: "compose", label: "Compose",   Icon: Icons.Compose },
    { key: "bulk",    label: "Bulk Send", Icon: Icons.Bulk },
  ];

  return (
    <div className={styles.app}>

      {/* Mobile top bar */}
      <div className={styles.mobileTopBar}>
        <button className={styles.menuBtn} onClick={() => setSidebarOpen((o) => !o)}>
          {sidebarOpen ? <Icons.Close /> : <Icons.Menu />}
        </button>
        <div className={styles.mobileLogoWrap}>
          <Icons.Inbox />
          MailDesk
        </div>
        {unread > 0 && <span className={styles.mobileBadge}>{unread}</span>}
      </div>

      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      <div className={styles.content}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}><Icons.Inbox /></div>
            <div className={styles.logoText}>
              <span className={styles.logoName}>MailDesk</span>
              <span className={styles.logoSub}>Evolve Property Mgmt</span>
            </div>
          </div>

          <nav className={styles.nav}>
            <div className={styles.navSection}>Mail</div>
            {navItems.map(({ key, label, Icon }) => (
              <button
                key={key}
                className={`${styles.navItem} ${view === key ? styles.navActive : ""}`}
                onClick={() => switchView(key)}
              >
                <span className={styles.navIcon}><Icon /></span>
                {label}
                {key === "inbox" && unread > 0 && <span className={styles.badge}>{unread}</span>}
              </button>
            ))}
          </nav>

          <div className={styles.sidebarFooter}>
            <div className={styles.agentCard}>
              <div className={styles.agentAvatar}><Icons.User /></div>
              <div style={{flex:1}}>
                <div className={styles.agentName}>Jay Franco</div>
                <div className={styles.agentRole}>Support Agent</div>
              </div>
              <button
                onClick={logout}
                title="Sign out"
                style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.4)",padding:"4px",display:"flex",alignItems:"center",transition:"color 0.15s"}}
                onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,0.8)"}
                onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.4)"}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </aside>

        {/* List panel */}
        {isListView && (
          <div className={`${styles.listPanel} ${mobilePane === "read" ? styles.listHidden : ""}`}>
            {/* Stats */}
            <div className={styles.statsBar}>
              <div className={styles.statItem}>
                <span className={`${styles.statVal} ${styles.red}`}>{unread}</span>
                <span className={styles.statLbl}>Unread</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statVal}>{inboxTotal}</span>
                <span className={styles.statLbl}>Inbox</span>
              </div>
              <div className={styles.statItem}>
                <span className={`${styles.statVal} ${styles.accent}`}>{sentTotal}</span>
                <span className={styles.statLbl}>Sent</span>
              </div>
            </div>

            <div className={styles.listHeader}>
              <h2 className={styles.listTitle}>{view === "inbox" ? "Inbox" : "Sent"}</h2>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span className={styles.listCount}>{filtered.length} emails</span>
                {emails.length > 0 && (
                  <button onClick={clearAllEmails} title="Clear all emails" style={{display:"flex",alignItems:"center",gap:4,background:"none",border:"1px solid var(--border2)",borderRadius:"var(--radius)",padding:"3px 8px",fontSize:11,color:"var(--text3)",cursor:"pointer",fontFamily:"var(--font)"}}>
                    <Icons.Trash /> Clear all
                  </button>
                )}
              </div>
            </div>

            <div className={styles.searchBar}>
              <div className={styles.searchWrap}>
                <span className={styles.searchIcon}><Icons.Search /></span>
                <input className={styles.searchInput} placeholder="Search emails..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>

            <div className={styles.emailList}>
              {dbError ? (
                <div className={styles.dbError} style={{margin:"12px"}}>
                  <Icons.Warning />
                  <div>
                    <strong>Database not connected.</strong><br/>
                    Set <code style={{fontFamily:"monospace",background:"#fee2e2",padding:"1px 4px",borderRadius:3}}>MONGODB_URI</code> in your <code style={{fontFamily:"monospace",background:"#fee2e2",padding:"1px 4px",borderRadius:3}}>.env.local</code> file and restart the server.
                  </div>
                </div>
              ) : loading ? (
                <div className={styles.emptyState}>Loading emails...</div>
              ) : filtered.length === 0 ? (
                <div className={styles.emptyState}>
                  <span className={styles.emptyStateIcon}><Icons.EmptyInbox /></span>
                  No emails found
                </div>
              ) : (
                filtered.map((email) => {
                  const name = view === "inbox" ? (email.fromName || email.fromEmail) : (email.toName || email.toEmail);
                  const ac = avatarColor(name);
                  return (
                    <button
                      key={email.id}
                      className={`${styles.emailItem} ${selected?.id === email.id ? styles.emailActive : ""} ${email.unread ? styles.emailUnread : ""}`}
                      onClick={() => openEmail(email)}
                    >
                      <div className={styles.emailItemTop}>
                        <span className={styles.emailFrom}>{name}</span>
                        <span className={styles.emailTime}>{timeAgo(email.createdAt)}</span>
                      </div>
                      <div className={styles.emailSubject}>{email.subject}</div>
                      <div className={styles.emailPreview}>{email.body?.replace(/\n/g, " ").slice(0, 75)}...</div>
                      <div className={styles.emailMeta}>
                        {email.tag && (
                          <span className={styles.tag} style={{ background: TAG_COLORS[email.tag]?.bg, color: TAG_COLORS[email.tag]?.color }}>
                            {email.tag}
                          </span>
                        )}
                        {email.unread && <span className={styles.unreadDot} />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Main panel */}
        <main className={`${styles.mainPanel} ${isListView && mobilePane === "list" ? styles.mainHidden : ""}`}>

          {isListView && selected && (
            <button className={styles.backBtn} onClick={() => { setSelected(null); setMobilePane("list"); }}>
              <Icons.Back /> Back to {view === "inbox" ? "Inbox" : "Sent"}
            </button>
          )}

          {isListView && (
            !selected ? (
              <div className={styles.emptyMain}>
                <div className={styles.emptyMainIcon}><Icons.EmptyInbox /></div>
                <div className={styles.emptyMainTitle}>No email selected</div>
                <div className={styles.emptyMainSub}>Choose an email from the list to read it here</div>
              </div>
            ) : (
              <div className={styles.readPanel}>
                <div className={styles.readHeader}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:14}}>
                    <h1 className={styles.readSubject} style={{marginBottom:0}}>{selected.subject}</h1>
                    <button
                      onClick={() => deleteEmail(selected.id)}
                      title="Delete email"
                      style={{display:"flex",alignItems:"center",gap:5,flexShrink:0,background:"none",border:"1px solid var(--border2)",borderRadius:"var(--radius)",padding:"6px 10px",fontSize:12,color:"var(--text3)",cursor:"pointer",fontFamily:"var(--font)",transition:"all 0.1s"}}
                      onMouseEnter={e=>{e.currentTarget.style.background="var(--red-bg)";e.currentTarget.style.color="var(--red)";e.currentTarget.style.borderColor="#fca5a5"}}
                      onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color="var(--text3)";e.currentTarget.style.borderColor="var(--border2)"}}
                    >
                      <Icons.Trash /> Delete
                    </button>
                  </div>
                  <div className={styles.readMeta}>
                    {(() => {
                      const name = view === "inbox" ? (selected.fromName || selected.fromEmail) : (selected.toName || selected.toEmail);
                      const ac = avatarColor(name);
                      return (
                        <div className={styles.avatar} style={{ background: ac.bg, color: ac.color }}>
                          {initials(name)}
                        </div>
                      );
                    })()}
                    <div className={styles.metaInfo}>
                      <div className={styles.metaFrom}>
                        {view === "inbox" ? (selected.fromName || selected.fromEmail) : (selected.toName || selected.toEmail)}
                        {selected.tag && (
                          <span className={styles.tag} style={{ background: TAG_COLORS[selected.tag]?.bg, color: TAG_COLORS[selected.tag]?.color }}>
                            {selected.tag}
                          </span>
                        )}
                      </div>
                      <div className={styles.metaEmail}>
                        {view === "inbox" ? selected.fromEmail : selected.toEmail}
                      </div>
                    </div>
                    <div className={styles.metaTime}>{timeAgo(selected.createdAt)}</div>
                  </div>
                </div>

                <div className={styles.readBody}>
                  {selected.body?.split("\n").map((line, i) => <p key={i}>{line || <br />}</p>)}
                </div>

                {view === "inbox" && (
                  <div className={styles.replyBox}>
                    <div className={styles.replyHeader}>Reply to {selected.fromName || selected.fromEmail}</div>
                    <textarea
                      className={styles.replyTextarea}
                      placeholder={`Write your reply to ${selected.fromName || "this customer"}...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={4}
                    />
                    <div className={styles.replyActions}>
                      <button className={styles.btnSend} onClick={sendReply} disabled={replyStatus === "sending"}>
                        <Icons.Send />
                        {replyStatus === "sending" ? "Sending..." : "Send Reply"}
                      </button>
                      <button className={styles.btnGhost} onClick={() => setReplyText("")}>Clear</button>
                      {replyStatus === "sent"    && <span className={styles.statusOk}>✓ Reply sent successfully</span>}
                      {replyStatus === "warning" && <span className={styles.statusOk}>✓ Saved — email delivery may be delayed</span>}
                      {replyStatus === "error"   && <span className={styles.statusErr}>Failed to send. Check your connection.</span>}
                    </div>
                  </div>
                )}
              </div>
            )
          )}

          {view === "compose" && (
            <div className={styles.composePanel}>
              <div className={styles.composeHeader}>
                <h2>New Email</h2>
                <span className={styles.powerBy}>via Zepto Mail SMTP</span>
              </div>
              <div className={styles.fields}>
                {[
                  { label: "To",      key: "to",      type: "email", placeholder: "customer@example.com" },
                  { label: "Name",    key: "toName",  type: "text",  placeholder: "Customer name (optional)" },
                  { label: "Subject", key: "subject", type: "text",  placeholder: "Subject line" },
                ].map((f) => (
                  <div key={f.key} className={styles.field}>
                    <label className={styles.fieldLabel}>{f.label}</label>
                    <input className={styles.fieldInput} type={f.type} placeholder={f.placeholder} value={compose[f.key]} onChange={(e) => setCompose({ ...compose, [f.key]: e.target.value })} />
                  </div>
                ))}
                <div className={styles.fieldTextarea}>
                  <label className={styles.fieldLabel}>Message</label>
                  <textarea className={styles.fieldTextareaEl} placeholder={"Hi [Name],\n\nWrite your message here...\n\nBest regards,\nJay Franco\nEvolve Property Management"} value={compose.message} onChange={(e) => setCompose({ ...compose, message: e.target.value })} />
                </div>
              </div>
              <div className={styles.composeFooter}>
                <button className={styles.btnSend} onClick={sendCompose} disabled={composeStatus === "sending"}>
                  <Icons.Send />
                  {composeStatus === "sending" ? "Sending..." : "Send Email"}
                </button>
                <button className={styles.btnGhost} onClick={() => setCompose({ to: "", toName: "", subject: "", message: "" })}>Clear</button>
                {composeStatus === "sent" && <span className={styles.statusOk}>✓ Email sent successfully!</span>}
                {composeStatus && composeStatus !== "sending" && composeStatus !== "sent" && <span className={styles.statusErr}>{composeStatus}</span>}
              </div>
            </div>
          )}

          {view === "bulk" && (
            <div className={styles.composePanel}>
              <div className={styles.composeHeader}>
                <h2>Bulk Email</h2>
                <span className={styles.powerBy}>Max 100 recipients</span>
              </div>
              <div className={styles.fields}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Recipients</label>
                  <textarea
                    className={styles.fieldTextareaEl}
                    style={{minHeight: 120, borderBottom: "1px solid var(--border)", paddingBottom: 8}}
                    placeholder={"One per line — email, Name (name optional)\namaka@example.com, Amaka Obi\nchidi@company.com"}
                    value={bulk.recipients}
                    onChange={(e) => setBulk({ ...bulk, recipients: e.target.value })}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Subject</label>
                  <input className={styles.fieldInput} placeholder="Subject line for all recipients" value={bulk.subject} onChange={(e) => setBulk({ ...bulk, subject: e.target.value })} />
                </div>
                <div className={styles.fieldTextarea}>
                  <label className={styles.fieldLabel}>Message</label>
                  <textarea className={styles.fieldTextareaEl} placeholder={"Dear Customer,\n\nWe have an important update to share..."} value={bulk.message} onChange={(e) => setBulk({ ...bulk, message: e.target.value })} />
                </div>
              </div>
              <div className={styles.composeFooter}>
                <button className={styles.btnSend} onClick={sendBulk} disabled={bulkStatus === "sending"}>
                  <Icons.Send />
                  {bulkStatus === "sending" ? "Sending..." : "Send to All"}
                </button>
                {bulkStatus && bulkStatus !== "sending" && (
                  <span className={bulkStatus.startsWith("✓") ? styles.statusOk : styles.statusErr}>{bulkStatus}</span>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}