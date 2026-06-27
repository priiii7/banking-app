import { C } from "../utils/theme";

const TABS = [
  { id: "dashboard", label: "HOME",      color: C.red  },
  { id: "ai",        label: "AI ADVISOR",color: C.black },
  { id: "goals",     label: "GOALS",     color: C.black },
  { id: "predict",   label: "FORECAST",  color: C.blue  },
];

/**
 * BottomNavigation — fixed pill-style tab bar at the bottom of the screen.
 * Active tab shows a coloured background + white dot indicator.
 */
export default function BottomNavigation({ activeTab, onTabChange }) {
  return (
    <div
      style={{
        position:       "fixed",
        bottom:         16,
        left:           "50%",
        transform:      "translateX(-50%)",
        background:     "#e0e0e0",
        border:         `2px solid ${C.border}`,
        borderRadius:   50,
        padding:        "6px 8px",
        display:        "flex",
        gap:            6,
        boxShadow:      "4px 4px 0 #000",
        zIndex:         100,
      }}
    >
      {TABS.map((t) => {
        const active = activeTab === t.id;
        const bgColor = active
          ? (t.id === "dashboard" ? C.red : t.id === "predict" ? C.blue : C.black)
          : C.white;

        return (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            style={{
              background:    bgColor,
              color:         active ? C.white : C.black,
              border:        `2px solid ${C.black}`,
              borderRadius:  40,
              padding:       "7px 14px",
              fontFamily:    C.pixelFont,
              fontWeight:    700,
              fontSize:      10,
              cursor:        "pointer",
              letterSpacing: 0.5,
              boxShadow:     active ? "none" : "1px 1px 0 #999",
              display:       "flex",
              alignItems:    "center",
              gap:           4,
              whiteSpace:    "nowrap",
            }}
          >
            {active && (
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.white, display: "inline-block" }} />
            )}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
