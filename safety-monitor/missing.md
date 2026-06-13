# Missing APIs / Pages — Frontend ↔ Backend Gap Analysis

Generated from a frontend/backend comparison of `safety-monitor/frontend/` against `Backendgrad/`. Two sections:

1. **Missing in backend** — endpoints the React frontend calls but Django doesn't expose.
2. **Missing in frontend** — endpoints Django exposes but the React frontend doesn't use yet.

---

## 1. Missing in Backend

These endpoints are referenced by the React frontend (in `src/config/endpoints.js` and the corresponding pages) but have no matching Django view. They need to be implemented on the backend.

### 1.1 Camera Management (HIGH priority — Dashboard depends on it)
The Dashboard "live camera feeds" UI and the Camera Management page assume cameras are persisted entities.

| Frontend call | Suggested Django endpoint | Body / Response |
|---|---|---|
| `getCameras()` | `GET /api/cameras/` | `[{ id, name, ip, status, thumbnail, location? }]` |
| `addCamera(camera)` | `POST /api/cameras/` | Body: `{ name, ip, location? }` → `{ id, name, ip, status, thumbnail }` |
| `deleteCamera(id)` | `DELETE /api/cameras/{id}/` | 204 |

**Suggested model:** add a `Camera` model in a new `cameras` Django app with fields `name`, `ip_address`, `location`, `status (online/offline/error)`, `last_seen`, `thumbnail_url`. Wire a periodic `status` check (or expose a `POST /api/cameras/{id}/health/` endpoint).

### 1.2 User Settings (MEDIUM)
Settings page (`pages/SettingsNew.js`) reads/writes user-level preferences.

| Frontend call | Suggested Django endpoint | Body / Response |
|---|---|---|
| `getSettings()` | `GET /api/auth/settings/` | `{ language, theme, account: { name, email, phone }, notifications: { in_app, email, sms } }` |
| `saveSettings(settings)` | `PUT /api/auth/settings/` | Same shape, returns updated settings |

**Note:** the `account` block partly overlaps with `GET/PUT /api/auth/profile/` (already exists). Consider extending the existing profile endpoint with a `preferences` JSON field instead of creating a new endpoint.

### 1.3 Notification Preferences (MEDIUM)
Distinct from the global alert configs — these are **per-user toggles** for which alert types and channels the logged-in user wants.

| Frontend call | Suggested Django endpoint | Body / Response |
|---|---|---|
| `getNotificationPreferences()` | `GET /api/auth/notification-preferences/` | `{ enableAll, doNotDisturb, alerts: { hardHat, vest, gloves, ... }, channels: { in_app, email, sms }, emailReports, reportFrequency }` |
| `saveNotificationPreferences(settings)` | `PUT /api/auth/notification-preferences/` | Same shape |

**Note:** could be merged into Settings (§1.2). The existing `/api/alerts/recipients/` is recipient-centric (one row per person, used by admin-configured broadcast lists) and is not the same thing.

### 1.4 Instructions / How-To Steps (LOW)
The Instructions page renders a list of setup steps.

| Frontend call | Suggested Django endpoint | Body / Response |
|---|---|---|
| `getHowToSteps()` | `GET /api/content/how-to/` | `[{ id, order, title, description, image_url? }]` |

**Alternative:** keep this content static in the React app (no backend needed). Recommended unless the steps need to be edited without redeploying.

---

## 2. Missing in Frontend

These backend endpoints are functional and exposed by Django but no React page consumes them. Each is an opportunity for a future feature.

### 2.1 Reports (the React `Reports.js` is currently an empty stub)
| Backend endpoint | What it returns | Suggested page/feature |
|---|---|---|
| `GET /api/reports/summary/` | 30-day overview, top workers, daily trend | Main Reports page — KPI cards + line chart |
| `GET /api/reports/compliance/?group_by=day\|week\|department` | Time-series compliance % | Compliance chart inside Reports |
| `GET /api/reports/violations/` | Paginated violation records | "Violations" tab inside Reports |
| `GET /api/reports/worker/?worker_id=...` | Per-worker stats | "Worker detail" pop-up inside Reports / Workers |
| `POST /api/reports/export/` | CSV or JSON download | "Export" button on Reports page |
| `GET /api/reports/generated/` | Past exports list | "Recent exports" panel |

### 2.2 Violations management
| Backend endpoint | Suggested page/feature |
|---|---|
| `GET /api/detection/violations/` | A "Violations" page (list with filters: status, severity, date, worker, department) |
| `GET /api/detection/violations/{id}/` | Violation detail modal — includes the snapshot image |
| `PUT /api/detection/violations/{id}/` | Resolve / dismiss / escalate workflow on the detail page |

### 2.3 Detection sessions
| Backend endpoint | Suggested page/feature |
|---|---|
| `POST /api/detection/sessions/` | "Start monitoring session" button on Camera page |
| `GET /api/detection/sessions/` | "Sessions" history page (last 50) |
| `GET /api/detection/sessions/{id}/` | Session detail (timeline + thumbnails) |
| `POST /api/detection/sessions/{id}/end/` | "Stop session" button |
| `GET /api/detection/records/` | Raw frame records (probably admin-only/debug page) |

