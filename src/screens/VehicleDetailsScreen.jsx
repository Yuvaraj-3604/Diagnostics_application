import React, { useState } from "react";
import {
  ArrowLeft, Edit3, FileText, Activity, Battery, Thermometer,
  Fuel, Gauge, MapPin, ArrowRight, ExternalLink, Eye
} from "lucide-react";
import truckHeroImg from "../assets/hauloop-truck.png";
import LiveLocationScreen from "./LiveLocationScreen.jsx";
import DiagnosticsScreen from "./DiagnosticsScreen.jsx";

export default function VehicleDetailsScreen({
  vehicle,
  onBack,
  setPage,
  initialSubTab = "overview"
}) {
  const [subTab, setSubTab] = useState(initialSubTab);

  if (!vehicle) {
    return (
      <div className="vehicle-details-empty">
        <p>No vehicle selected.</p>
        <button className="hl-btn-primary" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to vehicles</span>
        </button>
      </div>
    );
  }

  const isNeedAttention = vehicle.status === "Need Attention" || vehicle.status === "Attention";
  const isOffline = vehicle.status === "Offline";

  return (
    <div className="vehicle-details-screen-container">
      {/* 4. Top Header Bar matching Screen 4 */}
      <div className="vehicle-details-topbar-actions">
        <button className="back-nav-btn" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Vehicle Details</span>
        </button>

        <div className="details-header-action-btns">
          <button className="hl-btn-outline-edit">
            <Edit3 size={15} />
            <span>Edit</span>
          </button>
          <button
            className="hl-btn-primary"
            onClick={() => setPage("reports")}
            title="Open Vehicle Health Report"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Eye size={15} />
            <span>View Report</span>
          </button>
        </div>
      </div>

      {/* Vehicle Hero Header Card matching Screen 4 */}
      <div className="hl-card vehicle-hero-summary-card">
        <div className="hero-summary-grid">
          {/* Left: Red Truck Photo */}
          <div className="hero-truck-thumbnail-box">
            <img
              src={truckHeroImg}
              alt={vehicle.makeModel}
              className="hero-truck-image"
            />
          </div>

          {/* Right: Key Identification & Status */}
          <div className="hero-summary-info">
            <div className="hero-plate-row">
              <h2 className="hero-plate-text">{vehicle.vehicleNo}</h2>
              <span className={`status-pill ${isOffline ? "pill-offline" : (isNeedAttention ? "pill-attention" : "pill-healthy")}`}>
                <span className="status-dot" />
                <span>{vehicle.status}</span>
              </span>
            </div>

            <div className="hero-model-title">{vehicle.makeModel}</div>

            <div className="hero-meta-strip">
              <span className="hero-meta-item">Last updated: {vehicle.lastUpdated}</span>
              <span className="hero-meta-dot">•</span>
              <span className="hero-meta-item">Driver: {vehicle.driver}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Tabs matching Screen 4: Overview | Live Data | Diagnostics | History */}
      <div className="vehicle-subtabs-nav">
        <button
          className={`subtab-btn ${subTab === "overview" ? "active" : ""}`}
          onClick={() => setSubTab("overview")}
        >
          Overview
        </button>
        <button
          className={`subtab-btn ${subTab === "livedata" ? "active" : ""}`}
          onClick={() => setSubTab("livedata")}
        >
          Live Data
        </button>
        <button
          className={`subtab-btn ${subTab === "diagnostics" ? "active" : ""}`}
          onClick={() => setSubTab("diagnostics")}
        >
          Diagnostics
        </button>
        <button
          className={`subtab-btn ${subTab === "history" ? "active" : ""}`}
          onClick={() => setSubTab("history")}
        >
          History
        </button>
      </div>

      {/* ========================================================= */}
      {/* Tab 1: OVERVIEW (3 Cards Side-by-Side matching Screen 4)    */}
      {/* ========================================================= */}
      {subTab === "overview" && (
        <div className="overview-three-cards-grid">
          {/* Card 1: Vehicle Info */}
          <div className="hl-card overview-card">
            <h3 className="overview-card-title">Vehicle Info</h3>
            <div className="info-keyval-list">
              <div className="keyval-row">
                <span className="keyval-label">Make</span>
                <span className="keyval-value">{vehicle.make || "Ashok Leyland"}</span>
              </div>
              <div className="keyval-row">
                <span className="keyval-label">Model</span>
                <span className="keyval-value">{vehicle.model || "3520"}</span>
              </div>
              <div className="keyval-row">
                <span className="keyval-label">Year</span>
                <span className="keyval-value">{vehicle.year || 2024}</span>
              </div>
              <div className="keyval-row">
                <span className="keyval-label">Fuel Type</span>
                <span className="keyval-value">{vehicle.fuelType || "Diesel"}</span>
              </div>
              <div className="keyval-row">
                <span className="keyval-label">VIN</span>
                <span className="keyval-value mono">{vehicle.vin || "MB1AA2K31L8765432"}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Current Status */}
          <div className="hl-card overview-card">
            <h3 className="overview-card-title">Current Status</h3>
            <div className="status-keyval-list">
              <div className="status-row-item">
                <div className="status-row-icon icon-green"><Activity size={18} /></div>
                <span className="status-row-label">Engine</span>
                <span className="status-row-val text-green">{vehicle.engineStatus || "Normal"}</span>
              </div>
              <div className="status-row-item">
                <div className="status-row-icon icon-green"><Battery size={18} /></div>
                <span className="status-row-label">Battery</span>
                <span className={`status-row-val ${isNeedAttention ? "text-amber" : "text-green"}`}>{vehicle.batteryStatus || "Good"}</span>
              </div>
              <div className="status-row-item">
                <div className="status-row-icon icon-green"><Thermometer size={18} /></div>
                <span className="status-row-label">Coolant</span>
                <span className="status-row-val text-green">{vehicle.tempStatus || "Normal"}</span>
              </div>
              <div className="status-row-item">
                <div className="status-row-icon icon-blue"><Fuel size={18} /></div>
                <span className="status-row-label">Fuel Level</span>
                <span className="status-row-val">{vehicle.fuelLevel || 68}%</span>
              </div>
              <div className="status-row-item">
                <div className="status-row-icon icon-slate"><Gauge size={18} /></div>
                <span className="status-row-label">Odometer</span>
                <span className="status-row-val">{vehicle.odometer || "42,580 km"}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Location */}
          <div className="hl-card overview-card location-card">
            <h3 className="overview-card-title">Location</h3>

            {/* Mini Map Graphic Preview with Red Pin matching Screen 4 */}
            <div className="mini-map-preview-box clickable" onClick={() => setSubTab("location")}>
              <div className="mini-map-tile-bg">
                <div className="mini-map-roads" />
                <div className="mini-map-route-line" />
                <div className="mini-map-pin-pulse">
                  <div className="mini-pin-dot" />
                  <MapPin size={24} className="mini-pin-icon" />
                </div>
              </div>
            </div>

            <div className="location-meta-details">
              <strong className="location-name-bold">{vehicle.locationName || "Coimbatore, Tamil Nadu"}</strong>
              <span className="location-seen-time">Last seen: {vehicle.lastSeen || "2 min ago"}</span>
              <button
                className="location-view-map-link"
                onClick={() => setPage("location")}
              >
                <span>View on Map</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: LIVE DATA */}
      {subTab === "livedata" && (
        <div className="hl-card">
          <div className="hl-card-header">
            <div>
              <h3 className="hl-card-title">Live Telematics Feed for {vehicle.vehicleNo}</h3>
              <p className="hl-card-subtitle">Real-time CAN stream updates from FMC650 unit</p>
            </div>
            <span className="live-stream-badge">
              <span className="live-pulse-dot" />
              Ingestion Active
            </span>
          </div>

          <div className="live-gauges-cluster">
            <div className="gauge-metric-card">
              <div className="gauge-icon"><Activity size={20} /></div>
              <div className="gauge-val">{vehicle.engineRpm || 1450} <small>RPM</small></div>
              <div className="gauge-name">Engine Speed</div>
            </div>
            <div className="gauge-metric-card">
              <div className="gauge-icon"><Gauge size={20} /></div>
              <div className="gauge-val">{vehicle.currentSpeed || 62} <small>km/h</small></div>
              <div className="gauge-name">Vehicle Speed</div>
            </div>
            <div className="gauge-metric-card">
              <div className="gauge-icon"><Thermometer size={20} /></div>
              <div className="gauge-val">{vehicle.coolantTemp || "82 °C"}</div>
              <div className="gauge-name">Coolant Temperature</div>
            </div>
            <div className="gauge-metric-card">
              <div className="gauge-icon"><Battery size={20} /></div>
              <div className="gauge-val">{vehicle.batteryVoltage || "26.4 V"}</div>
              <div className="gauge-name">Battery Voltage</div>
            </div>
            <div className="gauge-metric-card">
              <div className="gauge-icon"><Fuel size={20} /></div>
              <div className="gauge-val">{vehicle.fuelLevel || 68}%</div>
              <div className="gauge-name">Fuel Level</div>
            </div>
            <div className="gauge-metric-card">
              <div className="gauge-icon"><Activity size={20} /></div>
              <div className="gauge-val">{vehicle.fuelRate || "18.5 L/h"}</div>
              <div className="gauge-name">Fuel Consumption Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: DIAGNOSTICS */}
      {subTab === "diagnostics" && (
        <div className="hl-card">
          <div className="hl-card-header">
            <div>
              <h3 className="hl-card-title">ECU Fault Diagnostics</h3>
              <p className="hl-card-subtitle">Active and historical DTCs for {vehicle.vehicleNo}</p>
            </div>
            <button className="hl-btn-primary" onClick={() => setPage("diagnostics")}>
              <span>Open Diagnostics Lab</span>
              <ArrowRight size={15} />
            </button>
          </div>
          <p style={{ color: "#64748b", fontSize: 13.5 }}>
            No pending critical DTC faults in ECU memory for {vehicle.vehicleNo}. All powertrain sensors are within nominal SAE J1939 operating tolerances.
          </p>
        </div>
      )}

      {/* Tab 4: HISTORY */}
      {subTab === "history" && (
        <div className="hl-card trip-history-card">
          <div className="hl-card-header">
            <h3 className="hl-card-title">Recent Trips & Routes</h3>
          </div>
          <table className="hl-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Route</th>
                <th>Distance</th>
                <th>Travel Time</th>
                <th>Fuel Used</th>
                <th>Avg Speed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>21 Oct 2026</td>
                <td>Coimbatore Depot → Perundurai SIPCOT</td>
                <td>84 km</td>
                <td>2h 15m</td>
                <td>18.5 L</td>
                <td>52 km/h</td>
              </tr>
              <tr>
                <td>20 Oct 2026</td>
                <td>Tiruppur Hub → Coimbatore Logistics Yard</td>
                <td>68 km</td>
                <td>1h 45m</td>
                <td>15.2 L</td>
                <td>49 km/h</td>
              </tr>
              <tr>
                <td>19 Oct 2026</td>
                <td>Salem Freight Gateway → Tiruppur</td>
                <td>92 km</td>
                <td>2h 30m</td>
                <td>20.0 L</td>
                <td>51 km/h</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
