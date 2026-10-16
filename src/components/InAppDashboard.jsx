/**
 * InAppDashboard — complete owner control centre
 * Opens as an overlay on the website (gold + button x5 taps)
 * Uses real MongoDB APIs via src/utils/api.js
 * Falls back to localStorage when backend is offline
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import * as API from '../utils/api';

/* ── Fallback offline PIN ──────────────────────────── */
const OFFLINE_PIN = '2024';

/* ── Theme ────────────────────────────────────────── */
const T = {
  bg: '#060e09', surf: '#0d1f12', surf2: '#142a18',
  bdr: '#1e3a22', gold: '#d4a843', cream: '#f0e8d0',
  muted: '#6a8870',
};

/* ════════════════════════════════════════════════════
   ATOMS
════════════════════════════════════════════════════ */
function Btn({ children, onClick, v = 'primary', sm, disabled, full }) {
  const bg = { primary: T.gold, ghost: 'transparent', danger: 'rgba(192,57,43,.75)', success: 'rgba(17,92,69,.75)' }[v] ?? T.gold;
  const col = { primary: '#000', ghost: T.cream, danger: '#fff', success: '#fff' }[v] ?? '#000';
  const brd = v === 'ghost' ? `1px solid ${T.bdr}` : 'none';
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: bg, color: col, border: brd,
      padding: sm ? '3px 10px' : '6px 14px', borderRadius: 8,
      fontSize: sm ? 11 : 12, fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .5 : 1, transition: 'opacity .15s',
      width: full ? '100%' : undefined, fontFamily: 'inherit',
    }}>{children}</button>
  );
}

function Fld({ label, value, onChange, type = 'text', rows, ph, style: sx }) {
  const base = {
    width: '100%', background: T.bg, border: `1px solid ${T.bdr}`,
    borderRadius: 8, padding: '6px 10px', color: T.cream, fontSize: 12,
    outline: 'none', boxSizing: 'border-box', marginTop: 3, fontFamily: 'inherit',
  };
  return (
    <div style={{ marginBottom: 10 }}>
      {label && <div style={{ fontSize: 10, color: T.muted, textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</div>}
      {rows
        ? <textarea value={value ?? ''} onChange={e => onChange(e.target.value)} rows={rows} placeholder={ph} style={{ ...base, resize: 'vertical', ...sx }} />
        : <input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={ph} style={{ ...base, ...sx }} />}
    </div>
  );
}

function Slct({ label, value, onChange, opts }) {
  return (
    <div style={{ marginBottom: 10 }}>
      {label && <div style={{ fontSize: 10, color: T.muted, textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</div>}
      <select value={value ?? ''} onChange={e => onChange(e.target.value)} style={{
        width: '100%', background: T.bg, border: `1px solid ${T.bdr}`, borderRadius: 8,
        padding: '6px 10px', color: T.cream, fontSize: 12, outline: 'none', marginTop: 3,
      }}>
        {opts.map(o => <option key={o.v ?? o} value={o.v ?? o}>{o.l ?? o}</option>)}
      </select>
    </div>
  );
}

function Card({ title, badge, children, action }) {
  return (
    <div style={{ background: T.surf, border: `1px solid ${T.bdr}`, borderRadius: 12, marginBottom: 14, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: `1px solid ${T.bdr}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: T.cream, fontWeight: 600, fontSize: 13 }}>{title}</span>
          {badge > 0 && <span style={{ background: 'rgba(192,57,43,.75)', color: '#fff', borderRadius: 999, fontSize: 10, padding: '1px 7px', fontWeight: 700 }}>{badge}</span>}
        </div>
        {action}
      </div>
      <div style={{ padding: '12px 14px' }}>{children}</div>
    </div>
  );
}

function Tag({ label, color = T.gold }) {
  return <span style={{ display: 'inline-block', fontSize: 10, padding: '1px 7px', borderRadius: 999, background: `${color}22`, color, border: `1px solid ${color}44` }}>{label}</span>;
}

function Tbl({ cols, rows, empty = 'Nothing yet.' }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
        <thead><tr>{cols.map(h => <th key={h} style={{ textAlign: 'left', padding: '5px 8px', color: T.muted, fontSize: 10, textTransform: 'uppercase', borderBottom: `1px solid ${T.bdr}`, whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.length === 0
            ? <tr><td colSpan={cols.length} style={{ padding: '20px 8px', textAlign: 'center', color: T.muted }}>{empty}</td></tr>
            : rows.map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T.bdr}44` }}>
                {r.map((cell, j) => <td key={j} style={{ padding: '6px 8px', color: T.cream, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>{cell}</td>)}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

function Toast({ msg, ok, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 80, opacity: 0 }}
      style={{
        position: 'fixed', bottom: 80, right: 16, zIndex: 99999,
        background: ok ? 'rgba(17,92,69,.95)' : 'rgba(120,20,20,.95)',
        color: ok ? '#6ee7b7' : '#fca5a5',
        border: `1px solid ${ok ? 'rgba(52,211,153,.3)' : 'rgba(248,113,113,.3)'}`,
        borderRadius: 10, padding: '8px 16px', fontSize: 12, fontWeight: 600,
        boxShadow: '0 4px 20px rgba(0,0,0,.5)',
      }}>
      {msg}
    </motion.div>
  );
}

function Loading() {
  return <div style={{ color: T.muted, fontSize: 12, padding: '16px 0', textAlign: 'center' }}>Loading…</div>;
}

const fmt = d => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';
const id  = x => x?._id || x?.id;

/* ════════════════════════════════════════════════════
   AUTH GATE  — Admin login OR offline PIN
════════════════════════════════════════════════════ */
function AuthGate({ onUnlock, onClose }) {
  const [tab, setTab]   = useState('login');
  const [email, setEmail] = useState('admin@anyogainstitute.org');
  const [pwd, setPwd]   = useState('');
  const [pin, setPin]   = useState('');
  const [err, setErr]   = useState('');
  const [busy, setBusy] = useState(false);
  const [tries, setTries] = useState(0);
  const [locked, setLocked] = useState(false);

  const doLogin = async () => {
    setErr(''); setBusy(true);
    try {
      const res = await API.adminLogin(email, pwd);
      API.setToken(res.token);
      onUnlock(true);
    } catch (e) { setErr(e.message || 'Login failed'); }
    finally { setBusy(false); }
  };

  const pressPin = k => {
    if (locked) return;
    if (k === '⌫') { setPin(p => p.slice(0, -1)); setErr(''); return; }
    const next = pin + k;
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === OFFLINE_PIN) { onUnlock(false); }
        else {
          const t = tries + 1; setTries(t); setPin('');
          if (t >= 5) {
            setLocked(true); setErr('Too many attempts. Wait 1 min.');
            setTimeout(() => { setLocked(false); setTries(0); setErr(''); }, 60000);
          } else setErr(`Wrong PIN — ${5 - t} left`);
        }
      }, 120);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px', textAlign: 'center', minHeight: 420, justifyContent: 'center' }}>
      <img src="/images/logo.png" alt="Logo" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: `1px solid ${T.gold}44`, marginBottom: 12 }} />
      <div style={{ color: T.cream, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Owner Dashboard</div>

      {/* Tab toggle */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: T.surf2, borderRadius: 8, padding: 3 }}>
        {[['login', '📧 Admin Login'], ['pin', '🔢 Offline PIN']].map(([m, l]) => (
          <button key={m} onClick={() => { setTab(m); setErr(''); }}
            style={{ padding: '4px 14px', borderRadius: 6, border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', background: tab === m ? T.gold : 'transparent', color: tab === m ? '#000' : T.muted }}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'login' ? (
        <div style={{ width: '100%', maxWidth: 260 }}>
          <Fld label="Email" value={email} onChange={setEmail} type="email" />
          <Fld label="Password" value={pwd} onChange={setPwd} type="password" ph="••••••••" />
          {err && <div style={{ color: '#fca5a5', fontSize: 11, marginBottom: 8 }}>{err}</div>}
          <Btn onClick={doLogin} disabled={busy} full>{busy ? 'Signing in…' : 'Sign In'}</Btn>
          <p style={{ color: T.muted, fontSize: 10, marginTop: 8 }}>admin@anyogainstitute.org / Admin@DAYS2024!</p>
        </div>
      ) : (
        <div>
          <p style={{ color: T.muted, fontSize: 11, marginBottom: 16 }}>4-digit PIN (offline mode only)</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', border: `2px solid ${pin.length > i ? T.gold : T.bdr}`, background: pin.length > i ? T.gold : 'transparent', transition: 'all .15s' }} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, width: 200 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map((k, i) => (
              <button key={i} disabled={locked || k === ''} onClick={() => k !== '' && pressPin(String(k))}
                style={{ height: 44, borderRadius: 10, background: k === '' ? 'transparent' : T.surf, border: `1px solid ${k === '' ? 'transparent' : T.bdr}`, color: k === '⌫' ? T.gold : T.cream, fontSize: 14, fontWeight: 600, cursor: k === '' ? 'default' : 'pointer', opacity: locked ? .4 : 1, visibility: k === '' ? 'hidden' : 'visible' }}>
                {k}
              </button>
            ))}
          </div>
          {err && <div style={{ color: '#fca5a5', fontSize: 11, marginTop: 10 }}>{err}</div>}
        </div>
      )}
      <button onClick={onClose} style={{ marginTop: 16, background: 'none', border: 'none', color: T.muted, fontSize: 11, cursor: 'pointer' }}>Cancel</button>
    </div>
  );
}

/* ── Helper: uploads URL fix for production ───────────── */
const API_BASE = import.meta.env.VITE_API_URL || '';
function resolveImg(img) {
  if (!img) return null;
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  if (img.startsWith('/uploads')) return `${API_BASE}${img}`;
  return img;
}

/* ════════════════════════════════════════════════════
   HOOK: useApiList — loads from API, falls back to ctx
   FIX: some endpoints return {data, stats} (achievements)
        so we always pick .data first, then fallback to
        the raw response if it's already an array.
════════════════════════════════════════════════════ */
function useApiList(apiFn, ctxData, ctxSetter) {
  const [items, setItems] = useState(ctxData || []);
  const [loading, setLoading] = useState(true);
  const setterRef = useRef(ctxSetter);
  setterRef.current = ctxSetter;

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFn();
      // Handle both {data:[]} and {data:[], stats:[]} shapes
      const data = res?.data ?? res;
      const arr = Array.isArray(data) ? data : [];
      setItems(arr);
      setterRef.current?.(arr);
    } catch { setItems(ctxData || []); }
    finally { setLoading(false); }
  }, [apiFn]); // eslint-disable-line

  useEffect(() => { refresh(); }, [refresh]);
  return { items, loading, refresh, setItems };
}

