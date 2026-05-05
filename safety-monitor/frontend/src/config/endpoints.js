export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://jsonplaceholder.typicode.com";

// Single source of truth for API endpoints.
export const ENDPOINTS = {
  settings: "/posts/1",
  saveSettings: "/posts",
  notificationPreferences: "/posts/2",
  saveNotificationPreferences: "/posts",
  workers: "/users",
  saveWorker: "/users",
  workerById: (id) => `/users/${id}`,
  analyzeImage: "/posts",
  dashboardSummary: "/posts/3",
  dashboardAlerts: "/posts",
  cameras: "/posts",
  addCamera: "/posts",
  cameraById: (id) => `/posts/${id}`,
  howToSteps: "/posts"
};

export function resolveEndpoint(pathOrKey, ...args) {
  if (typeof pathOrKey !== "string") {
    throw new Error("Endpoint key/path must be a string.");
  }

  if (pathOrKey.startsWith("/")) {
    return pathOrKey;
  }

  const endpoint = ENDPOINTS[pathOrKey];
  if (!endpoint) {
    throw new Error(`Unknown endpoint key: ${pathOrKey}`);
  }

  return typeof endpoint === "function" ? endpoint(...args) : endpoint;
}
