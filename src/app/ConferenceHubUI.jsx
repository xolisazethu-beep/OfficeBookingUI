"use client";

import { useState } from "react";

const CORAL="#FFD2C2",CORAL2="#FFE7DD",BLUE="#15557B",BLUE_D="#0E3A56",RED="#F26B5E",GREEN="#2A9D6B",MUTE="#7E8C97",WHITE="#FFFFFF",INK="#1E3040",WALL="#F2EBE4",FLOOR="#EAE0D7",WOOD="#C8975A",CHAIR="#15557B";

// June 2026 — starts on Monday (day-of-week index 1, S=0)
const MONTH_LABEL = "June 2026";
const MONTH_FIRST_OFFSET = 1; // Mon
const MONTH_DAYS = 30;
const TODAY = 16;
const TIMES = ["9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00"];
const CAL_DAYS = ["S","M","T","W","T","F","S"];

const NAV = [
  {id:"buildings",label:"Buildings",path:"M3 21h18M3 10l9-7 9 7M5 21V10M19 21V10M9 21v-6h6v6"},
  {id:"rooms",label:"Rooms",path:"M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1zM9 4v16"},
  {id:"bookings",label:"My bookings",path:"M4 7h16M4 7a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2M16 3v4M8 3v4"},
  {id:"schedule",label:"Schedule",path:"M12 20a8 8 0 100-16 8 8 0 000 16zM12 12l2 2M12 7v5"},
  {id:"saved",label:"Saved",path:"M12 21C12 21 4 15 4 9a4 4 0 018 0 4 4 0 018 0c0 6-8 12-8 12z"},
];

function Icon({ path, size=18, color="currentColor", sw=1.8 }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={path}/></svg>);
}

// ── Room illustrations with EXACT chair counts ───────────────────────────────
// Each takes a `cap` prop and draws that many chairs.

function RoomBoard({ cap }) {
  // Long table; chairs along top, bottom, and 1 at each end
  const ends = Math.min(2, cap);
  const sides = cap - ends;
  const top = Math.ceil(sides / 2);
  const bot = sides - top;
  return (
    <svg viewBox="0 0 220 110" width="100%" style={{display:"block",borderRadius:10}}>
      <rect width="220" height="110" fill={FLOOR}/><rect width="220" height="32" fill={WALL}/>
      <rect x="22" y="5" width="96" height="22" rx="3" fill="#A9D6EC"/><rect x="158" y="6" width="36" height="20" rx="2" fill="#1E3040"/>
      <rect x="28" y="40" width="164" height="36" rx="8" fill={WOOD} opacity="0.85"/>
      {Array.from({length:top}).map((_,i)=>{const gap=164/(top+1);return<rect key={i} x={28+gap*(i+1)-7} y="32" width="14" height="10" rx="4" fill={CHAIR}/>;})}
      {Array.from({length:bot}).map((_,i)=>{const gap=164/(bot+1);return<rect key={i+"b"} x={28+gap*(i+1)-7} y="74" width="14" height="10" rx="4" fill={CHAIR}/>;})}
      {ends>=1 && <rect x="14" y="51" width="12" height="14" rx="4" fill={CHAIR}/>}
      {ends>=2 && <rect x="194" y="51" width="12" height="14" rx="4" fill={CHAIR}/>}
      <circle cx="200" cy="96" r="7" fill={GREEN}/>
    </svg>
  );
}

function RoomRound({ cap }) {
  return (
    <svg viewBox="0 0 220 110" width="100%" style={{display:"block",borderRadius:10}}>
      <rect width="220" height="110" fill={FLOOR}/><rect width="220" height="32" fill={WALL}/>
      <rect x="22" y="5" width="96" height="22" rx="3" fill="#A9D6EC"/><rect x="158" y="6" width="36" height="20" rx="2" fill="#1E3040"/>
      <ellipse cx="110" cy="68" rx={Math.min(40, 16 + cap*2)} ry={Math.min(28, 12 + cap*1.5)} fill={WOOD} opacity="0.85"/>
      {Array.from({length:cap}).map((_,i)=>{const a=(i/cap)*2*Math.PI - Math.PI/2;const rx=Math.min(56,32+cap*2),ry=Math.min(38,22+cap*1.5);return<rect key={i} x={110+Math.cos(a)*rx-7} y={68+Math.sin(a)*ry-5} width="14" height="10" rx="4" fill={CHAIR}/>;})}
      <circle cx="200" cy="96" r="7" fill={GREEN}/>
    </svg>
  );
}

function RoomU({ cap }) {
  // U-shape: head + 2 sides
  const head = Math.min(Math.ceil(cap*0.4), 6);
  const sideTotal = cap - head;
  const perSide = Math.ceil(sideTotal/2);
  return (
    <svg viewBox="0 0 220 110" width="100%" style={{display:"block",borderRadius:10}}>
      <rect width="220" height="110" fill={FLOOR}/><rect width="220" height="32" fill={WALL}/>
      <rect x="22" y="5" width="96" height="22" rx="3" fill="#A9D6EC"/><rect x="158" y="6" width="36" height="20" rx="2" fill="#1E3040"/>
      <rect x="40" y="36" width="140" height="10" rx="4" fill={WOOD} opacity="0.85"/>
      <rect x="40" y="36" width="10" height="50" rx="4" fill={WOOD} opacity="0.85"/>
      <rect x="170" y="36" width="10" height="50" rx="4" fill={WOOD} opacity="0.85"/>
      {Array.from({length:head}).map((_,i)=>{const gap=140/(head+1);return<rect key={i} x={40+gap*(i+1)-7} y="28" width="14" height="9" rx="4" fill={CHAIR}/>;})}
      {Array.from({length:perSide}).map((_,i)=>{const gap=50/(perSide+1);return<rect key={i+"L"} x="28" y={36+gap*(i+1)-5} width="12" height="10" rx="4" fill={CHAIR}/>;})}
      {Array.from({length:sideTotal-perSide}).map((_,i)=>{const gap=50/((sideTotal-perSide)+1);return<rect key={i+"R"} x="180" y={36+gap*(i+1)-5} width="12" height="10" rx="4" fill={CHAIR}/>;})}
      <circle cx="200" cy="96" r="7" fill={GREEN}/>
    </svg>
  );
}

