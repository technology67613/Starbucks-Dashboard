# TRD — Starbucks Patna Store Dashboard

## 1. Architecture Summary

Single-page React app, client-side only, no backend during the hackathon build. All "data layer" work is: load a bundled CSV → parse → derive fields → hold in React Context → filter/aggregate in memoized selectors → render.

```
Browser
 └─ Vite-built SPA (React + TS)
     ├─ DataProvider (Context) — parses CSVs once at load, exposes typed order[] and inventoryItem[]
     ├─ FilterProvider (Context) — shared filter state where pages need it (Orders, Reports)
     └─ Pages (tab-based, no router — matches ShopSphere precedent, saves build time)
```

No server, no database, no network calls at runtime (fully offline-capable demo — important safety net if venue wifi is bad).

## 2. Technology Stack

| Concern | Choice | Why |
|---|---|---|
| Build tool | Vite | Fastest cold-start + HMR for a timed live build; no SSR needed |
| UI | React 18 + TypeScript | Type safety catches data-shape bugs fast during a timed build |
| Styling | Tailwind CSS | Matches design tokens fastest, no separate CSS files to manage |
| Icons | lucide-react | Matches reference mockups' icon style, tree-shakeable |
| Charts | Recharts | Fast to wire up for line/area/donut/bar, good defaults |
| CSV parsing | PapaParse | Battle-tested, handles the header row and typing coercion cleanly |
| State | React Context + hooks | No Redux/Zustand needed at this scope; keeps build time down |
| Routing | None — tab-based conditional rendering | One less dependency/config surface in a 120-minute window |
| Deployment | Vercel or Netlify (static) | One-command deploy for the live demo; local `vite preview` as offline backup |

Deliberately **not** using: Next.js (no SSR/backend need), a router library (tabs are enough for 6 fixed pages), any backend framework, any real auth library.

## 3. Folder Structure

```
src/
  main.tsx
  App.tsx                  # top-level tab switcher + layout shell
  index.css                # Tailwind base + design tokens (CSS vars)
  types/
    order.ts                # Order, DerivedOrder (with status), OrderStatus
    inventory.ts             # InventoryItem, StockStatus
  data/
    mock_starbucks_patna_dataset.csv   # bundled, fetched at load
    inventory.json           # separately authored mock inventory (see PRD §6.4)
  lib/
    parseOrders.ts           # PapaParse wrapper + type coercion
    deriveStatus.ts          # deterministic order_id -> status rule (PRD §6.3)
    todayLogic.ts             # computes pseudo-"today" = max(order_date)
    aggregations.ts           # KPI/report math, all pure functions, all unit-testable
  context/
    DataContext.tsx
    FilterContext.tsx
  components/
    layout/Sidebar.tsx, Header.tsx
    ui/Card.tsx, Button.tsx, Badge.tsx, StatusBadge.tsx, Modal.tsx, Toast.tsx,
       EmptyState.tsx, LoadingSkeleton.tsx, DataTable.tsx, DatePicker.tsx
    charts/SalesTrendChart.tsx, CategoryDonut.tsx, HourlyBarChart.tsx
  pages/
    Dashboard.tsx, Orders.tsx, Menu.tsx, Inventory.tsx, Reports.tsx, Settings.tsx
```

**Why this shape:** `lib/` holds pure, testable data functions separated from `components/`, so a teammate who isn't confident with React can still meaningfully review/tweak `lib/` logic or copy, and so the aggregation math (which judges may probe) is easy to point to and explain live.

## 4. Data Model (frontend types)

```ts
type OrderRaw = {
  order_id: string; order_date: string; order_time: string; outlet: string;
  item_name: string; category: Category; size: string; quantity: number;
  unit_price: number; total_amount: number;
  payment_method: PaymentMethod; order_type: OrderType;
};

type Category = "Hot Beverages" | "Cold Beverages" | "Bakery" | "Food" | "Merchandise";
type PaymentMethod = "Starbucks App Wallet" | "Credit/Debit Card" | "UPI" | "Cash";
type OrderType = "Dine-in" | "Takeaway" | "Delivery";
type OrderStatus = "Completed" | "Preparing" | "Cancelled";

type DerivedOrder = OrderRaw & { status: OrderStatus };

type InventoryItem = {
  id: string; item: string; category: string; current_stock: number;
  unit: "kg" | "L" | "pcs"; status: "In Stock" | "Low Stock" | "Out of Stock";
  last_updated: string;
};
```

`DerivedOrder` is computed once when the CSV loads (`deriveStatus.ts`) and memoized in `DataContext` — never recomputed per render.

## 5. Key Derivation Logic (must be implemented exactly as documented, for judge transparency)

