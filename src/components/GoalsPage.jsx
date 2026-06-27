import { C } from "../utils/theme";
import { GOALS } from "../data/mockData";
import FloppyCard from "./FloppyCard";
import GoalCard from "./GoalCard";

const BADGES = ["🔥 14-Day Streak", "⭐ 7-Day Streak", "🏆 Goal Done", "💪 First Save", "🎯 Goal Setter"];

export default function GoalsPage() {
  return (
    <div>
      <FloppyCard title="SAVINGS GOALS" subtitle="Streaks & Badges" accentColor={C.green}>
        {GOALS.map((g) => (
          <GoalCard key={g.id} goal={g} />
        ))}
      </FloppyCard>

      <FloppyCard title="BADGE COLLECTION" subtitle="Achievements unlocked" accentColor={C.yellow}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {BADGES.map((b) => (
            <div key={b} style={{
              background: C.black, color: C.white,
              fontFamily: C.pixelFont, fontSize: 10,
              padding: "4px 10px", borderRadius: 4,
              border: `1px solid ${C.border}`,
            }}>
              {b}
            </div>
          ))}
        </div>
      </FloppyCard>
    </div>
  );
}