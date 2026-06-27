import { C } from "../utils/theme";
import { ACCOUNT } from "../data/mockData";
import { calcHealth } from "../utils/calcHealth";
import { TRANSACTIONS } from "../data/mockData";
import Sticker from "./Sticker";
import ChunkyButton from "./ChunkyButton";

/**
 * Header — hero section with name, floating stickers, balance card,
 * and CTA buttons. Mirrors the portfolio reference design.
 */
export default function Header({ onNavigate }) {
  const health  = calcHealth(TRANSACTIONS);
  const { name, balance, income, spent } = ACCOUNT;
  const saved   = income - spent;

  const healthColor = { healthy: C.green, moderate: C.yellow, struggling: C.red }[health];

  return (
    <div style={{ padding: "24px 20px 16px" }}>
      {/* Floating stickers + name */}
      <div style={{ position: "relative", marginBottom: 20 }}>
        <Sticker color={C.blue} rotate={-6} style={{ position: "absolute", top: 0, left: 0, fontSize: 10 }}>
          Software Engineer
        </Sticker>
        <Sticker color={C.red} rotate={5} style={{ position: "absolute", top: 0, right: 0, fontSize: 10 }}>
          Creator
        </Sticker>

        <div style={{ textAlign: "center", paddingTop: 8 }}>
          <div style={{ fontFamily: C.handFont, fontSize: 13, color: C.muted, marginBottom: 4 }}>Hi, I am</div>
          <div style={{ fontFamily: C.pixelFont, fontSize: 32, fontWeight: 900, letterSpacing: 2, color: C.black, lineHeight: 1 }}>
            {name}
          </div>
        </div>

        <div style={{ marginTop: 8, display: "flex", justifyContent: "center" }}>
          <Sticker color={C.yellow} rotate={2} style={{ color: C.black, fontSize: 10 }}>💰 Explorer</Sticker>
        </div>
      </div>

      <div style={{ textAlign: "center", fontFamily: C.handFont, fontSize: 13, color: C.muted, marginBottom: 16 }}>
        Managing finances with AI-powered insights
      </div>

      {/* Balance card */}
      <div style={{
        background:   C.white,
        border:       `3px solid ${C.black}`,
        borderRadius: 10,
        padding:      16,
        boxShadow:    "5px 5px 0 #000",
        marginBottom: 16,
        textAlign:    "center",
      }}>
        <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
          Total Balance
        </div>
        <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: -1, color: C.black }}>
          ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </div>

        {/* Health indicator */}
        <div style={{ marginTop: 6, marginBottom: 10 }}>
          <Sticker color={healthColor} style={{ fontSize: 9, color: health === "moderate" ? C.black : C.white }}>
            {health.toUpperCase()} HEALTH
          </Sticker>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
          <div>
            <div style={{ fontSize: 9, color: C.muted }}>INCOME</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>+${income.toLocaleString()}</div>
          </div>
          <div style={{ width: 1, background: C.gridLine }} />
          <div>
            <div style={{ fontSize: 9, color: C.muted }}>SPENT</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.red }}>-${spent.toLocaleString()}</div>
          </div>
          <div style={{ width: 1, background: C.gridLine }} />
          <div>
            <div style={{ fontSize: 9, color: C.muted }}>SAVED</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.blue }}>
              ${saved.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <ChunkyButton color={C.black} style={{ flex: 1 }} onClick={() => onNavigate("ai")}>
          🧠 AI ADVISOR
        </ChunkyButton>
        <ChunkyButton color={C.green} style={{ flex: 1 }} onClick={() => onNavigate("predict")}>
          🔮 FORECAST
        </ChunkyButton>
      </div>
    </div>
  );
}
