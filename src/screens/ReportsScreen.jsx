import React, { useState } from "react";
import {
  Download, FileText, CheckCircle2, AlertTriangle, ShieldCheck,
  Truck, Search, ArrowDownToLine, RefreshCw, Filter, Clock, Eye, X
} from "lucide-react";
import truckThumb from "../assets/hauloop-truck.png";
import { generateVehicleHealthReportPdf } from "../lib/pdfReportGenerator.js";

// Standardized Vehicle Health Report data generator with current year 2026
export function getVehicleHealthReportData(vehicle) {
  const vNo = vehicle?.vehicleNo || "TN 38 AB 4821";
  const model = vehicle?.makeModel || `${vehicle?.make || "Commercial"} ${vehicle?.model || "Truck"}`;
  const vin = vehicle?.vin || "MB1AA2K31L8765432";
  const driver = vehicle?.driver || "Assigned Fleet Driver";
  const odo = vehicle?.odometer || "42,580 km";
  const status = vehicle?.status || "Healthy";

  // Tailored report content per vehicle with Year 2026
  if (vNo.includes("1188")) {
    return {
      reportId: "HLP-HLTH-1188",
      generatedOn: "22-Oct-2026, 10:24",
      reportPeriod: "01 Oct 2026 – 22 Oct 2026",
      vehicleNo: vNo,
      model,
      vin,
      driver,
      odometer: odo,
      overallStatus: "Needs Attention",
      vehicleHealth: "Needs Attention",
      summary:
        "The available vehicle data indicates degraded charging circuit performance. One maintenance item requires attention. Please review the recommended action below.",
      issueExplanation:
        "Alternator charging voltage is detected at 21.8 V (nominal range 26.5 V – 28.0 V for 24V commercial vehicle electrical systems). Sustained under-voltage operation may lead to battery deep discharge, ECU communication reboots, or hard cranking in morning shifts.",
      supportedParameters: [
        { name: "Engine RPM", value: "1,120 rpm", status: "Supported" },
        { name: "Vehicle Speed", value: "38 km/h", status: "Supported" },
        { name: "Coolant Temperature", value: "86 °C", status: "Supported" },
        { name: "Battery Voltage", value: "21.8 V", status: "Needs Attention", warning: true },
        { name: "Fuel Level", value: "54%", status: "Supported" },
        { name: "Fuel Rate", value: "16.0 L/h", status: "Supported" },
        { name: "Engine Oil Pressure", value: "3.9 bar", status: "Supported" },
        { name: "Retarder Torque", value: "Unavailable", status: "Unavailable" },
        { name: "Transmission Sump Temp", value: "Unavailable", status: "Unavailable" },
        { name: "DPF Differential Pressure", value: "2.1 kPa", status: "Supported" }
      ],
      faultCodes: [
        { code: "SPN 168 FMI 1", description: "Electrical Potential (Voltage) Below Normal Operating Range", status: "Active" },
        { code: "SPN 158 FMI 0", description: "Key Switch Battery Potential Fluctuation", status: "Pending" }
      ],
      rawCanIds: ["0x0CF00400 (EEC1)", "0x18FEF200 (LFE)", "0x18FEEE00 (ET1)", "0x18FEF700 (VEP)"],
      lastDataReceived: "22-Oct-2026, 10:12 AM",
      connectionStatus: "Online",
      dataFreshness: "Current",
      unavailableParameters: "Retarder Torque, Transmission Sump Temperature",
      reportLimitations:
        "Battery internal chemical impedance estimation is unavailable via standard SAE J1939 telematics; physical carbon pile battery load test recommended at terminal.",
      assessment: "Maintenance Recommended",
      summaryForCustomer:
        "Vehicle TN 72 CD 1188 exhibits low battery charging voltage (21.8 V). The truck remains drivable, but charging performance is compromised. Next recommended step: Schedule electrical system checkup for alternator diode pack, drive belt tension, and battery terminal contacts within 48 hours."
    };
  }

  if (vNo.includes("3377")) {
    return {
      reportId: "HLP-HLTH-3377",
      generatedOn: "22-Oct-2026, 10:24",
      reportPeriod: "01 Oct 2026 – 22 Oct 2026",
      vehicleNo: vNo,
      model,
      vin,
      driver,
      odometer: odo,
      overallStatus: "Critical",
      vehicleHealth: "Critical",
      summary:
        "The connected diagnostic gateway is offline with no live telematics received for over 5 hours. Physical inspection required.",
      issueExplanation:
        "Gateway heartbeat packet timeout detected. Last broadcast telemetry was logged near NH44 bypass corridor. Vehicle battery master isolation switch may have been actuated, or telematics harness was unplugged during maintenance.",
      supportedParameters: [
        { name: "Engine RPM", value: "Unavailable", status: "Unavailable" },
        { name: "Vehicle Speed", value: "0 km/h (Last Known)", status: "Unavailable" },
        { name: "Coolant Temperature", value: "Unavailable", status: "Unavailable" },
        { name: "Battery Voltage", value: "Unavailable", status: "Unavailable" },
        { name: "Fuel Level", value: "32% (Last Known)", status: "Unavailable" },
        { name: "Fuel Rate", value: "Unavailable", status: "Unavailable" },
        { name: "Engine Oil Pressure", value: "Unavailable", status: "Unavailable" },
        { name: "Retarder Torque", value: "Unavailable", status: "Unavailable" },
        { name: "Transmission Sump Temp", value: "Unavailable", status: "Unavailable" },
        { name: "DPF Differential Pressure", value: "Unavailable", status: "Unavailable" }
      ],
      faultCodes: [
        { code: "COM-TIMEOUT-04", description: "Teltonika FMC650 GPRS / MQTT Telemetry Packet Stalled", status: "Critical" },
        { code: "CAN-BUS-SILENT", description: "Powertrain CAN Bus J1939 Broadcast Inactive", status: "Active" }
      ],
      rawCanIds: ["Last Logged: 0x0CF00400", "Last Logged: 0x18FEEE00"],
      lastDataReceived: "22-Oct-2026, 05:22 AM (5 hr ago)",
      connectionStatus: "Offline",
      dataFreshness: "Stale",
      unavailableParameters: "All live CAN parameters currently unavailable (Gateway Offline)",
      reportLimitations:
        "Live telemetry unavailable due to gateway offline condition. Historical parameters from flash memory buffer displayed.",
      assessment: "Inspection Required",
      summaryForCustomer:
        "Vehicle TN 66 EF 3377 has been offline for over 5 hours. Telematics connection is interrupted. Next recommended step: Contact driver Karthik immediately to verify vehicle safety and check telematics gateway fuse/power harness."
    };
  }

  if (vNo.includes("2299")) {
    return {
      reportId: "HLP-HLTH-2299",
      generatedOn: "22-Oct-2026, 10:24",
      reportPeriod: "01 Oct 2026 – 22 Oct 2026",
      vehicleNo: vNo,
      model,
      vin,
      driver,
      odometer: odo,
      overallStatus: "Healthy",
      vehicleHealth: "Healthy",
      summary:
        "The available vehicle data indicates optimal operating conditions. All monitored parameters are within factory specifications.",
      issueExplanation:
        "No anomalous engine, electrical, or emission parameters detected. Transmission fluid temperature and engine RPM operating in optimal fuel-efficiency zone. ECU diagnostic freeze frames contain 0 active DTCs.",
      supportedParameters: [
        { name: "Engine RPM", value: "1,380 rpm", status: "Supported" },
        { name: "Vehicle Speed", value: "68 km/h", status: "Supported" },
        { name: "Coolant Temperature", value: "81 °C", status: "Supported" },
        { name: "Battery Voltage", value: "27.4 V", status: "Supported" },
        { name: "Fuel Level", value: "78%", status: "Supported" },
        { name: "Fuel Rate", value: "22.4 L/h", status: "Supported" },
        { name: "Engine Oil Pressure", value: "4.5 bar", status: "Supported" },
        { name: "Retarder Torque", value: "0 %", status: "Supported" },
        { name: "Transmission Sump Temp", value: "76 °C", status: "Supported" },
        { name: "DPF Differential Pressure", value: "1.4 kPa", status: "Supported" }
      ],
      faultCodes: [],
      rawCanIds: ["0x0CF00400 (EEC1)", "0x18FEF200 (LFE)", "0x18FEEE00 (ET1)", "0x18F0010B (ETC1)"],
      lastDataReceived: "22-Oct-2026, 10:18 AM",
      connectionStatus: "Online",
      dataFreshness: "Current",
      unavailableParameters: "None",
      reportLimitations: "None. Full dual-channel J1939 broadcast operational.",
      assessment: "Healthy",
      summaryForCustomer:
        "Vehicle TN 55 GH 2299 is running in peak condition with zero fault codes. All powertrain systems and emissions components are fully compliant. Continue regular scheduled operations."
    };
  }

  // Default / TN 38 AB 4821 (Year 2026)
  return {
    reportId: "HLP-HLTH-4821",
    generatedOn: "22-Oct-2026, 10:24",
    reportPeriod: "01 Oct 2026 – 22 Oct 2026",
    vehicleNo: vNo,
    model,
    vin,
    driver,
    odometer: odo,
    overallStatus: status === "Offline" ? "Critical" : (status === "Need Attention" ? "Needs Attention" : "Healthy"),
    vehicleHealth: status === "Offline" ? "Critical" : (status === "Need Attention" ? "Needs Attention" : "Healthy"),
    summary:
      "The available vehicle data indicates normal operating conditions. One maintenance item requires attention. Please review the recommended action below.",
    issueExplanation:
      "Transient coolant temperature elevation (peak 88 °C) was recorded during gradient payload climb on highway. Core telemetry parameters have stabilized back to nominal 82 °C. Secondary auxiliary bus signals are operating as expected.",
    supportedParameters: [
      { name: "Engine RPM", value: "1,450 rpm", status: "Supported" },
      { name: "Vehicle Speed", value: "62 km/h", status: "Supported" },
      { name: "Coolant Temperature", value: "82 °C", status: "Supported" },
      { name: "Battery Voltage", value: "26.4 V", status: "Supported" },
      { name: "Fuel Level", value: "68%", status: "Supported" },
      { name: "Fuel Rate", value: "18.5 L/h", status: "Supported" },
      { name: "Engine Oil Pressure", value: "4.2 bar", status: "Supported" },
      { name: "Retarder Torque", value: "Unavailable", status: "Unavailable" },
      { name: "Transmission Sump Temp", value: "Unavailable", status: "Unavailable" },
      { name: "DPF Differential Pressure", value: "1.8 kPa", status: "Supported" }
    ],
    faultCodes: [
      { code: "SPN 110 FMI 0", description: "Engine Coolant Temperature High (Resolved / Historical Log)", status: "Resolved" }
    ],
    rawCanIds: ["0x0CF00400 (EEC1)", "0x18FEF200 (LFE)", "0x18FEEE00 (ET1)", "0x18FEF600 (IC1)"],
    lastDataReceived: "22-Oct-2026, 10:22 AM",
    connectionStatus: "Online",
    dataFreshness: "Current",
    unavailableParameters: "Retarder Torque, Transmission Sump Temperature",
    reportLimitations:
      "Chassis is not equipped with hydraulic retarder or secondary transmission CAN gateway. Powertrain J1939 broadcast is 100% operational.",
    assessment: "Healthy",
    summaryForCustomer:
      "Vehicle TN 38 AB 4821 is in sound operating health with no active critical faults. Engine RPM, oil pressure, and charging voltage are normal. Next recommended step: Check coolant reservoir level at next depot stop as preventive care."
  };
}

