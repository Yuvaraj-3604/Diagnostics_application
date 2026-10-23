import React, { useState } from "react";
import {
  Thermometer, Battery, WifiOff, ChevronRight, CheckCircle2,
  AlertTriangle, ArrowLeft, Trash2, X
} from "lucide-react";

export default function AlertsScreen({
  alerts,
  vehicles,
  onSelectVehicle,
  onClearAllAlerts,
  onDismissAlert
}) {
  const [filterType, setFilterType] = useState("all"); // "all" | "critical" | "warning" | "info"

  const filteredAlerts = alerts.filter((a) => {
    if (filterType === "all") return true;
    return a.type.toLowerCase() === filterType.toLowerCase();
  });

  const criticalCount = alerts.filter(a => a.type === "critical").length;
  const warningCount = alerts.filter(a => a.type === "warning").length;
  const infoCount = alerts.filter(a => a.type === "info").length;

  return (
    <div className="alerts-screen-container">
      {/* 6. Header matching Screen 6 */}
      <div className="screen-page-header">
        <div className="header-titles">
          <h2 className="screen-title">Alerts & Notifications</h2>
          <p className="screen-subtitle">Stay informed about your fleet's health.</p>
        </div>
        {alerts.length > 0 && onClearAllAlerts && (
          <button
            type="button"
            className="hl-btn-outline-clear"
            onClick={onClearAllAlerts}
            title="Clear all fleet notifications"
          >
            <Trash2 size={15} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Filter Tabs matching Screen 6: All (3) | Critical (1) | Warning (1) | Info (1) */}
      <div className="alerts-filter-tabs">
        <button
          className={`filter-tab-pill ${filterType === "all" ? "active" : ""}`}
          onClick={() => setFilterType("all")}
        >
          All ({alerts.length})
        </button>
        <button
          className={`filter-tab-pill ${filterType === "critical" ? "active" : ""}`}
          onClick={() => setFilterType("critical")}
        >
          Critical ({criticalCount})
        </button>
        <button
          className={`filter-tab-pill ${filterType === "warning" ? "active" : ""}`}
          onClick={() => setFilterType("warning")}
        >
          Warning ({warningCount})
        </button>
        <button
          className={`filter-tab-pill ${filterType === "info" ? "active" : ""}`}
          onClick={() => setFilterType("info")}
        >
          Info ({infoCount})
        </button>
      </div>

      {/* Alerts Cards List matching Screen 6 */}
      <div className="alerts-cards-list-view">
        {filteredAlerts.length === 0 ? (
          <div className="hl-card empty-card-box">
            <CheckCircle2 size={32} style={{ color: "#16a34a", marginBottom: 8 }} />
            <p>No active alerts in this category.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.type === "critical";
            const isWarning = alert.type === "warning";
            const isInfo = alert.type === "info";

            return (
              <div
                key={alert.id}
                className="hl-card alert-row-card clickable"
                onClick={() => {
                  const found = vehicles.find((v) => v.vehicleNo === alert.vehicleNo);
                  if (found && onSelectVehicle) onSelectVehicle(found);
                }}
              >
                <div className="alert-row-left">
                  <div
                    className={`alert-circular-icon-wrap ${
                      isCritical
                        ? "icon-critical"
                        : isWarning
                        ? "icon-warning"
                        : "icon-info"
                    }`}
                  >
                    {isCritical ? (
                      <Thermometer size={18} />
                    ) : isWarning ? (
                      <Battery size={18} />
                    ) : (
                      <WifiOff size={18} />
                    )}
                  </div>

                  <div className="alert-row-body">
                    <strong className="alert-row-title">{alert.message}</strong>
                    <div className="alert-row-meta">
                      <span>{alert.vehicleNo}</span>
                      <span className="meta-dot">•</span>
                      <span>{alert.time}</span>
                    </div>
                  </div>
                </div>

                <div className="alert-row-action">
                  <span className="view-link-text">View</span>
                  <ChevronRight size={16} className="view-chevron" />
                  {onDismissAlert && (
                    <button
                      type="button"
                      className="alert-row-dismiss-btn"
                      title="Dismiss alert"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDismissAlert(alert.id);
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