### 2.4 Alerts (global, admin-level)
The current frontend only has *user-level* notification preferences (which themselves are missing — see §1.3). The backend has a richer alerts subsystem:

| Backend endpoint | Suggested page/feature |
|---|---|
| `GET/POST /api/alerts/config/` | "Alert Rules" page — admin defines thresholds (e.g., "send email if 3 missing-hardhat violations in 10 min") |
| `GET/PUT/DELETE /api/alerts/config/{id}/` | Edit / delete an alert rule |
| `GET /api/alerts/history/` | "Alert History" page (currently we wire this to the Dashboard's recent-alerts strip) — full page version with filters |
| `GET /api/alerts/stats/` | KPI tiles for an admin Alerts dashboard |
| `POST /api/alerts/test/` | "Send test alert" button on the Alert Rules page |
| `GET/POST /api/alerts/recipients/` | "Recipients" page — manage who gets which alerts |
| `GET/PUT/DELETE /api/alerts/recipients/{id}/` | Edit / delete a recipient |

### 2.5 Worker management — deeper features
| Backend endpoint | Suggested page/feature |
|---|---|
| `GET /api/workers/stats/` | KPI tiles at the top of the Worker Management page (total, active, by-department) |
| `GET /api/workers/violations-summary/` | A "Violations per worker" table inside Worker Management |
| `GET /api/workers/{id}/` | Full worker detail page (currently the React app only shows list-view info) |
| `PUT/PATCH /api/workers/{id}/` | Edit worker form |
| `GET /api/workers/id/{worker_id}/` | Lookup by string `worker_id` (e.g., after face-recognition match) |
| `GET /api/workers/{worker_id}/shifts/` | Worker shift history tab |
| `POST /api/workers/{worker_id}/shifts/` | "Log a shift" form |
| `GET /api/workers/{worker_id}/violations/` | Violations tab on worker detail page |
| `POST /api/workers/retrain-face-model/` | "Retrain face recognition" admin button |

### 2.6 Authentication — missing flows
| Backend endpoint | Suggested page/feature |
|---|---|
| `POST /api/auth/register/` | Sign-up page (if the app allows self-registration; otherwise leave it admin-only) |
| `POST /api/auth/change-password/` | "Change password" form inside Settings |
| `GET/PUT /api/auth/profile/` | Profile page / Account section of Settings |
| `GET /api/auth/me/` | Use on app boot to refresh the cached `user` from `localStorage` |
| `GET /api/auth/workers/` *(profile list)* | Worker profile list (distinct from `/api/workers/`) — possibly for HR-style worker onboarding |
| `POST /api/auth/workers/create-account/` | "Grant login access" button on a worker's detail page (admin/supervisor only) |

### 2.7 WebSockets — real-time features (NOT YET INTEGRATED)
Two WebSocket endpoints are exposed via Django Channels but the React app has no client for either.

| Backend WS | Protocol summary | Suggested feature |
|---|---|---|
| `ws://<host>/ws/detect/` | Client sends raw image bytes; server replies with `{ type: "detection", detections, compliant, nonCompliant }`. Supports config messages (`required_ppe`, `confidence_threshold`). | Real-time camera feed analysis on the Dashboard or a dedicated "Live Monitoring" page |
| `ws://<host>/ws/notifications/?user_id=X&role=admin\|supervisor\|worker&worker_id=W001` | Server pushes violation notifications based on subscription groups. | Real-time toast/badge updates app-wide (alerts counter on header increments without a refresh) |

**Implementation hint:** a single `WebSocketProvider` React Context that connects to `/ws/notifications/` on login and exposes a subscription API to any component that wants live alerts.

---

## 3. Optional cleanups (not blockers)

- Backend `add-with-photo` and `retrain-face-model` are `AllowAny` "for testing" (`Backendgrad/workers/views.py:241, 334`). Switch to `IsAuthenticated` before production.
- Backend `compliance_report` department grouping uses an estimation (`Backendgrad/reports/views.py:278-311`). If the frontend exposes this chart, the estimation will mislead users.
- Backend PPE class mismatch: `safetyGlasses` and `earProtection` are listed in `MISSING_PPE_TYPES` but the model never detects them — the frontend will always show them as "missing" if the worker requires them.

---

## Priority recommendation

If we have to pick what to build next, this is the order I'd suggest:

1. **§1.1 Cameras backend** — Dashboard and Camera Management are first-class UI but currently empty.
2. **§2.4 Alerts admin pages** — backend is rich; just needs UI to expose it to admins.
3. **§2.7 WebSocket notifications** — instantly elevates perceived responsiveness of the dashboard.
4. **§1.2/§1.3 Settings + notification preferences backend** — needed for a believable Settings page.
5. **§2.1 Reports page** — backend is fully wired; "just" needs a React page.
6. Everything else.
