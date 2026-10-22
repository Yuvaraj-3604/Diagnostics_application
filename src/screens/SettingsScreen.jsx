import React, { useState } from "react";
import {
  User, Bell, Shield, Sliders, CheckCircle2, Save, Camera, Mail, Phone, Lock
} from "lucide-react";
import { saveToUserDatabase } from "../lib/userDatabase.js";

export default function SettingsScreen({ currentUser, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState("profile");

  const [name, setName] = useState(currentUser?.fullName || "Yuvaraj Perumal");
  const [email, setEmail] = useState(currentUser?.email || "yuvaraj@example.com");
  const [phone, setPhone] = useState(currentUser?.phone || "+91 98765 43210");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings toggles
  const [speedAlertLimit, setSpeedAlertLimit] = useState(80);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [telematicsInterval, setTelematicsInterval] = useState(1);

  const handleSaveProfile = (e) => {
    e.preventDefault();

    const updated = {
      ...(currentUser || {}),
      fullName: name,
      email: email,
      phone: phone
    };

    saveToUserDatabase(updated);
    if (onUpdateUser) onUpdateUser(updated);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="settings-screen-container">
      {/* 9. Settings Header */}
      <div className="screen-page-header">
        <div className="header-titles">
          <h2 className="screen-title">Settings</h2>
          <p className="screen-subtitle">Manage your account and application settings.</p>
        </div>
      </div>

      <div className="settings-layout-grid">
        {/* Left Sub-Navigation matching Panel 9 */}
        <div className="settings-sidebar-nav">
          <button
            className={`settings-nav-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <User size={16} />
            <span>Profile Information</span>
          </button>
          <button
            className={`settings-nav-btn ${activeTab === "vehicle" ? "active" : ""}`}
            onClick={() => setActiveTab("vehicle")}
          >
            <Sliders size={16} />
            <span>Vehicle Settings</span>
          </button>
          <button
            className={`settings-nav-btn ${activeTab === "system" ? "active" : ""}`}
            onClick={() => setActiveTab("system")}
          >
            <Shield size={16} />
            <span>System</span>
          </button>
          <button
            className={`settings-nav-btn ${activeTab === "alerts" ? "active" : ""}`}
            onClick={() => setActiveTab("alerts")}
          >
            <Bell size={16} />
            <span>Alerts</span>
          </button>
        </div>

        {/* Right Content Panel matching Panel 9 */}
        <div className="settings-content-panel">
          {activeTab === "profile" && (
            <div className="hl-card settings-card">
              {/* Profile Avatar Card Header */}
              <div className="profile-identity-strip">
                <div className="profile-avatar-circle">
                  <span>YP</span>
                </div>
                <div className="profile-identity-text">
                  <h3 className="profile-name-title">{name}</h3>
                  <span className="profile-email-sub">{email}</span>
                </div>
              </div>

              {saveSuccess && (
                <div className="login-alert-box alert-success" style={{ margin: "16px 0" }}>
                  <CheckCircle2 size={16} />
                  <span>Account profile settings updated successfully!</span>
                </div>
              )}

              {/* Form Fields matching Panel 9 */}
              <form onSubmit={handleSaveProfile} className="settings-form">
                <div className="settings-form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="settings-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="settings-form-group">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="settings-form-actions">
                  <button type="submit" className="hl-btn-primary hl-btn-save">
                    <Save size={16} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "vehicle" && (
            <div className="hl-card settings-card">
              <h3 className="hl-card-title">Vehicle & Telematics Thresholds</h3>
              <p className="hl-card-subtitle">Configure fleet speed warnings and diagnostic polling</p>

              <div className="settings-toggle-group">
                <div className="toggle-row">
                  <div>
                    <strong>Speed Warning Threshold ({speedAlertLimit} km/h)</strong>
                    <p className="toggle-desc">Trigger high speed notification if truck exceeds limit</p>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="110"
                    value={speedAlertLimit}
                    onChange={(e) => setSpeedAlertLimit(Number(e.target.value))}
                    className="hl-slider"
                  />
                </div>

                <div className="toggle-row">
                  <div>
                    <strong>Telematics Ingestion Rate</strong>
                    <p className="toggle-desc">FMC650 CAN bus live frame broadcast frequency</p>
                  </div>
                  <select
                    value={telematicsInterval}
                    onChange={(e) => setTelematicsInterval(Number(e.target.value))}
                    className="reports-select"
                  >
                    <option value={1}>1 second (Continuous / Live)</option>
                    <option value={5}>5 seconds</option>
                    <option value={10}>10 seconds</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div className="hl-card settings-card">
              <h3 className="hl-card-title">System & Protocol Configuration</h3>
              <p className="hl-card-subtitle">Teltonika FMC650 Codec 8 Extended (8E) & AWS Broker</p>

              <div className="system-config-specs">
                <div className="spec-row">
                  <span>CAN Channel:</span>
                  <strong>CAN1 Port (Heavy Vehicle 250 kbps)</strong>
                </div>
                <div className="spec-row">
                  <span>Standard:</span>
                  <strong>SAE J1939-71 (29-bit Extended Identifiers)</strong>
                </div>
                <div className="spec-row">
                  <span>Cloud Sync Channel:</span>
                  <strong className="text-green">Connected (Web & Android Sync)</strong>
                </div>
              </div>
            </div>
          )}

          {activeTab === "alerts" && (
            <div className="hl-card settings-card">
              <h3 className="hl-card-title">Alert Notification Preferences</h3>
              <p className="hl-card-subtitle">Real-time alerts for engine overheating, low battery, and offline units</p>

              <div className="settings-toggle-group">
                <label className="toggle-checkbox-row">
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                  />
                  <div>
                    <strong>Email Notifications</strong>
                    <p className="toggle-desc">Receive critical engine DTC warnings at {email}</p>
                  </div>
                </label>

                <label className="toggle-checkbox-row">
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                  />
                  <div>
                    <strong>SMS Dispatch Alerts</strong>
                    <p className="toggle-desc">Send immediate SMS alerts to assigned driver numbers</p>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
