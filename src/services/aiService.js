const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
function getKey() {
  return import.meta.env.VITE_GEMINI_API_KEY;
}

async function callGemini(systemPrompt, userMessage) {
  const res = await fetch(`${GEMINI_URL}?key=${getKey()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || "Gemini API error");
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function callGeminiWithHistory(systemPrompt, messages) {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const res = await fetch(`${GEMINI_URL}?key=${getKey()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || "Gemini API error");
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

export async function streamChat(messages, systemPrompt, onToken) {
  try {
    const fullReply = await callGeminiWithHistory(systemPrompt, messages);
    const words = fullReply.split(" ");
    let current = "";
    for (const word of words) {
      current += (current ? " " : "") + word;
      onToken(current);
      await new Promise((r) => setTimeout(r, 40));
    }
    return fullReply;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function extractInsight(userMsg, assistantReply) {
  try {
    const text = await callGemini(
      "Extract structured data from financial conversations. Return ONLY valid JSON, no markdown.",
      `User: "${userMsg}" Advisor: "${assistantReply}" → Return JSON: { "category": "spending"|"saving"|"investing"|"budget", "urgency": "high"|"medium"|"low", "action": "one short action item or null" }`
    );
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    return null;
  }
}

export async function predictBudget() {
  try {
    const text = await callGemini(
      "You are a budget prediction AI. Respond ONLY with valid JSON, no markdown.",
      `Monthly spending: Jan:2100, Feb:1850, Mar:2400, Apr:2200, May:1980, Jun:2340. Income: $4200.
Return JSON: { "predicted": number, "confidence": "high"|"medium"|"low", "tip": "one sentence", "trend": "up"|"down"|"stable", "breakdown": { "food": number, "bills": number, "entertainment": number, "other": number } }`
    );
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    return {
      predicted: 2180,
      confidence: "medium",
      tip: "Cut food delivery to save ~$80 next month.",
      trend: "down",
      breakdown: { food: 820, bills: 680, entertainment: 480, other: 200 },
    };
  }
}