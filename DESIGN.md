# DESIGN.md — Starbucks Patna Store Dashboard

## 1. Design Philosophy

"Apple-level simplicity + modern SaaS dashboard + Starbucks visual identity." An internal tool the store admin uses daily — not a Starbucks advertisement. Every element earns its place by helping the admin see or do something. White/off-white foundation, restrained Starbucks green as an accent (not a wash), subtle glassmorphism used sparingly (translucent cards on the marketing-quote strip and modals only — never on data-dense tables or charts, where full opacity wins for readability).

## 2. Layout System

- **Shell:** fixed left sidebar (240px desktop) + top header (64px) + scrollable content area.
- **Grid:** 12-column CSS grid for KPI rows (3-up on desktop, 2-up tablet, 1-up mobile); content max-width unconstrained (fills viewport) but inner cards never exceed a comfortable reading measure for text-heavy panels (e.g. Settings forms capped ~640px).
- **Sidebar:** logo block (Starbucks siren mark + "Patna" subtitle) at top, 6 nav items with icon + label, active item = filled light-green background + left accent bar + bold label. Bottom-of-sidebar decorative brand card ("Good Coffee Drives Good Days") — lowest priority element, first to cut under time pressure.
- **Header:** global search (left), page-contextual location pill ("Patna"), notification bell with unread dot, user avatar + name + role (right-aligned), consistent across all 6 pages.

## 3. Screen-by-Screen Notes (from reference mockups → implementation rules)

### Dashboard
- 3 KPI cards in a row, each: icon chip (tinted circle) + label + big number + delta badge (green up-arrow / red down-arrow) + tiny sparkline.
- Below: 2-column split — Sales Today chart (wide, ~65%) + Today's Highlights card (~35%) with 3 stacked rows (Best Selling Item, Peak Hour, Total Customers), each with a small icon.
- Quote strip: full-width, pale green background, centered italic quote — decorative only, cut first if short on time.

