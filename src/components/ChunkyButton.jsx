import { C } from "../utils/theme";

/**
 * ChunkyButton — retro pixel-style button with hard drop shadow.
 */
export default function ChunkyButton({
  children,
  color     = C.black,
  textColor = C.white,
  onClick,
  disabled,
  style = {},
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background:    color,
        color:         textColor,
        fontFamily:    C.pixelFont,
        fontWeight:    700,
        fontSize:      12,
        padding:       "10px 20px",
        borderRadius:  8,
        border:        `2px solid ${C.black}`,
        boxShadow:     disabled ? "none" : "3px 3px 0 #000",
        cursor:        disabled ? "not-allowed" : "pointer",
        letterSpacing: 1,
        textTransform: "uppercase",
        transition:    "all 0.1s",
        opacity:       disabled ? 0.6 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