/* ════════════════════════════════════════════════════
   OVERVIEW
════════════════════════════════════════════════════ */
function OverviewPanel({ goTo, isAdmin }) {
  const { pendingEnquiries, pendingMemberships, pendingReviews, siteReviews, siteFacilitators, sitePlans } = useApp();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (isAdmin) API.getDashboardStats().then(r => setStats(r.data)).catch(() => {});
  }, [isAdmin]);

  const cards = [
    { icon: '✉️', label: 'Enquiries',      value: stats?.enquiries      ?? pendingEnquiries.length,   badge: stats?.newEnquiries         ?? pendingEnquiries.filter(e => e.status === 'new').length,      tab: 'enquiries' },
    { icon: '🎫', label: 'Memberships',    value: stats?.memberships    ?? pendingMemberships.length, badge: stats?.pendingMemberships   ?? pendingMemberships.filter(m => m.status === 'pending').length, tab: 'memberships' },
    { icon: '⏳', label: 'Pending Reviews',value: stats?.pendingReviews ?? pendingReviews.length,     badge: stats?.pendingReviews       ?? pendingReviews.length,                                          tab: 'reviews' },
    { icon: '🧘', label: 'Facilitators',   value: stats?.facilitators   ?? siteFacilitators.length,  badge: 0, tab: 'facilitators' },
    { icon: '💎', label: 'Plans',          value: sitePlans.length,                                   badge: 0, tab: 'plans' },
    { icon: '⭐', label: 'Reviews Live',   value: stats?.reviews        ?? siteReviews.length,        badge: 0, tab: 'published' },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 }}>
        {cards.map(c => (
          <div key={c.label} onClick={() => goTo(c.tab)} style={{ background: T.surf, border: `1px solid ${c.badge > 0 ? `${T.gold}66` : T.bdr}`, borderRadius: 10, padding: '10px 8px', textAlign: 'center', cursor: 'pointer', transition: 'border .15s' }}>
            <div style={{ fontSize: 20 }}>{c.icon}</div>
            <div style={{ color: T.gold, fontSize: 18, fontWeight: 700, lineHeight: 1.1 }}>{c.value}</div>
            <div style={{ color: T.muted, fontSize: 9, textTransform: 'uppercase', marginTop: 2 }}>{c.label}</div>
            {c.badge > 0 && <div style={{ marginTop: 4, background: 'rgba(192,57,43,.65)', color: '#fff', borderRadius: 999, fontSize: 9, padding: '1px 6px', display: 'inline-block' }}>{c.badge} new</div>}
          </div>
        ))}
      </div>

      {isAdmin && (
        <Card title="🖥️ Full Admin Panel (MongoDB)">
          <p style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>Full-featured panel with search, pagination, image uploads, and all settings.</p>
          <a href={`${import.meta.env.VITE_API_URL || ''}/admin`} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: T.gold, color: '#000', padding: '7px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
            Open Admin Panel ↗
          </a>
        </Card>
      )}

      <Card title="ℹ️ How it works">
        <ul style={{ color: T.muted, fontSize: 11, lineHeight: 2, paddingLeft: 14 }}>
          <li>Contact form → <b style={{ color: T.cream }}>Enquiries</b> tab</li>
          <li>Membership registration → <b style={{ color: T.cream }}>Memberships</b> tab</li>
          <li>Review submission → <b style={{ color: T.cream }}>Pending Reviews</b> → approve to publish</li>
          <li>All edits save to <b style={{ color: T.gold }}>MongoDB</b> and reflect on site immediately</li>
          {!isAdmin && <li style={{ color: '#fca5a5' }}>⚠️ Offline mode — changes save locally only. Log in as admin for MongoDB sync.</li>}
        </ul>
      </Card>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   ENQUIRIES
