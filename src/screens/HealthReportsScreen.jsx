import React, { useState } from "react";
import {
  CheckCircle2, AlertTriangle, XCircle, ArrowRight, Activity, Battery,
  Disc, Zap, ShieldCheck, Thermometer, ChevronRight
} from "lucide-react";

export default function HealthReportsScreen({
  selectedVehicle,
  embedded = false,
  onNavigateAlerts
}) {
  const [activeTab, setActiveTab] = useState("overview");

  const vehicle = selectedVehicle || {
    vehicleNo: "TN 38 AB 4821",
    makeModel: "Ashok Leyland 3520",
    healthScore: 92,
    subsystems: {
      engine: 95,
      battery: 92,
      brakes: 94,
      transmission: 90,
      emissions: 96
    }
  };

  const healthScore = vehicle.healthScore || 92;

  // Recent faults list matching Panel 6
  const recentFaults = [
    {
      id: "f1",
      title: "Overheat warning (resolved)",
      vehicleNo: "TN 38 AB 4821",
      date: "12 Jul 2026 - 10:32 AM",
      status: "resolved",
      type: "amber"
    },
    {
      id: "f2",
      title: "Low battery voltage (resolved)",
      vehicleNo: "KA 01 CD 7768",
      date: "10 Jul 2026 - 04:21 PM",
      status: "resolved",
      type: "amber"
    },
    {
      id: "f3",
      title: "ABS sensor fault (open)",
      vehicleNo: "TN 72 EF 9032",
      date: "08 Jul 2026 - 09:15 AM",
      status: "open",
      type: "red"
    }
  ];

  // SVG Circular Gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <div className={`health-reports-screen-container ${embedded ? "is-embedded" : ""}`}>
      {/* 6. Header (if not embedded) */}
      {!embedded && (
        <div className="screen-page-header">
          <div className="header-titles">
            <h2 className="screen-title">Health Reports</h2>
            <p className="screen-subtitle">Detailed vehicle health and fault information.</p>
          </div>
        </div>
      )}

      {/* Subsystem Navigation Tabs matching Panel 6 */}
      <div className="health-tabs-row">
        <button
          className={`health-tab-pill ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`health-tab-pill ${activeTab === "engine" ? "active" : ""}`}
          onClick={() => setActiveTab("engine")}
        >
          Engine
        </button>
        <button
          className={`health-tab-pill ${activeTab === "battery" ? "active" : ""}`}
          onClick={() => setActiveTab("battery")}
        >
          Battery
        </button>
        <button
          className={`health-tab-pill ${activeTab === "brakes" ? "active" : ""}`}
          onClick={() => setActiveTab("brakes")}
        >
          Brakes
        </button>
        <button
          className={`health-tab-pill ${activeTab === "others" ? "active" : ""}`}
          onClick={() => setActiveTab("others")}
        >
          Others
        </button>
      </div>

      {/* Main Health Card matching Panel 6 */}
      <div className="hl-card overall-health-card">
        <div className="health-gauge-grid">
          {/* Left: Overall Health 92% Ring Gauge */}
          <div className="health-gauge-left">
            <div className="circular-progress-wrap">
              <svg width="130" height="130" viewBox="0 0 130 130" className="gauge-svg">
                {/* Background Track */}
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="11"
                />
                {/* Progress Ring */}
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 65 65)"
                  style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
              </svg>
              <div className="gauge-inner-content">
                <span className="gauge-score-pct">{healthScore}%</span>
              </div>
            </div>

            <div className="health-status-text-block">
              <span className="health-title-lbl">Overall Health</span>
              <strong className="health-status-desc">Good</strong>
              <small className="health-sub-note">Vehicle operating within nominal thresholds</small>
            </div>
          </div>

          {/* Right: Big Green Checkmark Icon matching Panel 6 */}
          <div className="health-gauge-right">
            <div className="status-checkmark-circle">
              <CheckCircle2 size={42} className="check-icon-large" />
            </div>
          </div>
        </div>

        {/* Subsystems Breakdown (when activeTab is overview or specific) */}
        <div className="subsystems-progress-strip">
          <div className="subsystem-progress-item">
            <div className="subsystem-header">
              <span className="subsystem-name">Engine System</span>
              <span className="subsystem-val">{vehicle.subsystems?.engine || 95}%</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill fill-green"
                style={{ width: `${vehicle.subsystems?.engine || 95}%` }}
              />
            </div>
          </div>

          <div className="subsystem-progress-item">
            <div className="subsystem-header">
              <span className="subsystem-name">Battery & Alternator</span>
              <span className="subsystem-val">{vehicle.subsystems?.battery || 92}%</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill fill-green"
                style={{ width: `${vehicle.subsystems?.battery || 92}%` }}
              />
            </div>
          </div>

          <div className="subsystem-progress-item">
            <div className="subsystem-header">
              <span className="subsystem-name">Brakes (EBS/ABS)</span>
              <span className="subsystem-val">{vehicle.subsystems?.brakes || 94}%</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill fill-green"
                style={{ width: `${vehicle.subsystems?.brakes || 94}%` }}
              />
            </div>
          </div>

          <div className="subsystem-progress-item">
            <div className="subsystem-header">
              <span className="subsystem-name">Transmission</span>
              <span className="subsystem-val">{vehicle.subsystems?.transmission || 90}%</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill fill-green"
                style={{ width: `${vehicle.subsystems?.transmission || 90}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Faults Section matching Panel 6 */}
      <div className="hl-card recent-faults-card">
        <div className="hl-card-header">
          <h3 className="hl-card-title">Recent Faults</h3>
          <button
            className="hl-link-btn"
            onClick={() => onNavigateAlerts && onNavigateAlerts()}
          >
            <span>View all</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="recent-faults-list">
          {recentFaults.map((fault) => {
            const isRed = fault.type === "red";
            return (
              <div key={fault.id} className="recent-fault-row">
                <div className={`fault-icon-wrap ${isRed ? "icon-red" : "icon-amber"}`}>
                  <AlertTriangle size={18} />
                </div>

                <div className="fault-info-block">
                  <div className="fault-title-line">
                    <strong className="fault-title">{fault.title}</strong>
                    <span className="fault-veh-pill">{fault.vehicleNo}</span>
                  </div>
                </div>

                <div className="fault-date-cell">
                  <span>{fault.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
