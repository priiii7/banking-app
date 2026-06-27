import { useState, useRef, useEffect } from "react";
import { C } from "../utils/theme";
import { calcHealth } from "../utils/calcHealth";
import { buildSystemPrompt } from "../utils/buildSystemPrompt";
import { streamChat, extractInsight } from "../services/aiService";
import Sticker from "./Sticker";
import ChunkyButton from "./ChunkyButton";

const QUICK_PROMPTS = ["Am I overspending?", "How to save more?", "Rate my finances", "Biggest risk?"];

export default function AIAdvisor({ transactions }) {
  const health       = calcHealth(transactions);
  const systemPrompt = buildSystemPrompt(transactions);

  const [messages,  setMessages]  = useState([
    { role: "assistant", text: `Hey! 👋 I'm your AI advisor. Your finances look ${health} right now. What would you like to know?` },
  ]);
  const [input,     setInput]     = useState("");
  const [streaming, setStreaming] = useState(false);
  const [insight,   setInsight]   = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim() || streaming) return;

    const userMsg = input.trim();
    setInput("");
    setInsight(null);

    const newMessages = [...messages, { role: "user", text: userMsg }];
    setMessages([...newMessages, { role: "assistant", text: "", streaming: true }]);
    setStreaming(true);

    // Gemini uses "model" instead of "assistant", and first message must be "user"
    const apiMessages = newMessages
      .filter((m) => m.text)
      .map((m) => ({
        role:    m.role === "assistant" ? "model" : "user",
        content: m.text,
      }));

    // Gemini can't start with "model" role — remove leading model messages
    while (apiMessages.length > 0 && apiMessages[0].role === "model") {
      apiMessages.shift();
    }

    try {
      const fullReply = await streamChat(apiMessages, systemPrompt, (partial) => {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", text: partial, streaming: true };
          return updated;
        });
      });

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", text: fullReply, streaming: false };
        return updated;
      });

      const parsed = await extractInsight(userMsg, fullReply);
      if (parsed?.action) setInsight(parsed);

    } catch (e) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", text: `Error: ${e.message}`, streaming: false };
        return updated;
      });
    }

    setStreaming(false);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        <Sticker color={health === "healthy" ? C.green : health === "moderate" ? C.yellow : C.red} style={{ fontSize: 10 }}>
          {health.toUpperCase()} HEALTH
        </Sticker>
        <Sticker color={C.purple} style={{ fontSize: 10 }}>🧠 STREAMING</Sticker>
        <Sticker color={C.black}  style={{ fontSize: 10 }}>💾 {messages.length} MSG MEMORY</Sticker>
      </div>

      <div style={{ maxHeight: 260, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, marginBottom: 10, scrollbarWidth: "none" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "86%", padding: "8px 12px",
              background: m.role === "user" ? C.black : C.white,
              color: m.role === "user" ? C.white : C.black,
              border: `2px solid ${C.black}`,
              borderRadius: m.role === "user" ? "8px 8px 2px 8px" : "8px 8px 8px 2px",
              fontFamily: C.pixelFont, fontSize: 12, lineHeight: 1.55,
              boxShadow: "2px 2px 0 #999", whiteSpace: "pre-wrap",
            }}>
              {m.role === "assistant" && (
                <div style={{ fontSize: 9, color: C.blue, fontWeight: 700, marginBottom: 3, letterSpacing: 1 }}>
                  AI ADVISOR
                </div>
              )}
              {m.text}
              {m.streaming && (
                <span style={{ display: "inline-block", width: 2, height: 11, background: C.blue, marginLeft: 2, animation: "blink 0.7s infinite" }} />
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {insight?.action && (
        <div style={{ background: C.yellow, border: `2px solid ${C.black}`, borderRadius: 6, padding: "8px 12px", marginBottom: 8, boxShadow: "2px 2px 0 #000" }}>
          <div style={{ fontFamily: C.pixelFont, fontSize: 9, fontWeight: 700, letterSpacing: 1, marginBottom: 3, textTransform: "uppercase" }}>
            {insight.category} · {insight.urgency} priority
          </div>
          <div style={{ fontFamily: C.pixelFont, fontSize: 11, color: C.black }}>→ {insight.action}</div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about your finances…"
          style={{
            flex: 1, background: C.white, border: `2px solid ${C.black}`,
            borderRadius: 6, padding: "8px 12px", fontFamily: C.pixelFont,
            fontSize: 12, outline: "none", boxShadow: "2px 2px 0 #999",
          }}
        />
        <ChunkyButton onClick={send} disabled={streaming} color={C.black}>
          {streaming ? "…" : "SEND"}
        </ChunkyButton>
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
        {QUICK_PROMPTS.map((q) => (
          <button key={q} onClick={() => setInput(q)} style={{
            background: "transparent", border: `1.5px solid ${C.border}`,
            borderRadius: 4, padding: "3px 8px", fontFamily: C.pixelFont,
            fontSize: 10, color: C.muted, cursor: "pointer",
          }}>
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}