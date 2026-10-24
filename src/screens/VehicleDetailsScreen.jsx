import React, { useState } from "react";
import {
  ArrowLeft, Edit3, FileText, Activity, Battery, Thermometer,
  Fuel, Gauge, MapPin, ArrowRight, ExternalLink, Eye, X, Check, CheckCircle2,
  Download, AlertTriangle, ShieldCheck
} from "lucide-react";
import truckHeroImg from "../assets/hauloop-truck.png";
import LiveLocationScreen from "./LiveLocationScreen.jsx";
import DiagnosticsScreen from "./DiagnosticsScreen.jsx";
import { getVehicleHealthReportData } from "./ReportsScreen.jsx";
import { generateVehicleHealthReportPdf } from "../lib/pdfReportGenerator.js";

export default function VehicleDetailsScreen({
  vehicle,
  onBack,
  setPage,
  initialSubTab = "overview",
  onUpdateVehicle
}) {
  const [subTab, setSubTab] = useState(initialSubTab);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState(null);

  const [editForm, setEditForm] = useState({
    vehicleNo: "",
    makeModel: "",
    driver: "",
    driverPhone: "",
    status: "Healthy",
    engineStatus: "Normal",
    batteryStatus: "Good",
    year: 2024,
    fuelLevel: 75,
    locationName: "",
    vin: ""
  });



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

  const handleOpenEdit = () => {
    setEditForm({
      vehicleNo: vehicle.vehicleNo || "",
      makeModel: vehicle.makeModel || "",
      driver: vehicle.driver || "",
      driverPhone: vehicle.driverPhone || "+91 98421 11234",
      status: vehicle.status || "Healthy",
      engineStatus: vehicle.engineStatus || "Normal",
      batteryStatus: vehicle.batteryStatus || "Good",
      year: vehicle.year || 2024,
      fuelLevel: vehicle.fuelLevel !== undefined ? vehicle.fuelLevel : 75,
      locationName: vehicle.locationName || "Coimbatore, Tamil Nadu",
      vin: vehicle.vin || ""
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editForm.vehicleNo.trim()) return;

    const updatedVehicle = {
      ...vehicle,
      vehicleNo: editForm.vehicleNo.trim().toUpperCase(),
      makeModel: editForm.makeModel.trim() || vehicle.makeModel,
      make: editForm.makeModel.split(" ")[0] || vehicle.make,
      model: editForm.makeModel.split(" ").slice(1).join(" ") || vehicle.model,
      driver: editForm.driver.trim() || vehicle.driver,
      driverPhone: editForm.driverPhone.trim() || vehicle.driverPhone,
      status: editForm.status,
      engineStatus: editForm.engineStatus,
      batteryStatus: editForm.batteryStatus,
      year: parseInt(editForm.year) || vehicle.year,
      fuelLevel: Number(editForm.fuelLevel),
      locationName: editForm.locationName.trim() || vehicle.locationName,
      vin: editForm.vin.trim() || vehicle.vin,
      lastUpdated: "Just now"
    };

    if (onUpdateVehicle) {
      onUpdateVehicle(updatedVehicle);
    }

    setShowEditModal(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleDownloadPdf = async () => {
    try {
      const rep = getVehicleHealthReportData(vehicle);
      await generateVehicleHealthReportPdf(rep);
      setDownloadMsg(`Diagnostic Health Report PDF for ${vehicle.vehicleNo} downloaded!`);
      setTimeout(() => setDownloadMsg(null), 4000);
    } catch (e) {
      console.error("PDF generation failed:", e);
    }
  };

  const isNeedAttention = vehicle.status === "Need Attention" || vehicle.status === "Attention";
  const isOffline = vehicle.status === "Offline";

  return (
    <div className="vehicle-details-screen-container">
      {/* Success Notification Banner */}
      {saveSuccess && (
        <div className="hl-toast-banner-success">
          <CheckCircle2 size={18} />
          <span>Vehicle information updated successfully!</span>
        </div>
      )}

      {/* PDF Download Notification Banner */}
      {downloadMsg && (
        <div className="hl-toast-banner-success">
          <CheckCircle2 size={18} />
          <span>{downloadMsg}</span>
        </div>
      )}

      {/* 4. Top Header Bar matching Screen 4 */}
      <div className="vehicle-details-topbar-actions">
        <button className="back-nav-btn" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Vehicle Details</span>
        </button>

        <div className="details-header-action-btns">
          <button
            type="button"
            className="hl-btn-outline-edit"
            onClick={handleOpenEdit}
            title="Edit vehicle details"
          >
            <Edit3 size={15} />
            <span>Edit</span>
          </button>
          <button
            type="button"
            className="hl-btn-secondary"
            onClick={handleDownloadPdf}
            title="Download PDF Diagnostic Report"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Download size={15} />
            <span>PDF</span>
          </button>
          <button
            className="hl-btn-primary"
            onClick={() => setShowReportModal(true)}
            title="Open Vehicle Health Diagnostic Report"
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
                <div className={`status-row-icon ${vehicle.engineStatus === "Normal" ? "icon-green" : (vehicle.engineStatus === "Offline" ? "icon-offline" : "icon-warning")}`}><Activity size={18} /></div>
                <span className="status-row-label">Engine</span>
                <span className={`status-row-val ${vehicle.engineStatus === "Normal" ? "text-green" : (vehicle.engineStatus === "Offline" ? "text-muted" : "text-amber")}`}>{vehicle.engineStatus || "Normal"}</span>
              </div>
              <div className="status-row-item">
                <div className={`status-row-icon ${vehicle.batteryStatus === "Good" ? "icon-green" : (vehicle.batteryStatus === "Offline" ? "icon-offline" : "icon-warning")}`}><Battery size={18} /></div>
                <span className="status-row-label">Battery</span>
                <span className={`status-row-val ${vehicle.batteryStatus === "Good" ? "text-green" : (vehicle.batteryStatus === "Offline" ? "text-muted" : "text-amber")}`}>{vehicle.batteryStatus || "Good"}</span>
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
      {subTab === "diagnostics" && (() => {
        const rep = getVehicleHealthReportData(vehicle);
        return (
          <div className="hl-card">
            <div className="hl-card-header">
              <div>
                <h3 className="hl-card-title">ECU Fault Diagnostics · {vehicle.vehicleNo}</h3>
                <p className="hl-card-subtitle">Active and historical DTCs for {vehicle.vehicleNo}</p>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="hl-btn-secondary"
                  onClick={() => setShowReportModal(true)}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <Eye size={15} />
                  <span>View Diagnostic Report</span>
                </button>
                <button
                  type="button"
                  className="hl-btn-primary"
                  onClick={() => setPage("diagnostics")}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <span>Open Diagnostics Lab</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {rep.faultCodes.length === 0 ? (
              <div style={{ padding: "14px 18px", background: "rgba(22, 163, 74, 0.08)", borderRadius: "8px", border: "1px solid rgba(22, 163, 74, 0.2)", display: "flex", alignItems: "center", gap: "10px", color: "#16a34a" }}>
                <CheckCircle2 size={20} />
                <div>
                  <strong style={{ display: "block", fontSize: "14px" }}>0 Active Faults Detected</strong>
                  <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#475569" }}>
                    No pending critical DTC faults in ECU memory for {vehicle.vehicleNo}. All powertrain sensors are within nominal SAE J1939 operating tolerances.
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ padding: "12px 16px", background: "rgba(245, 158, 11, 0.08)", borderRadius: "8px", border: "1px solid rgba(245, 158, 11, 0.25)", display: "flex", alignItems: "center", gap: "10px", color: "#d97706" }}>
                  <AlertTriangle size={20} />
                  <div>
                    <strong style={{ display: "block", fontSize: "14px" }}>{rep.faultCodes.length} Active DTC Fault(s) Logged</strong>
                    <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#475569" }}>
                      {rep.summary}
                    </p>
                  </div>
                </div>

                <div className="fault-codes-list" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {rep.faultCodes.map((f, i) => (
                    <div key={i} style={{ borderLeft: "4px solid #f59e0b", padding: "12px 14px", background: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong style={{ color: "#d97706", fontFamily: "monospace", fontSize: "14px" }}>{f.code}</strong>
                        <span className="status-pill badge-attention">{f.status}</span>
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#334155" }}>{f.description}</p>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "4px", padding: "12px 14px", background: "#f1f5f9", borderRadius: "6px", fontSize: "13px", color: "#334155" }}>
                  <strong>Recommended Action:</strong> {rep.summaryForCustomer}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Tab 4: HISTORY */}
      {subTab === "history" && (
        <div className="hl-card trip-history-card">
          <div className="hl-card-header">
            <h3 className="hl-card-title">Recent Trips & Routes</h3>
          </div>
          <div className="table-responsive trip-history-table-wrap">
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
        </div>
      )}

      {/* Edit Vehicle Modal Dialog */}
      {showEditModal && (
        <div className="hl-modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="hl-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="hl-modal-header">
              <div className="modal-header-icon-title">
                <Edit3 size={18} className="text-primary" />
                <h3 className="modal-title">Edit Vehicle Details</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowEditModal(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="modal-form">
              <div className="form-group">
                <label>Vehicle Registration Number *</label>
                <input
                  type="text"
                  value={editForm.vehicleNo}
                  onChange={(e) => setEditForm({ ...editForm, vehicleNo: e.target.value })}
                  required
                  placeholder="e.g. TN 38 AB 4821"
                />
              </div>

              <div className="form-group">
                <label>Make & Model *</label>
                <input
                  type="text"
                  value={editForm.makeModel}
                  onChange={(e) => setEditForm({ ...editForm, makeModel: e.target.value })}
                  required
                  placeholder="e.g. Ashok Leyland 3520"
                />
              </div>

              <div className="form-row edit-modal-row">
                <div className="form-group">
                  <label>Assigned Driver</label>
                  <input
                    type="text"
                    value={editForm.driver}
                    onChange={(e) => setEditForm({ ...editForm, driver: e.target.value })}
                    placeholder="e.g. Ramesh"
                  />
                </div>

                <div className="form-group">
                  <label>Driver Phone Number</label>
                  <input
                    type="tel"
                    value={editForm.driverPhone}
                    onChange={(e) => setEditForm({ ...editForm, driverPhone: e.target.value })}
                    placeholder="+91 98421 11234"
                  />
                </div>
              </div>

              <div className="form-row edit-modal-row">
                <div className="form-group">
                  <label>Operational Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setEditForm((prev) => {
                        let eng = prev.engineStatus;
                        let batt = prev.batteryStatus;
                        if (newStatus === "Healthy") {
                          eng = "Normal";
                          batt = "Good";
                        } else if (newStatus === "Offline") {
                          eng = "Offline";
                          batt = "Offline";
                        } else if (newStatus === "Need Attention" && eng === "Normal" && batt === "Good") {
                          eng = "Need Attention";
                        }
                        return { ...prev, status: newStatus, engineStatus: eng, batteryStatus: batt };
                      });
                    }}
                  >
                    <option value="Healthy">Healthy</option>
                    <option value="Need Attention">Need Attention</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Fuel Level (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editForm.fuelLevel}
                    onChange={(e) => setEditForm({ ...editForm, fuelLevel: e.target.value })}
                  />
                </div>
              </div>

              {/* Engine Status & Battery Status (Request 2) */}
              <div className="form-row edit-modal-row">
                <div className="form-group">
                  <label>Engine Status</label>
                  <select
                    value={editForm.engineStatus}
                    onChange={(e) => {
                      const newEng = e.target.value;
                      setEditForm((prev) => {
                        let st = prev.status;
                        if (newEng !== "Normal" && st === "Healthy") st = "Need Attention";
                        return { ...prev, engineStatus: newEng, status: st };
                      });
                    }}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Check Engine">Check Engine</option>
                    <option value="Need Attention">Need Attention</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Battery Status</label>
                  <select
                    value={editForm.batteryStatus}
                    onChange={(e) => {
                      const newBatt = e.target.value;
                      setEditForm((prev) => {
                        let st = prev.status;
                        if (newBatt !== "Good" && st === "Healthy") st = "Need Attention";
                        return { ...prev, batteryStatus: newBatt, status: st };
                      });
                    }}
                  >
                    <option value="Good">Good</option>
                    <option value="Need Attention">Need Attention</option>
                    <option value="Low Voltage">Low Voltage</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Depot / Current Location</label>
                <input
                  type="text"
                  value={editForm.locationName}
                  onChange={(e) => setEditForm({ ...editForm, locationName: e.target.value })}
                  placeholder="e.g. Coimbatore Depot, Tamil Nadu"
                />
              </div>

              <div className="form-group">
                <label>VIN / Chassis Number</label>
                <input
                  type="text"
                  value={editForm.vin}
                  onChange={(e) => setEditForm({ ...editForm, vin: e.target.value })}
                  placeholder="e.g. MB1AA2K31L8765432"
                />
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="hl-btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="hl-btn-primary">
                  <Check size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Interactive Vehicle Health Report Modal */}
      {showReportModal && (() => {
        const rep = getVehicleHealthReportData(vehicle);
        return (
          <div className="auth-modal-overlay" onClick={() => setShowReportModal(false)}>
            <div className="report-viewer-modal-card" onClick={(e) => e.stopPropagation()}>
              {/* Modal Top Header */}
              <div className="report-modal-header">
                <div className="report-modal-header-titles">
                  <div className="report-brand-badge">
                    <span className="brand-dot" />
                    <span>HAULOOP VEHICLE CARE</span>
                  </div>
                  <h3 className="report-modal-main-title">Vehicle Health Diagnostic Report</h3>
                  <div className="report-id-subline">
                    <span>Report ID: <strong>{rep.reportId}</strong></span>
                    <span className="dot-sep">•</span>
                    <span>Vehicle: <strong>{rep.vehicleNo}</strong> ({rep.model})</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="auth-modal-close-btn"
                  onClick={() => setShowReportModal(false)}
                  aria-label="Close report viewer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Report Scrollable Body */}
              <div className="report-modal-scroll-body">
                {/* 1. Header Metadata Box */}
                <div className="report-view-meta-box">
                  <div className="meta-item">
                    <span className="meta-lbl">Generated On:</span>
                    <span className="meta-val">{rep.generatedOn}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-lbl">Report Period:</span>
                    <span className="meta-val">{rep.reportPeriod}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-lbl">Overall Vehicle Status:</span>
                    <span className={`status-pill ${
                      rep.overallStatus === "Healthy" ? "badge-healthy" :
                      rep.overallStatus === "Critical" ? "badge-offline" : "badge-attention"
                    }`}>
                      {rep.overallStatus}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-lbl">Assessment:</span>
                    <span className={`status-pill ${
                      rep.assessment === "Healthy" ? "badge-healthy" :
                      rep.assessment === "Inspection Required" ? "badge-offline" : "badge-attention"
                    }`}>
                      {rep.assessment}
                    </span>
                  </div>
                </div>

                {/* 2. Customer Summary */}
                <div className="report-view-section">
                  <h4 className="report-view-sec-title">Summary</h4>
                  <div className="report-view-text-card">
                    {rep.summary}
                  </div>
                </div>

                {/* 3. Issue Explanation */}
                <div className="report-view-section">
                  <h4 className="report-view-sec-title">Issue Explanation</h4>
                  <div className="report-view-text-card">
                    {rep.issueExplanation}
                  </div>
                </div>

                {/* 4. Monitored Parameters */}
                <div className="report-view-section">
                  <h4 className="report-view-sec-title">Monitored SAE J1939 Telemetry Parameters</h4>
                  <div className="table-responsive">
                    <table className="hl-table report-params-table">
                      <thead>
                        <tr>
                          <th>Parameter</th>
                          <th>Live Telemetry Value</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rep.supportedParameters.map((p, i) => (
                          <tr key={i} className={p.warning ? "row-warning" : ""}>
                            <td><strong>{p.name}</strong></td>
                            <td><code>{p.value}</code></td>
                            <td>
                              <span className={`status-pill ${p.warning ? "badge-attention" : (p.status === "Supported" ? "badge-healthy" : "badge-unavailable")}`}>
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 5. Active DTCs */}
                <div className="report-view-section">
                  <h4 className="report-view-sec-title">Active Fault Codes (Technical Appendix)</h4>
                  {rep.faultCodes.length === 0 ? (
                    <div className="report-view-text-card clean-status-card" style={{ display: "flex", alignItems: "center", gap: "8px", color: "#16a34a" }}>
                      <CheckCircle2 size={18} />
                      <span>Zero active fault codes logged in ECU diagnostic freeze frames.</span>
                    </div>
                  ) : (
                    <div className="fault-codes-list" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {rep.faultCodes.map((f, i) => (
                        <div key={i} style={{ borderLeft: "4px solid #f59e0b", padding: "10px 14px", background: "rgba(245, 158, 11, 0.06)", borderRadius: "6px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <strong style={{ color: "#d97706", fontFamily: "monospace" }}>{f.code}</strong>
                            <span className="status-pill badge-attention">{f.status}</span>
                          </div>
                          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#334155" }}>{f.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 6. Recommended Action */}
                <div className="report-view-section">
                  <h4 className="report-view-sec-title">Summary & Recommended Action</h4>
                  <div className="report-view-text-card highlight-action-box" style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "12px 16px" }}>
                    <p style={{ margin: 0, fontSize: "13.5px", lineHeight: "1.5" }}>{rep.summaryForCustomer}</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="report-modal-footer">
                <button
                  type="button"
                  className="hl-btn-secondary"
                  onClick={() => {
                    setShowReportModal(false);
                    setPage("reports");
                  }}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <ExternalLink size={15} />
                  <span>Open in Fleet Reports</span>
                </button>
                <button
                  type="button"
                  className="hl-btn-primary hl-btn-download"
                  onClick={() => generateVehicleHealthReportPdf(rep)}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <Download size={16} />
                  <span>Download PDF Report</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
