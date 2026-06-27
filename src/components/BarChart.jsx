import { C } from "../utils/theme";

/**
 * BarChart — pixel-style vertical bar chart.
 * Optionally renders a dashed AI-predicted bar at the end.
 */
export default function BarChart({ data, predicted }) {
  const max = Math.max(...data.map((d) => d.amount), predicted || 0);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <div
            style={{
              width:        "100%",
              background:   C.black,
              height:       `${(d.amount / max) * 100}%`,
              borderRadius: "2px 2px 0 0",
              border:       `1px solid ${C.border}`,
            }}
          />
          <span style={{ fontSize: 8, color: C.muted, fontFamily: C.pixelFont }}>{d.month}</span>
        </div>
      ))}

      {predicted && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <div
            style={{
              width:        "100%",
              background:   C.blue,
              height:       `${(predicted / max) * 100}%`,
              borderRadius: "2px 2px 0 0",
              border:       `2px dashed ${C.black}`,
            }}
          />
          <span style={{ fontSize: 8, color: C.blue, fontFamily: C.pixelFont, fontWeight: 700 }}>Jul*</span>
        </div>
      )}
    </div>
  );
}
