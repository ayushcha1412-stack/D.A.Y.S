/**
 * InAppDashboard — Complete Admin Control Centre
 * Opens when Plus button is tapped 2× on the floating action button.
 * Covers every section of the website.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import * as API from '../utils/api';

/* ─── Theme ─────────────────────────────────────────── */
const T = {
  bg: '#060e09', surf: '#0d1f12', surf2: '#142a18',
  bdr: '#1e3a22', gold: '#d4a843', goldL: '#f5d98b',
  cream: '#f0e8d0', muted: '#6a8870', red: '#c0392b',
  green: '#115c45', greenT: '#6ee7b7',
};

/* ─── NAV SECTIONS ───────────────────────────────────── */
const SECTIONS = [
  { id: 'overview',      icon: '📊', label: 'Overview' },
  { id: 'enquiries',     icon: '✉️',  label: 'Enquiries' },
  { id: 'memberships',   icon: '🎫',  label: 'Memberships' },
  { id: 'payments',      icon: '💳',  label: 'Payments' },
  { id: 'reviews',       icon: '⭐',  label: 'Reviews' },
  { id: 'facilitators',  icon: '🧘',  label: 'Facilitators' },
  { id: 'gallery',       icon: '🖼️',  label: 'Gallery' },
  { id: 'classes',       icon: '📚',  label: 'Classes' },
  { id: 'plans',         icon: '💎',  label: 'Plans' },
  { id: 'achievements',  icon: '🏆',  label: 'Achievements' },
  { id: 'schedule',      icon: '🕐',  label: 'Schedule' },
  { id: 'config',        icon: '⚙️',  label: 'Site Config' },
];

/* ─── ATOMS ──────────────────────────────────────────── */
function Btn({ children, onClick, v = 'primary', sm, disabled, full, style: sx }) {
  const bg  = { primary: T.gold, ghost: 'transparent', danger: T.red + 'cc', success: T.green + 'cc' }[v] ?? T.gold;
  const col = { primary: '#000', ghost: T.cream, danger: '#fff', success: T.greenT }[v] ?? '#000';
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: bg, color: col,
      border: v === 'ghost' ? `1px solid ${T.bdr}` : 'none',
      padding: sm ? '3px 10px' : '7px 15px',
      borderRadius: 8, fontSize: sm ? 11 : 12, fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .4 : 1, width: full ? '100%' : 'auto',
      fontFamily: 'inherit', transition: 'opacity .15s', ...sx,
    }}>{children}</button>
  );
}