export default function ReportsScreen({ vehicles = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState(null);
  const [viewingReportVehicle, setViewingReportVehicle] = useState(null);

  // Download PDF handler for an individual vehicle
  const handleDownloadVehiclePdf = (vehicle) => {
    try {
      const reportData = getVehicleHealthReportData(vehicle);
      generateVehicleHealthReportPdf(reportData);
      setDownloadSuccessMsg(`Vehicle Health Report PDF for ${vehicle.vehicleNo} generated! Check your phone's "Downloads" folder or "Files" app.`);
      setTimeout(() => setDownloadSuccessMsg(null), 5000);
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  };

  // Bulk download all vehicle reports in PDF
  const handleDownloadAllReports = () => {
    vehicles.forEach((v, index) => {
      setTimeout(() => {
        const reportData = getVehicleHealthReportData(v);
        generateVehicleHealthReportPdf(reportData);
      }, index * 400);
    });
    setDownloadSuccessMsg(`Downloading ${vehicles.length} Vehicle Health Report PDFs (Year 2026)...`);
    setTimeout(() => setDownloadSuccessMsg(null), 5000);
  };

  const getStatusBadgeClass = (statusStr) => {
    switch (statusStr?.toLowerCase()) {
      case "healthy":
        return "badge-healthy";
      case "needs attention":
      case "need attention":
      case "maintenance recommended":
        return "badge-attention";
      case "critical":
      case "inspection required":
      case "offline":
        return "badge-offline";
      default:
        return "badge-unavailable";
    }
  };

  // Filtered vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.makeModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.driver && v.driver.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter === "all") return true;
    if (statusFilter === "healthy") return v.status === "Healthy";
    if (statusFilter === "attention") return v.status === "Need Attention" || v.status === "Needs Attention";
    if (statusFilter === "critical") return v.status === "Offline" || v.status === "Critical";
    return true;
  });

  const healthyCount = vehicles.filter((v) => v.status === "Healthy").length;
  const attentionCount = vehicles.filter((v) => v.status === "Need Attention" || v.status === "Needs Attention").length;
  const criticalCount = vehicles.filter((v) => v.status === "Offline" || v.status === "Critical").length;

  return (
    <div className="reports-screen-container">
      {/* Clean Topbar: NO print button, NO date button as requested */}
      <div className="reports-screen-topbar">
        <div className="header-titles">
          <div className="report-title-row">
            <ShieldCheck size={26} className="text-red" />
            <h2 className="screen-title">Vehicle Health Reports</h2>
          </div>
          <p className="screen-subtitle">
            Generate and download standardized diagnostic PDF reports for individual fleet vehicles (Year 2026).
          </p>
        </div>

        <div className="reports-top-controls">
          <button
            className="hl-btn-primary hl-btn-download"
            onClick={handleDownloadAllReports}
            title="Download PDF health reports for all connected vehicles"
          >
            <ArrowDownToLine size={16} />
            <span>Download All Reports (PDF)</span>
          </button>
        </div>
      </div>

      {downloadSuccessMsg && (
        <div className="login-alert-box alert-success" style={{ margin: "4px 0 16px" }}>
          <CheckCircle2 size={16} />
          <span>{downloadSuccessMsg}</span>
        </div>
      )}

      {/* KPI Overview Cards */}
      <div className="reports-kpi-grid">
        <div className="kpi-mini-card">
          <div className="kpi-mini-icon blue">
            <Truck size={18} />
          </div>
          <div className="kpi-mini-body">
            <span className="kpi-mini-label">Total Fleet Reports</span>
            <strong className="kpi-mini-value">{vehicles.length}</strong>
          </div>
        </div>

        <div className="kpi-mini-card">
          <div className="kpi-mini-icon green">
            <CheckCircle2 size={18} />
          </div>
          <div className="kpi-mini-body">
            <span className="kpi-mini-label">Healthy Vehicles</span>
            <strong className="kpi-mini-value">{healthyCount}</strong>
          </div>
        </div>

        <div className="kpi-mini-card">
          <div className="kpi-mini-icon amber">
            <AlertTriangle size={18} />
          </div>
          <div className="kpi-mini-body">
            <span className="kpi-mini-label">Maintenance Recommended</span>
            <strong className="kpi-mini-value">{attentionCount}</strong>
          </div>
        </div>

        <div className="kpi-mini-card">
          <div className="kpi-mini-icon red">
            <ShieldCheck size={18} />
          </div>
          <div className="kpi-mini-body">
            <span className="kpi-mini-label">Inspection Required</span>
            <strong className="kpi-mini-value">{criticalCount}</strong>
          </div>
        </div>
      </div>

      {/* Vehicle Health Reports Management List */}
      <div className="hl-card reports-management-card">
        {/* Filters and Search Bar */}
        <div className="reports-filter-bar">
          <div className="reports-search-box">
            <Search size={16} className="search-icon-muted" />
            <input
              type="text"
              placeholder="Search by vehicle number, model, or driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="reports-search-field"
            />
          </div>

          <div className="reports-filter-pills">
            <button
              className={`filter-pill ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              All ({vehicles.length})
            </button>
            <button
              className={`filter-pill ${statusFilter === "healthy" ? "active" : ""}`}
              onClick={() => setStatusFilter("healthy")}
            >
              Healthy ({healthyCount})
            </button>
            <button
              className={`filter-pill ${statusFilter === "attention" ? "active" : ""}`}
              onClick={() => setStatusFilter("attention")}
            >
              Needs Attention ({attentionCount})
            </button>
            <button
              className={`filter-pill ${statusFilter === "critical" ? "active" : ""}`}
              onClick={() => setStatusFilter("critical")}
            >
              Critical / Offline ({criticalCount})
            </button>
          </div>
        </div>

        {/* Vehicles Table with Download PDF Action */}
        <div className="fleet-reports-table-wrap">
          <table className="hl-table">
            <thead>
              <tr>
                <th>Vehicle No & Model</th>
                <th>Report ID</th>
                <th>Overall Status</th>
                <th>Assessment</th>
                <th>Last Data Received</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-muted">
                    No vehicles found matching your search.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((v) => {
                  const vRep = getVehicleHealthReportData(v);
                  return (
                    <tr key={v.id} className="reports-table-row">
                      <td>
                        <div className="veh-td-cell">
                          <img src={truckThumb} alt="truck" className="veh-thumb-mini" />
                          <div>
                            <strong className="veh-num-text">{v.vehicleNo}</strong>
                            <div className="text-xs text-muted">{v.makeModel} · {v.driver || "Fleet Driver"}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code className="text-xs font-mono report-id-pill">{vRep.reportId}</code>
                      </td>
                      <td>
                        <span className={`status-pill ${getStatusBadgeClass(vRep.overallStatus)}`}>
                          {vRep.overallStatus}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${getStatusBadgeClass(vRep.assessment)}`}>
                          {vRep.assessment}
                        </span>
                      </td>
                      <td>
                        <div className="text-xs text-muted flex items-center gap-1">
                          <Clock size={12} />
                          <span>{vRep.lastDataReceived}</span>
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="report-row-actions">
                          <button
                            type="button"
                            className="hl-btn-view-report"
                            onClick={() => setViewingReportVehicle(v)}
                            title={`View official report for ${v.vehicleNo}`}
                          >
                            <Eye size={14} />
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            className="hl-btn-download-pdf"
                            onClick={() => handleDownloadVehiclePdf(v)}
                            title={`Download official PDF report for ${v.vehicleNo}`}
                          >
                            <Download size={14} />
                            <span>Download PDF</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Standardized Format Info Note */}
      <div className="reports-info-callout">
        <div className="callout-icon-col">
          <FileText size={20} className="text-red" />
        </div>
        <div className="callout-content-col">
          <h4 className="callout-heading">Official Standardized Vehicle Health Report (PDF)</h4>
          <p className="callout-desc">
            Each downloaded PDF report contains complete SAE J1939 telematics diagnostic telemetry, including Report ID, Overall Status, Issue Explanation, Diagnostic Parameters (Supported vs. Unavailable), Technical Appendix with active SPN/FMI fault codes, CAN Broadcast IDs, Assessment, and Customer Summary for the <strong>2026</strong> reporting cycle.
          </p>
          <p className="callout-desc" style={{ marginTop: "8px", fontWeight: "600", color: "#0f172a" }}>
            📱 <strong>On Mobile Phone / APK:</strong> Tap the <strong>View</strong> (Eye) button to inspect the full report directly on your screen, or tap <strong>Download PDF</strong> to save to your phone's <strong>Downloads</strong> folder.
          </p>
        </div>
      </div>

      {/* In-App Interactive Vehicle Health Report Modal */}
      {viewingReportVehicle && (() => {
        const rep = getVehicleHealthReportData(viewingReportVehicle);
        return (
          <div className="auth-modal-overlay" onClick={() => setViewingReportVehicle(null)}>
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
                  onClick={() => setViewingReportVehicle(null)}
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
                    <span className={`status-pill ${getStatusBadgeClass(rep.overallStatus)}`}>
                      {rep.overallStatus}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-lbl">Vehicle Health:</span>
                    <span className={`status-pill ${getStatusBadgeClass(rep.assessment)}`}>
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

                {/* 4. Important Notice */}
                <div className="report-view-advisory-box">
                  <AlertTriangle size={18} className="text-amber flex-shrink-0" />
                  <div>
                    <strong>Important:</strong> Critical warnings should be assessed promptly. Follow the vehicle manufacturer's instructions and arrange a physical inspection where necessary. Only parameters supported by the connected vehicle and diagnostic device are displayed.
                  </div>
                </div>

                {/* 5. Diagnostic Parameters Table */}
                <div className="report-view-section">
                  <h4 className="report-view-sec-title">Monitored Telematics Parameters</h4>
                  <div className="report-params-table-wrap">
                    <table className="hl-table report-modal-table">
                      <thead>
                        <tr>
                          <th>Parameter</th>
                          <th>SPN / Register</th>
                          <th>Measured Value</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rep.parameters?.map((p, idx) => (
                          <tr key={idx}>
                            <td><strong>{p.parameter}</strong></td>
                            <td className="text-muted">{p.spn}</td>
                            <td><span className="font-mono font-bold">{p.value}</span></td>
                            <td>
                              <span className={`status-pill ${p.status === "Unavailable" ? "badge-unavailable" : (p.status === "Critical" ? "badge-offline" : (p.status === "Needs Attention" ? "badge-attention" : "badge-healthy"))}`}>
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 6. Technical Appendix (Fault Codes & CAN Broadcasts) */}
                <div className="report-view-section">
                  <h4 className="report-view-sec-title">Technical Appendix: Fault Codes & CAN Registers</h4>
                  <div className="report-appendix-grid">
                    <div className="appendix-subcard">
                      <div className="subcard-title">Diagnostic Trouble Codes (DTC)</div>
                      {rep.faultCodes?.length > 0 ? (
                        <div className="fault-codes-list">
                          {rep.faultCodes.map((fc, idx) => (
                            <div key={idx} className="fault-code-pill-item">
                              <span className="fc-code">{fc.code}</span>
                              <span className="fc-desc">{fc.description}</span>
                              <span className={`status-pill ${fc.status === "Critical" ? "badge-offline" : "badge-attention"}`}>{fc.status}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-muted">No active diagnostic fault codes detected. System healthy.</div>
                      )}
                    </div>

                    <div className="appendix-subcard">
                      <div className="subcard-title">Monitored CAN Broadcast PGNs</div>
                      <div className="can-pgn-list">
                        {rep.canBroadcasts?.map((cb, idx) => (
                          <div key={idx} className="can-pgn-row">
                            <span className="can-id font-mono">{cb.id}</span>
                            <span className="can-desc">{cb.description}</span>
                            <span className="can-rate text-xs text-muted">{cb.rate}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Action Footer */}
              <div className="report-modal-footer">
                <button
                  type="button"
                  className="hl-btn-download-pdf"
                  onClick={() => handleDownloadVehiclePdf(viewingReportVehicle)}
                >
                  <Download size={15} />
                  <span>Download PDF Report</span>
                </button>
                <button
                  type="button"
                  className="hl-btn-secondary"
                  onClick={() => setViewingReportVehicle(null)}
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
