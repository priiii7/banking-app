import { useState, useRef, useEffect } from "react";

// ── New Palette ───────────────────────────────────────────
const C = {
  bg:          "#FAFAF8",
  dot:         "#D4C5E2",
  ink:         "#1A1025",
  purple:      "#6B21A8",
  purpleL:     "#A855F7",
  purplePale:  "#F3E8FF",
  mint:        "#10B981",
  mintL:       "#6EE7B7",
  mintPale:    "#ECFDF5",
  coral:       "#F43F5E",
  coralPale:   "#FFF1F2",
  amber:       "#F59E0B",
  amberPale:   "#FFFBEB",
  white:       "#FFFFFF",
  offwhite:    "#F5F0FF",
  muted:       "#7C6D8A",
  border:      "#1A1025",
  displayFont: "'Georgia', 'Times New Roman', serif",
  pixelFont:   "'Courier New', 'Lucida Console', monospace",
};

// ── Mock Data ─────────────────────────────────────────────
const DEFAULT_TRANSACTIONS = [
  { id:1, name:"Netflix",     cat:"Entertainment", amount:-14.99,  date:"Jun 25", mood:"planned", icon:"🎬" },
  { id:2, name:"Salary",      cat:"Income",        amount:4200,    date:"Jun 24", mood:"planned", icon:"💼" },
  { id:3, name:"Uber Eats",   cat:"Food",          amount:-38.50,  date:"Jun 23", mood:"impulse", icon:"🍕" },
  { id:4, name:"Gym",         cat:"Health",        amount:-45,     date:"Jun 22", mood:"planned", icon:"💪" },
  { id:5, name:"Amazon",      cat:"Shopping",      amount:-127.30, date:"Jun 21", mood:"impulse", icon:"📦" },
  { id:6, name:"Starbucks",   cat:"Food",          amount:-6.75,   date:"Jun 20", mood:"impulse", icon:"☕" },
  { id:7, name:"Spotify",     cat:"Entertainment", amount:-9.99,   date:"Jun 19", mood:"planned", icon:"🎵" },
  { id:8, name:"Electricity", cat:"Bills",         amount:-89.00,  date:"Jun 18", mood:"planned", icon:"⚡" },
];

const SPENDING = [
  { month:"Jan", amount:2100 }, { month:"Feb", amount:1850 },
  { month:"Mar", amount:2400 }, { month:"Apr", amount:2200 },
  { month:"May", amount:1980 }, { month:"Jun", amount:2340 },
];

const GOALS = [
  { id:1, name:"Emergency Fund", target:10000, saved:6800, icon:"🛡️", streak:14 },
  { id:2, name:"Japan Trip",     target:3000,  saved:1200, icon:"✈️",  streak:7  },
  { id:3, name:"New MacBook",    target:2500,  saved:2500, icon:"💻",  streak:30 },
];

const CATS  = ["Entertainment","Income","Food","Health","Shopping","Bills","Travel","Other"];
const ICONS = ["🎬","💼","🍕","💪","📦","☕","🎵","⚡","🛍️","🏠","🚗","💊","🎮","✈️","📱"];

function calcHealth(txns) {
  const impulse = txns.filter(t=>t.mood==="impulse"&&t.amount<0).reduce((s,t)=>s+Math.abs(t.amount),0);
  const total   = txns.filter(t=>t.amount<0).reduce((s,t)=>s+Math.abs(t.amount),0);
  const r = impulse/(total||1);
  return r>0.5?"struggling":r>0.25?"moderate":"healthy";
}

function buildSystemPrompt(txns) {
  const health = calcHealth(txns);
  const spent  = txns.filter(t=>t.amount<0).reduce((s,t)=>s+Math.abs(t.amount),0);
  const tone   = { struggling:"Be warm but firm. User overspends on impulse.", moderate:"Be encouraging. Suggest one improvement.", healthy:"Be forward-looking. Help optimize wealth." }[health];
  return `You are a concise AI financial advisor. ${tone} Balance: ₹12,480 | Income: ₹4,200/mo | Spent: ₹${spent.toFixed(0)} | Health: ${health} | Transactions: ${JSON.stringify(txns.slice(0,6))}. Max 4 sentences, be specific, 1 emoji max.`;
}

