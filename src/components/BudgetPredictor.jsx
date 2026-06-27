import { useState } from "react";
import { C } from "../utils/theme";
import { predictBudget } from "../services/aiService";
import { SPENDING } from "../data/mockData";
import BarChart from "./BarChart";
import ChunkyButton from "./ChunkyButton";
import Sticker from "./Sticker";

/**
 * BudgetPredictor — calls Claude to forecast next month's spending.
 * Shows bar chart, predicted total, confidence, breakdown, and tip.
 */
export default function BudgetPredictor() {
  const [predicted, setPredicted] = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [insight,   setInsight]   = useState(null);

  async function handlePredict() {
    setLoading(true);
    const result = await predictBudget();
    setPredicted(result.predicted);
    setInsight(result);
    setLoading(false);
  }

  function handleReset() {
    setPredicted(null);
    setInsight(null);
  }

  return (
    <div>
      <BarChart data={SPENDING} predicted={predicted} />

      <div style={{ marginTop: 14 }}>
        {!predicted ? (
          <ChunkyButton onClick={handlePredict} disabled={loading} color={C.blue} style={{ width: "100%" }}>
            {loading ? "ANALYZING PATTERNS…" : "🔮 PREDICT JULY BUDGET"}
          </ChunkyButton>
        ) : (
          <div>
            {/* Prediction header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <div style={{ fontFamily: C.pixelFont, fontSize: 10, color: C.muted, textTransform: "uppercase" }}>
                  July Forecast
                </div>
                <div style={{ fontFamily: C.pixelFont, fontSize: 28, fontWeight: 700, color: C.blue }}>
                  ${predicted.toLocaleString()}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 22 }}>
                  {insight?.trend === "down" ? "📉" : insight?.trend === "up" ? "📈" : "➡️"}
                </div>
                <Sticker
                  color={insight?.confidence === "high" ? C.green : C.yellow}
                  style={{ fontSize: 9, marginTop: 4 }}
                >
                  {insight?.confidence} conf.
                </Sticker>
              </div>
            </div>

            {/* Category breakdown */}
            {insight?.breakdown && (
              <div style={{ background: C.white, border: `2px solid ${C.black}`, borderRadius: 6, padding: 10, marginBottom: 8, boxShadow: "2px 2px 0 #999" }}>
                <div style={{ fontFamily: C.pixelFont, fontSize: 9, fontWeight: 700, letterSpacing: 1, marginBottom: 6, color: C.muted }}>
                  PREDICTED BREAKDOWN
                </div>
                {Object.entries(insight.breakdown).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontFamily: C.pixelFont, fontSize: 11, marginBottom: 4 }}>
                    <span style={{ textTransform: "capitalize", color: C.muted }}>{k}</span>
                    <span style={{ fontWeight: 700 }}>${v}</span>
                  </div>
                ))}
              </div>
            )}

            {/* AI tip */}
            {insight?.tip && (
              <div style={{ background: C.yellow, border: `2px solid ${C.black}`, borderRadius: 6, padding: "8px 12px", fontFamily: C.pixelFont, fontSize: 11, boxShadow: "2px 2px 0 #000", marginBottom: 8 }}>
                💡 {insight.tip}
              </div>
            )}

            <ChunkyButton onClick={handleReset} color={C.white} textColor={C.black} style={{ width: "100%" }}>
              RESET
            </ChunkyButton>
          </div>
        )}
      </div>
    </div>
  );
}
