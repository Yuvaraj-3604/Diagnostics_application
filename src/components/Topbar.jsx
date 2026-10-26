import React, { useState } from "react";
import {
  Search, Bell, ChevronDown, User, LogOut, Settings,
  Menu, X, CheckCircle2, AlertTriangle, WifiOff, ArrowRight
} from "lucide-react";
import hauloopLogo from "../assets/hauloop-logo.png";

// Curated harmonious avatar palette
export const AVATAR_COLORS = [
  "#e5252a", // Crimson
  "#4f46e5", // Indigo
  "#0d9488", // Teal
  "#d97706", // Amber
  "#7c3aed", // Violet
  "#0284c7", // Sky blue
  "#16a34a", // Emerald
  "#db2777"  // Rose pink
];

// Helper to derive initials from user name
export function getInitials(name) {
  if (!name || typeof name !== "string") return "U";
  const clean = name.trim();
  if (!clean) return "U";
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, Math.min(2, clean.length)).toUpperCase();
}

// Deterministic color assignment based on name
export function getAvatarColor(name) {
  if (!name || typeof name !== "string") return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export default function Topbar({
  page,
  setPage,
  setOpenSidebar,
  currentUser,
  onLogout,
  searchQuery,
  setSearchQuery,
  alerts = [],
  onClearAllAlerts,
  onDismissAlert
}) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);

  const fullDisplayName = currentUser?.fullName || currentUser?.name || currentUser?.username || "Yuvaraj Perumal";
  const userName = fullDisplayName.split(" ")[0];
  const userInitials = getInitials(fullDisplayName);
  const avatarBg = getAvatarColor(fullDisplayName);
  const userEmail = currentUser?.email || "yuvaraj@example.com";
  const unreadAlertsCount = alerts.length;

  const handleToggleAlerts = () => {
    // If notifications are cleared (alerts.length === 0), do NOT display the popup
    if (alerts.length === 0) {
      setShowAlertsDropdown(false);
      return;
    }
    setShowAlertsDropdown((prev) => !prev);
    setShowUserDropdown(false);
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    if (onClearAllAlerts) {
      onClearAllAlerts();
    }
    setShowAlertsDropdown(false);
  };

  const handleDismissSingleAlert = (e, alertId) => {
    e.stopPropagation();
    if (onDismissAlert) {
      onDismissAlert(alertId);
    }
    if (alerts.length <= 1) {
      setShowAlertsDropdown(false);
    }
  };

  return (
    <header className="hl-topbar-root">
      {/* Left: Mobile Menu Trigger + Brand Logo */}
      <div className="hl-topbar-left">
        <button
          className="hl-mobile-menu-btn"
          onClick={() => setOpenSidebar(true)}
          aria-label="Open Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div className="hl-topbar-brand mobile-only-logo clickable" onClick={() => setPage("dashboard")}>
          <img src={hauloopLogo} alt="hauloop vehicle care" className="hl-topbar-logo" />
        </div>
      </div>

      {/* Center: Global Search Input matching Panel 2 */}
      <div className="hl-topbar-search">
        <div className="hl-search-input-box">
          <Search size={17} className="hl-search-icon" />
          <input
            type="text"
            className="hl-search-input"
            placeholder="Search vehicle, number or driver..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (page !== "vehicles") {
                setPage("vehicles");
              }
            }}
          />
          {searchQuery && (
            <button
              className="hl-search-clear-btn"
              onClick={() => setSearchQuery("")}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Right: Actions, Notifications & Profile Badge */}
      <div className="hl-topbar-right">
        {/* Notification Bell with Badge */}
        <div className="hl-notify-wrapper">
          <button
            className="hl-icon-btn hl-bell-btn"
            onClick={handleToggleAlerts}
            aria-label="Notifications"
            title={unreadAlertsCount > 0 ? `${unreadAlertsCount} unread notifications` : "No notifications"}
          >
            <Bell size={19} />
            {unreadAlertsCount > 0 && (
              <span className="hl-bell-badge">{unreadAlertsCount}</span>
            )}
          </button>

          {/* Alerts Dropdown Popover (Only displays if there are active notifications) */}
          {showAlertsDropdown && alerts.length > 0 && (
            <div className="hl-dropdown-menu alerts-dropdown">
              <div className="dropdown-header alerts-dropdown-header">
                <div className="dropdown-title-group">
                  <span className="dropdown-title">Fleet Notifications</span>
                  <span className="badge-count">{alerts.length} New</span>
                </div>
                <button
                  type="button"
                  className="hl-clear-all-btn"
                  onClick={handleClearAll}
                  title="Clear all notifications"
                >
                  Clear all
                </button>
              </div>
              <div className="alerts-preview-list">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="alert-preview-item clickable"
                    onClick={() => {
                      setShowAlertsDropdown(false);
                      setPage("alerts");
                    }}
                  >
                    <div className="alert-dot-indicator" />
                    <div className="alert-preview-text">
                      <div className="alert-prev-veh">{alert.vehicleNo}</div>
                      <div className="alert-prev-msg">{alert.message}</div>
                      <span className="alert-prev-time">{alert.time}</span>
                    </div>
                    <button
                      type="button"
                      className="alert-item-close-btn"
                      title="Dismiss notification"
                      onClick={(e) => handleDismissSingleAlert(e, alert.id)}
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="dropdown-footer">
                <button
                  className="dropdown-footer-btn"
                  onClick={() => {
                    setShowAlertsDropdown(false);
                    setPage("alerts");
                  }}
                >
                  <span>View All Alerts</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge (Dynamic Avatar based on User Name) */}
        <div className="hl-user-profile-wrapper">
          <button
            type="button"
            className="hl-user-profile-btn"
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowAlertsDropdown(false);
            }}
            aria-label="User profile menu"
          >
            <div
              className="hl-avatar-circle"
              style={{ backgroundColor: avatarBg }}
              title={fullDisplayName}
            >
              <span>{userInitials}</span>
            </div>
            <span className="hl-user-name">{userName}</span>
            <ChevronDown size={15} className="hl-chevron-icon" />
          </button>

          {/* User Profile Menu */}
          {showUserDropdown && (
            <div className="hl-dropdown-menu user-dropdown">
              <div className="user-dropdown-header">
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <div
                    className="hl-avatar-circle"
                    style={{ backgroundColor: avatarBg, width: "36px", height: "36px", fontSize: "13px", flexShrink: 0 }}
                  >
                    <span>{userInitials}</span>
                  </div>
                  <div style={{ minWidth: 0, overflow: "hidden" }}>
                    <strong className="user-name-bold" style={{ display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                      {fullDisplayName}
                    </strong>
                    <span className="user-email-text" style={{ display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                      {userEmail}
                    </span>
                  </div>
                </div>
                <span className="user-role-badge">{currentUser?.role || "Fleet Administrator"}</span>
              </div>
              <div className="dropdown-items-group">
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setShowUserDropdown(false);
                    setPage("settings");
                  }}
                >
                  <Settings size={16} />
                  <span>Account Settings</span>
                </button>
                <button
                  className="dropdown-item item-logout"
                  onClick={() => {
                    setShowUserDropdown(false);
                    onLogout();
                  }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}