// ── Cassette Card ─────────────────────────────────────────
function CassetteCard({ title, subtitle, children, accent = C.purple }) {
  return (
    <div style={{ background:C.white, border:`2px solid ${C.ink}`, borderRadius:16, overflow:"hidden", marginBottom:16, boxShadow:`4px 4px 0 ${C.ink}` }}>
      {/* Cassette top */}
      <div style={{ background:C.ink, padding:"10px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <div style={{ width:36, height:24, background:"#333", border:"2px solid #555", borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:20, height:14, background:"#222", borderRadius:2 }}/>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
            {[...Array(3)].map((_,i)=><div key={i} style={{ width:20, height:2, background:i===1?"#666":"#444" }}/>)}
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <div style={{ width:18, height:18, borderRadius:"50%", background:"#333", border:"2px solid #555" }}/>
          <div style={{ width:18, height:18, borderRadius:"50%", background:"#333", border:"2px solid #555" }}/>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
            {[...Array(3)].map((_,i)=><div key={i} style={{ width:20, height:2, background:i===1?"#666":"#444" }}/>)}
          </div>
          <div style={{ width:36, height:24, background:"#333", border:"2px solid #555", borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:20, height:14, background:"#222", borderRadius:2 }}/>
          </div>
        </div>
      </div>
      {/* Label */}
      <div style={{ background:C.offwhite, margin:"0 10px", borderRadius:8, padding:"12px 14px", border:`1px solid ${C.dot}`, marginTop:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
          <div>
            <div style={{ fontFamily:C.displayFont, fontWeight:700, fontSize:14, color:C.ink, letterSpacing:0.5 }}>{title}</div>
            {subtitle && <div style={{ fontFamily:C.pixelFont, fontSize:9, color:accent, textTransform:"uppercase", letterSpacing:1, marginTop:2 }}>{subtitle}</div>}
          </div>
          <div style={{ width:32, height:32, borderRadius:"50%", background:accent, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:16, height:16, borderRadius:"50%", background:C.ink }}/>
          </div>
        </div>
        {children}
      </div>
      {/* Cassette bottom strip */}
      <div style={{ background:C.ink, padding:"4px 16px", display:"flex", gap:3, alignItems:"center" }}>
        {[...Array(16)].map((_,i)=><div key={i} style={{ flex:1, height:i%4===0?8:4, background:i%3===0?"#555":"#333", borderRadius:1 }}/>)}
      </div>
    </div>
  );
}

// ── Tag ───────────────────────────────────────────────────
function Tag({ children, bg=C.purplePale, color=C.purple, border=C.purple }) {
  return (
    <span style={{ background:bg, color, border:`1.5px solid ${border}`, borderRadius:99, padding:"3px 10px", fontFamily:C.pixelFont, fontSize:10, fontWeight:700, whiteSpace:"nowrap" }}>
      {children}
    </span>
  );
}

// ── Pill Button ───────────────────────────────────────────
function PillBtn({ children, bg=C.ink, color=C.white, onClick, disabled, style={} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background:bg, color, fontFamily:C.pixelFont, fontWeight:700, fontSize:11,
      padding:"10px 18px", borderRadius:99, border:`2px solid ${C.ink}`,
      boxShadow:disabled?"none":`3px 3px 0 ${C.ink}`, cursor:disabled?"not-allowed":"pointer",
      letterSpacing:0.5, textTransform:"uppercase", transition:"all 0.1s", opacity:disabled?0.6:1, ...style,
    }}>{children}</button>
  );
}

// ── Bar Chart ─────────────────────────────────────────────
function BarChart({ data, predicted }) {
  const max = Math.max(...data.map(d=>d.amount), predicted||0);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:100 }}>
      {data.map((d,i)=>(
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
          <div style={{ width:"100%", background:`linear-gradient(to top, ${C.purple}, ${C.purpleL})`, height:`${(d.amount/max)*100}%`, borderRadius:"3px 3px 0 0", border:`1px solid ${C.ink}` }}/>
          <span style={{ fontSize:8, color:C.muted, fontFamily:C.pixelFont }}>{d.month}</span>
        </div>
      ))}
      {predicted && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
          <div style={{ width:"100%", background:`linear-gradient(to top, ${C.mint}, ${C.mintL})`, height:`${(predicted/max)*100}%`, borderRadius:"3px 3px 0 0", border:`2px dashed ${C.ink}` }}/>
          <span style={{ fontSize:8, color:C.mint, fontFamily:C.pixelFont, fontWeight:700 }}>Jul*</span>
        </div>
      )}
    </div>
  );
}

