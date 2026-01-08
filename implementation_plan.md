# Implementation Plan - Dashboard Redesign

The goal is to integrate a new premium design (Minimarket Mgr) into the existing financial dashboard while preserving all current data logic, filters, and analytics functionality.

## 1. Environment Setup
- Install Tailwind CSS and its dependencies.
- Configure `tailwind.config.js` with the custom colors and fonts from the provided design.
- Update `index.css` to include Tailwind directives and global styles.

## 2. Layout & Shell
- Create a `Sidebar` component using the provided HTML.
- Create a `Layout` component (or update `App.tsx`) to provide the sidebar + main content area structure.
- Ensure the layout is responsive (hidden sidebar/hamburger on mobile).

## 3. UI Component Redesign
Refactor existing components to match the new aesthetic:
- **Header**: Use the "Breadcrumbs & Heading" style.
- **FiltersBar**: Adapt to the new "Filters Bar" horizontal style.
- **KpiCard (KPI Section)**: Update to the new card style with icons, trends, and specific background colors.
- **Charts**: Wrap Recharts in the new card container style.
- **TabbedTables**: Redesign the table to match the "Store Performance Detail" look, including the progress bars for ratios.

## 4. Feature Integration
- Ensure all existing filters (locales, providers, dates, search) work within the new Filters Bar.
- Maintain the "Rejected Records" logic and modal.
- Ensure the "Source" (Ventas/Gastos/Merma) tabs in the table still work correctly.

## 5. Polish
- Apply the Inter font globally.
- Ensure smooth transitions and hover effects.
- Verify responsiveness.

# Task List
- [ ] Install and configure Tailwind CSS
- [ ] Create `Sidebar` component
- [ ] Create `Layout` wrapper
- [ ] Redesign `KpiCard`
- [ ] Redesign `FiltersBar`
- [ ] Update `App.tsx` layout
- [ ] Redesign `TabbedTables`
- [ ] Final visual polish and responsiveness check
