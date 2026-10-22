import React, { useState } from "react";
import {
  LayoutDashboard, Truck, Activity, FileText, Bell, Settings,
  X, Radio, Binary, Layers, Cpu, ShieldCheck, ChevronDown, ChevronRight
} from "lucide-react";
import hauloopLogo from "../assets/hauloop-logo.png";

export default function Sidebar({
  page,
  setPage,
  open,
  setOpen,
  unreadAlertsCount = 0
}) {
  const [labOpen, setLabOpen] = useState(false);

  const PRIMARY_NAV = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "vehicles", label: "Vehicles", icon: Truck },
    { id: "diagnostics", label: "Diagnostics", icon: Activity },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "alerts", label: "Alerts", icon: Bell, badge: unreadAlertsCount },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const ADVANCED_CAN_NAV = [
    { id: "can-monitor", label: "CAN Bus Monitor", icon: Radio },
    { id: "can-analyzer", label: "CAN Protocol Analyzer", icon: Binary },
    { id: "avl-mapping", label: "AVL Element Mapping", icon: Layers },
    { id: "devices", label: "FMC650 Hardware Fleet", icon: Cpu }
  ];

  const handleNavClick = (id) => {
    setPage(id);
    if (setOpen) setOpen(false);
  };

  return (
    <>
      {/* Mobile Scrim Backdrop */}
      {open && (
        <div
          className="hl-sidebar-scrim"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <aside className={`hl-sidebar-root ${open ? "hl-sidebar-open" : ""}`}>
        {/* Brand Header */}
        <div className="hl-sidebar-brand-row">
          <div className="hl-sidebar-logo-wrap clickable" onClick={() => handleNavClick("dashboard")}>
            <img src={hauloopLogo} alt="hauloop vehicle care" className="hl-sidebar-logo-img" />
          </div>
          {open && (
            <button
              className="hl-sidebar-close-btn"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Primary Navigation matching Panel 2 */}
        <nav className="hl-sidebar-nav">
          {PRIMARY_NAV.map((item) => {
            const Icon = item.icon;
            const isActive =
              page === item.id ||
              (item.id === "vehicles" && page === "vehicle-details");

            return (
              <button
                key={item.id}
                className={`hl-nav-item ${isActive ? "active" : ""}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={18} className="hl-nav-icon" />
                <span className="hl-nav-label">{item.label}</span>
                {item.badge > 0 && (
                  <span className="hl-nav-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Secondary Accordion: Advanced FMC650 CAN Lab (from cloned repo) */}
        <div className="hl-sidebar-extra-section">
          <button
            className="hl-accordion-toggle"
            onClick={() => setLabOpen(!labOpen)}
          >
            <span className="extra-section-title">CAN Telematics Lab</span>
            {labOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {labOpen && (
            <div className="hl-accordion-menu">
              {ADVANCED_CAN_NAV.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = page === sub.id;
                return (
                  <button
                    key={sub.id}
                    className={`hl-subnav-item ${isSubActive ? "active" : ""}`}
                    onClick={() => handleNavClick(sub.id)}
                  >
                    <SubIcon size={15} />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Footer Info */}
        <div className="hl-sidebar-footer">
          <div className="telematics-chip">
            <span className="live-pulse-dot" />
            <div className="chip-text">
              <strong>FMC650 J1939 Active</strong>
              <small>Codec 8E · 250 kbps</small>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}