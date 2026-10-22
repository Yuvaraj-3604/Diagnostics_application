import React, { useState } from "react";
import {
  Search, Bell, ChevronDown, User, LogOut, Settings,
  Menu, X, CheckCircle2, AlertTriangle, WifiOff, ArrowRight
} from "lucide-react";
import hauloopLogo from "../assets/hauloop-logo.png";

export default function Topbar({
  page,
  setPage,
  setOpenSidebar,
  currentUser,
  onLogout,
  searchQuery,
  setSearchQuery,
  alerts = []
}) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);

  const userName = currentUser?.fullName?.split(" ")[0] || "Yuvaraj";
  const userEmail = currentUser?.email || "yuvaraj@example.com";
  const unreadAlertsCount = alerts.length;

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
            onClick={() => {
              setShowAlertsDropdown(!showAlertsDropdown);
              setShowUserDropdown(false);
            }}
            aria-label="Notifications"
          >
            <Bell size={19} />
            {unreadAlertsCount > 0 && (
              <span className="hl-bell-badge">{unreadAlertsCount}</span>
            )}
          </button>

          {/* Alerts Dropdown Popover */}
          {showAlertsDropdown && (
            <div className="hl-dropdown-menu alerts-dropdown">
              <div className="dropdown-header">
                <span className="dropdown-title">Fleet Notifications</span>
                <span className="badge-count">{alerts.length} New</span>
              </div>
              <div className="alerts-preview-list">
                {alerts.slice(0, 4).map((alert) => (
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

        {/* User Profile Badge (Panel 2: YP circle + Yuvaraj + chevron) */}
        <div className="hl-user-profile-wrapper">
          <button
            className="hl-user-profile-btn"
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowAlertsDropdown(false);
            }}
          >
            <div className="hl-avatar-circle">
              <span>YP</span>
            </div>
            <span className="hl-user-name">{userName}</span>
            <ChevronDown size={15} className="hl-chevron-icon" />
          </button>

          {/* User Profile Menu */}
          {showUserDropdown && (
            <div className="hl-dropdown-menu user-dropdown">
              <div className="user-dropdown-header">
                <strong className="user-name-bold">{currentUser?.fullName || "Yuvaraj Perumal"}</strong>
                <span className="user-email-text">{userEmail}</span>
                <span className="user-role-badge">Fleet Administrator</span>
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