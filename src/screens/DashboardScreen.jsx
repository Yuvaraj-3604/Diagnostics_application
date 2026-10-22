import React from "react";
import {
  Truck, ShieldCheck, AlertTriangle, WifiOff, ArrowRight,
  Clock, AlertCircle, ChevronRight, Activity, Thermometer, Battery
} from "lucide-react";

export default function DashboardScreen({
  vehicles,
  alerts,
  currentUser,
  setPage,
  onSelectVehicle
}) {
  const userName = currentUser?.fullName?.split(" ")[0] || "Yuvaraj";

  // Dynamic Fleet Counts
  const totalVehicles = vehicles.length;
  const healthyCount = vehicles.filter(v => v.status === "Healthy").length;
  const attentionCount = vehicles.filter(v => v.status === "Need Attention" || v.status === "Attention").length;
  const offlineCount = vehicles.filter(v => v.status === "Offline").length;

  const healthyPct = Math.round((healthyCount / totalVehicles) * 100) || 75;

  // Recent 3 alerts matching Screen 2
  const recentAlerts = alerts.slice(0, 3);

  // Recent 3 vehicles matching Screen 2 bottom row
  const recentVehicles = vehicles.slice(0, 3);

  // SVG Gauge calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius; // ~314.16
  const strokeDashoffset = circumference - (healthyPct / 100) * circumference;

  return (
    <div className="dashboard-content-container">
      {/* 2. Dashboard / Overview Header Banner */}
      <div className="dashboard-hero-header">
        <div className="hero-text-block">
          <h2 className="hero-greeting">Good morning, {userName}</h2>
          <p className="hero-subtext">Here's the health overview of your fleet.</p>
        </div>
        <button
          className="hl-btn-primary hl-btn-icon-right"
          onClick={() => setPage("vehicles")}
        >
          <span>View all vehicles</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* 4 Metric Summary Cards matching Screen 2 */}
      <div className="fleet-metrics-grid">
        {/* Metric 1: Total Vehicles */}
        <div
          className="metric-card metric-total clickable"
          onClick={() => setPage("vehicles")}
        >
          <div className="metric-icon-wrap total-icon">
            <Truck size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Total Vehicles</span>
            <div className="metric-value-row">
              <span className="metric-number">{totalVehicles}</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Healthy */}
        <div
          className="metric-card metric-healthy clickable"
          onClick={() => setPage("vehicles")}
        >
          <div className="metric-icon-wrap healthy-icon">
            <ShieldCheck size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Healthy</span>
            <div className="metric-value-row">
              <span className="metric-number">{healthyCount}</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Need Attention */}
        <div
          className="metric-card metric-attention clickable"
          onClick={() => setPage("alerts")}
        >
          <div className="metric-icon-wrap attention-icon">
            <AlertTriangle size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Need Attention</span>
            <div className="metric-value-row">
              <span className="metric-number">{attentionCount}</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Offline */}
        <div
          className="metric-card metric-offline clickable"
          onClick={() => setPage("alerts")}
        >
          <div className="metric-icon-wrap offline-icon">
            <WifiOff size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Offline</span>
            <div className="metric-value-row">
              <span className="metric-number">{offlineCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Fleet Health & Recent Alerts */}
      <div className="dashboard-widgets-grid">
        {/* Left Column: Fleet Health Gauge Card matching Screen 2 */}
        <div className="hl-card fleet-status-card">
          <div className="hl-card-header">
            <h3 className="hl-card-title">Fleet Health</h3>
          </div>

          <div className="donut-chart-container">
            {/* Circular Gauge 75% Healthy */}
            <div className="donut-chart-wrapper">
              <svg width="150" height="150" viewBox="0 0 150 150">
                <circle
                  cx="75"
                  cy="75"
                  r={radius}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="12"
                />
                <circle
                  cx="75"
                  cy="75"
                  r={radius}
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 75 75)"
                  style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
              </svg>
              <div className="donut-center-label">
                <span className="donut-center-number">{healthyPct}%</span>
                <span className="donut-center-sub text-green">Healthy</span>
              </div>
            </div>

            {/* Legend matching Screen 2 */}
            <div className="donut-legend-list">
              <div className="donut-legend-item">
                <div className="legend-indicator dot-healthy" />
                <span className="legend-name">Healthy</span>
                <span className="legend-count">{healthyCount}</span>
              </div>

              <div className="donut-legend-item">
                <div className="legend-indicator dot-attention" />
                <span className="legend-name">Need Attention</span>
                <span className="legend-count">{attentionCount}</span>
              </div>

              <div className="donut-legend-item">
                <div className="legend-indicator dot-offline" />
                <span className="legend-name">Offline</span>
                <span className="legend-count">{offlineCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Alerts matching Screen 2 */}
        <div className="hl-card recent-alerts-card">
          <div className="hl-card-header">
            <h3 className="hl-card-title">Recent Alerts</h3>
            <button
              className="hl-link-btn"
              onClick={() => setPage("alerts")}
            >
              <span>View all</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="recent-alerts-list">
            {recentAlerts.map((alert) => {
              const isOffline = alert.type === "offline" || alert.type === "info";
              const isCritical = alert.type === "critical";

              return (
                <div
                  key={alert.id}
                  className="recent-alert-item clickable"
                  onClick={() => {
                    const found = vehicles.find(v => v.vehicleNo === alert.vehicleNo);
                    if (found && onSelectVehicle) {
                      onSelectVehicle(found);
                    } else {
                      setPage("alerts");
                    }
                  }}
                >
                  <div className={`alert-item-icon ${isCritical ? "icon-critical" : (isOffline ? "icon-offline" : "icon-warning")}`}>
                    {isOffline ? (
                      <WifiOff size={18} />
                    ) : isCritical ? (
                      <Thermometer size={18} />
                    ) : (
                      <Battery size={18} />
                    )}
                  </div>

                  <div className="alert-item-body">
                    <div className="alert-item-title-row">
                      <strong className="alert-item-title-text">{alert.message}</strong>
                    </div>
                    <div className="alert-item-sub-meta">
                      <span>{alert.vehicleNo}</span>
                      <span className="meta-dot">•</span>
                      <span>{alert.time}</span>
                    </div>
                  </div>

                  <ChevronRight size={16} className="alert-item-arrow" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Vehicles matching Screen 2 */}
      <div className="hl-card recent-vehicles-card">
        <div className="hl-card-header">
          <h3 className="hl-card-title">Recent Vehicles</h3>
          <button
            className="hl-link-btn"
            onClick={() => setPage("vehicles")}
          >
            <span>View all vehicles</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="recent-vehicles-row-grid">
          {recentVehicles.map((veh) => {
            const isNeedAttention = veh.status === "Need Attention" || veh.status === "Attention";
            const isOffline = veh.status === "Offline";

            return (
              <div
                key={veh.id}
                className="recent-veh-card clickable"
                onClick={() => onSelectVehicle && onSelectVehicle(veh)}
              >
                <div className="recent-veh-icon-col">
                  {isOffline ? (
                    <div className="veh-icon-box box-offline"><AlertCircle size={20} /></div>
                  ) : isNeedAttention ? (
                    <div className="veh-icon-box box-attention"><Thermometer size={20} /></div>
                  ) : (
                    <div className="veh-icon-box box-healthy"><Truck size={20} /></div>
                  )}
                </div>

                <div className="recent-veh-info-col">
                  <strong className="recent-veh-number">{veh.vehicleNo}</strong>
                  <span className="recent-veh-model-sub">{veh.makeModel}</span>
                  <div className="recent-veh-status-row">
                    <span className={`status-pill ${isOffline ? "pill-offline" : (isNeedAttention ? "pill-attention" : "pill-healthy")}`}>
                      <span className="status-dot" />
                      <span>{veh.status}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
