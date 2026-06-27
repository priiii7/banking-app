import { C } from "../utils/theme";

/**
 * Sticker — colourful rotated badge label, inspired by the
 * retro portfolio design reference.
 */
export default function Sticker({ children, color = C.blue, rotate = 0, style = {} }) {
  return (
    <div
      style={{
        display:     "inline-block",
        background:  color,
        color:       C.white,
        fontFamily:  C.pixelFont,
        fontWeight:  700,
        fontSize:    12,
        padding:     "5px 14px",
        borderRadius: 6,
        transform:   `rotate(${rotate}deg)`,
        border:      `2px solid ${C.black}`,
        boxShadow:   "2px 2px 0 #000",
        whiteSpace:  "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
