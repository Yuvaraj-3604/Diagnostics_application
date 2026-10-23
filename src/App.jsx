import React, { useState, useEffect, useRef } from "react";
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

// Helpers to map application routes to clean browser paths
const getUrlForPage = (targetPage, vehicle = null) => {
  if (!targetPage || targetPage === "dashboard") return "/";
  if (targetPage === "vehicle-details" && vehicle?.id) {
    return `/vehicles/${vehicle.id}`;
  }
  return `/${targetPage}`;
};

const getRouteFromLocation = (vehiclesList = []) => {
  if (typeof window === "undefined") return { page: "dashboard" };
  const path = window.location.pathname.replace(/^\/+|\/+$/g, "");

  if (!path || path === "dashboard") {
    return { page: "dashboard" };
  }

  if (path.startsWith("vehicles/")) {
    const parts = path.split("/");
    const vId = parts[1];
    const found = vehiclesList.find((v) => v.id === vId);
    return { page: "vehicle-details", vehicle: found, vehicleId: vId };
  }

  const KNOWN_PAGES = [
    "dashboard", "vehicles", "vehicle-details", "location",
    "health", "diagnostics", "reports", "alerts", "settings",
    "can-monitor", "can-analyzer", "avl-mapping", "devices"
  ];

  if (KNOWN_PAGES.includes(path)) {
    return { page: path };
  }

  return { page: "dashboard" };
};

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fleet state with localStorage persistence (Request 4)
  const [vehicles, setVehicles] = useState(() => {
    try {
      const saved = localStorage.getItem("hauloop_vehicles");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_VEHICLES;
  });

  const [selectedVehicle, setSelectedVehicle] = useState(() => {
    try {
      const savedVehicles = localStorage.getItem("hauloop_vehicles");
      if (savedVehicles) {
        const parsed = JSON.parse(savedVehicles);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      }
    } catch (e) {}
    return INITIAL_VEHICLES[0];
  });

  const [alerts, setAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem("hauloop_alerts");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return INITIAL_ALERTS;
  });

  // Filter for Vehicles page when redirected from Dashboard cards (Request 1)
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState("all");

  const handleNavigateVehicles = (status = "all") => {
    setVehicleStatusFilter(status);
    navigateTo("vehicles");
  };

  // Telematics real-time engine snapshot
  const [snapshot, setSnapshot] = useState(() => telematicsEngine.getSnapshot());

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const saved = localStorage.getItem("hauloop_auth");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.isAuthenticated === true;
      }
    } catch (e) {}
    return false;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("hauloop_auth");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.user) return parsed.user;
      }
    } catch (e) {}
    return INITIAL_USER;
  });

  // Centralized navigation that pushes state to browser history, enabling browser back/forward buttons
  const navigateTo = (targetPage, options = {}) => {
    const resolvedPage = typeof targetPage === "function" ? targetPage(page) : targetPage;
    if (!resolvedPage) return;

    const targetVehicle = options.vehicle || (resolvedPage === "vehicle-details" ? selectedVehicle : null);

    setPage(resolvedPage);
    if (options.vehicle) {
      setSelectedVehicle(options.vehicle);
    }

    if (!options.fromPopState && typeof window !== "undefined") {
      const url = getUrlForPage(resolvedPage, targetVehicle);
      const stateObj = {
        page: resolvedPage,
        vehicleId: targetVehicle?.id
      };

      try {
        if (options.replace) {
          window.history.replaceState(stateObj, "", url);
        } else {
          window.history.pushState(stateObj, "", url);
        }
      } catch (err) {
        console.warn("History pushState unavailable:", err);
      }
    }
  };

  // Keep vehicles ref up to date so popstate listener doesn't need to re-bind on every telematics tick
  const vehiclesRef = useRef(vehicles);
  useEffect(() => {
    vehiclesRef.current = vehicles;
  }, [vehicles]);

  // Sync initial history state and listen for browser Back (<-) & Forward (->) button clicks (Mount only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect route on initial page load
    const initialRoute = getRouteFromLocation(vehiclesRef.current);
    if (initialRoute.page && initialRoute.page !== "dashboard") {
      setPage(initialRoute.page);
      if (initialRoute.vehicle) {
        setSelectedVehicle(initialRoute.vehicle);
      }
    }

    const currentUrl = getUrlForPage(
      initialRoute.page || "dashboard",
      initialRoute.vehicle || vehiclesRef.current[0]
    );

    try {
      window.history.replaceState(
        {
          page: initialRoute.page || "dashboard",
          vehicleId: (initialRoute.vehicle || vehiclesRef.current[0])?.id
        },
        "",
        currentUrl
      );
    } catch (e) {}

    const handlePopState = (event) => {
      const state = event.state;
      let targetPage = state?.page;
      let targetVehicleId = state?.vehicleId;

      if (!targetPage) {
        const route = getRouteFromLocation(vehiclesRef.current);
        targetPage = route.page;
        targetVehicleId = route.vehicleId;
      }

      if (targetVehicleId) {
        const found = vehiclesRef.current.find((v) => v.id === targetVehicleId);
        if (found) {
          setSelectedVehicle(found);
        }
      }

      if (targetPage) {
        navigateTo(targetPage, { fromPopState: true });
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Subscribe to real-time telematics engine updates
  useEffect(() => {
    const unsubscribe = telematicsEngine.subscribe((newSnapshot) => {
      setSnapshot(newSnapshot);

      if (newSnapshot?.slots?.[0]) {
        const rawRpm = parseInt(newSnapshot.slots[0].value) || 1450;
        const newSpeed = Math.max(48, Math.min(65, Math.round(rawRpm / 28)));

        // Update live veh-01 speed/RPM (skip if offline)
        setVehicles((prev) =>
          prev.map((v) => {
            if (v.id === "veh-01") {
              if (v.status === "Offline") return v;
              if (v.engineRpm === rawRpm && v.currentSpeed === newSpeed) return v;
              return {
                ...v,
                engineRpm: rawRpm,
                currentSpeed: newSpeed
              };
            }
            return v;
          })
        );

        // Smoothly update selectedVehicle live metrics if veh-01 is currently viewed and not Offline
        setSelectedVehicle((prev) => {
          if (prev && prev.id === "veh-01" && prev.status !== "Offline") {
            if (prev.engineRpm === rawRpm && prev.currentSpeed === newSpeed) return prev;
            return {
              ...prev,
              engineRpm: rawRpm,
              currentSpeed: newSpeed
            };
          }
          return prev;
        });
      }
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
    navigateTo("dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("hauloop_auth");
  };

  const handleSelectVehicle = (vehicle, targetTab = "overview") => {
    setSelectedVehicle(vehicle);
    navigateTo("vehicle-details", { vehicle });
  };

  const handleAddVehicle = (newVehicle) => {
    setVehicles((prev) => {
      const updated = [newVehicle, ...prev];
      try {
        localStorage.setItem("hauloop_vehicles", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Immediate Alert & Status Synchronization (Request 3) with localStorage Persistence (Request 4)
  const handleUpdateVehicle = (updatedVehicle) => {
    setVehicles((prev) => {
      const newVehicles = prev.map((v) =>
        v.id === updatedVehicle.id ? { ...v, ...updatedVehicle } : v
      );
      try {
        localStorage.setItem("hauloop_vehicles", JSON.stringify(newVehicles));
      } catch (e) {}
      return newVehicles;
    });

    setSelectedVehicle((prev) => {
      if (prev && prev.id === updatedVehicle.id) {
        return { ...prev, ...updatedVehicle };
      }
      return updatedVehicle;
    });

    // Immediate Alert status update based on the vehicle status, engine status, and battery status
    setAlerts((prevAlerts) => {
      let newAlerts = [...prevAlerts];
      const vehNo = updatedVehicle.vehicleNo;

      if (updatedVehicle.status === "Healthy") {
        // Issue is resolved: immediately remove active alerts for this vehicle
        newAlerts = newAlerts.filter((a) => a.vehicleNo !== vehNo);
      } else if (updatedVehicle.status === "Need Attention") {
        let alertMsg = "Maintenance required";
        let alertType = "warning";
        let alertCode = "DIAG WARNING";
        let alertVal = "Vehicle requires checkup";

        if (updatedVehicle.engineStatus && updatedVehicle.engineStatus !== "Normal") {
          alertMsg = `Engine ${updatedVehicle.engineStatus.toLowerCase()} detected`;
          alertType = "critical";
          alertCode = "DTC SPN 110 FMI 0";
          alertVal = "104 °C (Threshold: 98 °C)";
        } else if (updatedVehicle.batteryStatus && updatedVehicle.batteryStatus !== "Good") {
          alertMsg = `Battery ${updatedVehicle.batteryStatus.toLowerCase()} warning`;
          alertType = "warning";
          alertCode = "DTC SPN 168 FMI 4";
          alertVal = "21.8 V (Threshold: 24.0 V)";
        }

        const existingIdx = newAlerts.findIndex((a) => a.vehicleNo === vehNo);
        if (existingIdx >= 0) {
          newAlerts[existingIdx] = {
            ...newAlerts[existingIdx],
            message: alertMsg,
            type: alertType,
            category: alertType === "critical" ? "Critical" : "Warning",
            time: "Just now",
            value: alertVal,
            code: alertCode
          };
        } else {
          newAlerts.unshift({
            id: `alt-${Date.now()}`,
            vehicleNo: vehNo,
            makeModel: updatedVehicle.makeModel,
            message: alertMsg,
            type: alertType,
            category: alertType === "critical" ? "Critical" : "Warning",
            time: "Just now",
            timestamp: new Date().toISOString(),
            value: alertVal,
            code: alertCode
          });
        }
      } else if (updatedVehicle.status === "Offline") {
        const existingIdx = newAlerts.findIndex((a) => a.vehicleNo === vehNo);
        const offlineMsg = "Vehicle offline";
        if (existingIdx >= 0) {
          newAlerts[existingIdx] = {
            ...newAlerts[existingIdx],
            message: offlineMsg,
            type: "info",
            category: "Info",
            time: "Just now",
            code: "MODEM LINK LOSS",
            value: "Cellular GSM link inactive"
          };
        } else {
          newAlerts.unshift({
            id: `alt-${Date.now()}`,
            vehicleNo: vehNo,
            makeModel: updatedVehicle.makeModel,
            message: offlineMsg,
            type: "info",
            category: "Info",
            time: "Just now",
            timestamp: new Date().toISOString(),
            value: "Cellular GSM link inactive",
            code: "MODEM LINK LOSS"
          });
        }
      }

      try {
        localStorage.setItem("hauloop_alerts", JSON.stringify(newAlerts));
      } catch (e) {}

      return newAlerts;
    });
  };

  const handleClearAllAlerts = () => {
    setAlerts([]);
    try {
      localStorage.setItem("hauloop_alerts", JSON.stringify([]));
    } catch (e) {}
  };

  const handleDismissAlert = (alertId) => {
    setAlerts((prev) => {
      const updated = prev.filter((a) => a.id !== alertId);
      try {
        localStorage.setItem("hauloop_alerts", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
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
            setPage={navigateTo}
            onSelectVehicle={handleSelectVehicle}
            onNavigateVehicles={handleNavigateVehicles}
          />
        );

      case "vehicles":
        return (
          <VehiclesScreen
            vehicles={vehicles}
            onSelectVehicle={handleSelectVehicle}
            onAddVehicle={handleAddVehicle}
            onUpdateVehicle={handleUpdateVehicle}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={vehicleStatusFilter}
            setStatusFilter={setVehicleStatusFilter}
          />
        );

      case "vehicle-details":
        return (
          <VehicleDetailsScreen
            vehicle={selectedVehicle}
            onBack={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                window.history.back();
              } else {
                navigateTo("vehicles");
              }
            }}
            setPage={navigateTo}
            onUpdateVehicle={handleUpdateVehicle}
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
            onNavigateAlerts={() => navigateTo("alerts")}
          />
        );

      case "diagnostics":
        return (
          <DiagnosticsScreen
            snapshot={snapshot}
            setPage={navigateTo}
            selectedVehicle={selectedVehicle}
          />
        );

      case "reports":
        return <ReportsScreen vehicles={vehicles} selectedVehicle={selectedVehicle} />;

      case "alerts":
        return (
          <AlertsScreen
            alerts={alerts}
            vehicles={vehicles}
            onSelectVehicle={handleSelectVehicle}
            onClearAllAlerts={handleClearAllAlerts}
            onDismissAlert={handleDismissAlert}
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
            setPage={navigateTo}
            onSelectCanId={() => navigateTo("can-analyzer")}
          />
        );

      case "can-analyzer":
        return (
          <CanAnalyzerScreen
            initialCanId="0CF00400"
            snapshot={snapshot}
            setPage={navigateTo}
          />
        );

      case "avl-mapping":
        return <AvlMappingScreen snapshot={snapshot} setPage={navigateTo} />;

      case "devices":
        return <DeviceManagementScreen snapshot={snapshot} setPage={navigateTo} />;

      default:
        return (
          <DashboardScreen
            vehicles={vehicles}
            alerts={alerts}
            currentUser={currentUser}
            setPage={navigateTo}
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
        setPage={navigateTo}
        open={menuOpen}
        setOpen={setMenuOpen}
        unreadAlertsCount={alerts.length}
      />

      {/* Main Workspace Area */}
      <div className="hl-main-viewport">
        {/* Topbar with Global Search & Alerts */}
        <Topbar
          page={page}
          setPage={navigateTo}
          setOpenSidebar={setMenuOpen}
          currentUser={currentUser}
          onLogout={handleLogout}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          alerts={alerts}
          onClearAllAlerts={handleClearAllAlerts}
          onDismissAlert={handleDismissAlert}
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
          onClick={() => navigateTo("dashboard")}
        >
          <LayoutDashboard size={19} />
          <span>Home</span>
        </button>
        <button
          type="button"
          className={`hl-mob-tab-btn ${page === "vehicles" || page === "vehicle-details" ? "active" : ""}`}
          onClick={() => navigateTo("vehicles")}
        >
          <Truck size={19} />
          <span>Vehicles</span>
        </button>
        <button
          type="button"
          className={`hl-mob-tab-btn ${page === "diagnostics" ? "active" : ""}`}
          onClick={() => navigateTo("diagnostics")}
        >
          <Activity size={19} />
          <span>Diagnostics</span>
        </button>
        <button
          type="button"
          className={`hl-mob-tab-btn ${page === "reports" ? "active" : ""}`}
          onClick={() => navigateTo("reports")}
        >
          <FileText size={19} />
          <span>Reports</span>
        </button>
        <button
          type="button"
          className={`hl-mob-tab-btn ${page === "alerts" ? "active" : ""}`}
          onClick={() => navigateTo("alerts")}
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