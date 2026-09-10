# Skydash Dashboard Design System & Aesthetic Rules

## Core Rule
Whenever developing new features, pages, modals, tables, or components for the Super Admin Dashboard, ALWAYS strictly adhere to the established "Skydash Light Theme" design language, palette, typography, and component patterns. Never use plain unstyled elements, generic AI-slop colors, or dark/black canvas backgrounds.

## 1. Color Palette (Strictly Human-Curated Skydash Light Theme)
- **Primary Brand / Deep Indigo (`#4B49AC`)**: Active navigation pill, active buttons, brand logo badges, primary action buttons, key metrics.
- **Primary Sky Blue (`#98BDFF`)**: Hero card gradients, soft accents, highlights.
- **Cornflower Blue (`#7DA0FA`)**: Metric stat cards, secondary data visualizations.
- **Iris Purple (`#7978E9`)**: Metric stat cards, file icons, spreadsheet emblems.
- **Coral Salmon (`#F3797E`)**: Alert cards, error badges, danger counters, troubleshooting boxes.
- **Canvas / Background (`#F4F5F7`)**: Calming soft slate-grey page canvas (`bg-[#F4F5F7]`).
- **Cards & Surfaces (`#FFFFFF`)**: Pure white cards with subtle borders (`border-[#E4E8F0]`).
- **Typography Hierarchy**:
  - Headings / Primary Numbers: High-contrast rich charcoal `#1E2238` (or `#212529`). Use `font-black` or `font-extrabold` with `tracking-tight`.
  - Subtitles / Muted: `#6C7383`.
  - Monospace Data / IDs / Phone Numbers: `font-mono font-bold` or `font-semibold`.

## 2. Component Design Patterns
- **Page Headers**:
  - Title: `text-2xl sm:text-3xl font-black tracking-tight text-[#1E2238]`.
  - Subtitle: `text-xs sm:text-sm font-medium text-[#6C7383] mt-1`.
  - Action buttons on the right: `variant="outline" size="md" className="rounded-xl border-[#E4E8F0] font-bold text-[#1E2238] hover:border-[#4B49AC] hover:text-[#4B49AC] shadow-2xs"`.
- **Navigation Breadcrumbs**:
  - Always have **one consistent Back button** in the top navigation row (never duplicate inside cards).
  - Use `variant="outline" size="md"` with `ArrowLeft` icon, `rounded-xl`, `shadow-2xs`.
- **Data Tables**:
  - Outer container: `rounded-3xl border border-[#E4E8F0] bg-white shadow-sm overflow-hidden`.
  - Header row: `<TableRow className="bg-[#F8F9FB] border-b border-[#E4E8F0]">`.
  - Header cells: `py-4 text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383]`.
  - Rows: `hover:bg-[#F8F9FB]/80 transition-colors border-b border-[#E4E8F0]/70`.
  - Body cells: `py-3.5`.
  - Action buttons: `size="sm" className="rounded-xl border-[#E4E8F0] font-bold text-xs hover:bg-[#4B49AC] hover:text-white transition-all shadow-2xs"`.
- **Stat Cards**:
  - 4 Skydash cards (`#7DA0FA`, `#4B49AC`, `#7978E9`, `#F3797E`) with `text-3xl sm:text-4xl font-black font-mono`, gradient badges, and contextual subtitle pills.
- **Profile / Detail Cards**:
  - Top header: 56px gradient emblem (`from-[#4B49AC] to-[#7DA0FA]` or `from-[#7978E9] to-[#98BDFF]`).
  - Section dividers: `text-[11px] font-extrabold uppercase tracking-wider text-[#6C7383] mb-3`.
  - Structured cards: `rounded-2xl border border-[#E4E8F0] bg-[#F8F9FB] p-5 shadow-2xs`.
- **Buttons & Pills**:
  - Border radius: `rounded-xl` for buttons, `rounded-md` or `rounded-lg` for badges/pills.
  - Soft elevation: `shadow-2xs` or `shadow-xs`.