════════════════════════════════════════════════════ */
function EnquiriesPanel({ toast, isAdmin }) {
  const { pendingEnquiries, updateEnquiries } = useApp();
  const [items, setItems] = useState([]);
  const [busy, setBusy]   = useState(true);
  const [view, setView]   = useState(null);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setBusy(true);
    if (isAdmin) {
      try { const r = await API.getEnquiries(); const d = r.data || []; setItems(d); updateEnquiries(d); }
      catch { setItems(pendingEnquiries); }
    } else { setItems(pendingEnquiries); }
    setBusy(false);
  }, [isAdmin]); // eslint-disable-line

  useEffect(() => { load(); }, [load]);

  const shown = items.filter(e => !search || [e.name, e.phone, e.service, e.email].some(f => f?.toLowerCase().includes(search.toLowerCase())));

  const mark = async (itemId, status) => {
    try {
      if (isAdmin) await API.updateEnquiry(itemId, { status });
      const u = items.map(e => id(e) === itemId ? { ...e, status } : e);
      setItems(u); updateEnquiries(u); toast('Updated ✓');
    } catch (e) { toast(e.message, false); }
  };

  const del = async (itemId) => {
    if (!confirm('Delete this enquiry?')) return;
    try {
      if (isAdmin) await API.deleteEnquiry(itemId);
      const u = items.filter(e => id(e) !== itemId);
      setItems(u); updateEnquiries(u); toast('Deleted');
    } catch (e) { toast(e.message, false); }
  };

  if (view) {
    const e = items.find(x => id(x) === view);
    if (!e) { setView(null); return null; }
    return (
      <Card title={`✉️ Enquiry — ${e.name}`} action={<Btn v="ghost" sm onClick={() => setView(null)}>← Back</Btn>}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, marginBottom: 10 }}>
          {[['Name', e.name], ['Phone', e.phone], ['Email', e.email || '—'], ['Service', e.service], ['Date', fmt(e.date || e.createdAt)], ['Status', e.status || 'new']].map(([l, v]) => (
            <div key={l}><span style={{ color: T.muted }}>{l}: </span>{l === 'Phone' ? <a href={`tel:+91${v}`} style={{ color: T.gold }}>{v}</a> : <span style={{ color: T.cream }}>{v}</span>}</div>
          ))}
        </div>
        <div style={{ background: T.bg, border: `1px solid ${T.bdr}`, borderRadius: 8, padding: '8px 10px', fontSize: 12, marginBottom: 12, whiteSpace: 'pre-wrap', color: T.cream }}>{e.message}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Btn v="success" sm onClick={() => { mark(id(e), 'replied'); setView(null); }}>✓ Mark Replied</Btn>
          <Btn v="ghost" sm onClick={() => mark(id(e), 'read')}>Mark Read</Btn>
          <a href={`https://wa.me/91${e.phone}?text=Namaste ${e.name}! Regarding your enquiry about ${e.service}.`} target="_blank" rel="noopener noreferrer">
            <Btn v="success" sm>WhatsApp ↗</Btn>
          </a>
          <Btn v="danger" sm onClick={() => { del(id(e)); setView(null); }}>Delete</Btn>
        </div>
      </Card>
    );
  }

  return (
    <Card title={`✉️ Enquiries`} badge={shown.filter(e => e.status === 'new' || !e.status).length}>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name / phone / service…"
        style={{ width: '100%', background: T.bg, border: `1px solid ${T.bdr}`, borderRadius: 8, padding: '6px 10px', color: T.cream, fontSize: 11, outline: 'none', marginBottom: 10, boxSizing: 'border-box' }} />
      {busy ? <Loading /> : (
        <Tbl cols={['Date', 'Name', 'Phone', 'Service', 'Status', 'Actions']}
          rows={shown.map(e => [
            fmt(e.date || e.createdAt), e.name, e.phone, e.service,
            <Tag key="s" label={e.status || 'new'} color={e.status === 'replied' ? '#6ee7b7' : e.status === 'read' ? T.muted : T.gold} />,
            <div key="a" style={{ display: 'flex', gap: 4 }}>
              <Btn v="ghost" sm onClick={() => setView(id(e))}>View</Btn>
              <Btn v="danger" sm onClick={() => del(id(e))}>Del</Btn>
            </div>
          ])}
          empty="No enquiries yet — they appear when visitors submit the contact form." />
      )}
    </Card>
  );
}

/* ════════════════════════════════════════════════════
   MEMBERSHIPS
════════════════════════════════════════════════════ */
function MembershipsPanel({ toast, isAdmin }) {
  const { pendingMemberships, updateMemberships } = useApp();
  const [items, setItems] = useState([]);
  const [busy, setBusy]   = useState(true);
  const [view, setView]   = useState(null);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setBusy(true);
    if (isAdmin) {
      try { const r = await API.getMemberships(); const d = r.data || []; setItems(d); updateMemberships(d); }
      catch { setItems(pendingMemberships); }
    } else { setItems(pendingMemberships); }
    setBusy(false);
  }, [isAdmin]); // eslint-disable-line

  useEffect(() => { load(); }, [load]);

  const shown = items.filter(m => !search || [m.name, m.phone, m.email].some(f => f?.toLowerCase().includes(search.toLowerCase())));

  const setStatus = async (itemId, status) => {
    try {
      if (isAdmin) await API.updateMembership(itemId, { status });
      const u = items.map(m => id(m) === itemId ? { ...m, status } : m);
      setItems(u); updateMemberships(u); toast('Updated ✓');
    } catch (e) { toast(e.message, false); }
  };

  const del = async (itemId) => {
    if (!confirm('Delete?')) return;
    try {
      if (isAdmin) await API.deleteMembership(itemId);
      const u = items.filter(m => id(m) !== itemId);
      setItems(u); updateMemberships(u); toast('Deleted');
    } catch (e) { toast(e.message, false); }
  };

  if (view) {
    const m = items.find(x => id(x) === view);
    if (!m) { setView(null); return null; }
    return (
      <Card title={`🎫 ${m.name}`} action={<Btn v="ghost" sm onClick={() => setView(null)}>← Back</Btn>}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, marginBottom: 10 }}>
          {[['Name', m.name], ['Phone', m.phone], ['Age/Gender', `${m.age} · ${m.gender || '—'}`], ['Email', m.email || '—'], ['Level', m.level], ['Mode', m.mode], ['Type', m.membershipType], ['Date', fmt(m.date || m.createdAt)]].map(([l, val]) => (
            <div key={l} style={l === 'Type' ? { gridColumn: '1/-1' } : {}}>
              <span style={{ color: T.muted }}>{l}: </span>
              {l === 'Phone' ? <a href={`tel:+91${val}`} style={{ color: T.gold }}>{val}</a>
                : l === 'Type' ? <Tag label={val} color={T.gold} />
                : <span style={{ color: T.cream }}>{val}</span>}
            </div>
          ))}
          {m.goals?.length > 0 && <div style={{ gridColumn: '1/-1' }}><span style={{ color: T.muted }}>Goals: </span><span style={{ color: T.cream }}>{m.goals.join(', ')}</span></div>}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Btn v="success" sm onClick={() => { setStatus(id(m), 'active'); setView(null); }}>✓ Activate</Btn>
          <Btn v="ghost" sm onClick={() => { setStatus(id(m), 'cancelled'); setView(null); }}>Cancel</Btn>
          <a href={`https://wa.me/91${m.phone}?text=Namaste ${m.name}! Your yoga membership has been confirmed. Welcome to DIVY ASHISH YOGA SANSTHAN!`} target="_blank" rel="noopener noreferrer">
            <Btn v="success" sm>WhatsApp ↗</Btn>
          </a>
          <Btn v="danger" sm onClick={() => { del(id(m)); setView(null); }}>Delete</Btn>
        </div>
      </Card>
    );
  }

  return (
    <Card title="🎫 Memberships" badge={shown.filter(m => !m.status || m.status === 'pending').length}>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name / phone…"
        style={{ width: '100%', background: T.bg, border: `1px solid ${T.bdr}`, borderRadius: 8, padding: '6px 10px', color: T.cream, fontSize: 11, outline: 'none', marginBottom: 10, boxSizing: 'border-box' }} />
      {busy ? <Loading /> : (
        <Tbl cols={['Date', 'Name', 'Phone', 'Type', 'Level', 'Status', 'Actions']}
          rows={shown.map(m => [
            fmt(m.date || m.createdAt), m.name, m.phone,
            <Tag key="t" label={m.membershipType} color={T.gold} />,
            m.level,
            <Tag key="s" label={m.status || 'pending'} color={m.status === 'active' ? '#6ee7b7' : m.status === 'pending' || !m.status ? T.gold : T.muted} />,
            <div key="a" style={{ display: 'flex', gap: 4 }}>
              <Btn v="ghost" sm onClick={() => setView(id(m))}>View</Btn>
              <Btn v="danger" sm onClick={() => del(id(m))}>Del</Btn>
            </div>
          ])}
          empty="No registrations yet — they appear when visitors complete the membership form." />
      )}
    </Card>
  );
}

