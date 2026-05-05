# API Documentation

This project centralizes endpoint configuration in one file:

- `src/config/endpoints.js`

## Base URL

The app uses:

- `API_BASE_URL` from `src/config/endpoints.js`
- or `REACT_APP_API_BASE_URL` env variable if provided

## Core API Helpers

Defined in `src/api.js`:

- `apiGet(pathOrKey, ...args)`
- `apiPost(pathOrKey, data, ...args)`
- `apiDelete(pathOrKey, ...args)`
- `resolveEndpoint(pathOrKey, ...args)` in `endpoints.js`

## Endpoint Registry

Current endpoint keys:

- `settings`
- `saveSettings`
- `notificationPreferences`
- `saveNotificationPreferences`
- `workers`
- `saveWorker`
- `workerById(id)`
- `analyzeImage`
- `dashboardSummary`
- `dashboardAlerts`
- `cameras`
- `addCamera`
- `cameraById(id)`
- `howToSteps`

## How to Change Backend Quickly

1. Update `API_BASE_URL`
2. Update `ENDPOINTS` values
3. Keep frontend code unchanged (it already consumes endpoint keys)

## Example Usage

```js
const workers = await apiGet("workers");
await apiPost("saveWorker", payload);
await apiDelete("workerById", workerId);
```