- **Pseudo-"today"**: `today = max(order.order_date)` across the full dataset (`todayLogic.ts`). Recompute this from data, never hardcode `"2025-09-14"` as a literal string in more than one place — keep it a single derived constant.
- **Order status**: deterministic hash of the numeric suffix in `order_id` (e.g. `parseInt(id.split('-')[2]) % 100`) mapped to bands: `<90 → Completed`, `90–95 → Cancelled`, `>95 → Preparing`. Orders where `order_date === today` are exempt from this band and instead get `Completed` or `Preparing` via a simpler 70/30 split, so the "today" view plausibly shows some in-flight orders.
- **"Total Customers" proxy**: count of orders in the period (documented in-UI via a tooltip: "1 order ≈ 1 customer visit — no customer ID in source data").
- **Previous-period delta**: for Dashboard KPIs, "previous period" = the prior date *present in the dataset*, not `today - 1 real day`.

## 6. State Management

- `DataContext`: loads + parses both CSVs once on mount, exposes `{ orders: DerivedOrder[], inventory: InventoryItem[], loading, error }`.
- `FilterContext`: shared between Orders and Reports where filter state should persist across a tab switch within a session (status filter, date range, search string). Menu/Inventory keep local filter state (simpler, no cross-page reuse needed).
- No global order-status mutation persistence is required — "Update status" and "Add item" actions update local component/context state only, with a toast confirming the (non-persisted) action, and a code comment noting where a real `PATCH /orders/:id` call would go.

## 7. API Design (documented for the "future full backend" story — not implemented in the 120-min build)

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Store Admin login |
| GET | `/api/dashboard/summary?date=` | KPIs + today highlights for a given date |
| GET | `/api/orders?status=&date=&q=&page=` | Paginated, filtered orders |
| PATCH | `/api/orders/:id` | Update order status |
| GET | `/api/menu` | Menu items |
| POST/PATCH | `/api/menu` / `/api/menu/:id` | Add/edit menu item |
| GET | `/api/inventory?status=` | Inventory list |
| PATCH | `/api/inventory/:id` | Update stock count |
| GET | `/api/reports?from=&to=` | Aggregated report data for a date range |
| GET/PATCH | `/api/settings` | Store settings |

Each would require: request validation (zod/yup), auth middleware checking a session cookie/JWT, and consistent error envelopes (`{ error: { code, message } }`).

## 8. Database Schema (future scope, for TRD completeness)

```
store(id, name, address, phone, hours, currency)
users(id, store_id, name, email, password_hash, role)
categories(id, name)
products(id, store_id, category_id, name, size, unit_price, available)
orders(id, store_id, order_date, order_time, order_type, payment_method, status, total_amount)
order_items(id, order_id, product_id, quantity, unit_price, line_total)
inventory_items(id, store_id, item, category, unit, current_stock, low_stock_threshold, last_updated)
```

`store_id` is present everywhere on purpose so a second outlet could be added later without a schema rewrite — but the current UI never surfaces a store switcher beyond the single "Starbucks Patna" label, per PRD non-goals.

## 9. Security (documented, not built in the 120-min prototype)

- No secrets in the frontend bundle (N/A currently — no API keys are used, since there's no live LLM/API call in this build, unlike the ShopSphere project).
- Future: httpOnly session cookies, CSRF token on state-changing routes, rate limiting on `/api/auth/login`, input validation on every write route, parameterized queries only.
- Frontend: no `dangerouslySetInnerHTML`, no `eval`, CSV values are rendered as text (React escapes by default) so there's no XSS vector from the mock data.

## 10. Performance

- Bundle the CSV as a static asset, parse once, memoize derived arrays — avoid re-parsing on every tab switch.
- Charts receive pre-aggregated arrays (aggregation done in `lib/aggregations.ts`, not inside chart components) to avoid recomputation on re-render.
- Pagination on Orders (10/page) avoids rendering all 260 rows to the DOM at once.
- Lazy-load nothing extra for a 6-page, single-bundle hackathon app — code-splitting adds build-time risk for negligible payoff at this scale.

## 11. Testing (scoped to what's realistic in 120 minutes)

- Manual demo-rehearsal checklist (see PROMPTS.md final phase) is the primary QA method.
- If time allows: 2–3 unit tests on `lib/aggregations.ts` (total revenue, order count, category breakdown) since these are the numbers most likely to be challenged by judges.
- No E2E test suite — out of scope for the time budget.

## 12. Deployment

- `vercel deploy` or Netlify drag-and-drop of `dist/` as the primary demo path.
- `npm run build && npm run preview` locally as the offline fallback if venue network fails during the live demo.

## 13. Technical Risks & Trade-offs

| Risk | Mitigation |
|---|---|
| Sparse "today" data (only 2 orders on 2025-09-14) makes the flagship Dashboard screen look thin live | Explicit, polished empty/sparse states (PRD §8.1) turn this into a demonstrated engineering decision rather than a bug — call it out proactively during the demo |
| Deriving order status invents data not in the CSV | Keep the rule deterministic, simple, and documented in code + PRD so it can be explained in 10 seconds if asked |
| No router = state (like current tab) is lost on refresh | Acceptable for a live demo; note as a one-line future improvement, not worth the setup time here |
| Team includes a non-technical fresher | Split PROMPTS.md phases so the fresher can own low-risk, high-visual-payoff work (Settings, static content, copy, icon/asset picks) while the primary developer drives data layer + core pages |