// ── Goal Card ─────────────────────────────────────────────
function GoalCard({ goal }) {
  const pct  = Math.min((goal.saved/goal.target)*100,100);
  const done = pct>=100;
  return (
    <div style={{ background:done?C.mintPale:C.white, border:`2px solid ${C.ink}`, borderRadius:12, padding:14, marginBottom:10, boxShadow:`3px 3px 0 ${C.ink}` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:22 }}>{goal.icon}</span>
          <div>
            <div style={{ fontFamily:C.displayFont, fontWeight:700, fontSize:13, color:C.ink }}>{goal.name}</div>
            <div style={{ fontFamily:C.pixelFont, fontSize:9, color:C.muted, marginTop:1 }}>🔥 {goal.streak} day streak</div>
          </div>
        </div>
        {done
          ? <Tag bg={C.mintPale} color={C.mint} border={C.mint}>✓ Done</Tag>
          : <Tag bg={C.purplePale} color={C.purple} border={C.purple}>{pct.toFixed(0)}%</Tag>
        }
      </div>
      <div style={{ background:C.dot, borderRadius:99, height:6 }}>
        <div style={{ width:`${pct}%`, height:"100%", borderRadius:99, background:done?`linear-gradient(90deg,${C.mint},${C.mintL})`:`linear-gradient(90deg,${C.purple},${C.purpleL})`, transition:"width 1s ease" }}/>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", fontFamily:C.pixelFont, fontSize:10, color:C.muted, marginTop:5 }}>
        <span>₹{goal.saved.toLocaleString()} saved</span>
        <span>of ₹{goal.target.toLocaleString()}</span>
      </div>
    </div>
  );
}

// ── Transaction Modal ─────────────────────────────────────
function TxnModal({ existing, onSave, onClose }) {
  const [form, setForm] = useState(existing||{ name:"", cat:"Food", amount:"", date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}), mood:"planned", icon:"💳" });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  function save() {
    if (!form.name||!form.amount) return;
    const amt = parseFloat(form.amount);
    onSave({...form, amount:form.cat==="Income"?Math.abs(amt):-Math.abs(amt)});
  }

  const inp = { width:"100%", background:C.white, border:`2px solid ${C.ink}`, borderRadius:8, padding:"8px 12px", fontFamily:C.pixelFont, fontSize:11, outline:"none", boxShadow:`2px 2px 0 ${C.ink}`, marginBottom:10 };
  const lbl = { fontFamily:C.pixelFont, fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:1, marginBottom:3, display:"block" };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(26,16,37,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:20 }}>
      <div style={{ background:C.offwhite, border:`3px solid ${C.ink}`, borderRadius:16, padding:20, width:"100%", maxWidth:360, boxShadow:`6px 6px 0 ${C.ink}` }}>
        <div style={{ fontFamily:C.displayFont, fontWeight:700, fontSize:16, marginBottom:16, color:C.ink }}>
          {existing?"✏️ Edit Transaction":"➕ New Transaction"}
        </div>
        <label style={lbl}>Name</label>
        <input style={inp} value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Swiggy"/>
        <label style={lbl}>Amount (₹)</label>
        <input style={inp} type="number" value={form.amount} onChange={e=>set("amount",e.target.value)} placeholder="e.g. 250"/>
        <label style={lbl}>Category</label>
        <select style={inp} value={form.cat} onChange={e=>set("cat",e.target.value)}>
          {CATS.map(c=><option key={c}>{c}</option>)}
        </select>
        <label style={lbl}>Type</label>
        <div style={{ display:"flex", gap:8, marginBottom:10 }}>
          {["planned","impulse"].map(m=>(
            <button key={m} onClick={()=>set("mood",m)} style={{
              flex:1, padding:"8px", fontFamily:C.pixelFont, fontSize:10, fontWeight:700,
              textTransform:"uppercase", cursor:"pointer", border:`2px solid ${C.ink}`, borderRadius:8,
              background:form.mood===m?(m==="impulse"?C.coral:C.mint):C.white,
              color:form.mood===m?C.white:C.ink, boxShadow:`2px 2px 0 ${C.ink}`,
            }}>{m}</button>
          ))}
        </div>
        <label style={lbl}>Icon</label>
        <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:14 }}>
          {ICONS.map(ic=>(
            <button key={ic} onClick={()=>set("icon",ic)} style={{ fontSize:16, background:form.icon===ic?C.purplePale:C.white, border:`2px solid ${form.icon===ic?C.purple:"#ddd"}`, borderRadius:8, padding:"4px 6px", cursor:"pointer" }}>{ic}</button>
          ))}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <PillBtn onClick={save} bg={C.ink} style={{ flex:1 }}>{existing?"Save":"Add"}</PillBtn>
          <PillBtn onClick={onClose} bg={C.white} color={C.ink} style={{ flex:1 }}>Cancel</PillBtn>
        </div>
      </div>
    </div>
  );
}

