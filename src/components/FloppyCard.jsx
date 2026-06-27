import { C } from "../utils/theme";

export default function FloppyCard({ title, subtitle, children, accentColor = C.black }) {
  return (
    <div style={{
      background: C.black, borderRadius: "8px 8px 6px 6px",
      border: `2px solid ${C.black}`, boxShadow: "4px 4px 0 #555",
      overflow: "hidden", marginBottom: 16,
    }}>
      {/* Top shell */}
      <div style={{ background: C.black, padding: "10px 16px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 30, height: 22, background: "#333", border: "2px solid #555", borderRadius: 2 }} />
          <div style={{ width: 8, height: 22, background: "#444", border: "1px solid #555" }} />
        </div>
        <div style={{ width: 20, height: 20, background: "#222", border: "2px solid #555", borderRadius: 2 }} />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 8, height: 22, background: "#444", border: "1px solid #555" }} />
          <div style={{ width: 30, height: 22, background: "#333", border: "2px solid #555", borderRadius: 2 }} />
        </div>
      </div>

      {/* White label */}
      <div style={{ background: C.offwhite, margin: "0 12px", borderRadius: 4, padding: "14px 16px", border: "1px solid #ccc" }}>
        <div style={{ fontFamily: C.pixelFont, fontWeight: 700, fontSize: 15, color: C.black, marginBottom: 2, letterSpacing: 1 }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontFamily: C.pixelFont, fontSize: 10, color: accentColor, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1, border: `1.5px solid ${accentColor}`, display: "inline-block", padding: "1px 8px", borderRadius: 2 }}>
            {subtitle}
          </div>
        )}
        <div style={{ marginTop: 10 }}>{children}</div>
      </div>

      {/* Barcode footer */}
      <div style={{ background: C.black, padding: "6px 16px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 2 }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ width: 3, height: 14, background: i % 3 === 0 ? "#555" : "#333" }} />
          ))}
        </div>
        <div style={{ fontFamily: C.pixelFont, fontSize: 9, color: "#666", textAlign: "right", lineHeight: 1.4 }}>
          <div>VOL_01.DAT</div>
          <div>HD-2HD</div>
        </div>
      </div>
    </div>
  );
}