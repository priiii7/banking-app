# 💰 AI Financial Management App

A fully functional, AI-powered personal finance manager built with React and Gemini AI. Features a retro pixel aesthetic inspired by classic portfolio design, with real-time AI insights, gamified savings goals, and complete transaction management.

🔗 **Live Demo:** [banking-app-coral-two.vercel.app](https://banking-app-coral-two.vercel.app)

---

## ✨ Features

### 🧠 AI Financial Advisor
- Powered by **Google Gemini 2.5 Flash** (free tier)
- **Streaming responses** — text appears word by word in real time
- **Full conversation memory** — entire chat history sent with each request
- **Dynamic system prompt** — adapts tone based on user's financial health score (healthy / moderate / struggling)
- **Structured JSON extraction** — after each response, a second AI call extracts category, urgency, and action item

### 🔮 Smart Budget Predictor
- Analyzes 6 months of spending history
- AI predicts next month's budget with confidence score
- Returns structured breakdown by category (food, bills, entertainment, other)
- Trend indicator (up / down / stable)

### 🎯 Gamified Savings Goals
- Progress bars with streak counters
- Badge collection system (🔥⭐🏆)
- Visual completion animation

### 📊 Transaction Management
- **Add** transactions via retro pixel popup form
- **Edit** any existing transaction
- **Delete** transactions
- **localStorage persistence** — data survives page refresh
- Impulse vs Planned spending tags on every transaction

### 🎨 Retro Pixel UI
- Grid paper background
- Floppy disk card components
- Chunky pill navigation bar
- Pixel/monospace typography throughout
- Floating sticker badges

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Inline styles with design tokens |
| AI | Google Gemini 2.5 Flash API |
| Storage | localStorage |
| Deployment | Vercel |

---

## 🏗️ Project Architecture

```
src/
├── components/
│   ├── AIAdvisor.jsx        # Streaming chat with memory
│   ├── BarChart.jsx         # Pixel-style bar chart
│   ├── BottomNavigation.jsx # Pill-style tab bar
│   ├── BudgetPredictor.jsx  # AI budget forecasting
│   ├── ChunkyButton.jsx     # Retro button component
│   ├── Dashboard.jsx        # Transaction management
│   ├── FloppyCard.jsx       # Floppy disk card wrapper
│   ├── GoalCard.jsx         # Individual savings goal
│   ├── GoalsPage.jsx        # Goals + badge collection
│   ├── Header.jsx           # Hero with balance card
│   └── Sticker.jsx          # Floating badge labels
│
├── services/
│   └── aiService.js         # All Gemini API calls isolated
│
├── utils/
│   ├── buildSystemPrompt.js # Dynamic prompt generation
│   ├── calcHealth.js        # Financial health scoring
│   └── theme.js             # Design tokens & palette
│
├── data/
│   └── mockData.js          # Transactions, goals, account
│
├── App.jsx                  # Root coordinator (~83 lines)
└── main.jsx
```

**App.jsx is only 83 lines** — all logic lives in dedicated layers.

---

## 🚀 Running Locally

**Prerequisites:** Node.js 18+

```bash
# Clone the repo
git clone https://github.com/priiii7/banking-app.git
cd banking-app

# Install dependencies
npm install

# Add your Gemini API key
# Create a .env file in the root:
echo "VITE_GEMINI_API_KEY=your_key_here" > .env

# Start the dev server
npm run dev
```

Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com)

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key (free at aistudio.google.com) |

---

## 💡 Key Technical Decisions

**Why Gemini over other LLMs?**
Free tier with no credit card required, generous rate limits, and strong performance on financial reasoning tasks.

**Why localStorage over a database?**
Keeps the project frontend-only with zero backend cost. A real production version would use a database with user authentication.

**Why inline styles over CSS/Tailwind?**
Component-level style isolation with a centralized theme token file (`utils/theme.js`) — all colors and fonts defined once, used everywhere.

**Why separate `aiService.js`?**
Isolates all API logic so switching models (Gemini → Claude → GPT) requires changing only one file.

---

## 📱 Screenshots

| Dashboard | AI Advisor | Goals | Forecast |
|-----------|-----------|-------|---------|
| Transaction management with add/edit/delete | Streaming AI chat with memory | Gamified savings with streaks | AI budget prediction with breakdown |

---

## 🔮 Future Improvements

- [ ] User authentication
- [ ] Backend database (Supabase / Firebase)
- [ ] Real bank API integration (Plaid)
- [ ] Push notifications for budget alerts
- [ ] Export transactions to CSV
- [ ] Dark/light mode toggle

---

## 👩‍💻 Author

**Priya** — [github.com/priiii7](https://github.com/priiii7)

---

## 📄 License

MIT License — feel free to use this project as inspiration for your own portfolio!