function Fld({ label, value, onChange, type = 'text', rows, ph }) {
  const base = { width: '100%', background: T.bg, border: `1px solid ${T.bdr}`, borderRadius: 8, padding: '6px 10px', color: T.cream, fontSize: 12, outline: 'none', boxSizing: 'border-box', marginTop: 3, fontFamily: 'inherit', resize: 'vertical' };
  return (
    <div style={{ marginBottom: 10 }}>
      {label && <div style={{ fontSize: 10, color: T.muted, textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</div>}
      {rows ? <textarea value={value ?? ''} onChange={e => onChange(e.target.value)} rows={rows} placeholder={ph} style={base} />
             : <input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={ph} style={base} />}
    </div>
  );
}

function Sel({ label, value, onChange, opts }) {
  return (
    <div style={{ marginBottom: 10 }}>
      {label && <div style={{ fontSize: 10, color: T.muted, textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</div>}
      <select value={value ?? ''} onChange={e => onChange(e.target.value)} style={{ width: '100%', background: T.bg, border: `1px solid ${T.bdr}`, borderRadius: 8, padding: '6px 10px', color: T.cream, fontSize: 12, outline: 'none', marginTop: 3, fontFamily: 'inherit' }}>
        {opts.map(o => <option key={o.v ?? o} value={o.v ?? o}>{o.l ?? o}</option>)}
      </select>
    </div>
  );
}

function Tag({ label, color = T.gold }) {
  return <span style={{ display: 'inline-block', fontSize: 10, padding: '1px 7px', borderRadius: 999, background: `${color}22`, color, border: `1px solid ${color}44`, whiteSpace: 'nowrap' }}>{label}</span>;
}

function Card({ title, badge, children, action }) {
  return (
    <div style={{ background: T.surf, border: `1px solid ${T.bdr}`, borderRadius: 12, marginBottom: 14, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: `1px solid ${T.bdr}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: T.cream, fontWeight: 600, fontSize: 13 }}>{title}</span>
          {badge > 0 && <span style={{ background: T.red + 'aa', color: '#fff', borderRadius: 999, fontSize: 10, padding: '1px 7px', fontWeight: 700 }}>{badge}</span>}
        </div>
        {action}
      </div>
      <div style={{ padding: '12px 14px' }}>{children}</div>
    </div>
  );
}

function Tbl({ cols, rows, empty = 'Nothing yet.' }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
        <thead><tr>{cols.map(h => <th key={h} style={{ textAlign: 'left', padding: '5px 8px', color: T.muted, fontSize: 10, textTransform: 'uppercase', borderBottom: `1px solid ${T.bdr}`, whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.length === 0
            ? <tr><td colSpan={cols.length} style={{ padding: '24px 8px', textAlign: 'center', color: T.muted }}>{empty}</td></tr>
            : rows.map((r, i) => <tr key={i} style={{ borderBottom: `1px solid ${T.bdr}44` }}>{r.map((c, j) => <td key={j} style={{ padding: '6px 8px', color: T.cream, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>{c}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}

function Spinner() { return <div style={{ color: T.muted, fontSize: 12, padding: '20px 0', textAlign: 'center' }}>Loading…</div>; }

const fmt  = d => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';
const eid  = x => x?._id || x?.id || '';
const API_ORIGIN = import.meta.env.VITE_API_URL || '';
function rImg(img) {
  if (!img) return null;
  if (typeof img !== 'string') return null;
  if (img.startsWith('http')) return img;
  if (img.startsWith('/uploads')) return `${API_ORIGIN}${img}`;
  return img;
}

/* ─── Toast ──────────────────────────────────────────── */
function Toast({ msg, ok, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 80, opacity: 0 }}
      style={{ position: 'fixed', bottom: 90, right: 16, zIndex: 99999, background: ok ? '#0d3d28' : '#3d0d0d', color: ok ? T.greenT : '#fca5a5', border: `1px solid ${ok ? '#2ecc7144' : '#e74c3c44'}`, borderRadius: 10, padding: '8px 16px', fontSize: 12, fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,.5)' }}>
      {msg}
    </motion.div>
  );
}

/* ─── AuthGate ───────────────────────────────────────── */
const OFFLINE_PIN = '2024';
function AuthGate({ onUnlock, onClose }) {
  const [tab, setTab]     = useState('login');
  const [email, setEmail] = useState('admin@anyogainstitute.org');
  const [pwd, setPwd]     = useState('');
  const [pin, setPin]     = useState('');
  const [err, setErr]     = useState('');
  const [busy, setBusy]   = useState(false);
  const [tries, setTries] = useState(0);
  const [locked, setLocked] = useState(false);

  const doLogin = async () => {
    setErr(''); setBusy(true);
    try { const r = await API.adminLogin(email, pwd); API.setToken(r.token); onUnlock(true); }
    catch (e) { setErr(e.message || 'Login failed'); }
    finally { setBusy(false); }
  };

  const pressPin = k => {
    if (locked) return;
    if (k === '⌫') { setPin(p => p.slice(0, -1)); setErr(''); return; }
    const next = pin + k;
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === OFFLINE_PIN) { onUnlock(false); return; }
        const t = tries + 1; setTries(t); setPin('');
        if (t >= 5) { setLocked(true); setErr('Too many attempts. Wait 1 min.'); setTimeout(() => { setLocked(false); setTries(0); setErr(''); }, 60000); }
        else setErr(`Wrong PIN — ${5 - t} left`);
      }, 120);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px', textAlign: 'center', minHeight: 460, justifyContent: 'center' }}>
      <img src="/images/logo.png" alt="" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${T.gold}55`, marginBottom: 14 }} />
      <div style={{ color: T.goldL, fontWeight: 700, fontSize: 17, marginBottom: 2 }}>DAYS Admin Dashboard</div>
      <div style={{ color: T.muted, fontSize: 11, marginBottom: 20 }}>DIVY ASHISH YOGA SANSTHAN</div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: T.surf2, borderRadius: 8, padding: 3 }}>
        {[['login', '📧 Admin Login'], ['pin', '🔢 Offline PIN']].map(([m, l]) => (
          <button key={m} onClick={() => { setTab(m); setErr(''); }} style={{ padding: '4px 14px', borderRadius: 6, border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', background: tab === m ? T.gold : 'transparent', color: tab === m ? '#000' : T.muted }}>
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
          <div style={{ color: T.muted, fontSize: 10, marginTop: 10 }}>admin@anyogainstitute.org</div>
        </div>
      ) : (
        <div>
          <div style={{ color: T.muted, fontSize: 11, marginBottom: 14 }}>4-digit PIN (offline mode)</div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 18 }}>
            {[0,1,2,3].map(i => <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', border: `2px solid ${pin.length > i ? T.gold : T.bdr}`, background: pin.length > i ? T.gold : 'transparent', transition: 'all .15s' }} />)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, width: 200 }}>
            {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((k, i) => (
              <button key={i} disabled={locked || k === ''} onClick={() => k !== '' && pressPin(String(k))}
                style={{ height: 44, borderRadius: 10, background: k === '' ? 'transparent' : T.surf, border: `1px solid ${k === '' ? 'transparent' : T.bdr}`, color: k === '⌫' ? T.gold : T.cream, fontSize: 14, fontWeight: 600, cursor: k === '' ? 'default' : 'pointer', opacity: locked ? .4 : 1, visibility: k === '' ? 'hidden' : 'visible' }}>
                {k}
              </button>
            ))}
          </div>
          {err && <div style={{ color: '#fca5a5', fontSize: 11, marginTop: 10 }}>{err}</div>}
        </div>
      )}
      <button onClick={onClose} style={{ marginTop: 18, background: 'none', border: 'none', color: T.muted, fontSize: 11, cursor: 'pointer' }}>Cancel</button>
    </div>
  );
}

/* ─── OVERVIEW ───────────────────────────────────────── */
function Overview({ goTo, isAdmin }) {
  const { pendingEnquiries, pendingMemberships, pendingReviews, siteReviews, siteFacilitators, sitePlans, siteGallery, siteClasses, siteAchievements, siteSchedule } = useApp();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (isAdmin) API.getDashboardStats().then(r => setStats(r.data)).catch(() => {});
  }, [isAdmin]);

  const cards = [
    { icon: '✉️', label: 'Enquiries',    val: stats?.enquiries    ?? pendingEnquiries.length,   badge: stats?.newEnquiries       ?? pendingEnquiries.filter(e=>!e.status||e.status==='new').length,       tab: 'enquiries' },
    { icon: '🎫', label: 'Memberships',  val: stats?.memberships  ?? pendingMemberships.length, badge: stats?.pendingMemberships ?? pendingMemberships.filter(m=>m.status==='pending'||!m.status).length, tab: 'memberships' },
    { icon: '💳', label: 'Payments',     val: '—',                                              badge: 0,                                                                                                   tab: 'payments' },
    { icon: '⭐', label: 'Reviews',      val: stats?.reviews      ?? siteReviews.length,        badge: stats?.pendingReviews     ?? pendingReviews.length,                                                  tab: 'reviews' },
    { icon: '🧘', label: 'Facilitators', val: stats?.facilitators ?? siteFacilitators.length,   badge: 0,                                                                                                   tab: 'facilitators' },
    { icon: '🖼️', label: 'Gallery',      val: siteGallery.length,                               badge: 0,                                                                                                   tab: 'gallery' },
    { icon: '📚', label: 'Classes',      val: siteClasses.length,                               badge: 0,                                                                                                   tab: 'classes' },
    { icon: '💎', label: 'Plans',        val: sitePlans.length,                                 badge: 0,                                                                                                   tab: 'plans' },
    { icon: '🏆', label: 'Achievements', val: siteAchievements.length,                          badge: 0,                                                                                                   tab: 'achievements' },
    { icon: '🕐', label: 'Schedule',     val: siteSchedule.length,                              badge: 0,                                                                                                   tab: 'schedule' },
    { icon: '⚙️', label: 'Config',       val: '—',                                              badge: 0,                                                                                                   tab: 'config' },
  ];

  return (
    <div>
      {/* Grid stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7, marginBottom: 14 }}>
        {cards.map(c => (
          <div key={c.label} onClick={() => goTo(c.tab)} style={{ background: T.surf, border: `1px solid ${c.badge>0 ? T.gold+'66' : T.bdr}`, borderRadius: 10, padding: '10px 6px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: 18 }}>{c.icon}</div>
            <div style={{ color: T.gold, fontSize: 17, fontWeight: 700, lineHeight: 1.1, marginTop: 2 }}>{c.val}</div>
            <div style={{ color: T.muted, fontSize: 9, textTransform: 'uppercase', marginTop: 1 }}>{c.label}</div>
            {c.badge>0 && <div style={{ marginTop: 3, background: T.red+'aa', color:'#fff', borderRadius: 999, fontSize: 9, padding: '1px 6px', display: 'inline-block' }}>{c.badge} new</div>}
          </div>
        ))}
      </div>

      {/* Quick links */}
      <Card title="🚀 Quick Actions">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {SECTIONS.filter(s => s.id !== 'overview').map(s => (
            <button key={s.id} onClick={() => goTo(s.id)} style={{ background: T.surf2, border: `1px solid ${T.bdr}`, borderRadius: 8, padding: '5px 12px', fontSize: 11, color: T.cream, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>
      </Card>

      {isAdmin && (
        <Card title="🖥️ Full Admin Panel">
          <p style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>Full-featured server panel with pagination, image uploads and all settings.</p>
          <a href={`${API_ORIGIN}/admin`} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: T.gold, color: '#000', padding: '7px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
            Open Full Admin Panel ↗
          </a>
        </Card>
      )}
    </div>
  );
}

/* ─── ENQUIRIES ──────────────────────────────────────── */
function Enquiries({ toast, isAdmin }) {
  const { pendingEnquiries, updateEnquiries } = useApp();
  const [items, setItems] = useState([]);
  const [busy, setBusy]   = useState(true);
  const [view, setView]   = useState(null);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setBusy(true);
    try {
      if (isAdmin) { const r = await API.getEnquiries(); const d = r.data||[]; setItems(d); updateEnquiries(d); }
      else setItems(pendingEnquiries);
    } catch { setItems(pendingEnquiries); }
    setBusy(false);
  }, [isAdmin]); // eslint-disable-line
  useEffect(() => { load(); }, [load]);

  const shown = items.filter(e => !search || [e.name,e.phone,e.service,e.email].some(f=>f?.toLowerCase().includes(search.toLowerCase())));

  const mark = async (eid2, status) => {
    try {
      if (isAdmin) await API.updateEnquiry(eid2, { status });
      const u = items.map(e => eid(e)===eid2 ? {...e,status} : e); setItems(u); updateEnquiries(u); toast('Updated ✓');
    } catch (e) { toast(e.message, false); }
  };

  const del = async (eid2) => {
    if (!confirm('Delete?')) return;
    try {
      if (isAdmin) await API.deleteEnquiry(eid2);
      const u = items.filter(e=>eid(e)!==eid2); setItems(u); updateEnquiries(u); toast('Deleted');
    } catch (e) { toast(e.message, false); }
  };

  if (view) {
    const e = items.find(x=>eid(x)===view); if (!e) { setView(null); return null; }
    return (
      <Card title={`✉️ ${e.name}`} action={<Btn v="ghost" sm onClick={()=>setView(null)}>← Back</Btn>}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, fontSize:12, marginBottom:10 }}>
          {[['Name',e.name],['Phone',e.phone],['Email',e.email||'—'],['Service',e.service],['Date',fmt(e.date||e.createdAt)],['Status',e.status||'new']].map(([l,v])=>(
            <div key={l}><span style={{color:T.muted}}>{l}: </span>{l==='Phone'?<a href={`tel:+91${v}`} style={{color:T.gold}}>{v}</a>:<span style={{color:T.cream}}>{v}</span>}</div>
          ))}
        </div>
        <div style={{ background:T.bg, border:`1px solid ${T.bdr}`, borderRadius:8, padding:'8px 10px', fontSize:12, marginBottom:10, whiteSpace:'pre-wrap', color:T.cream }}>{e.message}</div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          <Btn v="success" sm onClick={()=>{mark(eid(e),'replied');setView(null);}}>✓ Replied</Btn>
          <Btn v="ghost" sm onClick={()=>mark(eid(e),'read')}>Mark Read</Btn>
          <a href={`https://wa.me/91${e.phone}?text=Namaste ${e.name}! Regarding your enquiry about ${e.service}.`} target="_blank" rel="noopener noreferrer"><Btn v="success" sm>WhatsApp ↗</Btn></a>
          <Btn v="danger" sm onClick={()=>{del(eid(e));setView(null);}}>Delete</Btn>
        </div>
      </Card>
    );
  }

  return (
    <Card title="✉️ Enquiries" badge={shown.filter(e=>!e.status||e.status==='new').length}>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{ width:'100%', background:T.bg, border:`1px solid ${T.bdr}`, borderRadius:8, padding:'6px 10px', color:T.cream, fontSize:11, outline:'none', marginBottom:10, boxSizing:'border-box' }} />
      {busy ? <Spinner/> : <Tbl cols={['Date','Name','Phone','Service','Status','Act']} rows={shown.map(e=>[fmt(e.date||e.createdAt),e.name,e.phone,e.service,<Tag key="s" label={e.status||'new'} color={e.status==='replied'?T.greenT:e.status==='read'?T.muted:T.gold}/>,<div key="a" style={{display:'flex',gap:3}}><Btn v="ghost" sm onClick={()=>setView(eid(e))}>View</Btn><Btn v="danger" sm onClick={()=>del(eid(e))}>Del</Btn></div>])} empty="No enquiries yet." />}
    </Card>
  );
}

/* ─── MEMBERSHIPS ────────────────────────────────────── */
function Memberships({ toast, isAdmin }) {
  const { pendingMemberships, updateMemberships } = useApp();
  const [items, setItems] = useState([]);
  const [busy, setBusy]   = useState(true);
  const [view, setView]   = useState(null);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setBusy(true);
    try {
      if (isAdmin) { const r = await API.getMemberships(); const d=r.data||[]; setItems(d); updateMemberships(d); }
      else setItems(pendingMemberships);
    } catch { setItems(pendingMemberships); }
    setBusy(false);
  }, [isAdmin]); // eslint-disable-line
  useEffect(() => { load(); }, [load]);

  const shown = items.filter(m=>!search||[m.name,m.phone,m.email].some(f=>f?.toLowerCase().includes(search.toLowerCase())));

  const setStatus = async (eid2, status) => {
    try {
      if (isAdmin) await API.updateMembership(eid2, { status });
      const u=items.map(m=>eid(m)===eid2?{...m,status}:m); setItems(u); updateMemberships(u); toast('Updated ✓');
    } catch (e) { toast(e.message, false); }
  };

  const del = async (eid2) => {
    if (!confirm('Delete?')) return;
    try {
      if (isAdmin) await API.deleteMembership(eid2);
      const u=items.filter(m=>eid(m)!==eid2); setItems(u); updateMemberships(u); toast('Deleted');
    } catch (e) { toast(e.message, false); }
  };

  if (view) {
    const m=items.find(x=>eid(x)===view); if (!m) { setView(null); return null; }
    return (
      <Card title={`🎫 ${m.name}`} action={<Btn v="ghost" sm onClick={()=>setView(null)}>← Back</Btn>}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, fontSize:12, marginBottom:10 }}>
          {[['Name',m.name],['Phone',m.phone],['Age',m.age],['Gender',m.gender||'—'],['Email',m.email||'—'],['Level',m.level],['Mode',m.mode],['Type',m.membershipType],['Date',fmt(m.date||m.createdAt)]].map(([l,v])=>(
            <div key={l}><span style={{color:T.muted}}>{l}: </span>{l==='Phone'?<a href={`tel:+91${v}`} style={{color:T.gold}}>{v}</a>:<span style={{color:T.cream}}>{v}</span>}</div>
          ))}
          {m.goals?.length>0&&<div style={{gridColumn:'1/-1'}}><span style={{color:T.muted}}>Goals: </span><span style={{color:T.cream}}>{m.goals.join(', ')}</span></div>}
        </div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          <Btn v="success" sm onClick={()=>{setStatus(eid(m),'active');setView(null);}}>✓ Activate</Btn>
          <Btn v="ghost" sm onClick={()=>{setStatus(eid(m),'cancelled');setView(null);}}>Cancel</Btn>
          <a href={`https://wa.me/91${m.phone}?text=Namaste ${m.name}! Your membership is confirmed. Welcome to DIVY ASHISH YOGA SANSTHAN!`} target="_blank" rel="noopener noreferrer"><Btn v="success" sm>WhatsApp ↗</Btn></a>
          <Btn v="danger" sm onClick={()=>{del(eid(m));setView(null);}}>Delete</Btn>
        </div>
      </Card>
    );
  }

  return (
    <Card title="🎫 Memberships" badge={shown.filter(m=>!m.status||m.status==='pending').length}>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{ width:'100%', background:T.bg, border:`1px solid ${T.bdr}`, borderRadius:8, padding:'6px 10px', color:T.cream, fontSize:11, outline:'none', marginBottom:10, boxSizing:'border-box' }} />
      {busy?<Spinner/>:<Tbl cols={['Date','Name','Phone','Type','Level','Status','Act']} rows={shown.map(m=>[fmt(m.date||m.createdAt),m.name,m.phone,<Tag key="t" label={m.membershipType} color={T.gold}/>,m.level,<Tag key="s" label={m.status||'pending'} color={m.status==='active'?T.greenT:T.gold}/>,<div key="a" style={{display:'flex',gap:3}}><Btn v="ghost" sm onClick={()=>setView(eid(m))}>View</Btn><Btn v="danger" sm onClick={()=>del(eid(m))}>Del</Btn></div>])} empty="No memberships yet." />}
    </Card>
  );
}

