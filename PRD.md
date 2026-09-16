# PRD — Starbucks Patna Store Dashboard

**Project type:** Hackathon build (live coding, ~120-minute window)
**Team:** 2 (1 developer, 1 non-technical/fresher teammate)
**Stack:** Vite + React + TypeScript + Tailwind CSS (frontend-only, mock data)
**Store scope:** One outlet — Starbucks Patna, P&M Mall

---

## 1. Product Overview

An internal, single-store business management dashboard for Starbucks Patna staff. It is **not** a customer-facing ordering site. It gives the store admin (Devraj, playing "Store Admin") a fast, accurate read on how the store is performing today and over time, and lets them manage orders, menu, and inventory.

The product is judged as a hackathon submission on: functionality, UI/UX, effective use of AI tooling during the build, creativity, technical implementation, and time efficiency — inside a fixed ~120-minute build window.

## 2. Problem Statement

A single-store manager currently has no unified view of sales, orders, menu, and stock. They need one screen to answer "how are we doing today," and a few more screens to act on orders, menu availability, and stock levels — without being buried in irrelevant multi-branch or marketing features.

## 3. Goals

- Ship a working, visually polished 6-screen dashboard inside the build window.
- Ground every screen in the real provided dataset (`mock_starbucks_patna_dataset.csv`) — no placeholder/lorem data.
- Keep the scope disciplined: single store, no fake enterprise features, no customer marketing content.
- Demonstrate clean information hierarchy and a restrained, premium visual style (per DESIGN.md).

## 4. Non-Goals

- No real backend, database, or authentication (frontend-only prototype with mock/derived data).
- No multi-branch, branch comparison, or branch ranking features.
- No customer-facing ordering flow, cart, checkout, or loyalty program.
- No production-grade security hardening (documented conceptually in TRD, not implemented in the 120-minute build).
- No real payment processing.

## 5. Users

**Primary user:** Store Admin (Devraj Poddar, Store Admin role) — the only role in scope. No multi-role permission system is required for the hackathon build; TRD notes how it would extend.

## 6. Data Source & Ground Truth

`mock_starbucks_patna_dataset.csv` is the single source of truth for sales/order data:

| Column | Notes |
|---|---|
| `order_id` | Unique, format `SBX-PAT-XXXX` |
| `order_date` | `YYYY-MM-DD`, range **2025-07-01 to 2025-09-14** |
| `order_time` | `HH:MM`, 24h |
| `outlet` | Constant: `P&M Mall` (the one Starbucks Patna outlet) |
| `item_name` | 19 unique menu items |
| `category` | **Hot Beverages, Cold Beverages, Bakery, Food, Merchandise** (5 categories) |
| `size` | Varies by item (Short/Tall/Grande/Venti, Doppio/Solo, or Regular) |
| `quantity` | Integer |
| `unit_price` | ₹, integer |
| `total_amount` | `unit_price × quantity` |
| `payment_method` | Starbucks App Wallet, Credit/Debit Card, UPI, Cash |
| `order_type` | Dine-in, Takeaway, Delivery |

