import React, { useState } from "react";
import {
  CheckCircle2, AlertTriangle, XCircle, ArrowRight, Activity, Battery,
  Disc, Zap, ShieldCheck, Thermometer, ChevronRight, WifiOff
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
    status: "Healthy",
    engineStatus: "Normal",
    batteryStatus: "Good"
  };

  const isNeedAttention = vehicle.status === "Need Attention" || vehicle.status === "Attention";
  const isOffline = vehicle.status === "Offline";
  const isHealthy = !isNeedAttention && !isOffline;

  let healthScore = 96;
  let engineVal = 96;
  let batteryVal = 95;
  let brakesVal = 94;
  let transmissionVal = 92;
  let overallDesc = "Good";
  let overallNote = "Vehicle operating within nominal thresholds";
  let gaugeStroke = "#16a34a";

  if (isOffline) {
    healthScore = 15;
    engineVal = 0;
    batteryVal = 0;
    brakesVal = 0;
    transmissionVal = 0;
    overallDesc = "Offline";
    overallNote = "Diagnostic gateway unreachable";
    gaugeStroke = "#94a3b8";
  } else if (isNeedAttention) {
    const isEngineIssue = vehicle.engineStatus && vehicle.engineStatus !== "Normal";
    const isBatteryIssue = vehicle.batteryStatus && vehicle.batteryStatus !== "Good";
    gaugeStroke = "#f59e0b";

    if (isEngineIssue && isBatteryIssue) {
      healthScore = 58;
      engineVal = 52;
      batteryVal = 48;
      overallDesc = "Action Required";
      overallNote = "Engine thermal & battery voltage issues detected";
    } else if (isEngineIssue) {
      healthScore = 64;
      engineVal = 52;
      overallDesc = "Attention Required";
      overallNote = `Engine ${vehicle.engineStatus.toLowerCase()} detected`;
    } else if (isBatteryIssue) {
      healthScore = 68;
      batteryVal = 48;
      overallDesc = "Attention Required";
      overallNote = `Battery ${vehicle.batteryStatus.toLowerCase()} detected`;
    } else {
      healthScore = 72;
      overallDesc = "Maintenance Required";
      overallNote = "Scheduled preventive service due";
    }
  }

  // Dynamic recent faults for selected vehicle based on updated status
  const recentFaults = isOffline
    ? [
        {
          id: "f-off-1",
          title: "Gateway packet timeout (Active)",
          vehicleNo: vehicle.vehicleNo,
          date: "Just now",
          status: "open",
          type: "red"
        },
        {
          id: "f-off-2",
          title: "J1939 CAN bus silent (Active)",
          vehicleNo: vehicle.vehicleNo,
          date: "Just now",
          status: "open",
          type: "red"
        }
      ]
    : isNeedAttention
    ? [
        ...(vehicle.engineStatus && vehicle.engineStatus !== "Normal"
          ? [
              {
                id: "f-eng-1",
                title: `Engine coolant elevated / ${vehicle.engineStatus} (Active)`,
                vehicleNo: vehicle.vehicleNo,
                date: "Just now",
                status: "open",
                type: "amber"
              }
            ]
          : []),
        ...(vehicle.batteryStatus && vehicle.batteryStatus !== "Good"
          ? [
              {
                id: "f-batt-1",
                title: `Charging potential below nominal / ${vehicle.batteryStatus} (Active)`,
                vehicleNo: vehicle.vehicleNo,
                date: "Just now",
                status: "open",
                type: "amber"
              }
            ]
          : []),
        {
          id: "f-prev-1",
          title: "Scheduled service interval milestone",
          vehicleNo: vehicle.vehicleNo,
          date: "Yesterday",
          status: "resolved",
          type: "amber"
        }
      ]
    : [
        {
          id: "f-clean-1",
          title: "Coolant temperature spike (resolved)",
          vehicleNo: vehicle.vehicleNo,
          date: "12 Oct 2026 - 10:32 AM",
          status: "resolved",
          type: "amber"
        },
        {
          id: "f-clean-2",
          title: "Scheduled filter check (completed)",
          vehicleNo: vehicle.vehicleNo,
          date: "08 Oct 2026 - 04:21 PM",
          status: "resolved",
          type: "amber"
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
                  stroke={gaugeStroke}
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
              <strong className="health-status-desc">{overallDesc}</strong>
              <small className="health-sub-note">{overallNote}</small>
            </div>
          </div>

          {/* Right: Status Icon matching status */}
          <div className="health-gauge-right">
            <div className={`status-checkmark-circle ${isHealthy ? "status-circle-green" : (isOffline ? "status-circle-offline" : "status-circle-amber")}`}>
              {isHealthy ? (
                <CheckCircle2 size={42} className="check-icon-large text-green" />
              ) : isOffline ? (
                <WifiOff size={42} className="check-icon-large text-slate" />
              ) : (
                <AlertTriangle size={42} className="check-icon-large text-amber" />
              )}
            </div>
          </div>
        </div>

        {/* Subsystems Breakdown (when activeTab is overview or specific) */}
        <div className="subsystems-progress-strip">
          <div className="subsystem-progress-item">
            <div className="subsystem-header">
              <span className="subsystem-name">Engine System</span>
              <span className="subsystem-val">{engineVal}%</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className={`progress-bar-fill ${engineVal > 80 ? "fill-green" : (engineVal > 30 ? "fill-amber" : "fill-red")}`}
                style={{ width: `${engineVal}%` }}
              />
            </div>
          </div>

          <div className="subsystem-progress-item">
            <div className="subsystem-header">
              <span className="subsystem-name">Battery & Alternator</span>
              <span className="subsystem-val">{batteryVal}%</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className={`progress-bar-fill ${batteryVal > 80 ? "fill-green" : (batteryVal > 30 ? "fill-amber" : "fill-red")}`}
                style={{ width: `${batteryVal}%` }}
              />
            </div>
          </div>

          <div className="subsystem-progress-item">
            <div className="subsystem-header">
              <span className="subsystem-name">Brakes (EBS/ABS)</span>
              <span className="subsystem-val">{brakesVal}%</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className={`progress-bar-fill ${brakesVal > 80 ? "fill-green" : "fill-amber"}`}
                style={{ width: `${brakesVal}%` }}
              />
            </div>
          </div>

          <div className="subsystem-progress-item">
            <div className="subsystem-header">
              <span className="subsystem-name">Transmission</span>
              <span className="subsystem-val">{transmissionVal}%</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className={`progress-bar-fill ${transmissionVal > 80 ? "fill-green" : "fill-amber"}`}
                style={{ width: `${transmissionVal}%` }}
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
