# React Frontend ↔ Django Backend Integration Plan

## Context

The React admin dashboard at `safety-monitor/frontend/` is currently a UI shell pointing at `https://jsonplaceholder.typicode.com` for mock data. The Django backend at `/home/believer/Graduation_Project/Backendgrad/` already exposes 54 REST endpoints + 2 WebSocket endpoints with DRF Token auth and `django-cors-headers` configured for `http://localhost:3000`. Goal: replace the mock endpoints with real Django endpoints, add real authentication, and document every gap (frontend features with no backend endpoint, and backend features with no frontend page) in `missing.md`.

**Scope (chosen):** Wire existing React pages to existing backend endpoints + real auth + write `missing.md`. We do **not** build new backend endpoints or new React pages in this round — those land in `missing.md` for a later round.

**Dev setup (chosen):** CRA dev server on `http://localhost:3000`, Django on `http://localhost:8000`, configured via `REACT_APP_API_BASE_URL` in a `.env` file.

---

## Architecture

```
React dev (localhost:3000)
    │  fetch(`${API_BASE_URL}${path}`, { headers: { Authorization: `Token ${token}` } })
    ▼
Django dev (localhost:8000)
    │  django-cors-headers (already allows localhost:3000)
    │  DRF Token auth on `Authorization: Token <key>`
    ▼
SQLite db.sqlite3 + media/
```

Auth lifecycle:
1. `POST /api/auth/login/ { username, password }` → `{ token, user, worker? }`
2. Store `token` in `localStorage` under key `authToken`; store `user` under `authUser`.
3. `apiGet/apiPost/apiDelete` attach `Authorization: Token <token>` to every request.
4. On `401`, clear `localStorage` and redirect to `/login`.
5. `POST /api/auth/logout/` on user-initiated logout.

---

## Implementation Steps

### Step 1 — Frontend env configuration
**File:** `safety-monitor/frontend/.env` (new)
```
REACT_APP_API_BASE_URL=http://localhost:8000
```
Also create `.env.example` with the same content as a checked-in template. Add `.env` to `.gitignore` if not already there.

### Step 2 — Rewrite the endpoint registry
**File:** `safety-monitor/frontend/src/config/endpoints.js`

Replace the JSONPlaceholder paths with the real Django paths:

| Key | Old (JSONPlaceholder) | New (Django) |
|---|---|---|
| `login` *(new)* | — | `/api/auth/login/` |
| `logout` *(new)* | — | `/api/auth/logout/` |
| `me` *(new)* | — | `/api/auth/me/` |
| `dashboardSummary` | `/posts/3` | `/api/detection/dashboard-stats/` |
| `dashboardAlerts` | `/posts` | `/api/alerts/history/` |
| `workers` | `/users` | `/api/workers/` |
| `saveWorker` | `/users` | `/api/workers/add-with-photo/` *(multipart)* |
| `workerById(id)` | `/users/{id}` | `/api/workers/{id}/` |
| `analyzeImage` | `/posts` | `/api/detection/upload/` *(multipart)* |
| `healthCheck` *(new)* | — | `/api/detection/health/` |

Keep the rest (`settings`, `notificationPreferences`, `cameras`, `howToSteps`) **pointing at undefined backend routes for now** — they'll be flagged in `missing.md`. Either stub them to return `null` from `api.js` or leave them returning the JSONPlaceholder placeholder; we'll prefer stubbing so the UI shows "not yet implemented" rather than fake data.

### Step 3 — Add auth + token attachment in `src/api.js`
**File:** `safety-monitor/frontend/src/api.js`

Add a small set of helpers:
- `getToken()` / `setToken(token)` / `clearAuth()` — wraps `localStorage` access for `authToken` and `authUser`.
- A shared `authHeaders()` that returns `{ Authorization: \`Token ${token}\` }` when a token is present, otherwise `{}`.
- Update `apiGet`, `apiPost`, `apiDelete` to merge `authHeaders()` into the request, and to detect `401`/`403` → call `clearAuth()` + redirect to `/login`.
- New `login(username, password)` calling `POST /api/auth/login/`, persisting the returned token + user.
- New `logout()` calling `POST /api/auth/logout/` then `clearAuth()`.

Adjust `analyzeImage(file)` and `saveWorker(worker)` to send `multipart/form-data` (they already use `FormData`, but the worker form needs `worker_id`, `name`, `photo`, optional `department`, `position`, `required_ppe` as CSV — match the field names `add_worker_with_photo` reads in `Backendgrad/workers/views.py:264-297`).

Adjust the dashboard helpers to map Django response shapes to the UI's expected shape:
- `getSummary()`: read `total_workers`, `compliance_rate`, `total_violations` from `/api/detection/dashboard-stats/` and return `{ workers, compliance, alerts }`.
- `getAlerts()`: read `results` array from `/api/alerts/history/` (paginated DRF response) and map to the UI shape.
- `getWorkers()`: return the array directly from `/api/workers/` (DRF returns a list, not paginated for this view) and map each row to the UI shape, including `photo_url`.

### Step 4 — Wire the Login page to real auth
**File:** `safety-monitor/frontend/src/pages/Login*.js`

Currently sets `localStorage.isAuthenticated = "true"` on any non-empty form. Replace with:
```js
await login(form.username, form.password);
navigate("/");
```
On failure, show the API error message. Note the backend uses `username`, not `email` — relabel the form field accordingly.