function RoomPods({ cap }) {
  // 3 pods, distribute chairs evenly
  const pods = [[60,58],[155,52],[108,88]];
  const perPod = Math.ceil(cap/3);
  let drawn = 0;
  return (
    <svg viewBox="0 0 220 110" width="100%" style={{display:"block",borderRadius:10}}>
      <rect width="220" height="110" fill={FLOOR}/><rect width="220" height="30" fill={WALL}/>
      <rect x="22" y="5" width="80" height="20" rx="3" fill="#A9D6EC"/><rect x="156" y="5" width="36" height="20" rx="2" fill="#1E3040"/>
      {pods.map(([cx,cy],pi)=>{
        const n = Math.min(perPod, cap - drawn); drawn += n;
        return (
          <g key={pi}>
            <ellipse cx={cx} cy={cy} rx="16" ry="10" fill={WOOD} opacity="0.8"/>
            {Array.from({length:n}).map((_,i)=>{const a=(i/n)*2*Math.PI + 0.5;return<rect key={i} x={cx+Math.cos(a)*22-6} y={cy+Math.sin(a)*17-4} width="12" height="8" rx="3" fill={CHAIR}/>;})}
          </g>
        );
      })}
      <circle cx="200" cy="98" r="6" fill={GREEN}/>
    </svg>
  );
}

function RoomHuddle({ cap }) {
  // small round table - all chairs around it
  return (
    <svg viewBox="0 0 220 110" width="100%" style={{display:"block",borderRadius:10}}>
      <rect width="220" height="110" fill={FLOOR}/><rect width="220" height="30" fill={WALL}/>
      <rect x="22" y="5" width="80" height="20" rx="3" fill="#A9D6EC"/><rect x="156" y="5" width="36" height="20" rx="2" fill="#1E3040"/>
      <ellipse cx="110" cy="68" rx={Math.min(30, 12+cap*3)} ry={Math.min(20, 8+cap*2)} fill={WOOD} opacity="0.85"/>
      {Array.from({length:cap}).map((_,i)=>{const a=(i/cap)*2*Math.PI - Math.PI/2;const rx=Math.min(42,22+cap*3),ry=Math.min(28,16+cap*2);return<rect key={i} x={110+Math.cos(a)*rx-7} y={68+Math.sin(a)*ry-5} width="14" height="10" rx="4" fill={CHAIR}/>;})}
      <circle cx="200" cy="98" r="6" fill={GREEN}/>
    </svg>
  );
}

function RoomClass({ cap }) {
  // rows of desks: 4 per row, draw exactly cap chairs
  return (
    <svg viewBox="0 0 220 110" width="100%" style={{display:"block",borderRadius:10}}>
      <rect width="220" height="110" fill={FLOOR}/><rect width="220" height="28" fill={WALL}/>
      <rect x="22" y="4" width="110" height="20" rx="3" fill="#A9D6EC"/><rect x="170" y="5" width="34" height="18" rx="2" fill="#1E3040"/>
      {Array.from({length:cap}).map((_,i)=>{
        const cols = 4;
        const row = Math.floor(i/cols), col = i % cols;
        return (
          <g key={i}>
            <rect x={20+col*50} y={38+row*22} width="34" height="10" rx="3" fill={WOOD} opacity="0.8"/>
            <rect x={27+col*50} y={50+row*22} width="20" height="7" rx="3" fill={CHAIR}/>
          </g>
        );
      })}
      <circle cx="200" cy="98" r="6" fill={GREEN}/>
    </svg>
  );
}

const ROOMS = [
  { id:"r1", name:"Meeting Room #10", floor:6, cap:18, amens:["tv","ac","board","mic"],            type:"board",  rating:4.9 },
  { id:"r2", name:"Meeting Room #12", floor:6, cap:7,  amens:["ac","board"],                       type:"round",  rating:4.5 },
  { id:"r3", name:"The Atrium",       floor:3, cap:12, amens:["tv","ac","projector"],              type:"u",      rating:4.7 },
  { id:"r4", name:"Focus Pod A",      floor:1, cap:2,  amens:["ac","wifi"],                        type:"huddle", rating:4.3 },
  { id:"r5", name:"Brainstorm Lab",   floor:2, cap:10, amens:["board","tv","ac"],                  type:"pods",   rating:4.6 },
  { id:"r6", name:"The Gallery",      floor:8, cap:24, amens:["projector","mic","tv","ac"],        type:"class",  rating:4.8 },
  { id:"r7", name:"Sunrise Lounge",   floor:5, cap:8,  amens:["tv","ac","coffee"],                 type:"huddle", rating:4.4 },
  { id:"r8", name:"Summit Boardroom", floor:10,cap:16, amens:["tv","mic","ac","board"],            type:"board",  rating:5.0 },
  { id:"r9", name:"The Nook",         floor:2, cap:4,  amens:["tv","ac"],                          type:"round",  rating:4.0 },
  { id:"r10",name:"Innovation Studio",floor:7, cap:14, amens:["projector","board","tv","mic"],     type:"u",      rating:4.7 },
];

function RoomIllus({ type, cap }) {
  if (type==="board")  return <RoomBoard cap={cap}/>;
  if (type==="round")  return <RoomRound cap={cap}/>;
  if (type==="u")      return <RoomU cap={cap}/>;
  if (type==="pods")   return <RoomPods cap={cap}/>;
  if (type==="huddle") return <RoomHuddle cap={cap}/>;
  if (type==="class")  return <RoomClass cap={cap}/>;
  return <RoomBoard cap={cap}/>;
}

