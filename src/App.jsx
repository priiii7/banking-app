import { useState } from "react";
import { C } from "./utils/theme";
import { TRANSACTIONS } from "./data/mockData";

import Header           from "./components/Header";
import BottomNavigation from "./components/BottomNavigation";
import Dashboard        from "./components/Dashboard";
import AIAdvisor        from "./components/AIAdvisor";
import GoalsPage        from "./components/GoalsPage";
import BudgetPredictor  from "./components/BudgetPredictor";
import FloppyCard       from "./components/FloppyCard";

export default function App() {
  const [tab, setTab] = useState("dashboard");

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: C.pixelFont,
      background: `
        linear-gradient(${C.gridLine} 1px, transparent 1px),
        linear-gradient(90deg, ${C.gridLine} 1px, transparent 1px),
        ${C.bg}`,
      backgroundSize: "28px 28px",
      maxWidth: 480,
      margin: "0 auto",
      paddingBottom: 90,
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
        input::placeholder { color: #999; font-family: 'Courier New', monospace; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <Header onNavigate={setTab} />

      <div style={{ padding: "0 20px", animation: "slideUp 0.35s ease" }}>

        {tab === "dashboard" && <Dashboard />}

        {tab === "ai" && (
          <FloppyCard
            title="AI FINANCIAL ADVISOR"
            subtitle="Powered by Gemini · Streaming"
            accentColor={C.purple}
          >
            <AIAdvisor transactions={TRANSACTIONS} />
          </FloppyCard>
        )}

        {tab === "goals" && <GoalsPage />}

        {tab === "predict" && (
          <FloppyCard
            title="SMART BUDGET FORECAST"
            subtitle="AI predicts July spending"
            accentColor={C.blue}
          >
            <BudgetPredictor />
          </FloppyCard>
        )}

      </div>

      <BottomNavigation activeTab={tab} onTabChange={setTab} />
    </div>
  );
}