# MASTER PROMPT — Starbucks Patna Store Dashboard

Paste this into your AI coding agent (Antigravity / Claude Code / Cursor) as the first message of the build, before the phased prompts in PROMPTS.md.

---

You are building **Starbucks Patna Store Dashboard**, a frontend-only internal business management dashboard for the single Starbucks outlet in Patna (P&M Mall), for a **live 120-minute hackathon build**. The user is the Store Admin — this is not a customer-facing ordering site.

## What to read first, in order
1. `PRD.md` — product scope, page-by-page requirements, resolved data conflicts, acceptance criteria, edge cases.
2. `TRD.md` — architecture, stack, folder structure, data model, derivation logic.
3. `DESIGN.md` — visual direction, design tokens, component system, responsive rules.
4. `PROMPTS.md` — the phased build plan you will execute, in order, with time budgets.
5. The reference images provided alongside these docs — use them for visual direction and layout intuition only; where they conflict with the written docs above, the written docs win.

## Non-negotiable scope boundaries
- **One store only** — Starbucks Patna, outlet "P&M Mall." Never invent multiple branches, branch comparisons, or branch rankings.
- **Frontend-only.** No backend, no database, no real authentication. All data comes from the bundled `mock_starbucks_patna_dataset.csv` (order-level sales data) plus a small separately-authored `inventory.json` (see TRD §5 / PRD §6.4) for the Inventory screen only.
- **Currency:** Indian Rupee (₹) everywhere, Indian digit grouping (e.g. `₹1,27,530`, not `₹127,530`). Never $, USD, €, £.
- **No fake data beyond what's explicitly authorized.** Sales/order figures must come from the real CSV. The only synthesized fields are: order `status` (deterministic rule, TRD §5) and the Inventory dataset (explicitly a separate, clearly-labeled mock dataset — never blended into the orders CSV).
- **Pseudo-"today"** = the most recent date present in the CSV (`2025-09-14`), not the real system date. This must be computed from the data, not hardcoded in more than one place.
- Six pages only: Dashboard, Orders, Menu, Inventory, Reports, Settings. Don't add pages or nav items to fill space.
- No customer-facing ordering flow, cart, checkout, marketing banners, or promotional slogans. Starbucks branding should feel like part of the product's identity (logo, subtle green, product category icons), not an advertisement.

## Tech stack (locked — do not substitute)
Vite + React + TypeScript + Tailwind CSS. `lucide-react` for icons, `recharts` for charts, `papaparse` for CSV parsing. React Context for state (no Redux/Zustand). Tab-based navigation, no router. See TRD.md for the full rationale and folder structure — follow it exactly so both teammates can navigate the codebase during the live build.

## Design direction (summary — DESIGN.md is authoritative)
Minimalist, premium, modern SaaS. White/off-white foundation, restrained Starbucks green accent, very subtle glassmorphism (used only on the decorative quote strip and modals — never on data tables or charts). Rounded cards (16px), soft shadows, generous whitespace, calm visual hierarchy. Every element must justify its presence by helping the Store Admin see or do something — no decoration for its own sake.

## Data integrity rule
Every number shown anywhere in the app (Dashboard KPIs, Orders pagination totals, Reports Overview totals) must be computed from the same underlying data and must never contradict another screen. If you change an aggregation function, re-check every screen that consumes it.

## Known edge case to handle deliberately, not accidentally
The bundled CSV's pseudo-"today" date (2025-09-14) originally had only 2 real orders; 13 additional realistic orders (same item/price catalog, same payment/order-type proportions) were added for that date only to give the Dashboard normal daily volume (15 orders) for the live demo. Keep the data layer defensive against a low/zero-order day anyway — don't hardcode logic that only works above a minimum order count — per PRD §8.1, even though that's no longer the state judges will actually see.

## Responsive & accessibility bar
Desktop is the primary experience but the app must reflow cleanly at tablet and mobile widths per DESIGN.md §7, and must meet the accessibility rules in PRD §10 / DESIGN.md §8 (contrast, keyboard reachability, status never conveyed by color alone).

## Process
1. Confirm you've read PRD.md, TRD.md, DESIGN.md, and PROMPTS.md, and scanned the reference images.
2. State your implementation plan in 5–8 bullet points before writing code, mapped to the PROMPTS.md phases and their time budgets.
3. Execute PROMPTS.md prompts 01–12 in order. After each phase, briefly confirm what was built and flag anything cut or deferred due to time.
4. Build for **actual working functionality** — filters that filter, search that searches, pagination that paginates, toggles that toggle — not just a static visual imitation of the reference mockups.
5. Before declaring done, run the Final QA / Demo Rehearsal checklist in PROMPTS.md Prompt 12 and fix anything it surfaces.
6. Flag explicitly if the 120-minute budget is running out before all 6 pages are complete — cut Settings first, then the decorative quote strip, then the responsive polish pass, in that order, per PRD §12's MVP priority list. Core data-driven screens (Dashboard, Orders, Reports) must never be the first thing cut.

## What NOT to build
- No second Starbucks Patna branch, no branch comparison/ranking UI.
- No real backend, real database, or real auth (documented as future work in TRD only).
- No customer-facing ordering, cart, or checkout flow.
- No non-INR currency anywhere.
- No fabricated product photography — use category icons (DESIGN.md §10).
- No hardcoded totals that bypass the data layer — everything must be computed from `mock_starbucks_patna_dataset.csv` and `inventory.json`.
