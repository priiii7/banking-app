import { C } from "../utils/theme";
import Sticker from "./Sticker";

/**
 * GoalCard — displays a single savings goal with progress bar,
 * streak counter, and completion badge.
 */
export default function GoalCard({ goal }) {
  const pct  = Math.min((goal.saved / goal.target) * 100, 100);
  const done = pct >= 100;

  return (
    <div
      style={{
        background:    C.white,
        border:        `2px solid ${C.black}`,
        borderRadius:  8,
        padding:       14,
        marginBottom:  10,
        boxShadow:     "3px 3px 0 #000",
        position:      "relative",
      }}
    >
      {done && (
        <Sticker
          color={C.green}
          style={{ position: "absolute", top: -10, right: 10, fontSize: 9 }}
        >
          ✓ COMPLETE
        </Sticker>
      )}

      {/* Goal name + streak */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 20 }}>{goal.icon}</span>
          <span style={{ fontFamily: C.pixelFont, fontWeight: 700, fontSize: 13, color: C.black }}>
            {goal.name}
          </span>
        </div>
        <span style={{ fontFamily: C.pixelFont, fontSize: 11, color: C.yellow, fontWeight: 700 }}>
          {goal.badge}{goal.streak}d
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ background: C.grid, border: `1px solid ${C.border}`, borderRadius: 2, height: 8, marginBottom: 6 }}>
        <div
          style={{
            width:      `${pct}%`,
            height:     "100%",
            background: done ? C.green : C.blue,
            borderRadius: 2,
            transition: "width 1s ease",
          }}
        />
      </div>

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: C.pixelFont, fontSize: 10, color: C.muted }}>
        <span>${goal.saved.toLocaleString()} saved</span>
        <span style={{ color: done ? C.green : C.black, fontWeight: 700 }}>{pct.toFixed(0)}%</span>
      </div>
    </div>
  );
}
