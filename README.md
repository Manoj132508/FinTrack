# 💸 Expense Tracker · Analytics Dashboard

A responsive, **full-stack** financial analytics dashboard to monitor and manage expenses, built with **React**, **Redux Toolkit**, and **Chart.js** on the front end and a **Node/Express + SQLite** API on the back end. It turns raw transactions into real-time insights — spending by category, cash-flow trends, budget tracking, and exportable reports — behind secure per-user accounts, with a polished UI in both light and dark themes.

![Tech](https://img.shields.io/badge/React-18-61dafb) ![Tech](https://img.shields.io/badge/Redux%20Toolkit-2-764abc) ![Tech](https://img.shields.io/badge/Chart.js-4-ff6384) ![Tech](https://img.shields.io/badge/Express-4-000000) ![Tech](https://img.shields.io/badge/SQLite-node%3Asqlite-003b57) ![Tech](https://img.shields.io/badge/Vite-5-646cff)

## ✨ Features

### Accounts & security
- **Register / sign in / sign out** with per-user data isolation — every account sees only its own transactions and budgets.
- **Password hashing** with bcrypt; sessions via **JWT** (`Authorization: Bearer` tokens).
- **Forgot / reset password** with single-use, 15-minute expiring tokens. *(Email delivery isn't wired up in this demo, so the reset link is surfaced directly — see [Security notes](#-security-notes).)*
- **Persistent sessions** — a refresh keeps you signed in; your data is loaded from the server, not the browser.

### Analytics & tracking
- **Analytics dashboard** — KPI cards (income, spending, net balance, savings rate) that update in real time.
- **Interactive visualizations** (Chart.js): cash-flow line chart, spending-by-category doughnut with a live legend, and a monthly net surplus/deficit bar chart.
- **Transactions** — add, edit, delete, search, and filter by type/category.
- **Budgets** — set monthly caps per category with progress bars and over-budget warnings.
- **Reports** — custom date-range analysis, category breakdown table, and **CSV export**.
- **Robust state management** with Redux Toolkit slices, memoized selectors, and a listener-middleware sync layer that debounces saves to the API.
- **Responsive & themeable** — collapsible mobile sidebar and a light/dark toggle that respects your OS preference.
- **Seeded demo data** for every new account so the dashboard looks alive immediately.

## 🛠 Tech Stack

| Concern         | Choice                                        |
| --------------- | --------------------------------------------- |
| UI              | React 18 + React Router                       |
| State           | Redux Toolkit + React-Redux (+ listener sync) |
| Charts          | Chart.js 4 + react-chartjs-2                  |
| Build tool      | Vite 5                                        |
| API             | Node.js + Express 4                           |
| Database        | SQLite via the built-in `node:sqlite` module  |
| Auth            | bcryptjs (hashing) + jsonwebtoken (JWT)       |
| Styling         | Hand-rolled CSS design system                 |

## 🚀 Getting Started

Requires **Node.js 22.5+** (the API uses the built-in `node:sqlite` module).

```bash
# install dependencies (front end + API share one package.json)
npm install

# start BOTH the API and the web app together
npm run dev
```

- Web app → **http://localhost:8080**
- API → **http://localhost:4000** (the Vite dev server proxies `/api` to it)

Other scripts:

```bash
npm run dev:web    # Vite dev server only
npm run dev:api    # Express API only
npm run build      # production build of the front end
npm run preview    # preview the production build
```

Optional environment variables for the API:

```bash
JWT_SECRET=your-long-random-secret   # REQUIRED in production
API_PORT=4000                        # API port (default 4000)
DB_PATH=./server/data.db             # SQLite file location
```

## 🧭 Project Structure

```
server/                       # Express + SQLite API
├─ server.js                  # app wiring, middleware, routes
├─ db.js                      # node:sqlite schema + data-access helpers
├─ security.js                # bcrypt, JWT, reset tokens, auth middleware
└─ routes/
   ├─ authRoutes.js           # register, login, me, forgot, reset
   └─ dataRoutes.js           # per-user transactions + budgets (protected)

src/
├─ api/client.js              # fetch wrapper + token storage
├─ app/
│  ├─ store.js                # Redux store
│  └─ syncMiddleware.js       # debounced server sync on data changes
├─ features/
│  ├─ auth/authSlice.js       # session thunks (bootstrap/login/register)
│  ├─ transactions/           # transactions slice
│  ├─ budgets/                # budgets slice
│  ├─ ui/                     # theme slice
│  └─ selectors.js            # memoized analytics selectors
├─ components/                # Layout, Sidebar, Topbar, AuthLayout, charts, …
├─ pages/
│  ├─ auth/                   # Login, Register, ForgotPassword, ResetPassword
│  ├─ Dashboard.jsx, Transactions.jsx, Budgets.jsx, Reports.jsx
├─ utils/                     # analytics, formatting, dates, seed
└─ data/categories.js         # category catalog (labels, icons, colors)
```

## 🏗 Architecture Notes

- **Auth flow** — the client stores only a JWT in `localStorage`. On startup a `bootstrapSession` thunk validates the token (`GET /api/auth/me`) and loads the user's data (`GET /api/data`) into Redux. Protected routes redirect to `/login` when unauthenticated.
- **Per-user persistence** — each user's transactions and budgets are stored server-side as a JSON blob keyed by user id. A Redux **listener middleware** watches for data mutations and debounces a `PUT /api/data`, so the UI stays snappy while the server stays in sync.
- **Separation of concerns** — all number-crunching lives in pure functions under `utils/analytics.js`, exposed through memoized selectors, so components stay presentational.
- **Consistency** — a single category catalog drives labels, icons, and the chart color palette everywhere.

## 🔒 Security notes

This is a portfolio project; a couple of deliberate shortcuts are called out honestly:

- **Password reset link is returned in the API response** (and logged server-side) because no email service is configured. In production this token would be emailed and never exposed to the client. The token itself is already production-shaped: random, SHA-256-hashed at rest, single-use, and expiring.
- **Set a strong `JWT_SECRET`** in production. Without it the API falls back to an insecure development default and logs a warning.
- Passwords are bcrypt-hashed; plaintext passwords are never stored or logged.

## 📄 License

MIT — free to use and adapt.