// ── Amenity icons + tooltips ────────────────────────────────────────────────
const AMEN_DATA = {
  tv:       { label:"Smart TV / Screen",     path:"M2 7a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7zM8 19h8M12 15v4" },
  ac:       { label:"Air conditioning",      path:"M12 3v18M3.5 8.5l17 7M20.5 8.5l-17 7" },
  board:    { label:"Whiteboard",            path:"M3 5h18M4 5v12a1 1 0 001 1h14a1 1 0 001-1V5M12 16v3M9 21h6" },
  mic:      { label:"Microphone",            path:"M12 2a3 3 0 013 3v6a3 3 0 01-6 0V5a3 3 0 013-3zM6 11a6 6 0 0012 0M12 17v4M9 21h6" },
  projector:{ label:"Projector",             path:"M2 8h20M4 8v8a2 2 0 002 2h12a2 2 0 002-2V8M9 8V5h6v3M12 12v4" },
  wifi:     { label:"Wi-Fi",                 path:"M5 12.5a9 9 0 0114 0M8.5 15.5a5 5 0 017 0M12 19h.01" },
  coffee:   { label:"Coffee / refreshments", path:"M6 9h10v5a4 4 0 01-4 4h-2a4 4 0 01-4-4V9zM15 9h3a2 2 0 010 4h-3" },
};

function AmenIcon({ name }) {
  const d = AMEN_DATA[name]; if (!d) return null;
  return (
    <span style={{position:"relative",display:"inline-flex"}} className="amen-icon">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#86919b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d={d.path}/></svg>
      <span className="amen-tip" style={{position:"absolute",bottom:"calc(100% + 6px)",left:"50%",transform:"translateX(-50%)",background:BLUE_D,color:WHITE,fontSize:10,fontWeight:600,padding:"4px 8px",borderRadius:6,whiteSpace:"nowrap",pointerEvents:"none",opacity:0,transition:"opacity .15s",zIndex:5}}>
        {d.label}
      </span>
    </span>
  );
}

const inputStyle = {width:"100%",padding:"11px 14px",borderRadius:10,border:`1px solid #EFE0D9`,background:CORAL2,fontSize:13,color:INK,outline:"none",fontFamily:"sans-serif",boxSizing:"border-box"};

// ── Login ───────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!email.includes("@")) return setErr("Enter a valid email");
    if (pwd.length < 6) return setErr("Password must be at least 6 characters");
    if (mode === "signup" && !name.trim()) return setErr("Enter your name");
    setErr("");
    const src = mode === "signup" ? name : email;
    const initials = src.trim().split(/\s+|@/)[0].slice(0,2).toUpperCase();
    onLogin({ email, name: mode === "signup" ? name : email.split("@")[0], initials });
  }

  return (
    <div style={{minHeight:"100vh",background:CORAL,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",padding:24}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",maxWidth:980,width:"100%",borderRadius:24,overflow:"hidden",boxShadow:"0 30px 80px rgba(176,107,88,.25)"}}>
        <div style={{background:`linear-gradient(180deg, #1A6390 0%, ${BLUE_D} 100%)`,padding:"56px 48px",color:WHITE,display:"flex",flexDirection:"column"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:10,background:"#FF9E92",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={BLUE_D} strokeWidth="2.2"><path d="M4 18c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2"/><path d="M4 13c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2"/></svg>
            </div>
            <div>
              <div style={{fontSize:18,fontWeight:700,fontFamily:"Georgia,serif"}}>Conference</div>
              <div style={{fontSize:10,color:"#FF9E92",fontWeight:700,letterSpacing:3}}>HUB</div>
            </div>
          </div>
          <div style={{marginTop:64}}>
            <h1 style={{fontSize:36,fontWeight:700,fontFamily:"Georgia,serif",margin:"0 0 8px",lineHeight:1.1}}>Book a meeting<br/><span style={{color:"#FF9E92"}}>room in seconds.</span></h1>
            <p style={{fontSize:14,color:"#9FC0D2",marginTop:16,lineHeight:1.6}}>Sign in to see live availability across every floor, then lock your slot in one tap.</p>
          </div>
          <div style={{marginTop:"auto",display:"flex",gap:24,fontSize:11,color:"#9FC0D2",paddingTop:24}}>
            <div>● 10 rooms</div><div>● Live availability</div><div>● One-tap booking</div>
          </div>
        </div>
        <div style={{background:WHITE,padding:"56px 48px"}}>
          <div style={{display:"flex",background:CORAL2,borderRadius:12,padding:4,marginBottom:32}}>
            <button onClick={()=>{setMode("login");setErr("")}} style={{flex:1,padding:"10px 0",borderRadius:8,border:"none",fontWeight:700,fontSize:13,cursor:"pointer",background:mode==="login"?WHITE:"transparent",color:mode==="login"?BLUE:MUTE,fontFamily:"sans-serif"}}>Log in</button>
            <button onClick={()=>{setMode("signup");setErr("")}} style={{flex:1,padding:"10px 0",borderRadius:8,border:"none",fontWeight:700,fontSize:13,cursor:"pointer",background:mode==="signup"?WHITE:"transparent",color:mode==="signup"?BLUE:MUTE,fontFamily:"sans-serif"}}>Sign up</button>
          </div>
          <form onSubmit={submit}>
            {mode==="signup" && (
              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:11,color:MUTE,fontWeight:600,marginBottom:6}}>Full name</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Alex Lee" style={inputStyle}/>
              </div>
            )}
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:11,color:MUTE,fontWeight:600,marginBottom:6}}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" style={inputStyle}/>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:11,color:MUTE,fontWeight:600,marginBottom:6}}>Password</label>
              <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="••••••••" style={inputStyle}/>
            </div>
            {err && <div style={{fontSize:11,color:RED,marginBottom:12,fontWeight:600}}>⚠ {err}</div>}
            <button type="submit" style={{width:"100%",padding:"13px 0",borderRadius:10,border:"none",background:`linear-gradient(135deg, #FF7E72, #EC5A4E)`,color:WHITE,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"sans-serif",marginTop:8}}>
              {mode==="login"?"Log in":"Create account"}
            </button>
            <div style={{textAlign:"center",fontSize:11,color:MUTE,marginTop:18}}>
              {mode==="login"?"First time here? ":"Already have an account? "}
              <span onClick={()=>{setMode(mode==="login"?"signup":"login");setErr("")}} style={{color:BLUE,fontWeight:700,cursor:"pointer"}}>
                {mode==="login"?"Sign up":"Log in"}
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Modal ───────────────────────────────────────────────────────────────────
function Modal({ children, onClose, maxWidth=440 }) {
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(14,58,86,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{background:WHITE,borderRadius:20,padding:"24px 28px",maxWidth,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 60px rgba(0,0,0,.3)"}}>
        {children}
      </div>
    </div>
  );
}
const iconBtn = {width:28,height:28,borderRadius:8,border:`1px solid #EFE0D9`,background:WHITE,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"};

// ── Cancel confirmation modal ───────────────────────────────────────────────
function CancelModal({ roomName, slotsText, onConfirm, onClose }) {
  return (
    <Modal onClose={onClose}>
      <div style={{textAlign:"center",padding:"20px 12px 12px"}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:"#FCE3E0",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:18}}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <h2 style={{fontSize:20,fontFamily:"Georgia,serif",color:BLUE,margin:"0 0 8px"}}>Cancel this booking?</h2>
        <p style={{fontSize:13,color:MUTE,margin:"0 0 6px",lineHeight:1.5}}>You're about to cancel your reservation for</p>
        <p style={{fontSize:14,color:INK,fontWeight:700,margin:"0 0 6px"}}>{roomName}</p>
        <p style={{fontSize:12,color:MUTE,margin:"0 0 20px"}}>{slotsText}</p>
        <div style={{background:CORAL2,borderRadius:9,padding:"10px 14px",fontSize:11.5,color:"#C0463B",fontWeight:600,marginBottom:20,lineHeight:1.5}}>
          Once cancelled, the slot opens up for everyone else. You can rebook anytime if it's still free.
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,padding:"12px 0",borderRadius:9,border:`1.5px solid #EFE0D9`,background:WHITE,color:INK,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"sans-serif"}}>No, keep it</button>
          <button onClick={onConfirm} style={{flex:1,padding:"12px 0",borderRadius:9,border:"none",background:RED,color:WHITE,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"sans-serif"}}>Yes, cancel</button>
        </div>
      </div>
    </Modal>
  );
}