// ── AI Chat ───────────────────────────────────────────────
function AIAdvisor({ transactions }) {
  const health = calcHealth(transactions);
  const systemPrompt = buildSystemPrompt(transactions);
  const [messages, setMessages] = useState([
    { role:"assistant", text:`Hey Priya! 👋 Your finances look ${health} right now. What would you like to know?` }
  ]);
  const [input, setInput]       = useState("");
  const [streaming, setStreaming] = useState(false);
  const [insight, setInsight]   = useState(null);
  const bottomRef = useRef(null);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  async function send() {
    if (!input.trim()||streaming) return;
    const userMsg=input.trim(); setInput(""); setInsight(null);
    const newMessages=[...messages,{role:"user",text:userMsg}];
    setMessages([...newMessages,{role:"assistant",text:"",streaming:true}]);
    setStreaming(true);
    const apiMessages=newMessages.filter(m=>m.text).map(m=>({role:m.role==="assistant"?"model":"user",parts:[{text:m.text}]}));
    while(apiMessages.length>0&&apiMessages[0].role==="model") apiMessages.shift();
    let fullReply="";
    try {
      const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({system_instruction:{parts:[{text:systemPrompt}]},contents:apiMessages})
      });
      const d=await res.json();
      if(!res.ok) throw new Error(d?.error?.message||"API error");
      fullReply=d.candidates?.[0]?.content?.parts?.[0]?.text||"";
      // Simulate streaming
      const words=fullReply.split(" "); let current="";
      for(const word of words){
        current+=(current?" ":"")+word;
        setMessages(prev=>{const u=[...prev];u[u.length-1]={role:"assistant",text:current,streaming:true};return u;});
        await new Promise(r=>setTimeout(r,35));
      }
      setMessages(prev=>{const u=[...prev];u[u.length-1]={role:"assistant",text:fullReply,streaming:false};return u;});
      // Extract insight
      try{
        const r2=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,{
          method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({system_instruction:{parts:[{text:"Return ONLY valid JSON, no markdown."}]},contents:[{role:"user",parts:[{text:`User: "${userMsg}" Advisor: "${fullReply}" → JSON: {"category":"spending"|"saving"|"budget","urgency":"high"|"medium"|"low","action":"one step or null"}`}]}]})
        });
        const d2=await r2.json();
        const t=d2.candidates?.[0]?.content?.parts?.[0]?.text||"{}";
        setInsight(JSON.parse(t.replace(/```json|```/g,"").trim()));
      }catch{}
    } catch(e) {
      setMessages(prev=>{const u=[...prev];u[u.length-1]={role:"assistant",text:`Error: ${e.message}`,streaming:false};return u;});
    }
    setStreaming(false);
  }

  const healthColors = { healthy:{bg:C.mintPale,color:C.mint,border:C.mint}, moderate:{bg:C.amberPale,color:C.amber,border:C.amber}, struggling:{bg:C.coralPale,color:C.coral,border:C.coral} }[health];

  return (
    <div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
        <Tag bg={healthColors.bg} color={healthColors.color} border={healthColors.border}>{health.toUpperCase()} HEALTH</Tag>
        <Tag bg={C.purplePale} color={C.purple} border={C.purple}>⚡ STREAMING</Tag>
        <Tag bg={C.offwhite} color={C.muted} border={C.dot}>💾 {messages.length} MSG</Tag>
      </div>

      <div style={{ maxHeight:260, overflowY:"auto", display:"flex", flexDirection:"column", gap:8, marginBottom:10, scrollbarWidth:"none" }}>
        {messages.map((m,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
            <div style={{
              maxWidth:"85%", padding:"10px 14px",
              background:m.role==="user"?C.ink:C.white,
              color:m.role==="user"?C.white:C.ink,
              border:`2px solid ${C.ink}`,
              borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",
              fontFamily:C.pixelFont, fontSize:12, lineHeight:1.6,
              boxShadow:`2px 2px 0 ${C.dot}`, whiteSpace:"pre-wrap",
            }}>
              {m.role==="assistant"&&<div style={{ fontSize:9, color:C.purpleL, fontWeight:700, marginBottom:3, letterSpacing:1 }}>AI ADVISOR</div>}
              {m.text}
              {m.streaming&&<span style={{ display:"inline-block", width:2, height:11, background:C.purpleL, marginLeft:2, animation:"blink 0.7s infinite" }}/>}
            </div>
          </div>
        ))}
        <div ref={bottomRef}/>
      </div>

      {insight?.action&&(
        <div style={{ background:C.amberPale, border:`2px solid ${C.amber}`, borderRadius:10, padding:"8px 12px", marginBottom:8, boxShadow:`2px 2px 0 ${C.ink}` }}>
          <div style={{ fontFamily:C.pixelFont, fontSize:9, fontWeight:700, color:C.amber, textTransform:"uppercase", letterSpacing:1, marginBottom:3 }}>{insight.category} · {insight.urgency} priority</div>
          <div style={{ fontFamily:C.pixelFont, fontSize:11, color:C.ink }}>→ {insight.action}</div>
        </div>
      )}

      <div style={{ display:"flex", gap:8 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder="Ask about your finances…"
          style={{ flex:1, background:C.white, border:`2px solid ${C.ink}`, borderRadius:99, padding:"10px 16px", fontFamily:C.pixelFont, fontSize:12, outline:"none", boxShadow:`2px 2px 0 ${C.dot}` }}
        />
        <PillBtn onClick={send} disabled={streaming} bg={streaming?C.muted:C.purple}>{streaming?"…":"Send"}</PillBtn>
      </div>
      <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap" }}>
        {["Am I overspending?","How to save more?","Rate my finances","Biggest risk?"].map(q=>(
          <button key={q} onClick={()=>setInput(q)} style={{ background:"transparent", border:`1.5px solid ${C.dot}`, borderRadius:99, padding:"3px 10px", fontFamily:C.pixelFont, fontSize:10, color:C.muted, cursor:"pointer" }}>{q}</button>
        ))}
      </div>
    </div>
  );
}

// ── Budget Predictor ──────────────────────────────────────
function BudgetPredictor() {
  const [predicted, setPredicted] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [insight, setInsight]     = useState(null);

  async function predict() {
    setLoading(true);
    try {
      const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({system_instruction:{parts:[{text:"Budget prediction AI. ONLY valid JSON, no markdown."}]},contents:[{role:"user",parts:[{text:`Spending: Jan:2100,Feb:1850,Mar:2400,Apr:2200,May:1980,Jun:2340. Income:₹4200. Return JSON: {"predicted":number,"confidence":"high"|"medium"|"low","tip":"one sentence","trend":"up"|"down"|"stable","breakdown":{"food":number,"bills":number,"entertainment":number,"other":number}}`}]}]})
      });
      const d=await res.json();
      const t=d.candidates?.[0]?.content?.parts?.[0]?.text||"{}";
      const p=JSON.parse(t.replace(/```json|```/g,"").trim());
      setPredicted(p.predicted); setInsight(p);
    } catch {
      setPredicted(2180);
      setInsight({predicted:2180,confidence:"medium",tip:"Cut food delivery to save ~₹800 next month.",trend:"down",breakdown:{food:820,bills:680,entertainment:480,other:200}});
    }
    setLoading(false);
  }

  return (
    <div>
      <BarChart data={SPENDING} predicted={predicted}/>
      <div style={{ marginTop:14 }}>
        {!predicted?(
          <PillBtn onClick={predict} disabled={loading} bg={C.purple} style={{ width:"100%" }}>
            {loading?"Analyzing…":"🔮 Predict July Budget"}
          </PillBtn>
        ):(
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div>
                <div style={{ fontFamily:C.pixelFont, fontSize:10, color:C.muted, textTransform:"uppercase" }}>July Forecast</div>
                <div style={{ fontFamily:C.displayFont, fontSize:28, fontWeight:700, color:C.purple }}>₹{predicted.toLocaleString()}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:22 }}>{insight?.trend==="down"?"📉":insight?.trend==="up"?"📈":"➡️"}</div>
                <Tag bg={insight?.confidence==="high"?C.mintPale:C.amberPale} color={insight?.confidence==="high"?C.mint:C.amber} border={insight?.confidence==="high"?C.mint:C.amber}>{insight?.confidence} conf.</Tag>
              </div>
            </div>
            {insight?.breakdown&&(
              <div style={{ background:C.offwhite, border:`2px solid ${C.dot}`, borderRadius:10, padding:10, marginBottom:8 }}>
                {Object.entries(insight.breakdown).map(([k,v])=>(
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", fontFamily:C.pixelFont, fontSize:11, marginBottom:4 }}>
                    <span style={{ textTransform:"capitalize", color:C.muted }}>{k}</span>
                    <span style={{ fontWeight:700, color:C.ink }}>₹{v}</span>
                  </div>
                ))}
              </div>
            )}
            {insight?.tip&&<div style={{ background:C.amberPale, border:`2px solid ${C.amber}`, borderRadius:8, padding:"8px 12px", fontFamily:C.pixelFont, fontSize:11, marginBottom:8, color:C.ink }}>💡 {insight.tip}</div>}
            <PillBtn onClick={()=>{setPredicted(null);setInsight(null);}} bg={C.white} color={C.ink} style={{ width:"100%" }}>Reset</PillBtn>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────
function Dashboard() {
  const [txns, setTxns]         = useState(()=>{ try{const s=localStorage.getItem("priya_txns"); return s?JSON.parse(s):DEFAULT_TRANSACTIONS;}catch{return DEFAULT_TRANSACTIONS;} });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]   = useState(null);
  useEffect(()=>localStorage.setItem("priya_txns",JSON.stringify(txns)),[txns]);

  function handleSave(t) {
    if(editing) setTxns(p=>p.map(x=>x.id===editing.id?{...t,id:editing.id}:x));
    else setTxns(p=>[{...t,id:Date.now()},...p]);
    setShowModal(false); setEditing(null);
  }

  const impulse=txns.filter(t=>t.mood==="impulse"&&t.amount<0).length;
  const planned=txns.filter(t=>t.mood==="planned"&&t.amount<0).length;

  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        {[{label:"😬 Impulse",val:`${impulse} buys`,bg:C.coralPale,color:C.coral},{label:"✅ Planned",val:`${planned} buys`,bg:C.mintPale,color:C.mint}].map(s=>(
          <div key={s.label} style={{ flex:1, background:s.bg, border:`2px solid ${C.ink}`, borderRadius:12, padding:12, boxShadow:`3px 3px 0 ${C.ink}` }}>
            <div style={{ fontSize:10, color:C.muted, fontFamily:C.pixelFont, marginBottom:3 }}>{s.label}</div>
            <div style={{ fontSize:14, fontWeight:700, color:s.color, fontFamily:C.displayFont }}>{s.val}</div>
          </div>
        ))}
      </div>

      <CassetteCard title="Transactions" subtitle="Your spending history" accent={C.purple}>
        <div style={{ marginBottom:12 }}>
          <PillBtn onClick={()=>{setEditing(null);setShowModal(true);}} bg={C.mint} style={{ width:"100%" }}>➕ Add Transaction</PillBtn>
        </div>
        {txns.map(t=>(
          <div key={t.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${C.dot}` }}>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <span style={{ fontSize:18 }}>{t.icon}</span>
              <div>
                <div style={{ fontFamily:C.displayFont, fontSize:12, fontWeight:700, color:C.ink }}>{t.name}</div>
                <div style={{ display:"flex", gap:4, marginTop:2 }}>
                  <span style={{ fontSize:9, color:C.muted, fontFamily:C.pixelFont }}>{t.cat}</span>
                  <Tag bg={t.mood==="impulse"?C.coralPale:C.mintPale} color={t.mood==="impulse"?C.coral:C.mint} border={t.mood==="impulse"?C.coral:C.mint}>{t.mood}</Tag>
                </div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:12, fontWeight:700, color:t.amount>0?C.mint:C.ink, fontFamily:C.displayFont }}>{t.amount>0?"+":""}₹{Math.abs(t.amount).toFixed(0)}</div>
                <div style={{ fontSize:9, color:C.muted, fontFamily:C.pixelFont }}>{t.date}</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                <button onClick={()=>{setEditing({...t,amount:Math.abs(t.amount)});setShowModal(true);}} style={{ background:C.amberPale, border:`1px solid ${C.amber}`, borderRadius:4, fontSize:10, padding:"2px 5px", cursor:"pointer" }}>✏️</button>
                <button onClick={()=>setTxns(p=>p.filter(x=>x.id!==t.id))} style={{ background:C.coralPale, border:`1px solid ${C.coral}`, borderRadius:4, fontSize:10, padding:"2px 5px", cursor:"pointer" }}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </CassetteCard>

      {showModal&&<TxnModal existing={editing} onSave={handleSave} onClose={()=>{setShowModal(false);setEditing(null);}}/>}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");

  const tabs = [
    { id:"dashboard", icon:"📊", label:"Home" },
    { id:"ai",        icon:"🧠", label:"Advisor" },
    { id:"goals",     icon:"🎯", label:"Goals" },
    { id:"predict",   icon:"🔮", label:"Forecast" },
  ];

  return (
    <div style={{
      minHeight:"100vh",
      background:`radial-gradient(circle, ${C.dot} 1px, transparent 1px)`,
      backgroundSize:"24px 24px",
      backgroundColor:C.bg,
      maxWidth:480, margin:"0 auto", paddingBottom:90,
      fontFamily:C.pixelFont,
    }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{display:none}
        input::placeholder{color:#7C6D8A;font-family:'Courier New',monospace}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Header */}
      <div style={{ padding:"28px 20px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div>
            <div style={{ fontFamily:C.pixelFont, fontSize:10, color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:4 }}>Good morning</div>
            <div style={{ fontFamily:C.displayFont, fontSize:30, fontWeight:700, color:C.ink, lineHeight:1 }}>Priya ✦</div>
            <div style={{ fontFamily:C.pixelFont, fontSize:10, color:C.purple, marginTop:4 }}>Managing finances with AI</div>
          </div>
          <div style={{ width:48, height:48, borderRadius:"50%", background:`linear-gradient(135deg,${C.purple},${C.purpleL})`, display:"flex", alignItems:"center", justifyContent:"center", border:`2px solid ${C.ink}`, boxShadow:`3px 3px 0 ${C.ink}`, fontFamily:C.displayFont, fontWeight:700, fontSize:18, color:C.white }}>P</div>
        </div>

        {/* Balance Card */}
        <div style={{ background:C.ink, borderRadius:20, padding:20, boxShadow:`6px 6px 0 ${C.purple}`, marginBottom:16, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, borderRadius:"50%", background:C.purple, opacity:0.15 }}/>
          <div style={{ position:"absolute", bottom:-30, left:-10, width:80, height:80, borderRadius:"50%", background:C.purpleL, opacity:0.1 }}/>
          <div style={{ fontFamily:C.pixelFont, fontSize:9, color:"#A78BFA", letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>Total Balance</div>
          <div style={{ fontFamily:C.displayFont, fontSize:36, fontWeight:700, color:C.white, letterSpacing:-1, marginBottom:16 }}>₹12,480<span style={{ fontSize:20 }}>.55</span></div>
          <div style={{ display:"flex", gap:20 }}>
            <div><div style={{ fontSize:9, color:"#A78BFA", fontFamily:C.pixelFont }}>INCOME</div><div style={{ fontSize:14, fontWeight:700, color:C.mintL, fontFamily:C.displayFont }}>+₹4,200</div></div>
            <div style={{ width:1, background:"#333" }}/>
            <div><div style={{ fontSize:9, color:"#A78BFA", fontFamily:C.pixelFont }}>SPENT</div><div style={{ fontSize:14, fontWeight:700, color:C.coral, fontFamily:C.displayFont }}>-₹331</div></div>
            <div style={{ width:1, background:"#333" }}/>
            <div><div style={{ fontSize:9, color:"#A78BFA", fontFamily:C.pixelFont }}>SAVED</div><div style={{ fontSize:14, fontWeight:700, color:C.amber, fontFamily:C.displayFont }}>₹3,869</div></div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ display:"flex", gap:10 }}>
          <PillBtn bg={C.purple} style={{ flex:1 }} onClick={()=>setTab("ai")}>🧠 AI Advisor</PillBtn>
          <PillBtn bg={C.mint} style={{ flex:1 }} onClick={()=>setTab("predict")}>🔮 Forecast</PillBtn>
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ padding:"0 20px", animation:"slideUp 0.3s ease" }}>
        {tab==="dashboard" && <Dashboard/>}

        {tab==="ai" && (
          <CassetteCard title="AI Financial Advisor" subtitle="Gemini · Streaming · Memory" accent={C.purple}>
            <AIAdvisor transactions={DEFAULT_TRANSACTIONS}/>
          </CassetteCard>
        )}

        {tab==="goals" && (
          <div>
            <CassetteCard title="Savings Goals" subtitle="Streaks & Progress" accent={C.mint}>
              {GOALS.map(g=><GoalCard key={g.id} goal={g}/>)}
            </CassetteCard>
            <CassetteCard title="Badge Collection" subtitle="Achievements" accent={C.amber}>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {["🔥 14-Day Streak","⭐ 7-Day Streak","🏆 Goal Done","💪 First Save","🎯 Goal Setter"].map(b=>(
                  <Tag key={b} bg={C.amberPale} color={C.amber} border={C.amber}>{b}</Tag>
                ))}
              </div>
            </CassetteCard>
          </div>
        )}

        {tab==="predict" && (
          <div>
            <CassetteCard title="Smart Budget Forecast" subtitle="AI predicts July spending" accent={C.mint}>
              <BudgetPredictor/>
            </CassetteCard>
            <CassetteCard title="Spend by Category" subtitle="Current month" accent={C.coral}>
              {[{cat:"Food",pct:38,color:C.coral},{cat:"Bills",pct:27,color:C.amber},{cat:"Entertainment",pct:20,color:C.purple},{cat:"Health",pct:15,color:C.mint}].map(c=>(
                <div key={c.cat} style={{ marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontFamily:C.pixelFont, fontSize:11, marginBottom:4 }}>
                    <span style={{ color:C.ink }}>{c.cat}</span><span style={{ color:C.muted }}>{c.pct}%</span>
                  </div>
                  <div style={{ background:C.dot, borderRadius:99, height:6 }}>
                    <div style={{ width:`${c.pct}%`, height:"100%", background:c.color, borderRadius:99, transition:"width 1s ease" }}/>
                  </div>
                </div>
              ))}
            </CassetteCard>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ position:"fixed", bottom:16, left:"50%", transform:"translateX(-50%)", background:C.ink, border:`2px solid ${C.ink}`, borderRadius:99, padding:"8px 12px", display:"flex", gap:4, boxShadow:`4px 4px 0 ${C.purple}`, zIndex:100 }}>
        {tabs.map(t=>{
          const active=tab===t.id;
          return (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              background:active?C.purple:"transparent",
              color:active?C.white:C.muted,
              border:"none", borderRadius:99, padding:"8px 14px",
              fontFamily:C.pixelFont, fontWeight:700, fontSize:10,
              cursor:"pointer", display:"flex", alignItems:"center", gap:4,
              transition:"all 0.2s",
            }}>
              <span style={{ fontSize:14 }}>{t.icon}</span>
              {active && <span>{t.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