Dataset stats (for the team's own sanity-checking during the build, not to hardcode): 273 rows, 273 unique `order_id`s (one row = one order in this dataset — no multi-line orders), ₹1,31,200 total revenue across the full range, most recent date **2025-09-14** with **15 orders** on that date (the original CSV only had 2 real orders on 2025-09-14; 13 additional orders were generated for that date only, using the same real item/size/price catalog and realistic payment/order-type proportions, so the pseudo-"today" view has normal daily volume for the demo).

### Resolved conflicts with the original visual reference / master prompt

1. **Categories.** The reference mockups/spec suggested "Hot Coffee / Cold Beverages / Food / Merchandise." The real CSV instead has **Hot Beverages, Cold Beverages, Bakery, Food, Merchandise**. Decision: use the CSV's 5 real categories everywhere (Menu filter tabs, Reports category breakdown, etc.) — real data wins over the illustrative suggestion.
2. **"Today."** The dashboard concept in the reference mockups implies a live "today." The dataset is historical and ends 2025-09-14. Decision: **treat 2025-09-14 (the most recent date in the CSV) as pseudo-"today."** All "Today" KPIs, the Sales Today chart, and Today's Highlights are computed from rows where `order_date == max(order_date)`.
3. **Order status.** The CSV has no status column, but Orders/Reports need Completed/Preparing/Cancelled states. Decision: **synthesize status deterministically** from `order_id` so it's stable across reloads (not random each render). Rule: hash last digit of the numeric suffix of `order_id` → ~90% Completed, ~6% Cancelled, ~4% Preparing/In Progress, with **all orders on the pseudo-"today" date forced into a mix of Completed/Preparing (no historical order stays "Preparing")**. Document this rule inline in code comments so judges can see it's an explicit, principled derivation, not randomness.
4. **Inventory.** The CSV is order/sales data, not stock data — it cannot drive an Inventory screen directly. Decision: **author a small, separate, realistic mock inventory dataset** (~10–12 raw-material/packaging items — coffee beans, milk, cups by size, syrups, pastries stock, etc.), matching the categories/items implied by the menu, with explicit In Stock / Low Stock / Out of Stock rows to demonstrate all three states. This is clearly a **separate authored dataset**, not derived from orders.csv, and should be labeled as such in TRD.

## 7. Information Architecture / Navigation

Sidebar, always visible on desktop, collapsible on tablet, becomes bottom/hamburger nav on mobile:

1. Dashboard
2. Orders
3. Menu
4. Inventory
5. Reports
6. Settings

Active page is visually distinct (filled background + accent left border, per reference mockups).

## 8. Page-by-Page Requirements

### 8.1 Dashboard

**Answers:** How much did we sell (today)? How many orders? How many customers? What's selling? What's happening with orders right now? How are people paying?

**Components:**
- Header: "Good [Morning/Afternoon/Evening], Devraj" (time-of-day greeting computed from the *system* clock at render time — this is a UI nicety, not tied to the pseudo-"today" data date) + current real date + date picker (non-functional stretch, defaults to pseudo-"today").
- 3 KPI cards: Total Sales (₹), Total Orders, Average Order Value — each with a "vs previous period" delta. Previous period = the prior calendar day *present in the dataset* (2025-09-13), not necessarily "yesterday" in real time.
- "Sales Today" line/area chart — hourly revenue for the pseudo-"today" date, x-axis in hours.
- "Today's Highlights" panel: Best Selling Item (by qty, today), Peak Hour (today), Total Customers (proxy = distinct orders today, since there's no customer_id field).
- Quote/banner strip (decorative, low-priority, cut first if time runs short).

**Acceptance criteria:**
- KPI numbers recompute correctly if the underlying CSV changes (no hardcoded totals).
- If pseudo-"today" has zero or very few orders (the real dataset only has **2 orders on 2025-09-14**), the Dashboard must render a clear, honest state — not fabricate data. See Edge Cases below.
- Chart renders with real x-axis hour labels even with sparse data (no crash on 1–2 data points).

**Edge case — low-volume "today" (defensive, no longer the demo state):** the dataset's pseudo-"today" (2025-09-14) now has a normal 15 orders after augmenting the original 2. The app should still defensively handle a low/zero-order day without crashing or inventing data (KPI cards show correct small/zero numbers, chart renders whatever points exist, "Today's Highlights" doesn't invent a peak hour from a single order time) — this is good practice and worth a quick test — but it is no longer the expected state judges will actually see live.

### 8.2 Orders

**Purpose:** Browse and filter all 260 orders as if managing live order flow.

**Table columns:** Order # (derived short form of `order_id`), Time, Item(s) + qty, Order Type (as "Customer/Channel" column, since there's no customer name field), Amount, Status, Actions.

**Filters:** All / Completed / In Progress / Cancelled (tabs, matching reference). Search by order id or item name. Date picker (defaults to pseudo-"today", can be cleared to show all 260).

**Actions:** View order (opens a modal/drawer with full line detail), Update status (local state only, no persistence needed beyond the session), pagination (10/page, matching the reference "Showing 1–10 of X").

**Acceptance criteria:**
- Filter tabs and search combine with AND logic.
- Status badge colors: Completed = green, In Progress/Preparing = amber, Cancelled = red — never color-only (also label text).
- Pagination count reflects the *filtered* result set, not always 260/218.

### 8.3 Menu

**Purpose:** Manage the 19 real menu items pulled from the CSV's distinct `item_name`s.

**Content per item card:** Name, category badge, price (use the item's `unit_price` — where an item appears at multiple sizes/prices in the CSV, show the base/most common size's price and list other sizes in the detail view), Availability toggle (In Stock/Out of Stock — mock, local state), edit/more actions (non-functional stub for the hackathon; documented as future work).

**Filters:** All / by category (5 real categories) + search.

**Acceptance criteria:** All 19 items from the CSV are present exactly once as a menu entry (dedup by `item_name`); "Add Item" opens a form (can be non-persisting for the demo, but must visually work — validation + success toast).

### 8.4 Inventory

**Purpose:** Show stock levels for the *separately authored* mock inventory dataset (see §6.4).

**Table columns:** Item, Category, Current Stock, Unit, Status, Last Updated.

**Filters:** All Items / Low Stock / Out of Stock.

**Acceptance criteria:** At least one item in each of the three states is present in the mock dataset so all filter tabs have visible results; Low/Out of Stock rows are visually distinct (amber/red badge) and also filterable, not just colored.

### 8.5 Reports

**Purpose:** Analyze the full 2.5-month history in the CSV.

**Tabs:** Overview / Sales / Orders / Top Items (matching reference).

**Overview content:** Total Sales, Total Orders, Total Customers (proxy = order count, documented as such) over a selectable date range (default: full dataset range, 2025-07-01–2025-09-14); Sales Trend chart (daily, area/line); Top Selling Items (by quantity, top 5); Sales by Category (donut, 5 real categories).

**Date filtering:** date-range picker; if a range with zero orders is selected, show an explicit empty state, not a broken chart.

**Acceptance criteria:** All figures in Reports must be internally consistent with Orders/Dashboard (e.g., total order count across Reports' full range must equal 273, matching Orders' "Showing X of 273").

### 8.6 Settings

**Purpose:** Static/mostly non-functional configuration screen (lowest priority — build last, cut first if short on time).

**Sections:** Store Information (name, address, phone, hours — static text, editable in a modal but not persisted), Preferences (Currency fixed to INR, Language, Timezone — display-only for the demo), Notifications (toggles, local state only), Account (profile stub, change-password stub, logout stub that returns to a fake login screen or just shows a toast — see TRD for whether auth is in scope at all).

**Acceptance criteria:** Every control is visibly interactive (hover/focus states) even where it doesn't persist — a judge should never encounter a dead-looking control.

## 9. Cross-Cutting UX Requirements

- **Information hierarchy:** KPIs and today's status always above the fold on Dashboard.
- **Progressive disclosure:** order detail lives in a modal/drawer, not inline in the table.
- **Consistency:** one Badge component, one Button component, one Card component reused across all 6 pages.
- **Feedback:** every action that would matter in production (status update, add item, toggle) shows a toast or inline confirmation, even though nothing persists to a backend.
- **Error prevention:** destructive-sounding actions (e.g. Cancel Order) show a confirm step.
- **Responsive:** Desktop is primary. Tablet: sidebar collapses to icons. Mobile: sidebar becomes a bottom nav or slide-in drawer; tables become stacked cards or horizontally scroll (pick one per table, document in DESIGN.md).

## 10. Accessibility

- Minimum WCAG AA contrast for text on cards/badges.
- All interactive elements keyboard-reachable with a visible focus ring.
- Status conveyed by icon/text + color, never color alone.
- Semantic HTML (`<table>` for tables, `<nav>` for sidebar, proper `<label>`s on form fields).

## 11. Analytics / Error / Empty States (per page)

| Page | Loading | Empty | Error |
|---|---|---|---|
| Dashboard | Skeleton KPI cards + chart shimmer | "No orders yet today" panel (relevant given the real sparse-today edge case) | Not expected (static CSV); if CSV fails to parse, show a friendly fallback banner |
| Orders | Skeleton rows | "No orders match your filters" + clear-filters button | same as above |
| Menu | Skeleton cards | "No items in this category" | same |
| Inventory | Skeleton rows | "No items match this filter" | same |
| Reports | Chart shimmer | "No data in selected range" | same |
| Settings | N/A (static) | N/A | N/A |

## 12. MVP Scope for the 120-Minute Build (priority order)

1. Design tokens + layout shell (sidebar/header) — everything depends on this.
2. Data layer: CSV parsing, derived fields (status, "today" logic).
3. Dashboard.
4. Orders.
5. Menu.
6. Inventory.
7. Reports.
8. Settings (cut first if time runs short — least judged value).
9. Responsive pass + polish (cut second-to-last).

## 13. Future Scope (explicitly out of the 120-minute build, for the "future work" slide)

- Real backend (Node/Postgres) with the schema in TRD §Database.
- Real auth (single Store Admin account is enough for v1; multi-role later).
- Persisted order-status updates and menu edits.
- Real customer identifier so "Total Customers" isn't a proxy for order count.
- Multi-outlet support if Starbucks Patna opens a second store (schema already allows it — see TRD).
