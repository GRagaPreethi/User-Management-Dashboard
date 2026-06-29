# User Management Dashboard

A production-ready admin dashboard for managing users, built with **React 18 + Vite (pure JavaScript — no TypeScript)**. Supports full CRUD operations against the JSONPlaceholder API with local state persistence, advanced filtering, sorting, pagination, and column management.

---

## Features

### Core
- **View Users** — Fetches 10 users from `https://jsonplaceholder.typicode.com/users` and displays them in a responsive table with columns: ID, First Name, Last Name, Email, Department, Actions
- **Add User** — Modal form with field validation; POSTs to API and appends to local state with auto-generated ID
- **Edit User** — Pre-filled modal form; PUTs to API and updates local state in place
- **Delete User** — Confirmation modal before removal; DELETEs from API and removes from local state
- **Search** — Debounced (300 ms) instant search across First Name, Last Name, Email, and Department
- **Filter Popup** — Separate modal for multi-field filtering (First Name, Last Name, Email, Department) with Apply and Reset actions
- **Sorting** — Click any column header to toggle ascending/descending; sort indicators shown
- **Pagination** — Page size options: 10 / 25 / 50 / 100; Previous/Next buttons; current page and total pages displayed
- **Validation** — All Add/Edit form fields are required; email format is validated before submission
- **Error Handling** — Error banner shown if the API fetch fails
- **Empty State** — "No users found." message when filters/search return no results
- **Loading State** — Skeleton rows displayed during the initial data fetch

### Bonus
- **Export CSV** — Downloads the currently visible (filtered + sorted + paginated) users as `users-YYYY-MM-DD.csv`; only exports visible columns
- **Column Visibility** — Toggle individual columns on/off; at least one column stays visible at all times
- **Drag-to-Reorder Columns** — Native HTML5 drag-and-drop reordering inside the Columns dropdown; order is reflected in the table and CSV export
- **LocalStorage Persistence** — All CRUD changes, column visibility, and column order survive page refresh
- **Toast Notifications** — Success and error toasts for every CRUD action (via Sonner)
- **Keyboard Accessibility** — ESC closes all modals

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite 7 |
| Language | **JavaScript (ES2022+, JSX — no TypeScript)** |
| Styling | Tailwind CSS 4 |
| UI components | shadcn/ui (Radix UI primitives, pure JSX) |
| HTTP client | Axios |
| Notifications | Sonner |
| Icons | Lucide React |

> **No TypeScript.** There are no `.ts` or `.tsx` files, no `tsconfig.json`, and no `@types/*` packages. All source files use `.jsx` / `.js` with standard ES module syntax.

---

## Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd user-management-dashboard

# 2. Install dependencies (requires Node.js 18+ and npm)
npm install
```

---

## Run Commands

```bash
# Development server (http://localhost:5173)
npm run dev

# Production build (outputs to dist/public/)
npm run build

# Preview production build locally
npm run serve
```

---

## Folder Structure

```
user-management-dashboard/
├── public/
├── src/
│   ├── api/
│   │   └── userService.js         # Axios CRUD helpers
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components (pure JSX)
│   │   ├── ColumnManager.jsx      # Drag-to-reorder + visibility dropdown
│   │   ├── ConfirmDelete.jsx      # Delete confirmation modal
│   │   ├── ErrorMessage.jsx       # Error banner
│   │   ├── FilterPopup.jsx        # Multi-field filter modal
│   │   ├── Header.jsx             # Dashboard header
│   │   ├── Pagination.jsx         # Page controls
│   │   ├── SearchBar.jsx          # Debounced search
│   │   ├── StatsCards.jsx         # Summary stats cards
│   │   ├── UserForm.jsx           # Add / Edit modal form
│   │   ├── UserRow.jsx            # Table row
│   │   ├── UserTable.jsx          # Sortable table
│   │   └── UserTableSkeleton.jsx  # Loading skeleton
│   ├── hooks/
│   │   ├── use-mobile.jsx
│   │   └── use-toast.js
│   ├── lib/
│   │   └── utils.js               # cn() utility
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html                     # Entry HTML (references src/main.jsx)
├── vite.config.js                 # Vite config (JavaScript)
├── package.json
└── README.md
```

---

## API Integration

All requests target `https://jsonplaceholder.typicode.com/users`.

| Action | Method | Endpoint | Notes |
|--------|--------|----------|-------|
| Fetch users | GET | `/users` | Returns 10 users |
| Create user | POST | `/users` | Local auto-incremented ID used |
| Update user | PUT | `/users/:id` | Full replace |
| Delete user | DELETE | `/users/:id` | 204 No Content |

JSONPlaceholder does not persist mutations — all state is managed in React state and synced to `localStorage`.

---

## Design Decisions

- **Pure JavaScript** — No TypeScript, no `tsconfig.json`. Zero `@types/*` packages.
- **localStorage as source of truth** — On mount the app checks localStorage first; if absent it fetches from the API. All mutations update localStorage immediately.
- **Debounced search** — 300 ms debounce prevents excessive re-renders while typing.
- **Column state persisted** — Visibility and order survive page refresh.
- **Optimistic updates** — State is updated on API success; errors are reported via toast.