/* ─── PAYMENTS ───────────────────────────────────────── */
function Payments({ toast, isAdmin }) {
  const [items, setItems] = useState([]);
  const [busy, setBusy]   = useState(true);
  const [view, setView]   = useState(null);
  const [utr, setUtr]     = useState('');

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const r = await fetch(`${API_ORIGIN}/api/payment/list`, { headers: { Authorization: `Bearer ${API.getToken()}` } });
      const d = await r.json(); setItems(d.data || []);
    } catch { setItems([]); }
    setBusy(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const confirm = async (orderId) => {
    if (!utr.trim()) { toast('Enter UTR number', false); return; }
    try {
      const r = await fetch(`${API_ORIGIN}/api/payment/confirm`, { method:'POST', headers:{'Content-Type':'application/json',Authorization:`Bearer ${API.getToken()}`}, body: JSON.stringify({orderId, utrNumber:utr.trim()}) });
      const d = await r.json(); if (d.success) { toast('Payment confirmed ✓'); setView(null); setUtr(''); load(); } else toast(d.message, false);
    } catch (e) { toast(e.message, false); }
  };

  const statusColor = s => ({ created:T.gold, paid:T.greenT, failed:'#fca5a5', expired:T.muted })[s] || T.muted;

  if (view) {
    const p = items.find(x=>x.orderId===view); if (!p) { setView(null); return null; }
    return (
      <Card title={`💳 ${p.name}`} action={<Btn v="ghost" sm onClick={()=>setView(null)}>← Back</Btn>}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, fontSize:12, marginBottom:10 }}>
          {[['Name',p.name],['Phone',p.phone],['Plan',p.planLabel],['Amount',`₹${p.amountRupees}`],['Status',p.status],['Date',fmt(p.createdAt)],['Timing',p.timing||'—'],['UTR',p.utrNumber||'—']].map(([l,v])=>(
            <div key={l}><span style={{color:T.muted}}>{l}: </span><span style={{color:l==='Amount'?T.gold:l==='Status'?statusColor(p.status):T.cream}}>{v}</span></div>
          ))}
          <div style={{gridColumn:'1/-1',wordBreak:'break-all'}}><span style={{color:T.muted}}>Order ID: </span><span style={{color:T.cream,fontFamily:'monospace',fontSize:10}}>{p.orderId}</span></div>
        </div>
        {p.status==='created'&&(
          <div style={{ background:T.bg, border:`1px solid ${T.gold}44`, borderRadius:10, padding:12, marginTop:8 }}>
            <div style={{ color:T.gold, fontSize:11, fontWeight:600, marginBottom:8 }}>✓ Confirm Payment Received</div>
            <Fld label="UTR / Transaction Reference *" value={utr} onChange={setUtr} ph="12-digit UTR number" />
            <Btn v="success" onClick={()=>confirm(p.orderId)}>Confirm & Activate</Btn>
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card title="💳 Payments" badge={items.filter(p=>p.status==='created').length}>
      <div style={{ color:T.muted, fontSize:11, marginBottom:8 }}>UPI: ashishku325@okhdfcbank · Confirm after receiving payment in your UPI app</div>
      {busy?<Spinner/>:<Tbl cols={['Date','Name','Plan','Amount','Status','Act']} rows={items.map(p=>[fmt(p.createdAt),p.name,p.planLabel?.slice(0,20),`₹${p.amountRupees}`,<Tag key="s" label={p.status} color={statusColor(p.status)}/>,<Btn key="a" v={p.status==='created'?'primary':'ghost'} sm onClick={()=>{setView(p.orderId);setUtr('');}}>{p.status==='created'?'Confirm':'View'}</Btn>])} empty="No payments yet." />}
    </Card>
  );
}

/* ─── REVIEWS ────────────────────────────────────────── */
function Reviews({ toast, isAdmin }) {
  const { pendingReviews, updatePendingReviews, siteReviews, updateReviews } = useApp();
  const [all, setAll]   = useState([]);
  const [busy, setBusy] = useState(true);
  const [editing, setEd] = useState(null);
  const [form, setForm] = useState({});

  const load = useCallback(async () => {
    setBusy(true);
    try {
      if (isAdmin) { const r=await API.getReviews(); setAll(r.data||[]); }
      else setAll([...pendingReviews,...siteReviews]);
    } catch { setAll([...pendingReviews,...siteReviews]); }
    setBusy(false);
  }, [isAdmin]); // eslint-disable-line
  useEffect(()=>{load();},[load]);

  const pending   = isAdmin ? all.filter(r=>!r.approved) : pendingReviews;
  const published = isAdmin ? all.filter(r=>r.approved)  : siteReviews;

  const approve = async (r) => {
    try {
      if (isAdmin) await API.approveReview(eid(r));
      else { updatePendingReviews(pendingReviews.filter(p=>p.id!==r.id)); updateReviews([{...r,verified:true},...siteReviews]); }
      await load(); toast('Published ✓');
    } catch (e) { toast(e.message,false); }
  };

  const del = async (eid2, isPending) => {
    if (!confirm('Delete?')) return;
    try {
      if (isAdmin) await API.deleteReview(eid2);
      else if (isPending) updatePendingReviews(pendingReviews.filter(p=>p.id!==eid2));
      else updateReviews(siteReviews.filter(r=>r.id!==eid2));
      await load(); toast('Deleted');
    } catch (e) { toast(e.message,false); }
  };

  const save = async () => {
    if (!form.name?.trim()||!form.review?.trim()) return;
    try {
      if (editing==='new') { const r=await API.submitReview({...form,approved:false}); if (isAdmin) await API.approveReview(r.data?._id||eid(r.data)); }
      else await API.updateReview(editing, form);
      await load(); setEd(null); setForm({}); toast('Saved ✓');
    } catch { updateReviews([{...form,id:Date.now(),verified:true},...siteReviews]); setEd(null); setForm({}); toast('Saved ✓'); }
  };

  const cats = ['Group Yoga','Online Yoga','Personal Yoga','Yogasana Sports',"Children's Yoga",'General','Other'];

  return (
    <div>
      {pending.length>0 && (
        <Card title="⏳ Pending Approval" badge={pending.length}>
          {pending.map(r=>(
            <div key={eid(r)} style={{ background:T.bg, border:`1px solid ${T.gold}33`, borderRadius:8, padding:'10px 12px', marginBottom:8 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{color:T.cream,fontWeight:600,fontSize:12}}>{r.name}</span>
                <span style={{color:T.muted,fontSize:10}}>{'★'.repeat(r.rating||5)} · {fmt(r.date||r.createdAt)}</span>
              </div>
              <p style={{color:'#c8d8c0',fontSize:11,margin:'0 0 8px',lineHeight:1.5}}>{r.review}</p>
              <div style={{display:'flex',gap:6}}>
                <Btn v="success" sm onClick={()=>approve(r)}>✓ Approve</Btn>
                <Btn v="danger" sm onClick={()=>del(eid(r),true)}>Delete</Btn>
              </div>
            </div>
          ))}
        </Card>
      )}

      <Card title={`⭐ Published (${published.length})`}
        action={<Btn sm onClick={()=>{setForm({name:'',category:'Group Yoga',rating:5,review:''});setEd('new');}}>+ Add</Btn>}>
        {editing!==null&&(
          <div style={{ background:T.bg, border:`1px solid ${T.bdr}`, borderRadius:10, padding:12, marginBottom:10 }}>
            <Fld label="Name *" value={form.name||''} onChange={v=>setForm(p=>({...p,name:v}))} />
            <Sel label="Category" value={form.category||'Group Yoga'} onChange={v=>setForm(p=>({...p,category:v}))} opts={cats} />
            <div style={{marginBottom:10}}>
              <div style={{fontSize:10,color:T.muted,textTransform:'uppercase',letterSpacing:'.06em'}}>Rating</div>
              <div style={{display:'flex',gap:4,marginTop:3}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setForm(p=>({...p,rating:n}))} style={{fontSize:20,background:'none',border:'none',cursor:'pointer',color:(form.rating||5)>=n?T.gold:T.bdr}}>★</button>)}</div>
            </div>
            <Fld label="Review *" value={form.review||''} onChange={v=>setForm(p=>({...p,review:v}))} rows={3} />
            <div style={{display:'flex',gap:6}}><Btn onClick={save}>Save</Btn><Btn v="ghost" onClick={()=>{setEd(null);setForm({});}}>Cancel</Btn></div>
          </div>
        )}
        {busy?<Spinner/>:<Tbl cols={['Name','Category','Rating','Preview','Act']} rows={published.map(r=>[r.name,r.category||'—','★'.repeat(r.rating||5),(r.review||'').slice(0,40)+'…',<div key="a" style={{display:'flex',gap:3}}><Btn v="ghost" sm onClick={()=>{setForm({...r});setEd(eid(r));}}>Edit</Btn><Btn v="danger" sm onClick={()=>del(eid(r),false)}>Del</Btn></div>])} empty="No published reviews." />}
      </Card>
    </div>
  );
}

