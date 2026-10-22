import React, { useState, useEffect } from "react";
import { LayoutDashboard, Truck, Activity, FileText, Bell } from "lucide-react";
import Topbar from "./components/Topbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { telematicsEngine } from "./lib/telematicsEngine.js";

// Core 10 Screens matching mockup
import LoginScreen from "./screens/LoginScreen.jsx";
import DashboardScreen from "./screens/DashboardScreen.jsx";
import VehiclesScreen from "./screens/VehiclesScreen.jsx";
import VehicleDetailsScreen from "./screens/VehicleDetailsScreen.jsx";
import LiveLocationScreen from "./screens/LiveLocationScreen.jsx";
import HealthReportsScreen from "./screens/HealthReportsScreen.jsx";
import DiagnosticsScreen from "./screens/DiagnosticsScreen.jsx";
import ReportsScreen from "./screens/ReportsScreen.jsx";
import SettingsScreen from "./screens/SettingsScreen.jsx";
import AlertsScreen from "./screens/AlertsScreen.jsx";

// Advanced FMC650 CAN Engineering Screens from repository
import CanMonitorScreen from "./screens/CanMonitorScreen.jsx";
import CanAnalyzerScreen from "./screens/CanAnalyzerScreen.jsx";
import AvlMappingScreen from "./screens/AvlMappingScreen.jsx";
import DeviceManagementScreen from "./screens/DeviceManagementScreen.jsx";