### Step 5 — Update Protected route guard
**File:** `safety-monitor/frontend/src/App.js`

Replace the `localStorage.getItem("isAuthenticated") === "true"` check with `Boolean(getToken())`. Keep the redirect behavior.

### Step 6 — Wire Logout
**File:** `safety-monitor/frontend/src/pages/Logout*.js`

Call `await logout()` (which POSTs to the backend and clears localStorage), then redirect to `/login`.

### Step 7 — Adjust each page's data fetch
For each of these pages, replace the mocked function calls with the updated ones from `api.js`. No structural changes to the components — only the data source changes.

- **Dashboard** — `getSummary()` and `getAlerts()` already used; just trust the rewritten implementations.
- **Worker Management** — `getWorkers()`, `deleteWorker(id)`.
- **Add Worker** — `saveWorker(form)` with `FormData` containing `worker_id`, `name`, `photo`, etc.
- **Analysis** — `analyzeImage(file)` returns `{ detected, compliant, nonCompliant, detections }`; adapt the result rendering.
- **Help → "Test API connection"** — point at `/api/detection/health/` and show `status` + `ppe_model_loaded`.
- **Camera Management, Settings, Notification Preferences, Instructions** — stub the API calls to return `null` and render a clear "Backend endpoint not yet implemented" notice. Don't fake data.

### Step 8 — Write `missing.md`
**File:** `safety-monitor/missing.md` (new — already drafted alongside this plan)

Two sections:
1. **Missing in backend** — endpoints the frontend uses but Django doesn't expose (cameras CRUD, user settings, notification preferences, instructions/how-to). Include the expected request/response shape inferred from the React code so it's actionable for the backend dev.
2. **Missing in frontend** — backend endpoints with no React page yet (Reports, Violations, Sessions, Alert Recipients, Alert Configs, Worker Stats, Worker Shifts, Profile/Change-Password, WebSockets `/ws/detect/` and `/ws/notifications/`). Note the existing endpoint paths so a UI dev can pick them up.

---

## Files to Modify / Create

| Action | Path |
|---|---|
| Create | `safety-monitor/frontend/.env` |
| Create | `safety-monitor/frontend/.env.example` |
| Edit | `safety-monitor/frontend/src/config/endpoints.js` |
| Edit | `safety-monitor/frontend/src/api.js` |
| Edit | `safety-monitor/frontend/src/App.js` |
| Edit | `safety-monitor/frontend/src/pages/Login*.js` |
| Edit | `safety-monitor/frontend/src/pages/Logout*.js` |
| Edit | `safety-monitor/frontend/src/pages/Dashboard*.js` (only if its data-mapping needs help) |
| Edit | `safety-monitor/frontend/src/pages/WorkerManagement*.js` |
| Edit | `safety-monitor/frontend/src/pages/AddWorker*.js` |
| Edit | `safety-monitor/frontend/src/pages/Analysis*.js` |
| Edit | `safety-monitor/frontend/src/pages/Help*.js` |
| Edit | `safety-monitor/frontend/src/pages/CameraManagement*.js` (show "not implemented") |
| Edit | `safety-monitor/frontend/src/pages/Settings*.js` (show "not implemented") |
| Edit | `safety-monitor/frontend/src/pages/NotificationPreferences*.js` (show "not implemented") |
| Edit | `safety-monitor/frontend/src/pages/Instructions*.js` (show "not implemented") |
| Create | `safety-monitor/missing.md` |

---

## Reused Existing Utilities

- `src/api.js` — already has `apiGet/apiPost/apiDelete` helpers; we add `login/logout/authHeaders` alongside.
- `src/config/endpoints.js` — already has `ENDPOINTS` dictionary + `resolveEndpoint(key, ...args)`; we only swap the URL values.
- Django side already has everything we need; no backend edits in this round.

---

## Verification

1. **Backend**: `cd Backendgrad && python3 manage.py runserver 0.0.0.0:8000` — confirm `/api/auth/login/`, `/api/workers/`, `/api/detection/health/` respond.
2. **Frontend**: `cd safety-monitor/frontend && npm start` — opens `http://localhost:3000`.
3. **Login**: with the seeded `admin` user (role=admin per the earlier role fix), submit the login form. Expect token + user in `localStorage` and redirect to `/`.
4. **Dashboard**: KPI numbers render from `/api/detection/dashboard-stats/`; the alerts list pulls from `/api/alerts/history/`.
5. **Workers list**: shows the 4 seeded workers with photos (using the `/media/...` URLs already fixed earlier).
6. **Add Worker**: form upload → 201 + the new worker appears in the list with photo.
7. **Analysis**: upload an image → `/api/detection/upload/` returns detections; UI renders the compliant/non-compliant breakdown.
8. **Help → Test API connection**: shows `status: ok` from `/api/detection/health/`.
9. **Camera / Settings / Notification Preferences / Instructions pages**: render a "Backend endpoint not yet implemented" banner (no JSONPlaceholder calls visible in DevTools Network tab).
10. **Logout**: token cleared from localStorage, redirect to `/login`, refreshing protected routes bounces back to `/login`.
11. **DevTools Network tab**: every request goes to `http://localhost:8000/api/...` and carries an `Authorization: Token ...` header (after login). No requests to `jsonplaceholder.typicode.com`.
12. **`missing.md`**: review with the team to prioritize the gaps for the next round.