/* ─── FACILITATORS ───────────────────────────────────── */
function Facilitators({ toast, isAdmin }) {
  const { siteFacilitators, updateFacilitators } = useApp();
  const [items, setItems] = useState(siteFacilitators||[]);
  const [busy, setBusy]   = useState(false);
  const [editing, setEd]  = useState(null);
  const [form, setForm]   = useState({});

  const load = useCallback(async () => {
    setBusy(true);
    try { const r=await API.getFacilitators(); const d=r.data||[]; setItems(d); updateFacilitators(d); }
    catch { setItems(siteFacilitators); }
    setBusy(false);
  }, []); // eslint-disable-line
  useEffect(()=>{load();},[load]);

  const save = async () => {
    if (!form.name?.trim()||!form.title?.trim()) return;
    const body = { ...form, specialization: (form.specialization||'').split(',').map(s=>s.trim()).filter(Boolean), certifications: (form.certifications||'').split(',').map(s=>s.trim()).filter(Boolean) };
    try {
      if (editing==='new') await API.createFacilitator(body); else await API.updateFacilitator(editing, body);
      await load(); setEd(null); setForm({}); toast('Saved ✓');
    } catch (e) { toast(e.message,false); }
  };

  const del = async (eid2) => {
    if (!confirm('Delete facilitator?')) return;
    try { await API.deleteFacilitator(eid2); await load(); toast('Deleted'); }
    catch (e) { toast(e.message,false); }
  };

  const openForm = (f=null) => {
    if (f) setForm({ ...f, specialization: (f.specialization||[]).join(', '), certifications: (f.certifications||[]).join(', ') });
    else setForm({ name:'', title:'', qualification:'', experience:'', specialization:'', certifications:'', biography:'', featured:false, isActive:true, order:0 });
    setEd(f ? eid(f) : 'new');
  };

  return (
    <Card title={`🧘 Facilitators (${items.length})`} action={<Btn sm onClick={()=>openForm()}>+ Add</Btn>}>
      {editing!==null&&(
        <div style={{ background:T.bg, border:`1px solid ${T.bdr}`, borderRadius:10, padding:12, marginBottom:12 }}>
          <div style={{color:T.goldL,fontWeight:600,fontSize:12,marginBottom:10}}>{editing==='new'?'Add Facilitator':'Edit Facilitator'}</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 10px'}}>
            <Fld label="Name *" value={form.name||''} onChange={v=>setForm(p=>({...p,name:v}))} />
            <Fld label="Title *" value={form.title||''} onChange={v=>setForm(p=>({...p,title:v}))} />
            <Fld label="Qualification" value={form.qualification||''} onChange={v=>setForm(p=>({...p,qualification:v}))} />
            <Fld label="Experience" value={form.experience||''} onChange={v=>setForm(p=>({...p,experience:v}))} />
          </div>
          <Fld label="Specialization (comma-separated)" value={form.specialization||''} onChange={v=>setForm(p=>({...p,specialization:v}))} />
          <Fld label="Certifications (comma-separated)" value={form.certifications||''} onChange={v=>setForm(p=>({...p,certifications:v}))} />
          <Fld label="Biography" value={form.biography||''} onChange={v=>setForm(p=>({...p,biography:v}))} rows={3} />
          <div style={{display:'flex',gap:12,marginBottom:10,fontSize:12}}>
            <label style={{display:'flex',gap:6,cursor:'pointer',color:T.cream}}><input type="checkbox" checked={!!form.featured} onChange={e=>setForm(p=>({...p,featured:e.target.checked}))} /> Featured</label>
            <label style={{display:'flex',gap:6,cursor:'pointer',color:T.cream}}><input type="checkbox" checked={form.isActive!==false} onChange={e=>setForm(p=>({...p,isActive:e.target.checked}))} /> Active</label>
          </div>
          <div style={{display:'flex',gap:6}}><Btn onClick={save}>Save</Btn><Btn v="ghost" onClick={()=>{setEd(null);setForm({});}}>Cancel</Btn></div>
        </div>
      )}
      {busy?<Spinner/>:(
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {items.map(f=>(
            <div key={eid(f)} style={{ display:'flex', alignItems:'center', gap:10, background:T.bg, border:`1px solid ${T.bdr}`, borderRadius:8, padding:'8px 10px' }}>
              {rImg(f.image) ? <img src={rImg(f.image)} alt={f.name} style={{width:36,height:36,borderRadius:'50%',objectFit:'cover',border:`1px solid ${T.bdr}`,flexShrink:0}} onError={e=>e.target.style.display='none'} /> : <div style={{width:36,height:36,borderRadius:'50%',background:T.surf2,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🧘</div>}
              <div style={{flex:1,minWidth:0}}>
                <div style={{color:T.cream,fontWeight:600,fontSize:12,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.name}</div>
                <div style={{color:T.muted,fontSize:10,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.title}</div>
              </div>
              <div style={{display:'flex',gap:3,flexShrink:0}}>
                {f.featured&&<Tag label="⭐" color={T.gold}/>}
                {f.isActive===false&&<Tag label="Off" color={T.muted}/>}
                <Btn v="ghost" sm onClick={()=>openForm(f)}>Edit</Btn>
                {isAdmin&&<Btn v="danger" sm onClick={()=>del(eid(f))}>Del</Btn>}
              </div>
            </div>
          ))}
          {items.length===0&&<div style={{color:T.muted,fontSize:12,textAlign:'center',padding:'16px 0'}}>No facilitators yet.</div>}
        </div>
      )}
    </Card>
  );
}

/* ─── GALLERY ────────────────────────────────────────── */
function Gallery({ toast, isAdmin }) {
  const { siteGallery, updateGallery } = useApp();
  const [items, setItems] = useState(siteGallery||[]);
  const [busy, setBusy]   = useState(false);
  const [editing, setEd]  = useState(null);
  const [form, setForm]   = useState({});
  const [file, setFile]   = useState(null);

  const load = useCallback(async () => {
    setBusy(true);
    try { const r=await API.getGallery(); const d=r.data||[]; setItems(d); updateGallery(d); }
    catch { setItems(siteGallery); }
    setBusy(false);
  }, []); // eslint-disable-line
  useEffect(()=>{load();},[load]);

  const saveNew = async () => {
    if (!form.title?.trim()||!file) { toast('Title and image required',false); return; }
    try {
      const fd=new FormData(); fd.append('title',form.title); fd.append('category',form.category||'General'); fd.append('image',file);
      await API.createGalleryItem(fd); await load(); setEd(null); setForm({}); setFile(null); toast('Uploaded ✓');
    } catch (e) { toast(e.message,false); }
  };

  const del = async (eid2) => {
    if (!confirm('Delete?')) return;
    try { await API.deleteGalleryItem(eid2); await load(); toast('Deleted'); }
    catch (e) { toast(e.message,false); }
  };

  return (
    <Card title={`🖼️ Gallery (${items.length})`} action={<Btn sm onClick={()=>{setForm({title:'',category:'General'});setEd('new');}}>+ Upload</Btn>}>
      {editing==='new'&&(
        <div style={{ background:T.bg, border:`1px solid ${T.bdr}`, borderRadius:10, padding:12, marginBottom:12 }}>
          <Fld label="Title *" value={form.title||''} onChange={v=>setForm(p=>({...p,title:v}))} />
          <Fld label="Category" value={form.category||''} onChange={v=>setForm(p=>({...p,category:v}))} />
          <div style={{marginBottom:10}}>
            <div style={{fontSize:10,color:T.muted,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:3}}>Image *</div>
            <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} style={{color:T.cream,fontSize:11}} />
          </div>
          <div style={{display:'flex',gap:6}}><Btn onClick={saveNew}>Upload</Btn><Btn v="ghost" onClick={()=>{setEd(null);setForm({});setFile(null);}}>Cancel</Btn></div>
        </div>
      )}
      {busy?<Spinner/>:(
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>
          {items.map(g=>(
            <div key={eid(g)} style={{position:'relative',borderRadius:8,overflow:'hidden',border:`1px solid ${T.bdr}`,aspectRatio:'1',background:T.surf2}}>
              {rImg(typeof g.image==='string'?g.image:null)?<img src={rImg(typeof g.image==='string'?g.image:null)} alt={g.title} style={{width:'100%',height:'100%',objectFit:'cover'}} />:<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24}}>🖼️</div>}
              <div style={{position:'absolute',bottom:0,left:0,right:0,background:'rgba(0,0,0,.7)',padding:'4px 6px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{color:T.cream,fontSize:9,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>{g.title}</span>
                {isAdmin&&<button onClick={()=>del(eid(g))} style={{background:'none',border:'none',color:'#fca5a5',fontSize:11,cursor:'pointer',flexShrink:0}}>✕</button>}
              </div>
            </div>
          ))}
          {items.length===0&&<div style={{gridColumn:'1/-1',color:T.muted,fontSize:12,textAlign:'center',padding:'16px 0'}}>No gallery items.</div>}
        </div>
      )}
    </Card>
  );
}

/* ─── CLASSES ────────────────────────────────────────── */
function Classes({ toast, isAdmin }) {
  const { siteClasses, updateClasses } = useApp();
  const [items, setItems] = useState(siteClasses||[]);
  const [busy, setBusy]   = useState(false);
  const [editing, setEd]  = useState(null);
  const [form, setForm]   = useState({});

  const load = useCallback(async () => {
    setBusy(true);
    try { const r=await API.getClasses(); const d=r.data||[]; setItems(d); updateClasses(d); }
    catch { setItems(siteClasses); }
    setBusy(false);
  }, []); // eslint-disable-line
  useEffect(()=>{load();},[load]);

  const save = async () => {
    if (!form.title?.trim()) return;
    try {
      const body={...form, suitableFor:(form.suitableFor||'').split(',').map(s=>s.trim()).filter(Boolean)};
      if (editing==='new') await API.createClass(body); else await API.updateClass(editing,body);
      await load(); setEd(null); setForm({}); toast('Saved ✓');
    } catch (e) { toast(e.message,false); }
  };

  const del = async (eid2) => {
    if (!confirm('Delete?')) return;
    try { await API.deleteClass(eid2); await load(); toast('Deleted'); }
    catch (e) { toast(e.message,false); }
  };

  const openForm = (c=null) => {
    setForm(c ? {...c, suitableFor:(c.suitableFor||[]).join(', ')} : {title:'',category:'Offline',mode:'Group',description:'',price:'',timing:'',icon:'🧘',suitableFor:'',isActive:true});
    setEd(c?eid(c):'new');
  };

  return (
    <Card title={`📚 Classes (${items.length})`} action={<Btn sm onClick={()=>openForm()}>+ Add</Btn>}>
      {editing!==null&&(
        <div style={{ background:T.bg, border:`1px solid ${T.bdr}`, borderRadius:10, padding:12, marginBottom:12 }}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 10px'}}>
            <Fld label="Title *" value={form.title||''} onChange={v=>setForm(p=>({...p,title:v}))} />
            <Fld label="Icon" value={form.icon||''} onChange={v=>setForm(p=>({...p,icon:v}))} />
            <Sel label="Category" value={form.category||'Offline'} onChange={v=>setForm(p=>({...p,category:v}))} opts={['Offline','Online']} />
            <Sel label="Mode" value={form.mode||'Group'} onChange={v=>setForm(p=>({...p,mode:v}))} opts={['Group','Personal']} />
            <Fld label="Price" value={form.price||''} onChange={v=>setForm(p=>({...p,price:v}))} />
            <Fld label="Timing" value={form.timing||''} onChange={v=>setForm(p=>({...p,timing:v}))} />
          </div>
          <Fld label="Description" value={form.description||''} onChange={v=>setForm(p=>({...p,description:v}))} rows={2} />
          <Fld label="Suitable For (comma-separated)" value={form.suitableFor||''} onChange={v=>setForm(p=>({...p,suitableFor:v}))} />
          <label style={{display:'flex',gap:6,cursor:'pointer',color:T.cream,fontSize:12,marginBottom:10}}><input type="checkbox" checked={form.isActive!==false} onChange={e=>setForm(p=>({...p,isActive:e.target.checked}))} /> Active</label>
          <div style={{display:'flex',gap:6}}><Btn onClick={save}>Save</Btn><Btn v="ghost" onClick={()=>{setEd(null);setForm({});}}>Cancel</Btn></div>
        </div>
      )}
      {busy?<Spinner/>:<Tbl cols={['Icon','Title','Category','Mode','Price','Act']} rows={items.map(c=>[c.icon||'🧘',c.title,c.category,c.mode,c.price,<div key="a" style={{display:'flex',gap:3}}><Btn v="ghost" sm onClick={()=>openForm(c)}>Edit</Btn>{isAdmin&&<Btn v="danger" sm onClick={()=>del(eid(c))}>Del</Btn>}</div>])} empty="No classes yet." />}
    </Card>
  );
}

/* ─── PLANS ──────────────────────────────────────────── */
function Plans({ toast, isAdmin }) {
  const { sitePlans, updatePlans } = useApp();
  const [items, setItems] = useState(sitePlans||[]);
  const [busy, setBusy]   = useState(false);
  const [editing, setEd]  = useState(null);
  const [form, setForm]   = useState({});

  const load = useCallback(async () => {
    setBusy(true);
    try { const r=await API.getPlans(); const d=r.data||[]; setItems(d); updatePlans(d); }
    catch { setItems(sitePlans); }
    setBusy(false);
  }, []); // eslint-disable-line
  useEffect(()=>{load();},[load]);

  const save = async () => {
    if (!form.name?.trim()||!form.price?.trim()) return;
    try {
      const body={...form, benefits:(form.benefits||'').split('\n').map(s=>s.trim()).filter(Boolean)};
      if (editing==='new') await API.createPlan(body); else await API.updatePlan(editing,body);
      await load(); setEd(null); setForm({}); toast('Saved ✓');
    } catch (e) { toast(e.message,false); }
  };

  const del = async (eid2) => {
    if (!confirm('Delete?')) return;
    try { await API.deletePlan(eid2); await load(); toast('Deleted'); }
    catch (e) { toast(e.message,false); }
  };

  const openForm = (p=null) => {
    setForm(p?{...p,benefits:(p.benefits||[]).join('\n')}:{name:'',subtitle:'',price:'',mode:'',cta:'Get Started',benefits:'',popular:false,isActive:true});
    setEd(p?eid(p):'new');
  };

  return (
    <Card title={`💎 Plans (${items.length})`} action={<Btn sm onClick={()=>openForm()}>+ Add</Btn>}>
      {editing!==null&&(
        <div style={{ background:T.bg, border:`1px solid ${T.bdr}`, borderRadius:10, padding:12, marginBottom:12 }}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 10px'}}>
            <Fld label="Name *" value={form.name||''} onChange={v=>setForm(p=>({...p,name:v}))} />
            <Fld label="Price *" value={form.price||''} onChange={v=>setForm(p=>({...p,price:v}))} />
            <Fld label="Subtitle" value={form.subtitle||''} onChange={v=>setForm(p=>({...p,subtitle:v}))} />
            <Fld label="Mode" value={form.mode||''} onChange={v=>setForm(p=>({...p,mode:v}))} />
            <Fld label="CTA Button" value={form.cta||''} onChange={v=>setForm(p=>({...p,cta:v}))} />
          </div>
          <Fld label="Benefits (one per line)" value={form.benefits||''} onChange={v=>setForm(p=>({...p,benefits:v}))} rows={4} />
          <div style={{display:'flex',gap:12,marginBottom:10,fontSize:12}}>
            <label style={{display:'flex',gap:6,cursor:'pointer',color:T.cream}}><input type="checkbox" checked={!!form.popular} onChange={e=>setForm(p=>({...p,popular:e.target.checked}))} /> Popular</label>
            <label style={{display:'flex',gap:6,cursor:'pointer',color:T.cream}}><input type="checkbox" checked={form.isActive!==false} onChange={e=>setForm(p=>({...p,isActive:e.target.checked}))} /> Active</label>
          </div>
          <div style={{display:'flex',gap:6}}><Btn onClick={save}>Save</Btn><Btn v="ghost" onClick={()=>{setEd(null);setForm({});}}>Cancel</Btn></div>
        </div>
      )}
      {busy?<Spinner/>:<Tbl cols={['Name','Price','Mode','Popular','Act']} rows={items.map(p=>[p.name,p.price,p.mode,p.popular?'⭐':'—',<div key="a" style={{display:'flex',gap:3}}><Btn v="ghost" sm onClick={()=>openForm(p)}>Edit</Btn>{isAdmin&&<Btn v="danger" sm onClick={()=>del(eid(p))}>Del</Btn>}</div>])} empty="No plans yet." />}
    </Card>
  );
}

/* ─── ACHIEVEMENTS ───────────────────────────────────── */
function Achievements({ toast, isAdmin }) {
  const { siteAchievements, updateAchievements } = useApp();
  const [items, setItems] = useState(siteAchievements||[]);
  const [busy, setBusy]   = useState(false);
  const [editing, setEd]  = useState(null);
  const [form, setForm]   = useState({});

  const load = useCallback(async () => {
    setBusy(true);
    try { const r=await API.getAchievements(); const d=r.data||[]; setItems(d); updateAchievements(d); }
    catch { setItems(siteAchievements); }
    setBusy(false);
  }, []); // eslint-disable-line
  useEffect(()=>{load();},[load]);

  const LEVELS = ['District','State','National','Championship','Certification','Judge / Observer'];

  const save = async () => {
    if (!form.title?.trim()||!form.year?.trim()) return;
    try {
      if (editing==='new') await API.createAchievement(form); else await API.updateAchievement(editing,form);
      await load(); setEd(null); setForm({}); toast('Saved ✓');
    } catch (e) { toast(e.message,false); }
  };

  const del = async (eid2) => {
    if (!confirm('Delete?')) return;
    try { await API.deleteAchievement(eid2); await load(); toast('Deleted'); }
    catch (e) { toast(e.message,false); }
  };

  const openForm = (a=null) => {
    setForm(a||{title:'',level:'State',year:new Date().getFullYear().toString(),location:'',position:'',description:'',icon:'🏆',isActive:true});
    setEd(a?eid(a):'new');
  };

  return (
    <Card title={`🏆 Achievements (${items.length})`} action={<Btn sm onClick={()=>openForm()}>+ Add</Btn>}>
      {editing!==null&&(
        <div style={{ background:T.bg, border:`1px solid ${T.bdr}`, borderRadius:10, padding:12, marginBottom:12 }}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 10px'}}>
            <Fld label="Title *" value={form.title||''} onChange={v=>setForm(p=>({...p,title:v}))} />
            <Fld label="Year *" value={form.year||''} onChange={v=>setForm(p=>({...p,year:v}))} />
            <Sel label="Level" value={form.level||'State'} onChange={v=>setForm(p=>({...p,level:v}))} opts={LEVELS} />
            <Fld label="Icon" value={form.icon||''} onChange={v=>setForm(p=>({...p,icon:v}))} />
            <Fld label="Position / Rank" value={form.position||''} onChange={v=>setForm(p=>({...p,position:v}))} />
            <Fld label="Location" value={form.location||''} onChange={v=>setForm(p=>({...p,location:v}))} />
          </div>
          <Fld label="Description" value={form.description||''} onChange={v=>setForm(p=>({...p,description:v}))} rows={2} />
          <div style={{display:'flex',gap:6}}><Btn onClick={save}>Save</Btn><Btn v="ghost" onClick={()=>{setEd(null);setForm({});}}>Cancel</Btn></div>
        </div>
      )}
      {busy?<Spinner/>:<Tbl cols={['Icon','Title','Level','Year','Position','Act']} rows={items.map(a=>[a.icon||'🏆',a.title,a.level,a.year,a.position||'—',<div key="a" style={{display:'flex',gap:3}}><Btn v="ghost" sm onClick={()=>openForm(a)}>Edit</Btn>{isAdmin&&<Btn v="danger" sm onClick={()=>del(eid(a))}>Del</Btn>}</div>])} empty="No achievements yet." />}
    </Card>
  );
}

/* ─── SCHEDULE ───────────────────────────────────────── */
function Schedule({ toast, isAdmin }) {
  const { siteSchedule, updateSchedule } = useApp();
  const [items, setItems] = useState(siteSchedule||[]);
  const [busy, setBusy]   = useState(false);
  const [editing, setEd]  = useState(null);
  const [form, setForm]   = useState({});

  const load = useCallback(async () => {
    setBusy(true);
    try { const r=await API.getSchedule(); const d=r.data||[]; setItems(d); updateSchedule(d); }
    catch { setItems(siteSchedule); }
    setBusy(false);
  }, []); // eslint-disable-line
  useEffect(()=>{load();},[load]);

  const save = async () => {
    if (!form.time?.trim()||!form.session?.trim()) return;
    try {
      if (editing==='new') await API.createSlot(form); else await API.updateSlot(editing,form);
      await load(); setEd(null); setForm({}); toast('Saved ✓');
    } catch (e) { toast(e.message,false); }
  };

  const del = async (eid2) => {
    if (!confirm('Delete?')) return;
    try { await API.deleteSlot(eid2); await load(); toast('Deleted'); }
    catch (e) { toast(e.message,false); }
  };

  const openForm = (s=null) => {
    setForm(s||{time:'',session:'',type:'Group',mode:'Offline',period:'morning',duration:'60 min',suitable:'All levels',isActive:true});
    setEd(s?eid(s):'new');
  };

  return (
    <Card title={`🕐 Schedule (${items.length} slots)`} action={<Btn sm onClick={()=>openForm()}>+ Add</Btn>}>
      {editing!==null&&(
        <div style={{ background:T.bg, border:`1px solid ${T.bdr}`, borderRadius:10, padding:12, marginBottom:12 }}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 10px'}}>
            <Fld label="Time *" value={form.time||''} onChange={v=>setForm(p=>({...p,time:v}))} ph="e.g. 06:00 AM" />
            <Fld label="Session Name *" value={form.session||''} onChange={v=>setForm(p=>({...p,session:v}))} />
            <Fld label="Type" value={form.type||''} onChange={v=>setForm(p=>({...p,type:v}))} />
            <Fld label="Mode" value={form.mode||''} onChange={v=>setForm(p=>({...p,mode:v}))} />
            <Sel label="Period" value={form.period||'morning'} onChange={v=>setForm(p=>({...p,period:v}))} opts={[{v:'morning',l:'Morning'},{v:'evening',l:'Evening'},{v:'night',l:'Night'}]} />
            <Fld label="Duration" value={form.duration||''} onChange={v=>setForm(p=>({...p,duration:v}))} />
          </div>
          <Fld label="Suitable For" value={form.suitable||''} onChange={v=>setForm(p=>({...p,suitable:v}))} />
          <label style={{display:'flex',gap:6,cursor:'pointer',color:T.cream,fontSize:12,marginBottom:10}}><input type="checkbox" checked={form.isActive!==false} onChange={e=>setForm(p=>({...p,isActive:e.target.checked}))} /> Active</label>
          <div style={{display:'flex',gap:6}}><Btn onClick={save}>Save</Btn><Btn v="ghost" onClick={()=>{setEd(null);setForm({});}}>Cancel</Btn></div>
        </div>
      )}
      {busy?<Spinner/>:<Tbl cols={['Time','Session','Type','Period','Duration','Act']} rows={items.map(s=>[s.time,s.session,s.type,s.period,s.duration,<div key="a" style={{display:'flex',gap:3}}><Btn v="ghost" sm onClick={()=>openForm(s)}>Edit</Btn>{isAdmin&&<Btn v="danger" sm onClick={()=>del(eid(s))}>Del</Btn>}</div>])} empty="No schedule slots yet." />}
    </Card>
  );
}

/* ─── SITE CONFIG ────────────────────────────────────── */
function SiteConfig({ toast, isAdmin }) {
  const { siteContact, updateContact } = useApp();
  const [form, setForm] = useState({ siteName:'', tagline:'', phones:'', whatsapp:'', website:'' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (siteContact) {
      setForm({
        siteName:  siteContact.siteName || siteContact.name || '',
        tagline:   siteContact.tagline  || '',
        phones:    (siteContact.phones  || []).join(', '),
        whatsapp:  siteContact.whatsapp || '',
        website:   siteContact.website  || '',
      });
    }
  }, [siteContact]);

  const save = async () => {
    setBusy(true);
    try {
      const body = { siteName:form.siteName, tagline:form.tagline, phones:form.phones.split(',').map(s=>s.trim()).filter(Boolean), whatsapp:form.whatsapp, website:form.website };
      if (isAdmin) await API.updateSiteConfig(body);
      updateContact({ ...siteContact, ...body });
      toast('Config saved ✓');
    } catch (e) { toast(e.message,false); }
    setBusy(false);
  };

  return (
    <Card title="⚙️ Site Configuration">
      <Fld label="Site Name" value={form.siteName} onChange={v=>setForm(p=>({...p,siteName:v}))} />
      <Fld label="Tagline" value={form.tagline} onChange={v=>setForm(p=>({...p,tagline:v}))} />
      <Fld label="Phone Numbers (comma-separated)" value={form.phones} onChange={v=>setForm(p=>({...p,phones:v}))} />
      <Fld label="WhatsApp Number" value={form.whatsapp} onChange={v=>setForm(p=>({...p,whatsapp:v}))} />
      <Fld label="Website URL" value={form.website} onChange={v=>setForm(p=>({...p,website:v}))} />
      <Btn onClick={save} disabled={busy} full>{busy?'Saving…':'Save Changes'}</Btn>
      {!isAdmin&&<p style={{color:'#fca5a5',fontSize:10,marginTop:8}}>⚠️ Offline mode — changes saved locally only.</p>}
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN InAppDashboard
═══════════════════════════════════════════════════════ */
export default function InAppDashboard() {
  const { dashOpen, setDashOpen } = useApp();
  const [authed, setAuthed]   = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [section, setSection] = useState('overview');
  const [toast, setToast]     = useState(null);

  // Auto-restore admin session
  useEffect(() => {
    if (dashOpen && !authed) {
      const token = API.getToken();
      if (token) {
        API.getMe().then(d => {
          if (d?.user?.role === 'admin') { setIsAdmin(true); setAuthed(true); }
          else { API.clearToken(); }
        }).catch(() => { API.clearToken(); });
      }
    }
  }, [dashOpen, authed]);

  const showToast = useCallback((msg, ok = true) => setToast({ msg, ok }), []);
  const goTo = useCallback((s) => setSection(s), []);

  const close = () => { setDashOpen(false); };

  if (!dashOpen) return null;

  const panelProps = { toast: showToast, isAdmin };

  return (
    <>
      <AnimatePresence>
        {dashOpen && (
          <motion.div
            key="dash-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.55)', zIndex:9000, backdropFilter:'blur(3px)' }}
          />
        )}
      </AnimatePresence>

      <motion.div
        key="dash-panel"
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 9001,
          width: 'min(420px, 100vw)',
          background: T.bg,
          borderLeft: `1px solid ${T.bdr}`,
          display: 'flex', flexDirection: 'column',
          fontFamily: "'Segoe UI', system-ui, sans-serif",
          boxShadow: '-8px 0 40px rgba(0,0,0,.6)',
        }}
      >
        {/* ── Top bar ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderBottom:`1px solid ${T.bdr}`, background:T.surf, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <img src="/images/logo.png" alt="" style={{ width:30, height:30, borderRadius:'50%', objectFit:'cover', border:`1px solid ${T.gold}44` }} />
            <div>
              <div style={{ color:T.goldL, fontWeight:700, fontSize:13, lineHeight:1.2 }}>DAYS Admin</div>
              <div style={{ color:T.muted, fontSize:9, textTransform:'uppercase', letterSpacing:'.06em' }}>
                {isAdmin ? '🟢 MongoDB Connected' : '🟡 Offline / Local'}
              </div>
            </div>
          </div>
          <div style={{ display:'flex', gap:6, alignItems:'center' }}>
            {authed && isAdmin && (
              <button onClick={()=>{API.clearToken();setAuthed(false);setIsAdmin(false);}} style={{ background:'none', border:`1px solid ${T.bdr}`, borderRadius:6, padding:'3px 8px', color:T.muted, fontSize:10, cursor:'pointer' }}>Sign Out</button>
            )}
            <button onClick={close} style={{ background:'none', border:`1px solid ${T.bdr}`, borderRadius:6, padding:'4px 8px', color:T.cream, fontSize:16, cursor:'pointer', lineHeight:1 }}>✕</button>
          </div>
        </div>

        {/* ── Auth gate ── */}
        {!authed ? (
          <div style={{ flex:1, overflowY:'auto' }}>
            <AuthGate onUnlock={(admin) => { setIsAdmin(admin); setAuthed(true); }} onClose={close} />
          </div>
        ) : (
          <>
            {/* ── Section nav (horizontal scroll) ── */}
            <div style={{ display:'flex', gap:4, padding:'8px 10px', borderBottom:`1px solid ${T.bdr}`, overflowX:'auto', flexShrink:0, scrollbarWidth:'none' }}>
              {SECTIONS.map(s => (
                <button key={s.id} onClick={()=>setSection(s.id)} style={{
                  display:'flex', flexDirection:'column', alignItems:'center', gap:2,
                  padding:'5px 10px', borderRadius:8, border:'none',
                  background: section===s.id ? T.gold+'22' : 'transparent',
                  borderBottom: section===s.id ? `2px solid ${T.gold}` : '2px solid transparent',
                  color: section===s.id ? T.goldL : T.muted,
                  cursor:'pointer', fontSize:9, fontWeight:600, textTransform:'uppercase',
                  letterSpacing:'.06em', whiteSpace:'nowrap', flexShrink:0,
                  transition:'all .15s',
                }}>
                  <span style={{ fontSize:16 }}>{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </div>

            {/* ── Content ── */}
            <div style={{ flex:1, overflowY:'auto', padding:'12px 12px', scrollbarWidth:'thin', scrollbarColor:`${T.bdr} transparent` }}>
              {section==='overview'     && <Overview      goTo={goTo} isAdmin={isAdmin} />}
              {section==='enquiries'    && <Enquiries     {...panelProps} />}
              {section==='memberships'  && <Memberships   {...panelProps} />}
              {section==='payments'     && <Payments      {...panelProps} />}
              {section==='reviews'      && <Reviews       {...panelProps} />}
              {section==='facilitators' && <Facilitators  {...panelProps} />}
              {section==='gallery'      && <Gallery       {...panelProps} />}
              {section==='classes'      && <Classes       {...panelProps} />}
              {section==='plans'        && <Plans         {...panelProps} />}
              {section==='achievements' && <Achievements  {...panelProps} />}
              {section==='schedule'     && <Schedule      {...panelProps} />}
              {section==='config'       && <SiteConfig    {...panelProps} />}
            </div>
          </>
        )}
      </motion.div>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast key="toast" msg={toast.msg} ok={toast.ok} onDone={()=>setToast(null)} />}
      </AnimatePresence>
    </>
  );
}