// Mockup Data
import { INITIAL_VEHICLES, INITIAL_ALERTS, INITIAL_USER } from "./data/fleetData.js";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fleet state
  const [vehicles, setVehicles] = useState(INITIAL_VEHICLES);
  const [selectedVehicle, setSelectedVehicle] = useState(INITIAL_VEHICLES[0]);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);

  // Telematics real-time engine snapshot
  const [snapshot, setSnapshot] = useState(() => telematicsEngine.getSnapshot());

  // Authentication State: Default to false so application always opens on Login page
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(INITIAL_USER);

  // Subscribe to real-time telematics engine updates
  useEffect(() => {
    const unsubscribe = telematicsEngine.subscribe((newSnapshot) => {
      setSnapshot(newSnapshot);

      // Periodically tick live vehicle speeds/RPMs smoothly
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.id === "veh-01" && newSnapshot?.slots?.[0]) {
            const rawRpm = parseInt(newSnapshot.slots[0].value) || 1450;
            return {
              ...v,
              engineRpm: rawRpm,
              currentSpeed: Math.max(48, Math.min(65, Math.round(rawRpm / 28)))
            };
          }
          return v;
        })
      );
    });
    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (user, remember) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    if (remember) {
      localStorage.setItem(
        "hauloop_auth",
        JSON.stringify({ isAuthenticated: true, user })
      );
    }
    setPage("dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("hauloop_auth");
  };

  const handleSelectVehicle = (vehicle, targetTab = "overview") => {
    setSelectedVehicle(vehicle);
    setPage("vehicle-details");
  };

  const handleAddVehicle = (newVehicle) => {
    setVehicles((prev) => [newVehicle, ...prev]);
  };

  // Render the requested screen
  const renderCurrentScreen = () => {
    switch (page) {
      case "dashboard":
        return (
          <DashboardScreen
            vehicles={vehicles}
            alerts={alerts}
            currentUser={currentUser}
            setPage={setPage}
            onSelectVehicle={handleSelectVehicle}
          />
        );

      case "vehicles":
        return (
          <VehiclesScreen
            vehicles={vehicles}
            onSelectVehicle={handleSelectVehicle}
            onAddVehicle={handleAddVehicle}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        );

      case "vehicle-details":
        return (
          <VehicleDetailsScreen
            vehicle={selectedVehicle}
            onBack={() => setPage("vehicles")}
            setPage={setPage}
          />
        );

      case "location":
        return (
          <LiveLocationScreen
            selectedVehicle={selectedVehicle}
            embedded={false}
          />
        );

      case "health":
        return (
          <HealthReportsScreen
            selectedVehicle={selectedVehicle}
            embedded={false}
            onNavigateAlerts={() => setPage("alerts")}
          />
        );

      case "diagnostics":
        return (
          <DiagnosticsScreen
            snapshot={snapshot}
            setPage={setPage}
            selectedVehicle={selectedVehicle}
          />
        );

      case "reports":
        return <ReportsScreen vehicles={vehicles} />;

      case "alerts":
        return (
          <AlertsScreen
            alerts={alerts}
            vehicles={vehicles}
            onSelectVehicle={handleSelectVehicle}
          />
        );

      case "settings":
        return (
          <SettingsScreen
            currentUser={currentUser}
            onUpdateUser={setCurrentUser}
          />
        );

      // Advanced FMC650 CAN Lab screens from repo
      case "can-monitor":
        return (
          <CanMonitorScreen
            snapshot={snapshot}
            setPage={setPage}
            onSelectCanId={() => setPage("can-analyzer")}
          />
        );

      case "can-analyzer":
        return (
          <CanAnalyzerScreen
            initialCanId="0CF00400"
            snapshot={snapshot}
            setPage={setPage}
          />
        );

      case "avl-mapping":
        return <AvlMappingScreen snapshot={snapshot} setPage={setPage} />;

      case "devices":
        return <DeviceManagementScreen snapshot={snapshot} setPage={setPage} />;

      default:
        return (
          <DashboardScreen
            vehicles={vehicles}
            alerts={alerts}
            currentUser={currentUser}
            setPage={setPage}
            onSelectVehicle={handleSelectVehicle}
          />
        );
    }
  };

  // If user signed out, show 1. Login / Welcome Screen
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="hl-app-shell">
      {/* Sidebar Navigation */}
      <Sidebar
        page={page}
        setPage={setPage}
        open={menuOpen}
        setOpen={setMenuOpen}
        unreadAlertsCount={alerts.length}
      />

      {/* Main Workspace Area */}
      <div className="hl-main-viewport">
        {/* Topbar with Global Search */}
        <Topbar
          page={page}
          setPage={setPage}
          setOpenSidebar={setMenuOpen}
          currentUser={currentUser}
          onLogout={handleLogout}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          alerts={alerts}
        />

        {/* Dynamic Screen Content */}
        <main className="hl-page-content-area">{renderCurrentScreen()}</main>

        {/* Global Footer */}
        <footer className="hl-global-footer">
          <div className="footer-left-info">
            <span className="footer-brand-tag">HAULOOP VEHICLE CARE</span>
            <span className="footer-dot">•</span>
            <span>Commercial Fleet Diagnostics & SAE J1939 Telematics</span>
          </div>
          <div className="footer-right-info">
            <span>Teltonika FMC650 Engine · Active</span>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Navigation Bar (Visible only on mobile / APK) */}
      <nav className="hl-mobile-bottom-nav" aria-label="Mobile Navigation">
        <button
          type="button"
          className={`hl-mob-tab-btn ${page === "dashboard" ? "active" : ""}`}
          onClick={() => setPage("dashboard")}
        >
          <LayoutDashboard size={19} />
          <span>Home</span>
        </button>
        <button
          type="button"
          className={`hl-mob-tab-btn ${page === "vehicles" || page === "vehicle-details" ? "active" : ""}`}
          onClick={() => setPage("vehicles")}
        >
          <Truck size={19} />
          <span>Vehicles</span>
        </button>
        <button
          type="button"
          className={`hl-mob-tab-btn ${page === "diagnostics" ? "active" : ""}`}
          onClick={() => setPage("diagnostics")}
        >
          <Activity size={19} />
          <span>Diagnostics</span>
        </button>
        <button
          type="button"
          className={`hl-mob-tab-btn ${page === "reports" ? "active" : ""}`}
          onClick={() => setPage("reports")}
        >
          <FileText size={19} />
          <span>Reports</span>
        </button>
        <button
          type="button"
          className={`hl-mob-tab-btn ${page === "alerts" ? "active" : ""}`}
          onClick={() => setPage("alerts")}
        >
          <div className="hl-mob-icon-wrap">
            <Bell size={19} />
            {alerts.length > 0 && <span className="hl-mob-unread-dot" />}
          </div>
          <span>Alerts</span>
        </button>
      </nav>
    </div>
  );
}