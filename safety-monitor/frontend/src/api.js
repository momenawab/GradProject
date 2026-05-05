import { API_BASE_URL, resolveEndpoint } from "./config/endpoints";

export async function apiGet(pathOrKey, ...args) {
  const path = resolveEndpoint(pathOrKey, ...args);
  const response = await fetch(`${API_BASE_URL}${path}`);
  return response.json();
}

export async function apiPost(pathOrKey, data, ...args) {
  const path = resolveEndpoint(pathOrKey, ...args);
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function apiDelete(pathOrKey, ...args) {
  const path = resolveEndpoint(pathOrKey, ...args);
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
  });
  return response.json();
}

export async function testApiConnection() {
  const data = await apiGet("settings");
  return Boolean(data);
}

// -------------------- Settings --------------------
export async function getSettings() {
  await apiGet("settings");
  return {
    language: "English",
    theme: "Dark",
    account: "Manage your account details",
    notifications: { push: true, email: false, sms: true }
  };
}

export async function saveSettings(settings) {
  return apiPost("saveSettings", settings);
}

// -------------------- Notification Preferences --------------------
export async function getNotificationPreferences() {
  await apiGet("notificationPreferences");
  return {
    enableAll: true,
    doNotDisturb: false,
    alerts: {
      hardHat: { inApp: true, email: false, sms: true },
      vest: { inApp: true, email: true, sms: false },
      goggles: { inApp: true, email: true, sms: true }
    },
    emailReports: true,
    reportFrequency: "Weekly Digest",
    system: { inApp: true, email: true }
  };
}

export async function saveNotificationPreferences(settings) {
  return apiPost("saveNotificationPreferences", settings);
}

// -------------------- Worker Management --------------------
export async function getWorkers() {
  const data = await apiGet("workers");
  return data.slice(0, 4).map((u, i) => ({
    id: `WKR-00${i + 1}`,
    name: u.name,
    department: i % 2 === 0 ? "Welding" : "Assembly",
    zone: `Zone ${i + 1}`
  }));
}

export async function saveWorker(worker) {
  return apiPost("saveWorker", worker);
}

export async function deleteWorker(id) {
  return apiDelete("workerById", id);
}

// -------------------- Detection --------------------
export async function analyzeImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  await fetch(`${API_BASE_URL}${resolveEndpoint("analyzeImage")}`, {
    method: "POST",
    body: formData,
  });

  // Dummy 
  return {
    workers: 3,
    compliant: 2,
    nonCompliant: 1,
    details: [
      { id: 1, hardHat: true, vest: true, gloves: true, status: "Compliant" },
      { id: 2, hardHat: true, vest: true, gloves: true, status: "Compliant" },
      { id: 3, hardHat: true, vest: false, gloves: true, status: "Non-Compliant" }
    ]
  };
}

// -------------------- Dashboard --------------------
export async function getSummary() {
  try {
    await apiGet("dashboardSummary");
    return { workers: 120, compliance: 92, alerts: 5 };
  } catch (error) {
    return { workers: 120, compliance: 92, alerts: 5 };
  }
}

export async function getAlerts() {
  try {
    const data = await apiGet("dashboardAlerts");
    return data.slice(0, 4).map((item, i) => ({
      id: i + 1,
      type: i % 2 === 0 ? "Hard Hat" : "Safety Vest",
      location: `Zone ${i + 1}`,
      time: "14:32:15 PM"
    }));
  } catch (error) {
    return [
      { id: 1, type: "Hard Hat", location: "Zone 1", time: "14:32:15 PM" },
      { id: 2, type: "Safety Vest", location: "Zone 2", time: "14:32:15 PM" },
      { id: 3, type: "Hard Hat", location: "Zone 3", time: "14:32:15 PM" },
      { id: 4, type: "Safety Vest", location: "Zone 4", time: "14:32:15 PM" }
    ];
  }
}

// -------------------- Cameras --------------------
export async function getCameras() {
  const data = await apiGet("cameras");
  return data.slice(0, 4).map((item, i) => ({
    id: i + 1,
    name: `Camera 0${i + 1} - ${item.title.substring(0, 10)}`,
    ip: `192.168.1.10${i + 1}`,
    status: i % 2 === 0 ? "Online" : "Offline",
    thumbnail: "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg"
  }));
}

export async function addCamera(camera) {
  return apiPost("addCamera", camera);
}

export async function deleteCamera(id) {
  return apiDelete("cameraById", id);
}

// -------------------- How To Use --------------------
export async function getHowToSteps() {
  await apiGet("howToSteps");
  return [
    { id: 1, title: "Camera Setup", description: "Connect your IP camera...", image: "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg" },
    { id: 2, title: "Start AI Analysis", description: "Click 'Start Monitoring'...", image: "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg" },
    { id: 3, title: "Monitor the Dashboard", description: "Dashboard shows key metrics...", image: "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg" },
    { id: 4, title: "Interpret Alerts", description: "AI triggers alerts for violations...", image: "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg" },
    { id: 5, title: "Review Report", description: "Access historical data in Reports...", image: "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg" }
  ];
}
