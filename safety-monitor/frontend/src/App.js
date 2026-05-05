import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/reports";
import Cameras from "./pages/Cameras";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Detection from "./pages/Detection";
import AnalysisNew from "./pages/AnalysisNew";
import CameraManagementNew from "./pages/CameraManagementNew";
import InstructionsNew from "./pages/InstructionsNew";
import SettingsNew from "./pages/SettingsNew";
import WorkerManagementNew from "./pages/WorkerManagementNew";
import NotificationPreferencesNew from "./pages/NotificationPreferencesNew";
import NotificationOptionsNew from "./pages/NotificationOptionsNew";
import AddNewWorkerNew from "./pages/AddNewWorkerNew";
import ApiDocs from "./pages/ApiDocs";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import AddNewWorker from "./pages/AddNewWorker";
import WorkerManagement from "./pages/WorkerManagement";
import NotificationSettings from "./pages/NotificationSettings";
import NotificationPreferences from "./pages/NotificationPreferences"; 

function App() {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const Protected = ({ element }) => (isAuthenticated ? element : <Navigate to="/login" replace />);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<Protected element={<Dashboard />} />} />
        <Route path="/reports" element={<Protected element={<Reports />} />} />
        <Route path="/cameras" element={<Protected element={<Cameras />} />} />
        <Route path="/settings" element={<Protected element={<Settings />} />} />
        <Route path="/help" element={<Protected element={<Help />} />} />
        <Route path="/detection" element={<Protected element={<Detection />} />} />
        <Route path="/analysis-new" element={<Protected element={<AnalysisNew />} />} />
        <Route path="/camera-management-new" element={<Protected element={<CameraManagementNew />} />} />
        <Route path="/instructions-new" element={<Protected element={<InstructionsNew />} />} />
        <Route path="/settings-new" element={<Protected element={<SettingsNew />} />} />
        <Route path="/worker-management-new" element={<Protected element={<WorkerManagementNew />} />} />
        <Route path="/notification-preferences-new" element={<Protected element={<NotificationPreferencesNew />} />} />
        <Route path="/notification-options-new" element={<Protected element={<NotificationOptionsNew />} />} />
        <Route path="/add-worker-new" element={<Protected element={<AddNewWorkerNew />} />} />
        <Route path="/api-docs" element={<Protected element={<ApiDocs />} />} />
        <Route path="/add-worker" element={<Protected element={<AddNewWorker />} />} />
        <Route path="/worker-management" element={<Protected element={<WorkerManagement />} />} />
        <Route path="/notification-settings" element={<Protected element={<NotificationSettings />} />} />
        <Route path="/notification-preferences" element={<Protected element={<NotificationPreferences />} />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