/* ════════════════════════════════════════════════════
   REVIEWS
════════════════════════════════════════════════════ */
function ReviewsPanel({ toast, isAdmin }) {
  const { pendingReviews, updatePendingReviews, siteReviews, updateReviews } = useApp();
  const [all, setAll]     = useState([]);
  const [busy, setBusy]   = useState(true);
  const [editing, setEdit] = useState(null);
  const [form, setForm]   = useState({});

  const load = useCallback(async () => {
    setBusy(true);
    if (isAdmin) {
      try { const r = await API.getReviews(); setAll(r.data || []); }
      catch { setAll([...pendingReviews, ...siteReviews]); }
    } else { setAll([...pendingReviews, ...siteReviews]); }
    setBusy(false);
  }, [isAdmin]); // eslint-disable-line

  useEffect(() => { load(); }, [load]);

  const pending   = isAdmin ? all.filter(r => !r.approved) : pendingReviews;
  const published = isAdmin ? all.filter(r => r.approved)  : siteReviews;

  const approve = async (r) => {
    try {
      if (isAdmin) await API.approveReview(id(r));
      else { updatePendingReviews(pendingReviews.filter(p => p.id !== r.id)); updateReviews([{ ...r, verified: true }, ...siteReviews]); }
      await load(); toast('Published ✓');
    } catch (e) { toast(e.message, false); }
  };

  const del = async (itemId, isPending) => {
    if (!confirm('Delete?')) return;
    try {
      if (isAdmin) await API.deleteReview(itemId);
      else if (isPending) updatePendingReviews(pendingReviews.filter(p => p.id !== itemId));
      else updateReviews(siteReviews.filter(r => r.id !== itemId));
      await load(); toast('Deleted');
    } catch (e) { toast(e.message, false); }
  };

  const save = async () => {
    if (!form.name?.trim() || !form.review?.trim()) return;
    try {
      if (editing === 'new') {
        const res = await API.submitReview({ ...form, approved: false });
        if (isAdmin) await API.approveReview(res.data?._id || id(res.data));
      } else {
        await API.updateReview(editing, form);
      }
      await load(); setEdit(null); setForm({}); toast('Saved ✓');
    } catch (e) {
      // offline fallback
      if (editing === 'new') updateReviews([{ ...form, id: Date.now(), verified: true }, ...siteReviews]);
      else updateReviews(siteReviews.map(r => (r._id || r.id) === editing ? { ...r, ...form } : r));
      setEdit(null); setForm({}); toast('Saved ✓');
    }
  };

  const cats = ['Group Yoga', 'Online Yoga', 'Personal Yoga', 'Yogasana Sports', "Children's Yoga", 'Other'];

  return (
    <div>
      {/* Pending */}
      {pending.length > 0 && (
        <Card title="⏳ Pending Approval" badge={pending.length}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pending.map(r => (
              <div key={id(r)} style={{ background: T.bg, border: `1px solid ${T.gold}33`, borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: T.cream, fontWeight: 600, fontSize: 12 }}>{r.name}</span>
                  <span style={{ color: T.muted, fontSize: 10 }}>{fmt(r.date || r.createdAt)} · {'★'.repeat(r.rating || 5)}</span>
                </div>
                <p style={{ color: '#c8d8c0', fontSize: 11, margin: '0 0 8px', lineHeight: 1.5 }}>{r.review}</p>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Btn v="success" sm onClick={() => approve(r)}>✓ Approve & Publish</Btn>
                  <Btn v="danger" sm onClick={() => del(id(r), true)}>✕ Delete</Btn>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Published */}
      <Card title={`⭐ Published Reviews (${published.length})`}
        action={<Btn sm onClick={() => { setForm({ name: '', category: 'Group Yoga', rating: 5, review: '', date: new Date().toISOString().split('T')[0] }); setEdit('new'); }}>+ Add</Btn>}>
        <AnimatePresence>
          {editing !== null && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ background: T.bg, border: `1px solid ${T.bdr}`, borderRadius: 10, padding: 12 }}>
                <Fld label="Name *" value={form.name || ''} onChange={v => setForm(p => ({ ...p, name: v }))} />
                <Slct label="Category" value={form.category || 'Group Yoga'} onChange={v => setForm(p => ({ ...p, category: v }))} opts={cats} />
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: T.muted, textTransform: 'uppercase', letterSpacing: '.06em' }}>Rating</div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 3 }}>
                    {[1, 2, 3, 4, 5].map(n => <button key={n} onClick={() => setForm(p => ({ ...p, rating: n }))} style={{ fontSize: 20, background: 'none', border: 'none', cursor: 'pointer', color: (form.rating || 5) >= n ? T.gold : T.bdr }}>★</button>)}
                  </div>
                </div>
                <Fld label="Review *" value={form.review || ''} onChange={v => setForm(p => ({ ...p, review: v }))} rows={3} />
                <div style={{ display: 'flex', gap: 8 }}><Btn onClick={save}>Save</Btn><Btn v="ghost" onClick={() => { setEdit(null); setForm({}); }}>Cancel</Btn></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {busy ? <Loading /> : (
          <Tbl cols={['Name', 'Category', 'Rating', 'Date', 'Actions']}
            rows={published.map(r => [
              r.name, <Tag key="c" label={r.category || '—'} />,
              <span key="r" style={{ color: T.gold }}>{'★'.repeat(r.rating || 5)}</span>,
              fmt(r.date || r.createdAt),
              <div key="a" style={{ display: 'flex', gap: 4 }}>
                <Btn v="ghost" sm onClick={() => { setForm({ ...r }); setEdit(id(r)); }}>Edit</Btn>
                <Btn v="danger" sm onClick={() => del(id(r), false)}>Del</Btn>
              </div>
            ])}
            empty="No published reviews." />
        )}
      </Card>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   FACILITATORS
════════════════════════════════════════════════════ */
function FacilitatorsPanel({ toast, isAdmin }) {
  const { updateFacilitators } = useApp();
  const { items, loading, refresh } = useApiList(API.getFacilitators, [], updateFacilitators);
  const [editing, setEdit] = useState(null);
  const [form, setForm]    = useState({});
  const [imgFile, setImgFile] = useState(null);

  const save = async () => {
    if (!form.name?.trim()) return;
    const spec = typeof form.specialization === 'string' ? form.specialization.split(',').map(s => s.trim()).filter(Boolean) : (form.specialization || []);
    const cert = typeof form.certifications === 'string' ? form.certifications.split(',').map(s => s.trim()).filter(Boolean) : (form.certifications || []);
    const data = { ...form, specialization: spec, certifications: cert };
    try {
      let savedId;
      if (editing === 'new') { const r = await API.createFacilitator(data); savedId = r.data?._id; }
      else { await API.updateFacilitator(editing, data); savedId = editing; }
      if (imgFile && savedId) await API.uploadFacilitatorImage(savedId, imgFile);
      await refresh(); setEdit(null); setForm({}); setImgFile(null); toast('Saved ✓');
    } catch (e) { toast(e.message || 'Save failed — admin login required', false); }
  };

  const del = async (itemId) => {
    if (!confirm('Delete facilitator?')) return;
    try { await API.deleteFacilitator(itemId); await refresh(); toast('Deleted'); }
    catch (e) { toast(e.message, false); }
  };

  const imgSrc = img => resolveImg(img);

  return (
    <Card title="🧘 Facilitators" action={<Btn sm onClick={() => { setForm({ name: '', title: '', qualification: '', experience: '', specialization: [], certifications: [], biography: '', social: { whatsapp: '' }, featured: false }); setEdit('new'); }}>+ Add</Btn>}>
      <AnimatePresence>
        {editing !== null && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginBottom: 10 }}>
            <div style={{ background: T.bg, border: `1px solid ${T.bdr}`, borderRadius: 10, padding: 12 }}>
              <Fld label="Full Name *" value={form.name || ''} onChange={v => setForm(p => ({ ...p, name: v }))} />
              <Fld label="Title / Role" value={form.title || ''} onChange={v => setForm(p => ({ ...p, title: v }))} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Fld label="Qualification" value={form.qualification || ''} onChange={v => setForm(p => ({ ...p, qualification: v }))} />
                <Fld label="Experience" value={form.experience || ''} onChange={v => setForm(p => ({ ...p, experience: v }))} />
              </div>
              <Fld label="Specializations (comma sep.)" value={Array.isArray(form.specialization) ? form.specialization.join(', ') : (form.specialization || '')} onChange={v => setForm(p => ({ ...p, specialization: v }))} />
              <Fld label="Certifications (comma sep.)" value={Array.isArray(form.certifications) ? form.certifications.join(', ') : (form.certifications || '')} onChange={v => setForm(p => ({ ...p, certifications: v }))} />
              <Fld label="WhatsApp Number" value={form.social?.whatsapp || ''} onChange={v => setForm(p => ({ ...p, social: { ...p.social, whatsapp: v } }))} />
              <Fld label="Biography" value={form.biography || ''} onChange={v => setForm(p => ({ ...p, biography: v }))} rows={3} />
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: T.muted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>Photo (jpg/png/webp)</div>
                <input type="file" accept="image/*" onChange={e => setImgFile(e.target.files[0])}
                  style={{ width: '100%', background: T.bg, border: `1px solid ${T.bdr}`, borderRadius: 8, padding: '4px 8px', color: T.cream, fontSize: 11 }} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: T.cream, cursor: 'pointer', marginBottom: 10 }}>
                <input type="checkbox" checked={!!form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} /> Featured
              </label>
              {!isAdmin && <p style={{ color: '#fca5a5', fontSize: 10, marginBottom: 8 }}>⚠️ Admin login required to save to database</p>}
              <div style={{ display: 'flex', gap: 8 }}><Btn onClick={save} disabled={!isAdmin}>Save to MongoDB</Btn><Btn v="ghost" onClick={() => { setEdit(null); setForm({}); setImgFile(null); }}>Cancel</Btn></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {loading ? <Loading /> : (
        <Tbl cols={['Photo', 'Name', 'Title', 'Featured', 'Actions']}
          rows={items.map(f => [
            imgSrc(f.image) ? <img key="i" src={imgSrc(f.image)} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: `1px solid ${T.bdr}` }} /> : '🧘',
            f.name?.replace(/\[|\]/g, ''), f.title,
            f.featured ? <span key="fe" style={{ color: T.gold }}>⭐ Yes</span> : <span key="fe" style={{ color: T.muted }}>No</span>,
            <div key="a" style={{ display: 'flex', gap: 4 }}>
              <Btn v="ghost" sm onClick={() => { setForm({ ...f, specialization: (f.specialization || []).join(', '), certifications: (f.certifications || []).join(', ') }); setEdit(id(f)); }}>Edit</Btn>
              {isAdmin && <Btn v="danger" sm onClick={() => del(id(f))}>Del</Btn>}
            </div>
          ])}
          empty="No facilitators." />
      )}
    </Card>
  );
}