### Orders
- Full-bleed data table under a segmented-tab filter bar (All / Completed / In Progress / Cancelled) + "New Order" primary button top-right (can be a disabled/stub button — it's out of scope, but its presence matches the reference and signals completeness).
- Table rows: monospace-ish order # column, status as a pill badge (rounded-full, colored bg + colored text, never bare color block), actions column = kebab menu.
- Pagination bottom-right, numbered pages + prev/next chevrons, "Showing X–Y of Z" bottom-left.

### Menu
- Card grid, 4-up desktop / 2-up tablet / 1-up mobile. Each card: square product image placeholder (use a simple icon/illustration per category since no real product photography is available — do not fabricate Starbucks product photos), name, price in ₹, status pill (In Stock/Out of Stock), kebab menu.
- Category filter as pill tabs + search input + "Add Item" primary button, top-right, matching reference layout.

### Inventory
- Data table, columns per PRD §8.4. Status pill colors: green (In Stock), amber (Low Stock), red (Out of Stock) — icon + text always accompanies color.
- Filter tabs: All Items / Low Stock / Out of Stock. "Add Item" primary button top-right.

### Reports
- Sub-nav tabs (Overview / Sales / Orders / Top Items) under the page header, next to a date-range picker (top-right).
- Overview: 3 KPI cards (reuse Dashboard's KPI card component) → Sales Trend area chart (full-width) → 2-column split (Top Selling Items ranked list w/ horizontal bars, Sales by Category donut with center total + legend).
- Quote strip repeats at the bottom (same low-priority component as Dashboard).

### Settings
- Left-nav-adjacent secondary tab bar (Store Settings / Profile / Preferences / Notifications) at the top of the content area.
- Store Information: photo + editable fields laid out as label/value pairs, "Edit" ghost button top-right of the card.
- Store Preferences: label/value rows with dropdowns (Currency locked to Indian Rupee (₹), Receipt Footer text field, Language, Timezone).
- Notification Settings: label + description + toggle switch per row.
- Account Actions: Change Password (button), Log Out (destructive-styled outline button, red).

## 4. Component System

| Component | Purpose | States/Variants |
|---|---|---|
| `Sidebar` | Primary nav | active/inactive item, collapsed (tablet) |
| `Header` | Global search, notifications, user | — |
| `KpiCard` | Metric + delta | positive/negative delta |
| `GlassCard` | Decorative/quote panels only | — |
| `Card` | Default opaque content container | — |
| `Button` | Actions | primary (filled green), secondary (outline), ghost, destructive (red outline) |
| `Badge` / `StatusBadge` | Category tags / order & stock status pills | success, warning, error, neutral |
| `DataTable` | Orders/Inventory | loading (skeleton rows), empty, populated |
| `ProductCard` | Menu grid item | in stock / out of stock |
| `ChartCard` | Wraps any chart w/ title, period, tooltip, empty state | line, area, donut, bar |
| `EmptyState` | No-data messaging | icon + message + optional CTA |
| `LoadingState` | Skeletons | card skeleton, row skeleton, chart shimmer |
| `Modal` / `Drawer` | Order detail, Add Item, Edit Store Info | — |
| `Toast` | Action feedback | success, error |
| `Dropdown` / `DatePicker` | Filters | — |
| `FormField` | Settings/Add Item forms | default, error, disabled |

Every page reuses the same `Card`, `Badge`, `Button`, and `DataTable`/`ChartCard` primitives — no page invents its own one-off card or table style.

## 5. Design Tokens

### Colors
```
--color-primary: #0C5C3D        /* Starbucks-inspired deep green */
--color-primary-tint: #E7F3EC   /* light green backgrounds, active nav */
--color-text: #1A1A1A
--color-text-secondary: #6B7280
--color-bg: #FAFAF8             /* off-white app background */
--color-surface: #FFFFFF
--color-border: rgba(0,0,0,0.08)
--color-success: #16A34A
--color-warning: #D97706
--color-error: #DC2626
--color-info: #2563EB
```

### Typography
- Font family: `Inter` (system fallback stack) — clean, highly legible, free, matches the "Apple-level simplicity" brief without licensing concerns.
- Scale: Page title 28px/bold · Section title 18px/semibold · Body 14px/regular · Table text 13px/regular · KPI numbers 32px/bold · Labels/captions 12px/medium, uppercase-tracked for table headers.

### Spacing
4px base unit: 4, 8, 12, 16, 24, 32, 48. Card padding 20–24px. Section gaps 24–32px.

### Radius
Cards: 16px. Buttons/inputs: 10px. Badges/pills: 999px (full round). Product images: 12px.

### Shadows
`--shadow-sm: 0 1px 2px rgba(0,0,0,0.04)` (default card) · `--shadow-md: 0 4px 16px rgba(0,0,0,0.06)` (hover/elevated, modals).

### Blur (glassmorphism, used sparingly)
`--blur-glass: blur(12px)` on the quote strip and any translucent overlay only; backdrop `rgba(255,255,255,0.6)` + `1px solid rgba(255,255,255,0.4)` border. Never applied to tables, KPI cards, or charts.

## 6. Charts

| Data | Chart | Notes |
|---|---|---|
| Sales Today (hourly) | Area/line | x = hour, y = ₹; tooltip shows exact ₹ + time |
| Sales Trend (Reports, daily) | Area/line | x = date, y = ₹; date-range aware |
| Sales by Category | Donut | center label = total ₹, legend = 5 categories w/ % |
| Top Selling Items | Horizontal bar / ranked list w/ inline bar | ranked 1–5, count label right-aligned |
| KPI sparkline (optional, stretch) | Tiny inline line | no axes, decorative trend only |

Every chart: title, implied time period label, ₹ units where relevant, tooltip on hover, and an explicit empty state (see PRD §11) rather than a blank canvas.

## 7. Responsive Behavior

- **Desktop (≥1280px):** full sidebar, multi-column KPI/report layouts as described above.
- **Tablet (768–1279px):** sidebar collapses to icon-only rail (labels on hover/tooltip); KPI cards go 2-up; Menu grid 2-up.
- **Mobile (<768px):** sidebar becomes a bottom tab bar or slide-in drawer (implementer's choice, pick one and keep it consistent); KPI cards stack 1-up; Orders/Inventory tables become stacked card rows (each row's columns become labeled key/value pairs) rather than horizontal scroll, since that reads better on a phone than a tiny scrolling table.

## 8. Accessibility

- Text/background contrast ≥ 4.5:1 for body text, ≥ 3:1 for large KPI numbers.
- All interactive elements reachable via Tab, visible focus ring (2px, `--color-primary`, offset 2px).
- Status badges pair color with an icon + text label.
- Form fields have associated `<label>`s; icon-only buttons (kebab menus) have `aria-label`s.

## 9. Microinteractions

Subtle only: 150–200ms ease-out on hover/press states, sidebar item transition, modal fade+scale-in, toast slide-in from top-right. No page-transition animation needed given the tab-based (routerless) navigation. Avoid anything that delays perceived load time during the live demo.

## 10. Image Usage

No real Starbucks product photography is bundled (avoid IP/asset-sourcing risk in a 120-minute build). Use simple flat icon illustrations per category (coffee cup, cold cup, pastry, food, merchandise icon) as product-card imagery instead — consistent, fast to implement, and avoids the "advertisement" feel the brief explicitly warns against.
