import { useState, useEffect } from "react";
import { C } from "../utils/theme";
import { TRANSACTIONS as DEFAULT_TRANSACTIONS, CATEGORIES } from "../data/mockData";
import FloppyCard from "./FloppyCard";
import ChunkyButton from "./ChunkyButton";

const STORAGE_KEY = "priya_transactions";

const ICONS = ["🎬", "💼", "🍕", "💪", "📦", "☕", "🎵", "⚡", "🛍️", "🏠", "🚗", "💊", "🎮", "✈️", "📱"];
const CATS  = ["Entertainment", "Income", "Food", "Health", "Shopping", "Bills", "Travel", "Other"];

function loadTransactions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS;
  } catch {
    return DEFAULT_TRANSACTIONS;
  }
}

function saveTransactions(txns) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(txns));
}

// ── Transaction Form Modal ────────────────────────────────
function TransactionModal({ existing, onSave, onClose }) {
  const [form, setForm] = useState(existing || {
    name: "", cat: "Food", amount: "", date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    mood: "planned", icon: "💳",
  });

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    if (!form.name || !form.amount) return;
    const amount = parseFloat(form.amount);
    onSave({ ...form, amount: form.cat === "Income" ? Math.abs(amount) : -Math.abs(amount) });
  }

  const inputStyle = {
    width: "100%", background: C.white, border: `2px solid ${C.black}`,
    borderRadius: 6, padding: "8px 10px", fontFamily: C.pixelFont,
    fontSize: 11, outline: "none", boxShadow: "2px 2px 0 #999",
    marginBottom: 10,
  };

  const labelStyle = {
    fontFamily: C.pixelFont, fontSize: 9, color: C.muted,
    textTransform: "uppercase", letterSpacing: 1, marginBottom: 3, display: "block",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 20,
    }}>
      <div style={{
        background: C.offwhite, border: `3px solid ${C.black}`,
        borderRadius: 12, padding: 20, width: "100%", maxWidth: 360,
        boxShadow: "6px 6px 0 #000",
      }}>
        <div style={{ fontFamily: C.pixelFont, fontWeight: 700, fontSize: 14, marginBottom: 16, letterSpacing: 1 }}>
          {existing ? "✏️ EDIT TRANSACTION" : "➕ ADD TRANSACTION"}
        </div>

        <label style={labelStyle}>Name</label>
        <input style={inputStyle} value={form.name} onChange={e => handleChange("name", e.target.value)} placeholder="e.g. Netflix" />

        <label style={labelStyle}>Amount (₹)</label>
        <input style={inputStyle} type="number" value={form.amount} onChange={e => handleChange("amount", e.target.value)} placeholder="e.g. 499" />

        <label style={labelStyle}>Category</label>
        <select style={inputStyle} value={form.cat} onChange={e => handleChange("cat", e.target.value)}>
          {CATS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <label style={labelStyle}>Type</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          {["planned", "impulse"].map(m => (
            <button key={m} onClick={() => handleChange("mood", m)} style={{
              flex: 1, padding: "8px", fontFamily: C.pixelFont, fontSize: 10,
              fontWeight: 700, textTransform: "uppercase", cursor: "pointer",
              border: `2px solid ${C.black}`, borderRadius: 6,
              background: form.mood === m ? (m === "impulse" ? C.red : C.green) : C.white,
              color: form.mood === m ? C.white : C.black,
              boxShadow: "2px 2px 0 #000",
            }}>{m}</button>
          ))}
        </div>

        <label style={labelStyle}>Icon</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {ICONS.map(icon => (
            <button key={icon} onClick={() => handleChange("icon", icon)} style={{
              fontSize: 18, background: form.icon === icon ? C.yellow : C.white,
              border: `2px solid ${form.icon === icon ? C.black : "#ccc"}`,
              borderRadius: 6, padding: "4px 6px", cursor: "pointer",
              boxShadow: form.icon === icon ? "2px 2px 0 #000" : "none",
            }}>{icon}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <ChunkyButton onClick={handleSave} color={C.black} style={{ flex: 1 }}>
            {existing ? "SAVE" : "ADD"}
          </ChunkyButton>
          <ChunkyButton onClick={onClose} color={C.white} textColor={C.black} style={{ flex: 1 }}>
            CANCEL
          </ChunkyButton>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────
export default function Dashboard() {
  const [transactions, setTransactions] = useState(loadTransactions);
  const [showModal,    setShowModal]    = useState(false);
  const [editing,      setEditing]      = useState(null);

  useEffect(() => { saveTransactions(transactions); }, [transactions]);

  const impulseCount = transactions.filter(t => t.mood === "impulse" && t.amount < 0).length;
  const plannedCount = transactions.filter(t => t.mood === "planned" && t.amount < 0).length;

  function handleSave(txn) {
    if (editing) {
      setTransactions(prev => prev.map(t => t.id === editing.id ? { ...txn, id: editing.id } : t));
    } else {
      setTransactions(prev => [{ ...txn, id: Date.now() }, ...prev]);
    }
    setShowModal(false);
    setEditing(null);
  }

  function handleEdit(txn) {
    setEditing({ ...txn, amount: Math.abs(txn.amount) });
    setShowModal(true);
  }

  function handleDelete(id) {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }

  function handleAdd() {
    setEditing(null);
    setShowModal(true);
  }

  return (
    <div>
      {/* Quick stats */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        {[
          { label: "😬 Impulse", val: `${impulseCount} buys`, color: C.red },
          { label: "✅ Planned", val: `${plannedCount} buys`, color: C.green },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: C.white, border: `2px solid ${C.black}`, borderRadius: 8, padding: 12, boxShadow: "3px 3px 0 #000" }}>
            <div style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>{s.label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: s.color, fontFamily: C.pixelFont }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <FloppyCard title="TRANSACTIONS" subtitle="Your spending history" accentColor={C.blue}>
        <div style={{ marginBottom: 12 }}>
          <ChunkyButton onClick={handleAdd} color={C.green} style={{ width: "100%" }}>
            ➕ ADD TRANSACTION
          </ChunkyButton>
        </div>

        {transactions.map(t => (
          <div key={t.id} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "8px 0", borderBottom: `1px solid ${C.gridLine}`,
          }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              <div>
                <div style={{ fontFamily: C.pixelFont, fontSize: 11, fontWeight: 700, color: C.black }}>{t.name}</div>
                <div style={{ display: "flex", gap: 4, marginTop: 2, alignItems: "center" }}>
                  <span style={{ fontSize: 9, color: C.muted }}>{t.cat}</span>
                  <span style={{
                    fontSize: 8, padding: "1px 5px", borderRadius: 2,
                    background: t.mood === "impulse" ? `${C.red}22` : `${C.green}22`,
                    color: t.mood === "impulse" ? C.red : C.green,
                    fontWeight: 700, textTransform: "uppercase",
                    border: `1px solid ${t.mood === "impulse" ? C.red : C.green}`,
                  }}>{t.mood}</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: t.amount > 0 ? C.green : C.black, fontFamily: C.pixelFont }}>
                  {t.amount > 0 ? "+" : ""}₹{Math.abs(t.amount).toFixed(0)}
                </div>
                <div style={{ fontSize: 9, color: C.muted }}>{t.date}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <button onClick={() => handleEdit(t)} style={{
                  background: C.yellow, border: `1px solid ${C.black}`, borderRadius: 3,
                  fontSize: 9, padding: "2px 5px", cursor: "pointer", fontFamily: C.pixelFont, fontWeight: 700,
                }}>✏️</button>
                <button onClick={() => handleDelete(t.id)} style={{
                  background: C.red, border: `1px solid ${C.black}`, borderRadius: 3,
                  fontSize: 9, padding: "2px 5px", cursor: "pointer", color: C.white, fontFamily: C.pixelFont, fontWeight: 700,
                }}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </FloppyCard>

      {/* Category breakdown */}
      <FloppyCard title="SPEND BY CATEGORY" subtitle="Current month" accentColor={C.red}>
        {CATEGORIES.map(c => (
          <div key={c.cat} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: C.pixelFont, fontSize: 11, marginBottom: 4 }}>
              <span>{c.cat}</span><span style={{ color: C.muted }}>{c.pct}%</span>
            </div>
            <div style={{ background: C.grid, border: `1px solid ${C.border}`, borderRadius: 2, height: 8 }}>
              <div style={{ width: `${c.pct}%`, height: "100%", background: c.color, borderRadius: 2, transition: "width 1s ease" }} />
            </div>
          </div>
        ))}
      </FloppyCard>

      {showModal && (
        <TransactionModal
          existing={editing}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
