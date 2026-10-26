# TradeX — Modern Fintech Bento Dashboard

An institutional-grade, dark-themed financial overview and interactive trading simulator for TradeX, engineered with responsive Bento grid architecture, vibrant lime-green accents, and student-focused financial literacy tools for learners 15+.

### User Review & Critical Decisions

> [!IMPORTANT]
> The dashboard will strictly distinguish simulated educational sample data from real financial accounts with clear regulatory disclaimers. All interactive charts, portfolio allocations, cash flow metrics, stock & crypto feeds, and financial goals are fully interactive with stateful filtering and simulation controls.

- **Confirmed Decision (Phase 1)**: Interactive experience tailored for students and young investors aged 15+, featuring intuitive asset breakdowns, visual progress tracking, educational tooltips, and zero dead clicks.
- **Brand Consistency**: Replaced all previous branding with **TradeX**, setting header title to `TradeX Dashboard` and subtitle to `Your financial overview at a glance`.
- **Component Placement**: Stored at `/components/ui/finance-bento.tsx` adhering to shadcn/ui conventions with helper utilities and clean modular export.

---

### 1. Overview & Core Concept

- **What It Does**: Provides a unified, high-density financial command center featuring net worth telemetry, interactive asset allocation, dynamic cash flow analysis, live-feel stock and crypto watchlists, recurring payment schedules, and tangible financial milestone trackers.
- **Target Audience / Persona**: High school and university students, young adult traders, and beginner investors (ages 15+) developing capital allocation and personal finance mastery in a risk-free environment.
- **Key Value**: Replaces complex, fragmented spreadsheets and confusing terminal interfaces with an intuitive, aesthetic Bento grid that makes portfolio management visually engaging and educational.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Executive Glance*: Review total balance ($42,850.20 simulated net worth), daily gains (+4.8%), and toggle timeframes (1D, 1W, 1M, 1Y, ALL) to inspect interactive SVG chart paths and tooltips.
  2. *Portfolio Composition*: Explore equity, crypto, cash, and high-yield savings allocations with interactive donut segments and percentage breakdowns.
  3. *Cash Flow & Income/Expense Pulse*: Compare monthly income streams against recurring expenses with dynamic bars and net cash balance.
  4. *Market Watch & Simulation*: Filter between Stocks (NVDA, AAPL, MSFT, TSLA) and Crypto (BTC, ETH, SOL), examine 24h trends, and trigger a quick simulated order modal (Buy/Sell paper trade).
  5. *Upcoming Obligations & Goals*: Monitor upcoming subscription dates (Tuition, Cloud, Spotify, TradingView) and contribute simulated funds to long-term financial targets (Emergency Fund, First Investment Fund, Tech Setup).

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Premium institutional fintech, inspired by high-end quantitative terminals (deep pitch black canvas, crisp titanium typography, vivid lime-green `#22c55e` / `#4ade80` / `#a3e635` accents).
  - *Color Distribution (60-30-10)*:
    - 60% Canvas: Neutral pitch black (`#09090b` / `#0c0e12`).
    - 30% Structural Surfaces: Elevated zinc containers (`#14171f`, `border-white/10`), subtle dividers, and muted secondary typography.
    - 10% Accent: Electric lime and emerald gradients strictly highlighting positive returns, active navigation states, primary buttons, and target milestones.
  - *Typography*: Clean neo-grotesque hierarchy with `font-sans` for confident headlines and `tabular-nums` / `font-mono` for every currency value, percentage, and date.
  - *Spatial Layout*: Responsive CSS Grid Bento with `lg:grid-cols-12` composition:
    - Top summary metric strip & interactive area chart (8 cols) paired with Portfolio Allocation Donut (4 cols).
    - Cash flow breakdown & income/expense comparison (4 cols).
    - Live stocks and crypto watchlists with real-time simulated price ticks (4 cols).
    - Upcoming payment deadlines and financial goals with interactive contribution buttons (4 cols).

---

### 3. Key Product Decisions & Trade-Offs

- **Component Architecture**:
  - *Decision*: Build `/components/ui/finance-bento.tsx` as a self-contained, flexible component accepting optional props (`title`, `subtitle`, `initialData`, `className`) while rendering full rich defaults when called with `<FinanceBento />`.
  - *Why*: Allows standalone demo usage while conforming strictly to the user prompt's specification and shadcn/ui folder standards.
- **Chart Rendering**:
  - *Decision*: Pure SVG path generators with smooth cubic bezier curves, gradient fill under-strokes, active hover markers, and responsive container resizing without external charting bloat.
  - *Why*: Ultra-fast render speed, zero dependency fragility, full mobile responsiveness, and crisp high-DPI resolution.
- **Educational Simulation Layer**:
  - *Decision*: Provide interactive timeframes (1D, 1W, 1M, 1Y), simulated paper trade action modal, and quick goal contribution actions with persistent feedback toasts.
  - *Why*: Fulfills the user's requirement for students above 15 while maintaining a realistic fintech standard.
- **Sample Data Integrity**:
  - *Decision*: Prominent educational disclaimer banner in the footer: *"Simulated Educational Environment — Sample market values for demonstration and training only."*
  - *Why*: Complies with strict non-misleading financial app guidelines.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                      TradeX Application                     │
│  src/App.tsx (Main Shell: Top Bar + Hero Title + Bento)     │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌───────────────────────────────┐ ┌───────────────────────────┐
│ Top Bar Contract              │ │ Educational Notice Banner │
│ TradeX Wordmark | Navigation  │ │ Sample Data Disclaimer    │
└───────────────────────────────┘ └───────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│             /components/ui/finance-bento.tsx                │
│                                                             │
│  ┌─────────────────────────────┬──────────────────────────┐ │
│  │ 1. Balance & Performance    │ 2. Portfolio Allocation  │ │
│  │    Interactive SVG Chart    │    Donut & Asset Mix     │ │
│  ├─────────────────────────────┼──────────────────────────┤ │
│  │ 3. Cash Flow & Net Pulse    │ 4. Stocks & Crypto Watch │ │
│  │    Income vs Expense Bars   │    Simulated Tickers     │ │
│  ├─────────────────────────────┴──────────────────────────┤ │
│  │ 5. Financial Milestones & Upcoming Payments            │ │
│  │    Progress bars, recurring bills, deposit simulation │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

- **Interactive State Mapping**:
  - `activeTimeframe`: Controls chart curve data, total percentage yield calculation, and date axis labels.
  - `activeAssetTab`: Toggles between All, Stocks, and Crypto watchlists.
  - `goalsState`: Allows students to simulate adding deposits towards savings milestones with animated progress updates.
  - `simulatedTradeModal`: Lets users preview a simulated buy/sell order for any watchlist asset with instant portfolio feedback.
- **Verification Plan**:
  - Verify that `components/ui/finance-bento.tsx` builds without TypeScript errors.
  - Confirm dark mode contrast, lime-green accents, and responsive layout across mobile and desktop.
  - Run `compile_applet` to confirm zero build regressions.
