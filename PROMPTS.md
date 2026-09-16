# PROMPTS.md — Phased Build Prompts

For a live 120-minute build with a 2-person team (1 developer driving the coding agent, 1 fresher teammate). Each prompt is meant to be pasted into your AI coding agent (Antigravity / Claude Code / Cursor) in order, after MASTER_PROMPT.md has been given as context. Read PRD.md, TRD.md, and DESIGN.md before starting — the agent should have already ingested them via MASTER_PROMPT.md.

**Suggested time budget (120 min total):**

| Phase | Prompt | Budget |
|---|---|---|
| 1 | Setup + design tokens | 10 min |
| 2 | Data layer | 15 min |
| 3 | Sidebar/Header shell | 10 min |
| 4 | Dashboard | 20 min |
| 5 | Orders | 15 min |
| 6 | Menu | 12 min |
| 7 | Inventory | 10 min |
| 8 | Reports | 15 min |
| 9 | Settings | 8 min |
| 10 | Responsive pass | 8 min |
| 11 | Polish + empty/loading states | 5 min |
| 12 | Final QA + demo rehearsal | remaining buffer |

Fresher teammate's realistic ownership: Phase 9 (Settings, mostly static content/copy), sourcing/picking icons for Phase 6, writing the demo script for Phase 12, and spot-checking numbers against the CSV throughout. This keeps them contributing on low-risk, high-visibility work while the developer drives the data layer and core screens.

---

### Prompt 01 — Project Setup
Scaffold a Vite + React + TypeScript project with Tailwind CSS configured. Add `lucide-react`, `recharts`, and `papaparse` (+ `@types/papaparse`). Set up the folder structure exactly as specified in TRD.md §3. Configure Tailwind theme extension with the design tokens from DESIGN.md §5 (colors, radius, shadow values as CSS variables consumed by Tailwind). Verify the dev server runs with zero errors before moving on.

### Prompt 02 — Data Layer
Copy `mock_starbucks_patna_dataset.csv` into `src/data/`. Author `src/data/inventory.json` as a small (~10–12 item) mock inventory dataset per PRD §6.4, covering all three stock statuses. Implement `lib/parseOrders.ts` (PapaParse, typed), `lib/deriveStatus.ts` (deterministic order-status rule per TRD §5), `lib/todayLogic.ts` (pseudo-"today" = max order_date), and `lib/aggregations.ts` with pure functions for: total revenue, order count, AOV, category breakdown, top items, hourly breakdown for a given date, daily trend for a date range. Wire `DataContext` to load and expose `{ orders, inventory, loading, error }`. Log the computed totals to console once and manually verify against the raw CSV (total revenue ₹1,31,200 across all 273 rows, most recent date 2025-09-14 with 15 orders that day) before proceeding.

### Prompt 03 — Sidebar / Header Shell
Build `Sidebar.tsx` (6 nav items, active-state styling, logo block) and `Header.tsx` (search, location pill, notification bell, user avatar) per DESIGN.md §2–3. Build `App.tsx` as a tab-based shell (no router) that renders the active page inside the content area next to the fixed sidebar. Confirm switching between all 6 placeholder pages works and the active nav item updates.

### Prompt 04 — Dashboard
Build the Dashboard page per PRD §8.1 and DESIGN.md's Dashboard notes: 3 `KpiCard`s (Total Sales, Total Orders, AOV, each with delta vs. the prior in-dataset date), the Sales Today chart (hourly, pseudo-"today"), and the Today's Highlights panel. 2025-09-14 now has a normal 15 orders (13 were added to the original 2 for demo purposes) — verify KPIs, the chart, and Today's Highlights render correctly with that volume. Keep the underlying logic defensive against a low/zero-order day anyway (don't hardcode assumptions that only work with 15+ orders), even though that's no longer what the demo will show.

### Prompt 05 — Orders
Build the Orders table per PRD §8.2: filter tabs (All/Completed/In Progress/Cancelled), search, pagination (10/page), status pills, and a detail modal/drawer for "View order." Confirm the "Showing X–Y of Z" count updates correctly under each filter combination.

### Prompt 06 — Menu
Build the Menu grid per PRD §8.3: 19 deduplicated items from the CSV, category pill filters (5 real categories), search, "Add Item" modal (validates but doesn't persist), and category-icon product imagery per DESIGN.md §10 (no fabricated product photos).

### Prompt 07 — Inventory
Build the Inventory table per PRD §8.4 from `inventory.json`: All Items/Low Stock/Out of Stock filter tabs, status pill styling (green/amber/red + icon + text), "Add Item" stub.

### Prompt 08 — Reports
Build the Reports page per PRD §8.5: Overview/Sales/Orders/Top Items tabs, date-range picker (default full dataset range), Sales Trend chart, Top Selling Items ranked list, Sales by Category donut. Cross-check that the full-range totals match Orders' 260-order count and Dashboard's category logic exactly — no drift between pages.

### Prompt 09 — Settings
Build the Settings page per PRD §8.6 and DESIGN.md's Settings notes: Store Settings/Profile/Preferences/Notifications tabs, static Store Information card, Preferences dropdowns (Currency locked to ₹), Notification toggles (local state), Account Actions (Change Password stub, Log Out stub). Everything can be non-persisting but must be visibly interactive.

### Prompt 10 — Responsive Pass
Apply the responsive rules from DESIGN.md §7 across all 6 pages: sidebar collapse behavior at tablet width, KPI card reflow, Menu grid reflow, and Orders/Inventory tables converting to stacked card rows on mobile. Test at 1440px, 1024px, 768px, and 390px widths.

### Prompt 11 — Polish: Loading / Empty / Error States
Implement the states table from PRD §11 across all pages: skeleton loaders, empty-state messaging (including "no orders match your filters" and the honest sparse-today messaging on Dashboard), and a friendly fallback if CSV parsing ever fails. Add toast confirmations for status updates, add-item, and toggle actions.

### Prompt 12 — Final QA & Demo Rehearsal
Run the full demo-rehearsal checklist:
1. Load app cold — no console errors, no flash of unstyled content.
2. Dashboard KPIs match a manual spot-check against the CSV for 2025-09-14 and 2025-09-13.
3. Orders: filter through all 4 tabs, search an item name, page through to the last page, open an order detail modal.
4. Menu: filter every category, search, open Add Item, submit and see a toast.
5. Inventory: confirm at least one Low Stock and one Out of Stock row is visible and filterable.
6. Reports: switch all 4 sub-tabs, change the date range to a narrow window with few/no orders and confirm the empty state.
7. Settings: click through all 4 tabs, toggle a notification, confirm toasts.
8. Resize the browser through all 4 breakpoints without layout breakage.
9. Confirm total revenue/order count are identical wherever they appear (Dashboard "previous period," Orders pagination total, Reports Overview) — no contradicting numbers.
10. Deploy to Vercel/Netlify and load the deployed URL once, then also confirm `npm run preview` works locally as an offline fallback.