/* ════════════════════════════════════════════════════
   GALLERY
════════════════════════════════════════════════════ */
function GalleryPanel({ toast, isAdmin }) {
  const { updateGallery } = useApp();
  const { items, loading, refresh } = useApiList(API.getGallery, [], updateGallery);
  const [editing, setEdit] = useState(null);
  const [form, setForm]    = useState({});
  const [imgFile, setImgFile] = useState(null);

  const save = async () => {
    if (!isAdmin) { toast('Admin login required', false); return; }
    if (editing === 'new' && !imgFile) { toast('Select an image', false); return; }
    try {
      if (editing === 'new') {
        const fd = new FormData();
        ['title', 'alt', 'category'].forEach(k => fd.append(k, form[k] || ''));
        fd.append('image', imgFile);
        await API.createGalleryItem(fd);
      } else {
        await API.updateGalleryItem(editing, { title: form.title, alt: form.alt, category: form.category });
      }
      await refresh(); setEdit(null); setForm({}); setImgFile(null); toast('Saved ✓');
    } catch (e) { toast(e.message, false); }
  };

  const del = async (itemId) => {
    if (!confirm('Delete?')) return;
    try { await API.deleteGalleryItem(itemId); await refresh(); toast('Deleted'); }
    catch (e) { toast(e.message, false); }
  };

  const src = img => resolveImg(img);
  const cats = ['Facilitators', 'Yoga Classes', 'Events', 'Competitions', 'Students', 'Certificates', 'General'];

  return (
    <Card title={`🖼️ Gallery (${items.length})`}
      action={<Btn sm onClick={() => { setForm({ title: '', alt: '', category: 'Facilitators' }); setEdit('new'); }}>+ Upload</Btn>}>
      <AnimatePresence>
        {editing !== null && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginBottom: 10 }}>
            <div style={{ background: T.bg, border: `1px solid ${T.bdr}`, borderRadius: 10, padding: 12 }}>
              <Fld label="Title *" value={form.title || ''} onChange={v => setForm(p => ({ ...p, title: v }))} />
              <Fld label="Alt Text" value={form.alt || ''} onChange={v => setForm(p => ({ ...p, alt: v }))} />
              <Slct label="Category" value={form.category || 'Facilitators'} onChange={v => setForm(p => ({ ...p, category: v }))} opts={cats} />
              {editing === 'new' && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: T.muted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>Image *</div>
                  <input type="file" accept="image/*" onChange={e => setImgFile(e.target.files[0])}
                    style={{ width: '100%', background: T.bg, border: `1px solid ${T.bdr}`, borderRadius: 8, padding: '4px 8px', color: T.cream, fontSize: 11 }} />
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <Btn onClick={save} disabled={!isAdmin}>Save</Btn>
                <Btn v="ghost" onClick={() => { setEdit(null); setForm({}); setImgFile(null); }}>Cancel</Btn>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {loading ? <Loading /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px,1fr))', gap: 8 }}>
          {items.length === 0 && <div style={{ gridColumn: '1/-1', color: T.muted, fontSize: 12, textAlign: 'center', padding: '20px 0' }}>No gallery items yet.</div>}
          {items.map(g => (
            <div key={id(g)} style={{ position: 'relative', aspectRatio: '1', borderRadius: 8, overflow: 'hidden', border: `1px solid ${T.bdr}`, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.querySelector('.overlay').style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.querySelector('.overlay').style.opacity = '0'}>
              <img src={resolveImg(typeof g.image === 'string' ? g.image : '') || ''} alt={g.alt || g.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} onError={e => { e.target.style.display = 'none'; }} />
              <div className="overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.7)', opacity: 0, transition: 'opacity .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <Btn v="ghost" sm onClick={() => { setForm({ title: g.title, alt: g.alt, category: g.category }); setEdit(id(g)); }}>✏️</Btn>
                {isAdmin && <Btn v="danger" sm onClick={() => del(id(g))}>🗑️</Btn>}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ════════════════════════════════════════════════════
   PLANS
════════════════════════════════════════════════════ */
function PlansPanel({ toast, isAdmin }) {
  const { updatePlans } = useApp();
  const { items, loading, refresh } = useApiList(API.getPlans, [], updatePlans);
  const [editing, setEdit] = useState(null);
  const [form, setForm]    = useState({});

  const save = async () => {
    if (!isAdmin) { toast('Admin login required', false); return; }
    const benefits = typeof form.benefits === 'string' ? form.benefits.split('\n').map(b => b.trim()).filter(Boolean) : (form.benefits || []);
    try {
      if (editing === 'new') await API.createPlan({ ...form, benefits });
      else await API.updatePlan(editing, { ...form, benefits });
      await refresh(); setEdit(null); setForm({}); toast('Saved ✓');
    } catch (e) { toast(e.message, false); }
  };

  const del = async (itemId) => {
    if (!confirm('Delete?')) return;
    try { await API.deletePlan(itemId); await refresh(); toast('Deleted'); }
    catch (e) { toast(e.message, false); }
  };

  return (
    <Card title="💎 Plans" action={<Btn sm onClick={() => setEdit('new') || setForm({ name: '', subtitle: '', price: '', priceDetails: '', mode: '', duration: 'Monthly', benefits: [], cta: 'Get Started', badge: '', popular: false, color: 'forest' })}>+ Add</Btn>}>
      <AnimatePresence>
        {editing !== null && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginBottom: 10 }}>
            <div style={{ background: T.bg, border: `1px solid ${T.bdr}`, borderRadius: 10, padding: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Fld label="Plan Name *" value={form.name || ''} onChange={v => setForm(p => ({ ...p, name: v }))} />
                <Fld label="Price *" value={form.price || ''} onChange={v => setForm(p => ({ ...p, price: v }))} ph="₹2,222" />
              </div>
              <Fld label="Price Details" value={form.priceDetails || ''} onChange={v => setForm(p => ({ ...p, priceDetails: v }))} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Fld label="Mode" value={form.mode || ''} onChange={v => setForm(p => ({ ...p, mode: v }))} />
                <Fld label="CTA Button" value={form.cta || ''} onChange={v => setForm(p => ({ ...p, cta: v }))} />
              </div>
              <Fld label="Badge (optional)" value={form.badge || ''} onChange={v => setForm(p => ({ ...p, badge: v }))} />
              <Fld label="Benefits (one per line)" value={Array.isArray(form.benefits) ? form.benefits.join('\n') : (form.benefits || '')} onChange={v => setForm(p => ({ ...p, benefits: v }))} rows={5} />
              <Slct label="Color Theme" value={form.color || 'forest'} onChange={v => setForm(p => ({ ...p, color: v }))} opts={['forest', 'gold', 'emerald', 'bronze']} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: T.cream, cursor: 'pointer', marginBottom: 10 }}>
                <input type="checkbox" checked={!!form.popular} onChange={e => setForm(p => ({ ...p, popular: e.target.checked }))} /> Popular
              </label>
              <div style={{ display: 'flex', gap: 8 }}><Btn onClick={save} disabled={!isAdmin}>Save</Btn><Btn v="ghost" onClick={() => { setEdit(null); setForm({}); }}>Cancel</Btn></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {loading ? <Loading /> : (
        <Tbl cols={['Name', 'Price', 'Mode', 'Popular', 'Actions']}
          rows={items.map(p => [
            p.name, <span key="pr" style={{ color: T.gold }}>{p.price}</span>, p.mode || '—',
            p.popular ? '⭐' : '—',
            <div key="a" style={{ display: 'flex', gap: 4 }}>
              <Btn v="ghost" sm onClick={() => { setForm({ ...p, benefits: (p.benefits || []).join('\n') }); setEdit(id(p)); }}>Edit</Btn>
              {isAdmin && <Btn v="danger" sm onClick={() => del(id(p))}>Del</Btn>}
            </div>
          ])}
          empty="No plans." />
      )}
    </Card>
  );
}

/* ════════════════════════════════════════════════════
   CLASSES
════════════════════════════════════════════════════ */
function ClassesPanel({ toast, isAdmin }) {
  const { updateClasses } = useApp();
  const { items, loading, refresh } = useApiList(API.getClasses, [], updateClasses);
  const [editing, setEdit] = useState(null);
  const [form, setForm]    = useState({});

  const save = async () => {
    if (!isAdmin) { toast('Admin login required', false); return; }
    const suitableFor = typeof form.suitableFor === 'string' ? form.suitableFor.split(',').map(s => s.trim()).filter(Boolean) : (form.suitableFor || []);
    try {
      if (editing === 'new') await API.createClass({ ...form, suitableFor });
      else await API.updateClass(editing, { ...form, suitableFor });
      await refresh(); setEdit(null); setForm({}); toast('Saved ✓');
    } catch (e) { toast(e.message, false); }
  };

  const del = async (itemId) => {
    if (!confirm('Delete?')) return;
    try { await API.deleteClass(itemId); await refresh(); toast('Deleted'); }
    catch (e) { toast(e.message, false); }
  };

  return (
    <Card title="📚 Classes" action={<Btn sm onClick={() => { setEdit('new'); setForm({ title: '', category: 'Offline', mode: 'Group', price: '', timing: '', icon: '🧘', description: '', suitableFor: [], featured: false }); }}>+ Add</Btn>}>
      <AnimatePresence>
        {editing !== null && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginBottom: 10 }}>
            <div style={{ background: T.bg, border: `1px solid ${T.bdr}`, borderRadius: 10, padding: 12 }}>
              <Fld label="Title *" value={form.title || ''} onChange={v => setForm(p => ({ ...p, title: v }))} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Slct label="Category" value={form.category || 'Offline'} onChange={v => setForm(p => ({ ...p, category: v }))} opts={['Offline', 'Online']} />
                <Slct label="Mode" value={form.mode || 'Group'} onChange={v => setForm(p => ({ ...p, mode: v }))} opts={['Group', 'Personal', 'Sports']} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Fld label="Price" value={form.price || ''} onChange={v => setForm(p => ({ ...p, price: v }))} />
                <Fld label="Icon" value={form.icon || '🧘'} onChange={v => setForm(p => ({ ...p, icon: v }))} />
              </div>
              <Fld label="Timing" value={form.timing || ''} onChange={v => setForm(p => ({ ...p, timing: v }))} />
              <Fld label="Description" value={form.description || ''} onChange={v => setForm(p => ({ ...p, description: v }))} rows={2} />
              <Fld label="Suitable For (comma sep.)" value={Array.isArray(form.suitableFor) ? form.suitableFor.join(', ') : (form.suitableFor || '')} onChange={v => setForm(p => ({ ...p, suitableFor: v }))} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: T.cream, cursor: 'pointer', marginBottom: 10 }}>
                <input type="checkbox" checked={!!form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} /> Featured
              </label>
              <div style={{ display: 'flex', gap: 8 }}><Btn onClick={save} disabled={!isAdmin}>Save</Btn><Btn v="ghost" onClick={() => { setEdit(null); setForm({}); }}>Cancel</Btn></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {loading ? <Loading /> : (
        <Tbl cols={['Icon', 'Title', 'Price', 'Mode', 'Featured', 'Actions']}
          rows={items.filter(Boolean).map(cl => [
            cl.icon || '🧘', cl.title,
            <span key="p" style={{ color: T.gold }}>{cl.price || '—'}</span>,
            cl.mode, cl.featured ? '⭐' : '—',
            <div key="a" style={{ display: 'flex', gap: 4 }}>
              <Btn v="ghost" sm onClick={() => { setForm({ ...cl, suitableFor: (cl.suitableFor || []).join(', ') }); setEdit(id(cl)); }}>Edit</Btn>
              {isAdmin && <Btn v="danger" sm onClick={() => del(id(cl))}>Del</Btn>}
            </div>
          ])}
          empty="No classes." />
      )}
    </Card>
  );
}

/* ════════════════════════════════════════════════════
   ACHIEVEMENTS
════════════════════════════════════════════════════ */
function AchievementsPanel({ toast, isAdmin }) {
  const { updateAchievements, siteStats, updateStats } = useApp();
  const { items, loading, refresh } = useApiList(API.getAchievements, [], updateAchievements);
  const [editing, setEdit] = useState(null);
  const [form, setForm]    = useState({});
  const levels = ['District', 'State', 'National', 'Championship', 'Certification', 'Judge / Observer'];

  const save = async () => {
    if (!isAdmin) { toast('Admin login required', false); return; }
    try {
      if (editing === 'new') await API.createAchievement(form);
      else await API.updateAchievement(editing, form);
      await refresh(); setEdit(null); setForm({}); toast('Saved ✓');
    } catch (e) { toast(e.message, false); }
  };

  const del = async (itemId) => {
    if (!confirm('Delete?')) return;
    try { await API.deleteAchievement(itemId); await refresh(); toast('Deleted'); }
    catch (e) { toast(e.message, false); }
  };

  const saveStats = async () => {
    try {
      if (isAdmin) { for (const st of siteStats) { if (st._id) await API.updateAchievementStat(st._id, st).catch(() => {}); } }
      updateStats([...siteStats]); toast('Stats saved ✓');
    } catch (e) { toast(e.message, false); }
  };

  return (
    <div>
      {/* Counter Stats */}
      <Card title="📊 Counter Stats" action={<Btn sm onClick={saveStats}>Save Stats</Btn>}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {siteStats.map((st, i) => (
            <div key={st._id || st.id || i} style={{ background: T.bg, border: `1px solid ${T.bdr}`, borderRadius: 8, padding: 10 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                <input value={st.icon || '📊'} onChange={e => updateStats(siteStats.map((s, j) => j === i ? { ...s, icon: e.target.value } : s))}
                  style={{ width: 32, background: 'transparent', border: 'none', fontSize: 16, textAlign: 'center' }} />
                <input value={st.value || ''} onChange={e => updateStats(siteStats.map((s, j) => j === i ? { ...s, value: e.target.value } : s))}
                  placeholder="e.g. 11+" style={{ flex: 1, background: T.bg, border: `1px solid ${T.bdr}`, borderRadius: 6, padding: '3px 6px', color: T.gold, fontSize: 13, fontWeight: 700, outline: 'none' }} />
              </div>
              <input value={st.label || ''} onChange={e => updateStats(siteStats.map((s, j) => j === i ? { ...s, label: e.target.value } : s))}
                style={{ width: '100%', background: T.bg, border: `1px solid ${T.bdr}`, borderRadius: 6, padding: '3px 6px', color: T.cream, fontSize: 11, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          ))}
        </div>
      </Card>

      {/* Achievements list */}
      <Card title={`🏆 Achievements (${items.length})`}
        action={<Btn sm onClick={() => { setEdit('new'); setForm({ title: '', level: 'State', year: '', location: '', position: '', description: '', icon: '🏆', type: 'Competition' }); }}>+ Add</Btn>}>
        <AnimatePresence>
          {editing !== null && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ background: T.bg, border: `1px solid ${T.bdr}`, borderRadius: 10, padding: 12 }}>
                <Fld label="Title *" value={form.title || ''} onChange={v => setForm(p => ({ ...p, title: v }))} />
                <Slct label="Level" value={form.level || 'State'} onChange={v => setForm(p => ({ ...p, level: v }))} opts={levels} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <Fld label="Year" value={form.year || ''} onChange={v => setForm(p => ({ ...p, year: v }))} />
                  <Fld label="Position" value={form.position || ''} onChange={v => setForm(p => ({ ...p, position: v }))} />
                </div>
                <Fld label="Location / Organisation" value={form.location || ''} onChange={v => setForm(p => ({ ...p, location: v }))} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <Fld label="Icon (emoji)" value={form.icon || '🏆'} onChange={v => setForm(p => ({ ...p, icon: v }))} />
                  <Fld label="Type" value={form.type || ''} onChange={v => setForm(p => ({ ...p, type: v }))} />
                </div>
                <Fld label="Description" value={form.description || ''} onChange={v => setForm(p => ({ ...p, description: v }))} rows={2} />
                <div style={{ display: 'flex', gap: 8 }}><Btn onClick={save} disabled={!isAdmin}>Save</Btn><Btn v="ghost" onClick={() => { setEdit(null); setForm({}); }}>Cancel</Btn></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {loading ? <Loading /> : (
          <Tbl cols={['Icon', 'Title', 'Level', 'Year', 'Actions']}
            rows={items.map(a => [
              a.icon || '🏆', a.title,
              <Tag key="l" label={a.level} color={a.level === 'National' ? T.gold : a.level === 'State' ? '#60a5fa' : T.muted} />,
              a.year,
              <div key="a" style={{ display: 'flex', gap: 4 }}>
                <Btn v="ghost" sm onClick={() => { setForm({ ...a }); setEdit(id(a)); }}>Edit</Btn>
                {isAdmin && <Btn v="danger" sm onClick={() => del(id(a))}>Del</Btn>}
              </div>
            ])}
            empty="No achievements." />
        )}
      </Card>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   SCHEDULE
════════════════════════════════════════════════════ */
function SchedulePanel({ toast, isAdmin }) {
  const { updateSchedule } = useApp();
  const { items, loading, refresh } = useApiList(API.getSchedule, [], updateSchedule);
  const [editing, setEdit] = useState(null);
  const [form, setForm]    = useState({});

  const save = async () => {
    if (!isAdmin) { toast('Admin login required', false); return; }
    if (!form.time?.trim() || !form.session?.trim()) return;
    try {
      if (editing === 'new') await API.createSlot(form);
      else await API.updateSlot(editing, form);
      await refresh(); setEdit(null); setForm({}); toast('Saved ✓');
    } catch (e) { toast(e.message, false); }
  };

  const del = async (itemId) => {
    if (!confirm('Delete?')) return;
    try { await API.deleteSlot(itemId); await refresh(); toast('Deleted'); }
    catch (e) { toast(e.message, false); }
  };

  return (
    <Card title="🕐 Schedule" action={<Btn sm onClick={() => { setEdit('new'); setForm({ time: '', session: '', type: 'Group', mode: 'Offline / Online', period: 'morning', duration: '60 min', suitable: 'All levels', description: '' }); }}>+ Add</Btn>}>
      <AnimatePresence>
        {editing !== null && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginBottom: 10 }}>
            <div style={{ background: T.bg, border: `1px solid ${T.bdr}`, borderRadius: 10, padding: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Fld label="Time *" value={form.time || ''} onChange={v => setForm(p => ({ ...p, time: v }))} ph="05:30 AM" />
                <Fld label="Session *" value={form.session || ''} onChange={v => setForm(p => ({ ...p, session: v }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Fld label="Type" value={form.type || ''} onChange={v => setForm(p => ({ ...p, type: v }))} />
                <Fld label="Duration" value={form.duration || ''} onChange={v => setForm(p => ({ ...p, duration: v }))} />
              </div>
              <Slct label="Period" value={form.period || 'morning'} onChange={v => setForm(p => ({ ...p, period: v }))} opts={['morning', 'evening', 'night']} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Fld label="Mode" value={form.mode || ''} onChange={v => setForm(p => ({ ...p, mode: v }))} />
                <Fld label="Suitable For" value={form.suitable || ''} onChange={v => setForm(p => ({ ...p, suitable: v }))} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}><Btn onClick={save} disabled={!isAdmin}>Save</Btn><Btn v="ghost" onClick={() => { setEdit(null); setForm({}); }}>Cancel</Btn></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {loading ? <Loading /> : (
        <Tbl cols={['Time', 'Session', 'Type', 'Period', 'Duration', 'Actions']}
          rows={items.map(s => [
            <span key="t" style={{ color: T.gold, fontWeight: 600 }}>{s.time}</span>,
            s.session, s.type,
            <Tag key="p" label={s.period} color={s.period === 'morning' ? T.gold : s.period === 'evening' ? '#6ee7b7' : '#a78bfa'} />,
            s.duration,
            <div key="a" style={{ display: 'flex', gap: 4 }}>
              <Btn v="ghost" sm onClick={() => { setForm({ ...s }); setEdit(id(s)); }}>Edit</Btn>
              {isAdmin && <Btn v="danger" sm onClick={() => del(id(s))}>Del</Btn>}
            </div>
          ])}
          empty="No schedule slots." />
      )}
    </Card>
  );
}

/* ════════════════════════════════════════════════════
   CONTACT + SEO + SECTIONS
════════════════════════════════════════════════════ */
function SitePanel({ toast, isAdmin }) {
  const { siteContact, updateContact } = useApp();
  const [cfg, setCfg]   = useState(null);
  const [busy, setBusy] = useState(true);
  const [tab, setTab]   = useState('contact');

  useEffect(() => {
    API.getSiteConfig()
      .then(r => { setCfg(r.data); })
      .catch(() => { setCfg({ ...siteContact, sections: {}, metaTitle: '', metaDesc: '', metaKeywords: '' }); })
      .finally(() => setBusy(false));
  }, []); // eslint-disable-line

  const set = useCallback((path, val) => {
    setCfg(prev => {
      const next = { ...prev };
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) { obj[keys[i]] = { ...obj[keys[i]] }; obj = obj[keys[i]]; }
      obj[keys[keys.length - 1]] = val;
      return next;
    });
  }, []);

  const save = async () => {
    if (!isAdmin) { toast('Admin login required', false); return; }
    try {
      await API.updateSiteConfig(cfg);
      updateContact({ ...siteContact, ...cfg });
      toast('Saved ✓');
    } catch (e) { toast(e.message, false); }
  };

  if (busy) return <Loading />;

  const sections = cfg?.sections || {};
  const SECTION_KEYS = ['home', 'about', 'facilitators', 'classes', 'plans', 'achievements', 'gallery', 'reviews', 'schedule', 'expertise', 'contact', 'membership'];

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 12, background: T.surf2, borderRadius: 8, padding: 3, flexWrap: 'wrap' }}>
        {[['contact', '📞 Contact'], ['seo', '🔍 SEO'], ['sections', '👁️ Sections']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            style={{ padding: '4px 12px', borderRadius: 6, border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', background: tab === k ? T.gold : 'transparent', color: tab === k ? '#000' : T.muted }}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'contact' && (
        <Card title="📞 Contact Information">
          <Fld label="Calling Number" value={(cfg?.phones || [])[0] || ''} onChange={v => set('phones', [v])} />
          <Fld label="WhatsApp Number" value={cfg?.whatsapp || ''} onChange={v => set('whatsapp', v)} />
          <Fld label="Email" value={cfg?.email || ''} onChange={v => set('email', v)} ph="info@anyogainstitute.org" />
          <Fld label="Website" value={cfg?.website || ''} onChange={v => set('website', v)} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Fld label="Address Area" value={cfg?.address?.area || ''} onChange={v => set('address.area', v)} />
            <Fld label="City" value={cfg?.address?.city || ''} onChange={v => set('address.city', v)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Fld label="State" value={cfg?.address?.state || ''} onChange={v => set('address.state', v)} />
            <Fld label="PIN Code" value={cfg?.address?.pin || ''} onChange={v => set('address.pin', v)} />
          </div>
          <Fld label="Google Maps URL" value={cfg?.address?.mapsUrl || ''} onChange={v => set('address.mapsUrl', v)} />
          <Fld label="Tagline (Hindi)" value={cfg?.tagline || ''} onChange={v => set('tagline', v)} rows={2} />
          <Fld label="Site Name" value={cfg?.siteName || ''} onChange={v => set('siteName', v)} />
          <Btn onClick={save} disabled={!isAdmin}>Save Contact Info</Btn>
        </Card>
      )}

      {tab === 'seo' && (
        <Card title="🔍 SEO Settings">
          <Fld label="Meta Title" value={cfg?.metaTitle || ''} onChange={v => set('metaTitle', v)} ph="DIVY ASHISH YOGA SANSTHAN — Yoga Classes in Lucknow" />
          <Fld label="Meta Description" value={cfg?.metaDesc || ''} onChange={v => set('metaDesc', v)} rows={3} ph="Yoga classes, Yogasana sports training, meditation and wellness programs in Aliganj, Lucknow." />
          <Fld label="Keywords (comma sep.)" value={cfg?.metaKeywords || ''} onChange={v => set('metaKeywords', v)} ph="yoga classes lucknow, yogasana sports, meditation" />
          <Btn onClick={save} disabled={!isAdmin}>Save SEO</Btn>
        </Card>
      )}

      {tab === 'sections' && (
        <Card title="👁️ Section Visibility">
          <p style={{ fontSize: 11, color: T.muted, marginBottom: 12 }}>Toggle which sections are visible on the website.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SECTION_KEYS.map(k => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: T.bg, border: `1px solid ${T.bdr}`, borderRadius: 8, padding: '8px 12px' }}>
                <span style={{ color: T.cream, fontSize: 12, textTransform: 'capitalize' }}>{k}</span>
                <button onClick={() => set(`sections.${k}`, !(sections[k] ?? true))} style={{
                  width: 40, height: 22, borderRadius: 999, border: 'none', cursor: 'pointer',
                  background: (sections[k] ?? true) ? T.gold : T.bdr, transition: 'background .2s', position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', top: 3, left: (sections[k] ?? true) ? 20 : 3,
                    width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left .2s',
                  }} />
                </button>
              </div>
            ))}
          </div>
          <Btn onClick={save} disabled={!isAdmin} style={{ marginTop: 12 }}>Save Visibility</Btn>
          {!isAdmin && <p style={{ color: '#fca5a5', fontSize: 10, marginTop: 6 }}>⚠️ Admin login required to save section visibility</p>}
        </Card>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════
   TABS CONFIG
════════════════════════════════════════════════════ */
const TABS = [
  { id: 'overview',     icon: '📊', label: 'Overview' },
  { id: 'enquiries',   icon: '✉️',  label: 'Enquiries' },
  { id: 'memberships', icon: '🎫', label: 'Memberships' },
  { id: 'reviews',     icon: '⏳', label: 'Reviews' },
  { id: 'published',   icon: '⭐', label: 'Published' },
  { id: 'facilitators',icon: '🧘', label: 'Facilitators' },
  { id: 'gallery',     icon: '🖼️',  label: 'Gallery' },
  { id: 'plans',       icon: '💎', label: 'Plans' },
  { id: 'classes',     icon: '📚', label: 'Classes' },
  { id: 'achievements',icon: '🏆', label: 'Achievements' },
  { id: 'schedule',    icon: '🕐', label: 'Schedule' },
  { id: 'site',        icon: '⚙️',  label: 'Site / SEO' },
];

/* ════════════════════════════════════════════════════
   MAIN DASHBOARD (post-auth)
════════════════════════════════════════════════════ */
function Dashboard({ onClose, isAdmin }) {
  const [tab, setTab]     = useState('overview');
  const [toasts, setToasts] = useState([]);
  const { pendingEnquiries, pendingMemberships, pendingReviews } = useApp();

  const addToast = useCallback((msg, ok = true) => {
    const tid = Date.now();
    setToasts(p => [...p, { tid, msg, ok }]);
  }, []);

  const badges = {
    enquiries:   pendingEnquiries.filter(e => e.status === 'new' || !e.status).length,
    memberships: pendingMemberships.filter(m => !m.status || m.status === 'pending').length,
    reviews:     pendingReviews.length,
  };

  const render = () => {
    const props = { toast: addToast, isAdmin };
    switch (tab) {
      case 'overview':     return <OverviewPanel goTo={setTab} isAdmin={isAdmin} />;
      case 'enquiries':    return <EnquiriesPanel   {...props} />;
      case 'memberships':  return <MembershipsPanel {...props} />;
      case 'reviews':
      case 'published':    return <ReviewsPanel     {...props} />;
      case 'facilitators': return <FacilitatorsPanel {...props} />;
      case 'gallery':      return <GalleryPanel      {...props} />;
      case 'plans':        return <PlansPanel         {...props} />;
      case 'classes':      return <ClassesPanel       {...props} />;
      case 'achievements': return <AchievementsPanel  {...props} />;
      case 'schedule':     return <SchedulePanel      {...props} />;
      case 'site':         return <SitePanel          {...props} />;
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ width: 130, background: T.surf, borderRight: `1px solid ${T.bdr}`, display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' }}>
        <div style={{ padding: '12px 8px', borderBottom: `1px solid ${T.bdr}`, textAlign: 'center' }}>
          <img src="/images/logo.png" alt="Logo" style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', border: `1px solid ${T.gold}44`, display: 'block', margin: '0 auto 4px' }} />
          <div style={{ color: T.gold, fontSize: 9, fontWeight: 700 }}>DAYS Admin</div>
          {isAdmin && <div style={{ color: '#6ee7b7', fontSize: 8, marginTop: 2 }}>● MongoDB Live</div>}
          {!isAdmin && <div style={{ color: '#fca5a5', fontSize: 8, marginTop: 2 }}>○ Offline Mode</div>}
        </div>
        <nav style={{ flex: 1, padding: '4px 0' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 5, width: '100%',
              padding: '6px 8px', background: 'none',
              borderLeft: `2px solid ${tab === t.id ? T.gold : 'transparent'}`,
              backgroundColor: tab === t.id ? `${T.gold}11` : 'transparent',
              color: tab === t.id ? T.gold : T.muted,
              fontSize: 10, fontWeight: 500, cursor: 'pointer', textAlign: 'left',
              transition: 'all .15s', position: 'relative',
            }}>
              <span style={{ fontSize: 12 }}>{t.icon}</span>
              {t.label}
              {badges[t.id] > 0 && (
                <span style={{ marginLeft: 'auto', background: 'rgba(192,57,43,.8)', color: '#fff', borderRadius: 999, fontSize: 8, padding: '1px 4px', fontWeight: 700 }}>
                  {badges[t.id]}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div style={{ padding: 8, borderTop: `1px solid ${T.bdr}` }}>
          <button onClick={onClose} style={{ width: '100%', padding: '5px 0', background: 'transparent', border: `1px solid ${T.bdr}`, borderRadius: 8, color: T.muted, fontSize: 9, cursor: 'pointer' }}>
            Close ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .15 }}>
            {render()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Toasts */}
      <AnimatePresence>
        {toasts.map(t => <Toast key={t.tid} msg={t.msg} ok={t.ok} onDone={() => setToasts(p => p.filter(x => x.tid !== t.tid))} />)}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   ROOT EXPORT
════════════════════════════════════════════════════ */
export default function InAppDashboard() {
  const { dashOpen, setDashOpen, dashUnlocked, unlockDash } = useApp();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if already logged in as admin
  useEffect(() => {
    const token = API.getToken();
    if (token) API.getMe().then(() => setIsAdmin(true)).catch(() => { API.clearToken(); setIsAdmin(false); });
  }, []);

  const handleUnlock = useCallback((adminMode) => {
    unlockDash();
    setIsAdmin(adminMode);
  }, [unlockDash]);

  if (!dashOpen) return null;

  return (
    <AnimatePresence>
      <motion.div key="dash-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(2,5,3,.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
        onClick={e => { if (e.target === e.currentTarget) setDashOpen(false); }}>
        <motion.div initial={{ scale: .93, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: .93, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          style={{ width: '100%', maxWidth: 940, height: dashUnlocked ? '88vh' : 'auto', background: T.bg, border: `1px solid ${T.bdr}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,.7)', display: 'flex', flexDirection: 'column', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
          {!dashUnlocked
            ? <AuthGate onUnlock={handleUnlock} onClose={() => setDashOpen(false)} />
            : <Dashboard onClose={() => setDashOpen(false)} isAdmin={isAdmin} />
          }
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
