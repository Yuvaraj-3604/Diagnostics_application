import React, { useState } from "react";
import {
  X, Truck, ShieldCheck, AlertTriangle, WifiOff, Bell, User,
  ChevronRight, ArrowRight, ArrowLeft, Share2, Home, Activity,
  Layers, Battery, Thermometer, Fuel, Gauge, Sliders, LogOut,
  HelpCircle, Settings as SettingsIcon, Search, Eye, Lock, Mail
} from "lucide-react";
import hauloopLogo from "../assets/hauloop-logo.png";
import truckThumb from "../assets/hauloop-truck.png";

export default function MobilePreviewModal({
  isOpen,
  onClose,
  vehicles,
  alerts,
  currentUser,
  onNavigateScreen
}) {
  // Active mobile view: "gallery" | "login" | "dashboard" | "vehicles" | "details" | "livedata" | "alerts" | "settings"
  const [activeScreenTab, setActiveScreenTab] = useState("dashboard");
  const [phoneAlertFilter, setPhoneAlertFilter] = useState("all");
  const [detailSubTab, setDetailSubTab] = useState("overview");

  if (!isOpen) return null;

  const totalVehicles = vehicles.length;
  const healthyCount = vehicles.filter((v) => v.status === "Healthy").length;
  const attentionCount = vehicles.filter((v) => v.status === "Need Attention" || v.status === "Attention").length;
  const offlineCount = vehicles.filter((v) => v.status === "Offline").length;

  const vehicle0 = vehicles[0] || {
    vehicleNo: "TN 38 AB 4821",
    makeModel: "Ashok Leyland 3520",
    driver: "Ramesh",
    currentSpeed: 62,
    fuelLevel: 68,
    coolantTemp: "82 °C",
    batteryVoltage: "26.4 V",
    engineRpm: 1450
  };

  const filteredAlerts = alerts.filter((a) => {
    if (phoneAlertFilter === "all") return true;
    return a.type.toLowerCase() === phoneAlertFilter.toLowerCase();
  });

  const renderPhoneHeader = (title, showBack = false, onBack = null) => (
    <div className="phone-brand-top-banner">
      <div className="phone-status-bar-white">
        <span>9:41</span>
        <div className="phone-status-icons">
          <span>●●●</span>
          <span>🔋</span>
        </div>
      </div>
      <div className="phone-red-header-content">
        {showBack ? (
          <button className="phone-white-back-btn" onClick={onBack || (() => setActiveScreenTab("dashboard"))}>
            <ArrowLeft size={18} />
          </button>
        ) : (
          <img src={hauloopLogo} alt="Hauloop" className="phone-white-logo" />
        )}
        <span className="phone-header-title">{title}</span>
        <div className="phone-header-right-icons">
          <Bell size={16} />
          <div className="phone-user-mini-circle">Y</div>
        </div>
      </div>
    </div>
  );

  const renderBottomNav = (activeTabName) => (
    <div className="phone-bottom-nav">
      <div
        className={`phone-nav-btn ${activeTabName === "home" ? "active" : ""}`}
        onClick={() => setActiveScreenTab("dashboard")}
      >
        <Home size={16} />
        <span>Home</span>
      </div>
      <div
        className={`phone-nav-btn ${activeTabName === "vehicles" ? "active" : ""}`}
        onClick={() => setActiveScreenTab("vehicles")}
      >
        <Truck size={16} />
        <span>Vehicles</span>
      </div>
      <div
        className={`phone-nav-btn ${activeTabName === "alerts" ? "active" : ""}`}
        onClick={() => setActiveScreenTab("alerts")}
      >
        <Bell size={16} />
        <span>Alerts</span>
      </div>
      <div
        className={`phone-nav-btn ${activeTabName === "settings" ? "active" : ""}`}
        onClick={() => setActiveScreenTab("settings")}
      >
        <User size={16} />
        <span>More</span>
      </div>
    </div>
  );

  return (
    <div className="mobile-preview-backdrop" onClick={onClose}>
      <div className="mobile-preview-container" onClick={(e) => e.stopPropagation()}>
        {/* Top Control Bar of Modal */}
        <div className="mobile-preview-top-bar">
          <div className="preview-heading-wrap">
            <span className="preview-badge">MOBILE FLOWS</span>
            <h3 className="preview-title">Mobile App Screens (Panels 8 - 14)</h3>
          </div>

          <div className="preview-controls-row">
            {/* Quick Screen Tabs */}
            <div className="preview-tab-pills">
              <button
                className={`preview-tab-btn ${activeScreenTab === "gallery" ? "active" : ""}`}
                onClick={() => setActiveScreenTab("gallery")}
              >
                Gallery (All Screens)
              </button>
              <button
                className={`preview-tab-btn ${activeScreenTab === "login" ? "active" : ""}`}
                onClick={() => setActiveScreenTab("login")}
              >
                8. Login
              </button>
              <button
                className={`preview-tab-btn ${activeScreenTab === "dashboard" ? "active" : ""}`}
                onClick={() => setActiveScreenTab("dashboard")}
              >
                9. Dashboard
              </button>
              <button
                className={`preview-tab-btn ${activeScreenTab === "vehicles" ? "active" : ""}`}
                onClick={() => setActiveScreenTab("vehicles")}
              >
                10. Vehicles
              </button>
              <button
                className={`preview-tab-btn ${activeScreenTab === "details" ? "active" : ""}`}
                onClick={() => setActiveScreenTab("details")}
              >
                11. Detail
              </button>
              <button
                className={`preview-tab-btn ${activeScreenTab === "livedata" ? "active" : ""}`}
                onClick={() => setActiveScreenTab("livedata")}
              >
                12. Live Data
              </button>
              <button
                className={`preview-tab-btn ${activeScreenTab === "alerts" ? "active" : ""}`}
                onClick={() => setActiveScreenTab("alerts")}
              >
                13. Alerts
              </button>
              <button
                className={`preview-tab-btn ${activeScreenTab === "settings" ? "active" : ""}`}
                onClick={() => setActiveScreenTab("settings")}
              >
                14. Settings
              </button>
            </div>

            <button className="preview-close-btn" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Stage */}
        <div className="mobile-mockups-stage">
          {/* ========================================================= */}
          {/* SCREEN 8: Login (Mobile)                                  */}
          {/* ========================================================= */}
          {(activeScreenTab === "gallery" || activeScreenTab === "login") && (
            <div className="phone-device-wrapper">
              <span className="phone-caption-tag">8. Login (Mobile)</span>
              <div className="iphone-chassis">
                <div className="phone-brand-top-banner">
                  <div className="phone-status-bar-white">
                    <span>9:41</span>
                    <div className="phone-status-icons"><span>●●●</span><span>🔋</span></div>
                  </div>
                  <div className="phone-red-header-content text-center">
                    <img src={hauloopLogo} alt="Hauloop" className="phone-white-logo-center" />
                  </div>
                </div>

                <div className="phone-app-body phone-login-body">
                  <h4 className="phone-login-title">Welcome Back</h4>
                  <p className="phone-login-sub">Sign in to continue</p>

                  <div className="phone-input-box">
                    <Mail size={15} className="text-muted" />
                    <input type="text" placeholder="Email or Mobile Number" defaultValue="yuvaraj@example.com" />
                  </div>

                  <div className="phone-input-box">
                    <Lock size={15} className="text-muted" />
                    <input type="password" placeholder="Password" defaultValue="••••••••" />
                    <Eye size={15} className="text-muted" />
                  </div>

                  <div className="phone-remember-row">
                    <label className="phone-check-lbl">
                      <input type="checkbox" defaultChecked />
                      <span>Remember me</span>
                    </label>
                    <span className="phone-forgot-link">Forgot password?</span>
                  </div>

                  <button className="phone-primary-cta" onClick={() => setActiveScreenTab("dashboard")}>
                    <span>Sign In</span>
                  </button>

                  <p className="phone-login-footer">Don't have an account? <span className="text-red">Contact your Fleet manager</span></p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 9: Mobile Dashboard                                */}
          {/* ========================================================= */}
          {(activeScreenTab === "gallery" || activeScreenTab === "dashboard") && (
            <div className="phone-device-wrapper">
              <span className="phone-caption-tag">9. Mobile Dashboard</span>
              <div className="iphone-chassis">
                {renderPhoneHeader("hauloop")}

                <div className="phone-app-body">
                  <div className="phone-greeting-box">
                    <h4 className="phone-greeting-title">Good morning, Yuvaraj</h4>
                    <p className="phone-greeting-sub">Here's your fleet overview</p>
                  </div>

                  <div className="phone-metrics-grid">
                    <div className="phone-metric-cell cell-total">
                      <Truck size={14} className="cell-icon text-blue" />
                      <span className="phone-metric-num">{totalVehicles}</span>
                      <span className="phone-metric-lbl">Total Vehicles</span>
                    </div>
                    <div className="phone-metric-cell cell-healthy">
                      <ShieldCheck size={14} className="cell-icon text-green" />
                      <span className="phone-metric-num">{healthyCount}</span>
                      <span className="phone-metric-lbl">Healthy</span>
                    </div>
                    <div className="phone-metric-cell cell-attention">
                      <AlertTriangle size={14} className="cell-icon text-amber" />
                      <span className="phone-metric-num">{attentionCount}</span>
                      <span className="phone-metric-lbl">Attention</span>
                    </div>
                    <div className="phone-metric-cell cell-offline">
                      <WifiOff size={14} className="cell-icon text-red" />
                      <span className="phone-metric-num">{offlineCount}</span>
                      <span className="phone-metric-lbl">Offline</span>
                    </div>
                  </div>

                  {/* Circular Gauge Card matching Screen 9 */}
                  <div className="phone-card-box">
                    <span className="phone-box-title">Fleet Health</span>
                    <div className="phone-health-gauge-row">
                      <div className="phone-gauge-circle">
                        <strong>75%</strong>
                        <small className="text-green">Healthy</small>
                      </div>
                      <div className="phone-gauge-legend">
                        <div><span className="dot-green" /> Healthy: <strong>9</strong></div>
                        <div><span className="dot-amber" /> Need Attention: <strong>2</strong></div>
                        <div><span className="dot-red" /> Offline: <strong>1</strong></div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Vehicles */}
                  <div className="phone-card-box">
                    <div className="phone-box-header">
                      <span className="phone-box-title">Recent Vehicles</span>
                      <span className="text-red font-bold text-xs" onClick={() => setActiveScreenTab("vehicles")}>View all →</span>
                    </div>
                    <div className="phone-veh-card-item" onClick={() => setActiveScreenTab("details")}>
                      <Truck size={18} className="text-muted" />
                      <div className="phone-veh-card-info">
                        <strong>TN 38 AB 4821</strong>
                        <span>Ashok Leyland 3520</span>
                      </div>
                      <span className="status-pill pill-healthy text-xs">Healthy</span>
                    </div>
                  </div>
                </div>

                {renderBottomNav("home")}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 10: Vehicle List (Mobile)                          */}
          {/* ========================================================= */}
          {(activeScreenTab === "gallery" || activeScreenTab === "vehicles") && (
            <div className="phone-device-wrapper">
              <span className="phone-caption-tag">10. Vehicle List (Mobile)</span>
              <div className="iphone-chassis">
                <div className="phone-brand-top-banner">
                  <div className="phone-status-bar-white">
                    <span>9:41</span>
                    <div className="phone-status-icons"><span>●●●</span><span>🔋</span></div>
                  </div>
                  <div className="phone-red-header-content">
                    <span className="phone-header-title">Vehicles</span>
                    <div className="phone-header-right-icons">
                      <Search size={16} />
                    </div>
                  </div>
                </div>

                <div className="phone-app-body">
                  <div className="phone-veh-list-scroll">
                    {vehicles.slice(0, 6).map((veh) => {
                      const isAttention = veh.status === "Need Attention" || veh.status === "Attention";
                      const isOffline = veh.status === "Offline";

                      return (
                        <div
                          key={veh.id}
                          className="phone-veh-row-card"
                          onClick={() => setActiveScreenTab("details")}
                        >
                          <img src={truckThumb} alt="truck" className="phone-row-thumb" />
                          <div className="phone-row-info">
                            <strong>{veh.vehicleNo}</strong>
                            <span>{veh.makeModel}</span>
                          </div>
                          <span
                            className={`status-pill ${
                              isOffline
                                ? "pill-offline"
                                : isAttention
                                ? "pill-attention"
                                : "pill-healthy"
                            } text-xs`}
                          >
                            {veh.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {renderBottomNav("vehicles")}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 11: Vehicle Detail (Mobile)                        */}
          {/* ========================================================= */}
          {(activeScreenTab === "gallery" || activeScreenTab === "details") && (
            <div className="phone-device-wrapper">
              <span className="phone-caption-tag">11. Vehicle Detail (Mobile)</span>
              <div className="iphone-chassis">
                {renderPhoneHeader("TN 38 AB 4821", true, () => setActiveScreenTab("vehicles"))}

                <div className="phone-app-body">
                  <div className="phone-truck-hero-card">
                    <img src={truckThumb} alt="truck" className="phone-truck-hero-img" />
                    <div className="phone-truck-details-text">
                      <h4>Ashok Leyland 3520</h4>
                      <p>Last updated: 2 min ago • Driver: Ramesh</p>
                    </div>
                  </div>

                  <div className="phone-subtabs-row">
                    <button
                      className={`phone-subtab ${detailSubTab === "overview" ? "active" : ""}`}
                      onClick={() => setDetailSubTab("overview")}
                    >
                      Overview
                    </button>
                    <button
                      className={`phone-subtab ${detailSubTab === "livedata" ? "active" : ""}`}
                      onClick={() => setActiveScreenTab("livedata")}
                    >
                      Live Data
                    </button>
                    <button
                      className={`phone-subtab ${detailSubTab === "diagnostics" ? "active" : ""}`}
                      onClick={() => setDetailSubTab("diagnostics")}
                    >
                      Diagnostics
                    </button>
                  </div>

                  <div className="phone-grid-2x2">
                    <div className="phone-metric-tile">
                      <Fuel size={15} className="text-amber" />
                      <span>Fuel Level</span>
                      <strong>68%</strong>
                    </div>
                    <div className="phone-metric-tile">
                      <Thermometer size={15} className="text-red" />
                      <span>Coolant Temp</span>
                      <strong>82 °C</strong>
                    </div>
                    <div className="phone-metric-tile">
                      <Activity size={15} className="text-green" />
                      <span>Engine RPM</span>
                      <strong>1,450 rpm</strong>
                    </div>
                    <div className="phone-metric-tile">
                      <Gauge size={15} className="text-blue" />
                      <span>Vehicle Speed</span>
                      <strong>62 km/h</strong>
                    </div>
                  </div>
                </div>

                {renderBottomNav("vehicles")}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 12: Live Data (Mobile)                             */}
          {/* ========================================================= */}
          {(activeScreenTab === "gallery" || activeScreenTab === "livedata") && (
            <div className="phone-device-wrapper">
              <span className="phone-caption-tag">12. Live Data (Mobile)</span>
              <div className="iphone-chassis">
                {renderPhoneHeader("Live Data", true, () => setActiveScreenTab("details"))}

                <div className="phone-app-body">
                  {/* Big RPM Gauge matching Screen 12 */}
                  <div className="phone-big-gauge-box">
                    <div className="phone-gauge-dial">
                      <span className="dial-value">1,450</span>
                      <small className="dial-unit">rpm</small>
                    </div>
                    <span className="dial-label">Engine RPM</span>
                  </div>

                  <div className="phone-grid-2x2">
                    <div className="phone-metric-tile">
                      <Gauge size={16} className="text-blue" />
                      <span>Speed</span>
                      <strong>62 km/h</strong>
                    </div>
                    <div className="phone-metric-tile">
                      <Fuel size={16} className="text-amber" />
                      <span>Fuel Level</span>
                      <strong>68%</strong>
                    </div>
                    <div className="phone-metric-tile">
                      <Thermometer size={16} className="text-red" />
                      <span>Coolant Temp</span>
                      <strong>82 °C</strong>
                    </div>
                    <div className="phone-metric-tile">
                      <Battery size={16} className="text-green" />
                      <span>Battery Voltage</span>
                      <strong>26.4 V</strong>
                    </div>
                  </div>
                </div>

                {renderBottomNav("vehicles")}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 13: Alerts (Mobile)                                */}
          {/* ========================================================= */}
          {(activeScreenTab === "gallery" || activeScreenTab === "alerts") && (
            <div className="phone-device-wrapper">
              <span className="phone-caption-tag">13. Alerts (Mobile)</span>
              <div className="iphone-chassis">
                <div className="phone-brand-top-banner">
                  <div className="phone-status-bar-white">
                    <span>9:41</span>
                    <div className="phone-status-icons"><span>●●●</span><span>🔋</span></div>
                  </div>
                  <div className="phone-red-header-content">
                    <span className="phone-header-title">Alerts</span>
                  </div>
                </div>

                <div className="phone-app-body">
                  <div className="phone-alert-tabs">
                    <button
                      className={`phone-alert-tab ${phoneAlertFilter === "all" ? "active" : ""}`}
                      onClick={() => setPhoneAlertFilter("all")}
                    >
                      All (3)
                    </button>
                    <button
                      className={`phone-alert-tab ${phoneAlertFilter === "critical" ? "active" : ""}`}
                      onClick={() => setPhoneAlertFilter("critical")}
                    >
                      Critical (1)
                    </button>
                    <button
                      className={`phone-alert-tab ${phoneAlertFilter === "warning" ? "active" : ""}`}
                      onClick={() => setPhoneAlertFilter("warning")}
                    >
                      Warning (1)
                    </button>
                  </div>

                  <div className="phone-alerts-scroll">
                    {filteredAlerts.map((alert) => {
                      const isCritical = alert.type === "critical";
                      const isWarning = alert.type === "warning";

                      return (
                        <div key={alert.id} className="phone-alert-card">
                          <div className={`phone-alert-icon ${isCritical ? "icon-red" : (isWarning ? "icon-amber" : "icon-info")}`}>
                            {isCritical ? <Thermometer size={14} /> : (isWarning ? <Battery size={14} /> : <WifiOff size={14} />)}
                          </div>
                          <div className="phone-alert-content">
                            <div className="phone-alert-header">
                              <strong className="phone-alert-veh">{alert.message}</strong>
                            </div>
                            <p className="phone-alert-desc">{alert.vehicleNo} • {alert.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {renderBottomNav("alerts")}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 14: Settings (Mobile)                              */}
          {/* ========================================================= */}
          {(activeScreenTab === "gallery" || activeScreenTab === "settings") && (
            <div className="phone-device-wrapper">
              <span className="phone-caption-tag">14. Settings (Mobile)</span>
              <div className="iphone-chassis">
                <div className="phone-brand-top-banner">
                  <div className="phone-status-bar-white">
                    <span>9:41</span>
                    <div className="phone-status-icons"><span>●●●</span><span>🔋</span></div>
                  </div>
                  <div className="phone-red-header-content">
                    <span className="phone-header-title">Settings</span>
                  </div>
                </div>

                <div className="phone-app-body">
                  <div className="phone-user-strip">
                    <div className="phone-user-avatar">Y</div>
                    <div className="phone-user-meta">
                      <strong>Yuvaraj</strong>
                      <span>Fleet Manager</span>
                    </div>
                  </div>

                  <div className="phone-settings-menu">
                    <div className="phone-menu-item">
                      <User size={15} />
                      <span>Account Settings</span>
                      <ChevronRight size={14} />
                    </div>
                    <div className="phone-menu-item">
                      <Bell size={15} />
                      <span>Notifications</span>
                      <ChevronRight size={14} />
                    </div>
                    <div className="phone-menu-item">
                      <Sliders size={15} />
                      <span>Vehicle Preferences</span>
                      <ChevronRight size={14} />
                    </div>
                    <div className="phone-menu-item">
                      <SettingsIcon size={15} />
                      <span>App Settings</span>
                      <ChevronRight size={14} />
                    </div>
                    <div className="phone-menu-item">
                      <HelpCircle size={15} />
                      <span>Help & Support</span>
                      <ChevronRight size={14} />
                    </div>
                    <div className="phone-menu-item text-red" onClick={onClose}>
                      <LogOut size={15} />
                      <span>Logout</span>
                    </div>
                  </div>
                </div>

                {renderBottomNav("settings")}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