// ── Booking calendar modal ──────────────────────────────────────────────────
function BookingModal({ room, user, bookings, onConfirm, onClose }) {
  const [selDay, setSelDay] = useState(null);
  const [selTime, setSelTime] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const bookingKey = selDay && selTime ? `${room.id}-${selDay}-${selTime}` : null;
  const slotTaken = bookingKey ? !!bookings[bookingKey] : false;
  const canConfirm = selDay && selTime && !slotTaken;

  function handleConfirm() {
    if (!canConfirm) return;
    onConfirm(bookingKey, selDay, selTime);
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <Modal onClose={onClose}>
        <div style={{textAlign:"center",padding:"32px 16px"}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:`linear-gradient(135deg, #4ED694, ${GREEN})`,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:20,boxShadow:`0 8px 24px ${GREEN}40`}}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <h2 style={{fontSize:22,fontFamily:"Georgia,serif",color:BLUE,margin:"0 0 8px"}}>Booked!</h2>
          <p style={{fontSize:13,color:MUTE,margin:"0 0 4px"}}>{room.name}</p>
          <p style={{fontSize:14,color:INK,margin:"0 0 24px",fontWeight:600}}>June {selDay}, 2026 · {selTime}</p>
          <div style={{background:CORAL2,borderRadius:10,padding:"12px 16px",marginBottom:20,fontSize:11.5,color:"#C0463B",fontWeight:600}}>
            🔒 This room is now locked for you. No one else can book this slot until your time ends.
          </div>
          <button onClick={onClose} style={{padding:"10px 28px",borderRadius:9,border:"none",background:BLUE,color:WHITE,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"sans-serif"}}>Done</button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <div style={{padding:"4px 4px 8px"}}>
        <h2 style={{fontSize:18,fontFamily:"Georgia,serif",color:BLUE,margin:"0 0 4px"}}>Book {room.name}</h2>
        <p style={{fontSize:12,color:MUTE,margin:"0 0 20px"}}>Floor {room.floor} · {room.cap} people · Pick a day and time</p>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <button style={iconBtn}><Icon path="M15 18l-6-6 6-6" size={14} color={BLUE} sw={2}/></button>
          <div style={{fontSize:14,fontWeight:700,color:BLUE}}>{MONTH_LABEL}</div>
          <button style={iconBtn}><Icon path="M9 18l6-6-6-6" size={14} color={BLUE} sw={2}/></button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:6}}>
          {CAL_DAYS.map((d,i)=><div key={i} style={{textAlign:"center",fontSize:10,color:MUTE,fontWeight:700,padding:"4px 0"}}>{d}</div>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:24}}>
          {Array.from({length:MONTH_FIRST_OFFSET}).map((_,i)=><div key={"e"+i}/>)}
          {Array.from({length:MONTH_DAYS}).map((_,i)=>{
            const day = i+1;
            const isSel = day === selDay;
            const isToday = day === TODAY;
            const past = day < TODAY;
            return (
              <button key={day} onClick={()=>!past && setSelDay(day)} disabled={past} style={{
                aspectRatio:"1/1",border:isToday?`1.5px solid ${RED}`:"none",borderRadius:8,
                cursor:past?"not-allowed":"pointer",
                background:isSel?RED:"transparent",color:isSel?WHITE:past?"#C5BFB7":INK,
                fontWeight:isSel||isToday?700:500,fontSize:12.5,fontFamily:"sans-serif",
                opacity:past?0.5:1,
              }}>{day}</button>
            );
          })}
        </div>
        <div style={{fontSize:12,fontWeight:700,color:BLUE,marginBottom:10}}>Pick a time slot</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:20}}>
          {TIMES.map(t=>{
            const isSel = t === selTime;
            const taken = selDay ? !!bookings[`${room.id}-${selDay}-${t}`] : false;
            return (
              <button key={t} onClick={()=>setSelTime(t)} disabled={taken && !isSel} style={{
                padding:"10px 0",borderRadius:9,border:`1.5px solid ${isSel?RED:"#EFE0D9"}`,
                background:isSel?RED:taken?"#F5F5F5":WHITE,color:isSel?WHITE:taken?MUTE:INK,
                fontWeight:isSel?700:500,fontSize:12,cursor:taken?"not-allowed":"pointer",
                opacity:taken && !isSel ?0.5:1,fontFamily:"sans-serif",
              }}>
                {t}{taken && !isSel ? " 🔒":""}
              </button>
            );
          })}
        </div>
        {slotTaken && (
          <div style={{background:"#FCE3E0",borderRadius:9,padding:"10px 14px",fontSize:12,color:"#C0463B",fontWeight:600,marginBottom:14}}>
            ⚠ This slot is already booked. Pick another time.
          </div>
        )}
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,padding:"12px 0",borderRadius:9,border:`1.5px solid #EFE0D9`,background:WHITE,color:INK,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"sans-serif"}}>Cancel</button>
          <button onClick={handleConfirm} disabled={!canConfirm} style={{flex:2,padding:"12px 0",borderRadius:9,border:"none",background:canConfirm?`linear-gradient(135deg, #FF7E72, #EC5A4E)`:"#EFE0D9",color:canConfirm?WHITE:MUTE,fontWeight:700,fontSize:13,cursor:canConfirm?"pointer":"not-allowed",fontFamily:"sans-serif"}}>
            {selDay && selTime ? `Confirm — June ${selDay} at ${selTime}` : "Pick a day and time"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Room card ───────────────────────────────────────────────────────────────
function RoomCard({ room, booked, selected, onSelect, onBook, onAskCancel, currentUserEmail }) {
  const myBookings = Object.keys(booked).filter(k => k.startsWith(room.id + "-") && booked[k]?.email === currentUserEmail);
  const hasMyBooking = myBookings.length > 0;

  return (
    <div onClick={()=>onSelect(room.id)} style={{
      background:WHITE,borderRadius:16,
      border:selected?`2px solid ${RED}`:"1.5px solid #EFE0D9",
      boxShadow:selected?`0 0 0 3px ${RED}33`:"0 4px 16px rgba(176,107,88,.10)",
      cursor:"pointer",overflow:"hidden",transition:"all .15s",
    }}>
      <div style={{position:"relative"}}>
        <RoomIllus type={room.type} cap={room.cap}/>
        {hasMyBooking ? (
          <span style={{position:"absolute",top:10,left:10,borderRadius:20,padding:"3px 10px",fontSize:10,fontWeight:700,fontFamily:"sans-serif",background:GREEN,color:WHITE,display:"flex",alignItems:"center",gap:4}}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg> Booked by you
          </span>
        ) : (
          <span style={{position:"absolute",top:10,left:10,borderRadius:20,padding:"3px 10px",fontSize:10,fontWeight:700,fontFamily:"sans-serif",background:GREEN,color:WHITE}}>● Available</span>
        )}
        <span style={{position:"absolute",top:10,right:10,background:"rgba(255,255,255,.95)",borderRadius:20,padding:"3px 8px",fontSize:10,fontWeight:700,color:INK,display:"flex",alignItems:"center",gap:3,fontFamily:"sans-serif"}}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="#F26B5E" stroke="#F26B5E" strokeWidth="1.5"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/></svg>
          {room.rating}
        </span>
      </div>
      <div style={{padding:"12px 14px 14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
          <div style={{fontWeight:700,fontSize:13.5,color:BLUE,fontFamily:"Georgia,serif",lineHeight:1.2}}>{room.name}</div>
          <span style={{flexShrink:0,background:CORAL2,borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700,color:"#C0463B"}}>{room.cap} ppl</span>
        </div>
        <div style={{fontSize:10.5,color:MUTE,marginTop:3}}>Floor {room.floor}</div>
        <div style={{display:"flex",gap:7,marginTop:9,flexWrap:"wrap"}}>
          {room.amens.map(a=><AmenIcon key={a} name={a}/>)}
        </div>
        {hasMyBooking ? (
          <>
            <div style={{marginTop:10,background:CORAL2,borderRadius:8,padding:"6px 10px",fontSize:10.5,color:"#C0463B",fontWeight:600,lineHeight:1.4}}>
              🔒 Your slots: {myBookings.map(k => { const p = k.split("-"); return `Jun ${p[1]} ${p[2]}`; }).join(" · ")}
            </div>
            <button onClick={e=>{e.stopPropagation();onAskCancel(room.id,myBookings)}} style={{marginTop:8,width:"100%",borderRadius:9,border:`1.5px solid ${RED}`,padding:"7px 0",fontWeight:700,fontSize:11.5,fontFamily:"sans-serif",cursor:"pointer",background:WHITE,color:RED}}>
              Cancel booking
            </button>
          </>
        ) : (
          <button onClick={e=>{e.stopPropagation();onBook(room.id)}} style={{marginTop:10,width:"100%",borderRadius:9,border:"none",padding:"8px 0",fontWeight:700,fontSize:12,fontFamily:"sans-serif",cursor:"pointer",background:`linear-gradient(135deg, #FF7E72, #EC5A4E)`,color:WHITE}}>
            Book now
          </button>
        )}
      </div>
    </div>
  );
}

// ── Page sections ───────────────────────────────────────────────────────────
function RoomsPage({ rooms, bookings, selRoom, setSelRoom, onBook, onAskCancel, user, sortBy, setSortBy, sortOpen, setSortOpen, sortOptions }) {
  const sortLabel = sortOptions.find(o=>o.id===sortBy)?.label || "Default";
  return (
    <>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div>
          <h2 style={{fontSize:22,fontFamily:"Georgia,serif",color:BLUE,margin:"0 0 4px"}}>Browse rooms</h2>
          <p style={{fontSize:12,color:MUTE,margin:0}}>Pick a room and click <b>Book now</b> — choose your day and time on the next screen.</p>
        </div>
        <div style={{position:"relative"}}>
          <button onClick={()=>setSortOpen(!sortOpen)} style={{display:"flex",alignItems:"center",gap:8,background:WHITE,border:`1px solid #EFE0D9`,borderRadius:10,padding:"9px 14px",fontSize:12,color:INK,cursor:"pointer",fontFamily:"sans-serif",fontWeight:600}}>
            <Icon path="M3 6h18M6 12h12M10 18h4" size={14} color={BLUE} sw={2}/>
            Sort: {sortLabel}
            <Icon path="M6 9l6 6 6-6" size={12} color={MUTE} sw={2}/>
          </button>
          {sortOpen && (
            <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,background:WHITE,borderRadius:12,boxShadow:"0 12px 32px rgba(0,0,0,.15)",border:`1px solid #EFE0D9`,minWidth:220,zIndex:10,overflow:"hidden"}}>
              {sortOptions.map(o=>(
                <div key={o.id} onClick={()=>{setSortBy(o.id);setSortOpen(false)}} style={{padding:"10px 14px",fontSize:12,cursor:"pointer",background:sortBy===o.id?CORAL2:WHITE,color:sortBy===o.id?"#C0463B":INK,fontWeight:sortBy===o.id?700:500,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  {o.label}
                  {sortBy===o.id && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C0463B" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))",gap:18}}>
        {rooms.map(room=>(
          <RoomCard key={room.id} room={room} booked={bookings} selected={selRoom===room.id} onSelect={setSelRoom} onBook={onBook} onAskCancel={onAskCancel} currentUserEmail={user.email}/>
        ))}
      </div>
    </>
  );
}

function BuildingsPage() {
  const buildings = [
    {name:"Hoffman building", addr:"Jefferson street, 54", floors:6, rooms:45, hours:"Mon–Fri 11am–6pm · Sat–Sun 9am–9pm"},
    {name:"Trustcorp building", addr:"Lincoln street, 182", floors:25, rooms:159, hours:"Mon–Sun · Day and night"},
    {name:"Marlowe Tower", addr:"Riverside Ave, 8", floors:14, rooms:88, hours:"Mon–Sat 8am–8pm"},
  ];
  return (
    <>
      <h2 style={{fontSize:22,fontFamily:"Georgia,serif",color:BLUE,margin:"0 0 4px"}}>Buildings</h2>
      <p style={{fontSize:12,color:MUTE,margin:"0 0 22px"}}>Every location your team can book a room in.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(280px,1fr))",gap:16}}>
        {buildings.map((b,i)=>(
          <div key={i} style={{background:WHITE,borderRadius:16,border:"1.5px solid #EFE0D9",padding:"18px 20px",boxShadow:"0 4px 14px rgba(176,107,88,.08)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <h3 style={{fontSize:15,fontFamily:"Georgia,serif",color:BLUE,margin:0}}>{b.name}</h3>
              <Icon path="M9 18l6-6-6-6" size={14} color={RED} sw={2.2}/>
            </div>
            <p style={{fontSize:11.5,color:RED,fontWeight:700,margin:"4px 0 14px"}}>{b.addr}</p>
            <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:BLUE,fontWeight:700,marginBottom:6}}>
              <Icon path="M12 20a8 8 0 100-16 8 8 0 000 16zM12 12l2 2M12 7v5" size={13} color={BLUE} sw={2}/> Working hours
            </div>
            <p style={{fontSize:11,color:INK,margin:"0 0 14px"}}>{b.hours}</p>
            <div style={{display:"flex",gap:18,fontSize:11.5,fontWeight:600,color:INK,paddingTop:10,borderTop:"1px solid #F4ECE6"}}>
              <span style={{color:RED}}>⌂ {b.floors} floors</span>
              <span style={{color:RED}}>▦ {b.rooms} meeting rooms</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function MyBookingsPage({ bookings, rooms, user, onAskCancel }) {
  const mine = Object.entries(bookings).filter(([_,v])=>v.email===user.email).sort((a,b)=>{
    const [_,dA,tA]=a[0].split("-"); const [__,dB,tB]=b[0].split("-");
    return (+dA - +dB) || tA.localeCompare(tB);
  });
  return (
    <>
      <h2 style={{fontSize:22,fontFamily:"Georgia,serif",color:BLUE,margin:"0 0 4px"}}>My bookings</h2>
      <p style={{fontSize:12,color:MUTE,margin:"0 0 22px"}}>{mine.length === 0 ? "You don't have any bookings yet. Head to Rooms to book one." : `${mine.length} booking${mine.length>1?"s":""}.`}</p>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {mine.map(([key,_])=>{
          const [roomId,day,time] = key.split("-");
          const room = rooms.find(r=>r.id===roomId);
          if (!room) return null;
          return (
            <div key={key} style={{background:WHITE,borderRadius:14,border:"1.5px solid #EFE0D9",padding:"14px 16px",display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:48,height:48,borderRadius:10,background:CORAL2,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <div style={{fontSize:9,color:RED,fontWeight:700}}>JUN</div>
                <div style={{fontSize:16,color:BLUE,fontWeight:700,fontFamily:"Georgia,serif",lineHeight:1}}>{day}</div>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:13.5,color:BLUE,fontFamily:"Georgia,serif"}}>{room.name}</div>
                <div style={{fontSize:11.5,color:MUTE,marginTop:2}}>Floor {room.floor} · {time} · {room.cap} people max</div>
              </div>
              <button onClick={()=>onAskCancel(room.id,[key])} style={{borderRadius:8,border:`1.5px solid ${RED}`,padding:"6px 14px",fontSize:11.5,fontWeight:700,background:WHITE,color:RED,cursor:"pointer",fontFamily:"sans-serif"}}>Cancel</button>
            </div>
          );
        })}
      </div>
    </>
  );
}

function SchedulePage({ bookings, rooms }) {
  const all = Object.entries(bookings).map(([key,info])=>{
    const [roomId,day,time] = key.split("-");
    const room = rooms.find(r=>r.id===roomId);
    return { key, room, day:+day, time, who:info.name, email:info.email };
  }).filter(x=>x.room).sort((a,b)=>(a.day-b.day) || a.time.localeCompare(b.time));

  const grouped = {};
  all.forEach(b => { (grouped[b.day] = grouped[b.day] || []).push(b); });
  const days = Object.keys(grouped).map(Number).sort((a,b)=>a-b);

  return (
    <>
      <h2 style={{fontSize:22,fontFamily:"Georgia,serif",color:BLUE,margin:"0 0 4px"}}>Schedule</h2>
      <p style={{fontSize:12,color:MUTE,margin:"0 0 22px"}}>Every booking, every room. Live as it happens.</p>
      {days.length === 0 ? (
        <div style={{background:WHITE,borderRadius:14,padding:"40px 20px",textAlign:"center",border:"1.5px solid #EFE0D9"}}>
          <p style={{color:MUTE,fontSize:13,margin:0}}>No bookings yet across the building.</p>
        </div>
      ) : days.map(d=>(
        <div key={d} style={{marginBottom:22}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{width:40,height:40,borderRadius:10,background:RED,color:WHITE,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <div style={{fontSize:8,fontWeight:700}}>JUN</div>
              <div style={{fontSize:14,fontWeight:700,fontFamily:"Georgia,serif",lineHeight:1}}>{d}</div>
            </div>
            <div style={{fontSize:13,fontWeight:700,color:BLUE,fontFamily:"Georgia,serif"}}>June {d}, 2026</div>
            <span style={{fontSize:11,color:MUTE,marginLeft:"auto"}}>{grouped[d].length} booking{grouped[d].length>1?"s":""}</span>
          </div>
          <div style={{background:WHITE,borderRadius:14,border:"1.5px solid #EFE0D9",overflow:"hidden"}}>
            {grouped[d].map((b,i)=>(
              <div key={b.key} style={{display:"grid",gridTemplateColumns:"80px 1fr 1fr 80px",alignItems:"center",padding:"12px 16px",borderTop:i===0?"none":"1px solid #F4ECE6",gap:12}}>
                <div style={{fontSize:12,fontWeight:700,color:RED,fontFamily:"sans-serif"}}>{b.time}</div>
                <div>
                  <div style={{fontSize:12.5,fontWeight:700,color:BLUE,fontFamily:"Georgia,serif"}}>{b.room.name}</div>
                  <div style={{fontSize:10.5,color:MUTE,marginTop:1}}>Floor {b.room.floor} · {b.room.cap} ppl</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:26,height:26,borderRadius:"50%",background:`linear-gradient(135deg,#FF9E92,${RED})`,color:WHITE,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {b.who.split(/\s+|@/)[0].slice(0,2).toUpperCase()}
                  </div>
                  <div style={{minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600,color:INK,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{b.who}</div>
                    <div style={{fontSize:10,color:MUTE,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{b.email}</div>
                  </div>
                </div>
                <div style={{textAlign:"right",fontSize:10,color:GREEN,fontWeight:700}}>● BOOKED</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function SavedPage({ saved, rooms, onUnsave, onBook }) {
  const list = rooms.filter(r=>saved.includes(r.id));
  return (
    <>
      <h2 style={{fontSize:22,fontFamily:"Georgia,serif",color:BLUE,margin:"0 0 4px"}}>Saved rooms</h2>
      <p style={{fontSize:12,color:MUTE,margin:"0 0 22px"}}>{list.length === 0 ? "Tap the heart icon on any room to save it here." : `${list.length} saved room${list.length>1?"s":""}.`}</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))",gap:18}}>
        {list.map(room=>(
          <div key={room.id} style={{background:WHITE,borderRadius:16,border:"1.5px solid #EFE0D9",overflow:"hidden",boxShadow:"0 4px 16px rgba(176,107,88,.10)"}}>
            <div style={{position:"relative"}}>
              <RoomIllus type={room.type} cap={room.cap}/>
              <button onClick={()=>onUnsave(room.id)} style={{position:"absolute",top:8,right:8,width:30,height:30,borderRadius:"50%",border:"none",background:WHITE,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 6px rgba(0,0,0,.15)"}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill={RED} stroke={RED} strokeWidth="2"><path d="M12 21C12 21 4 15 4 9a4 4 0 018 0 4 4 0 018 0c0 6-8 12-8 12z"/></svg>
              </button>
            </div>
            <div style={{padding:"12px 14px"}}>
              <div style={{fontWeight:700,fontSize:13.5,color:BLUE,fontFamily:"Georgia,serif"}}>{room.name}</div>
              <div style={{fontSize:10.5,color:MUTE,marginTop:2}}>Floor {room.floor} · {room.cap} ppl</div>
              <button onClick={()=>onBook(room.id)} style={{marginTop:10,width:"100%",borderRadius:9,border:"none",padding:"8px 0",fontWeight:700,fontSize:12,cursor:"pointer",background:`linear-gradient(135deg, #FF7E72, #EC5A4E)`,color:WHITE,fontFamily:"sans-serif"}}>Book now</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [activeNav, setActiveNav] = useState("rooms");
  const [selRoom, setSelRoom] = useState(null);
  // bookings: { "r5-15-13:00": {email, name} }
  const [bookings, setBookings] = useState({
    "r5-15-13:00": {email:"jordan@company.com", name:"Jordan Park"},
    "r10-18-14:00":{email:"priya@company.com",  name:"Priya Sharma"},
    "r1-17-11:00": {email:"marcus@company.com", name:"Marcus Lee"},
  });
  const [saved, setSaved] = useState(["r1","r6"]);
  const [bookingRoom, setBookingRoom] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null); // {roomId, slotKeys}
  const [sortBy, setSortBy] = useState("default");
  const [sortOpen, setSortOpen] = useState(false);
  const [toast, setToast] = useState(null);

  if (!user) return <LoginScreen onLogin={setUser}/>;

  const sortedRooms = [...ROOMS];
  if (sortBy === "size-asc")  sortedRooms.sort((a,b)=>a.cap-b.cap);
  if (sortBy === "size-desc") sortedRooms.sort((a,b)=>b.cap-a.cap);
  if (sortBy === "alpha")     sortedRooms.sort((a,b)=>a.name.localeCompare(b.name));
  if (sortBy === "rating")    sortedRooms.sort((a,b)=>b.rating-a.rating);
  if (sortBy === "floor")     sortedRooms.sort((a,b)=>a.floor-b.floor);

  function handleBookConfirm(key, day, time) {
    setBookings(b => ({...b, [key]: {email:user.email, name:user.name}}));
    setToast(`✓ Booked for June ${day} at ${time}`);
    setTimeout(()=>setToast(null), 4000);
  }
  function askCancel(roomId, slotKeys) {
    setCancelTarget({roomId, slotKeys});
  }
  function doCancel() {
    if (!cancelTarget) return;
    setBookings(b => {
      const next = {...b};
      cancelTarget.slotKeys.forEach(k => delete next[k]);
      return next;
    });
    setToast(`Booking cancelled for ${ROOMS.find(r=>r.id===cancelTarget.roomId)?.name}`);
    setTimeout(()=>setToast(null), 3000);
    setCancelTarget(null);
  }
  function startBook(roomId) {
    const room = ROOMS.find(r=>r.id===roomId);
    if (room) setBookingRoom(room);
  }

  const sortOptions = [
    {id:"default",label:"Default"},
    {id:"alpha",label:"Name (A–Z)"},
    {id:"size-asc",label:"Size (small → large)"},
    {id:"size-desc",label:"Size (large → small)"},
    {id:"rating",label:"Rating (highest)"},
    {id:"floor",label:"Floor (low → high)"},
  ];

  const cancelInfo = cancelTarget ? (()=>{
    const room = ROOMS.find(r=>r.id===cancelTarget.roomId);
    const slotsText = cancelTarget.slotKeys.map(k=>{const p=k.split("-");return `June ${p[1]} at ${p[2]}`;}).join(", ");
    return { roomName: room?.name || "this room", slotsText };
  })() : null;

  return (
    <div style={{display:"flex",height:"100vh",background:CORAL,fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",overflow:"hidden"}}>
      <style>{`.amen-icon:hover .amen-tip { opacity: 1 !important; }`}</style>

      {/* Sidebar */}
      <aside style={{width:200,flexShrink:0,background:`linear-gradient(180deg, #1A6390 0%, ${BLUE_D} 100%)`,display:"flex",flexDirection:"column",padding:"0 0 16px"}}>
        <div style={{padding:"22px 20px 16px",borderBottom:"1px solid #205a7d"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:28,height:28,borderRadius:8,background:"#FF9E92",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BLUE_D} strokeWidth="2.2"><path d="M4 18c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2"/><path d="M4 13c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2"/></svg>
            </div>
            <div>
              <div style={{color:"#EAF3F8",fontSize:13,fontWeight:700,fontFamily:"Georgia,serif"}}>Conference</div>
              <div style={{color:"#FF9E92",fontSize:8,fontWeight:700,letterSpacing:2.5}}>HUB</div>
            </div>
          </div>
        </div>
        <nav style={{flex:1,padding:"12px 10px 0"}}>
          {NAV.map(({id,label,path})=>{
            const act = activeNav === id;
            return (
              <div key={id} onClick={()=>setActiveNav(id)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:10,marginBottom:2,cursor:"pointer",background:act?"#13496B":"transparent",borderLeft:act?`3px solid ${RED}`:"3px solid transparent",color:act?WHITE:"#9FC0D2",fontWeight:act?600:400,fontSize:13}}>
                <Icon path={path} size={17} color={act?RED:"#9FC0D2"} sw={1.9}/>{label}
              </div>
            );
          })}
        </nav>
        <div style={{padding:"10px 10px 0",borderTop:"1px solid #205a7d",marginTop:8}}>
          <div onClick={()=>setUser(null)} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",borderRadius:10,cursor:"pointer",color:"#9FC0D2",fontSize:13}}>
            <Icon path="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" size={16} color="#9FC0D2" sw={1.8}/>Log out
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        <div style={{background:WHITE,borderBottom:`1px solid #EFE0D9`,padding:"0 22px",height:58,display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
          <h1 style={{flex:1,margin:0,fontSize:17,fontWeight:700,fontFamily:"Georgia,serif",color:BLUE}}>Hoffman building</h1>
          <span style={{fontSize:11,color:MUTE}}>Welcome, <b style={{color:BLUE}}>{user.name}</b></span>
          <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,#FF9E92,${RED})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:WHITE}}>{user.initials}</div>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"22px 22px 32px"}}>
          {activeNav === "rooms" && (
            <RoomsPage rooms={sortedRooms} bookings={bookings} selRoom={selRoom} setSelRoom={setSelRoom}
              onBook={startBook} onAskCancel={askCancel} user={user}
              sortBy={sortBy} setSortBy={setSortBy} sortOpen={sortOpen} setSortOpen={setSortOpen} sortOptions={sortOptions}/>
          )}
          {activeNav === "buildings" && <BuildingsPage/>}
          {activeNav === "bookings"  && <MyBookingsPage bookings={bookings} rooms={ROOMS} user={user} onAskCancel={askCancel}/>}
          {activeNav === "schedule"  && <SchedulePage bookings={bookings} rooms={ROOMS}/>}
          {activeNav === "saved"     && <SavedPage saved={saved} rooms={ROOMS} onUnsave={(id)=>setSaved(s=>s.filter(x=>x!==id))} onBook={startBook}/>}
        </div>
      </div>

      {bookingRoom && (
        <BookingModal room={bookingRoom} user={user} bookings={bookings} onConfirm={handleBookConfirm} onClose={()=>setBookingRoom(null)}/>
      )}
      {cancelInfo && (
        <CancelModal roomName={cancelInfo.roomName} slotsText={cancelInfo.slotsText} onConfirm={doCancel} onClose={()=>setCancelTarget(null)}/>
      )}
      {toast && (
        <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:BLUE_D,color:WHITE,borderRadius:12,padding:"12px 24px",fontSize:13,fontWeight:600,boxShadow:"0 8px 24px rgba(0,0,0,.25)",zIndex:99,fontFamily:"sans-serif"}}>{toast}</div>
      )}
    </div>
  );
}