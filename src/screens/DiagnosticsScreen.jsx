import React, { useState } from "react";
import {
  ArrowLeft, ArrowRight, Activity, Gauge, Fuel, Thermometer,
  Battery, Droplets, Radio, Cpu, RefreshCw, Trash2, CheckCircle2,
  FileCode, Zap
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { RPM_HOURLY_TREND } from "../data/fleetData.js";
import CanAnalyzerScreen from "./CanAnalyzerScreen.jsx";
import CanMonitorScreen from "./CanMonitorScreen.jsx";
import AvlMappingScreen from "./AvlMappingScreen.jsx";

export default function DiagnosticsScreen({
  snapshot,
  setPage,
  selectedVehicle
}) {
  const [activeCategory, setActiveCategory] = useState("live"); // "live" | "engine" | "fuel" | "electrical" | "signals" | "advanced"
  const [advancedTab, setAdvancedTab] = useState("analyzer");

  const vehicle = selectedVehicle || {
    vehicleNo: "TN 38 AB 4821",
    makeModel: "Ashok Leyland 3520",
    engineRpm: 1450,
    currentSpeed: 62,
    fuelLevel: 68,
    coolantTemp: "82 °C",
    batteryVoltage: "26.4 V",
    fuelRate: "18.5 L/h"
  };

  return (
    <div className="diagnostics-screen-container">
      {/* 5. Header matching Screen 5 */}
      <div className="screen-page-header">
        <div className="header-titles">
          <div className="screen-breadcrumb-row">
            <button className="diag-back-link" onClick={() => setPage("dashboard")}>
              <ArrowLeft size={16} />
              <span>Diagnostics</span>
            </button>
          </div>
          <p className="screen-subtitle">Real-time vehicle health and performance</p>
        </div>

        <button
          className="hl-link-btn"
          onClick={() => setActiveCategory(activeCategory === "signals" ? "live" : "signals")}
        >
          <span>{activeCategory === "signals" ? "Back to Metrics" : "View All Signals"}</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Category Tabs matching Screen 5: Live Metrics | Engine | Fuel | Electrical | More */}
      <div className="diag-category-tabs">
        <button
          className={`diag-cat-pill ${activeCategory === "live" ? "active" : ""}`}
          onClick={() => setActiveCategory("live")}
        >
          Live Metrics
        </button>
        <button
          className={`diag-cat-pill ${activeCategory === "engine" ? "active" : ""}`}
          onClick={() => setActiveCategory("engine")}
        >
          Engine
        </button>
        <button
          className={`diag-cat-pill ${activeCategory === "fuel" ? "active" : ""}`}
          onClick={() => setActiveCategory("fuel")}
        >
          Fuel
        </button>
        <button
          className={`diag-cat-pill ${activeCategory === "advanced" ? "active" : ""}`}
          onClick={() => setActiveCategory("advanced")}
        >
          CAN Lab
        </button>
      </div>

      {/* Main View: 6 Parameter Cards + 1-Hour RPM Chart matching Screen 5 */}
      {activeCategory !== "signals" && activeCategory !== "advanced" && (
        <div className="diagnostics-screen-body">
          {/* 6 Parameter Cards Grid */}
          <div className="diag-six-cards-grid">
            {/* Card 1: Engine RPM */}
            <div className="hl-card diag-param-box">
              <div className="param-box-top">
                <span className="param-box-label">Engine RPM</span>
                <div className="param-box-icon-wrap icon-green">
                  <Activity size={18} />
                </div>
              </div>
              <div className="param-box-val-line">
                <strong className="param-box-val">{vehicle.engineRpm?.toLocaleString() || "1,450"}</strong>
                <span className="param-box-unit">rpm</span>
              </div>
              <div className="param-box-spark-bar">
                <div className="spark-bar-fill fill-green" style={{ width: "72%" }} />
              </div>
            </div>

            {/* Card 2: Vehicle Speed */}
            <div className="hl-card diag-param-box">
              <div className="param-box-top">
                <span className="param-box-label">Vehicle Speed</span>
                <div className="param-box-icon-wrap icon-blue">
                  <Gauge size={18} />
                </div>
              </div>
              <div className="param-box-val-line">
                <strong className="param-box-val">{vehicle.currentSpeed || 62}</strong>
                <span className="param-box-unit">km/h</span>
              </div>
              <div className="param-box-spark-bar">
                <div className="spark-bar-fill fill-blue" style={{ width: "62%" }} />
              </div>
            </div>

            {/* Card 3: Fuel Level */}
            <div className="hl-card diag-param-box">
              <div className="param-box-top">
                <span className="param-box-label">Fuel Level</span>
                <div className="param-box-icon-wrap icon-amber">
                  <Fuel size={18} />
                </div>
              </div>
              <div className="param-box-val-line">
                <strong className="param-box-val">{vehicle.fuelLevel || 68}</strong>
                <span className="param-box-unit">%</span>
              </div>
              <div className="param-box-spark-bar">
                <div className="spark-bar-fill fill-amber" style={{ width: `${vehicle.fuelLevel || 68}%` }} />
              </div>
            </div>

            {/* Card 4: Coolant Temperature */}
            <div className="hl-card diag-param-box">
              <div className="param-box-top">
                <span className="param-box-label">Coolant Temperature</span>
                <div className="param-box-icon-wrap icon-red">
                  <Thermometer size={18} />
                </div>
              </div>
              <div className="param-box-val-line">
                <strong className="param-box-val">{vehicle.coolantTemp || "82 °C"}</strong>
              </div>
              <div className="param-box-spark-bar">
                <div className="spark-bar-fill fill-red" style={{ width: "68%" }} />
              </div>
            </div>

            {/* Card 5: Battery Voltage */}
            <div className="hl-card diag-param-box">
              <div className="param-box-top">
                <span className="param-box-label">Battery Voltage</span>
                <div className="param-box-icon-wrap icon-green">
                  <Battery size={18} />
                </div>
              </div>
              <div className="param-box-val-line">
                <strong className="param-box-val">{vehicle.batteryVoltage || "26.4 V"}</strong>
              </div>
              <div className="param-box-spark-bar">
                <div className="spark-bar-fill fill-green" style={{ width: "88%" }} />
              </div>
            </div>

            {/* Card 6: Fuel Rate */}
            <div className="hl-card diag-param-box">
              <div className="param-box-top">
                <span className="param-box-label">Fuel Rate</span>
                <div className="param-box-icon-wrap icon-purple">
                  <Droplets size={18} />
                </div>
              </div>
              <div className="param-box-val-line">
                <strong className="param-box-val">{vehicle.fuelRate || "18.5 L/h"}</strong>
              </div>
              <div className="param-box-spark-bar">
                <div className="spark-bar-fill fill-purple" style={{ width: "55%" }} />
              </div>
            </div>
          </div>

          {/* Bottom Card: Engine RPM (Last 1 Hour) Chart matching Screen 5 */}
          <div className="hl-card rpm-chart-card">
            <div className="hl-card-header">
              <h3 className="hl-card-title">Engine RPM (Last 1 Hour)</h3>
              <div className="rpm-current-pill">
                <span>Active: <strong>{vehicle.engineRpm || 1450} RPM</strong></span>
              </div>
            </div>

            <div className="rpm-area-chart-wrap" style={{ height: 260, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={RPM_HOURLY_TREND}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="rpmGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e5252a" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#e5252a" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf2f7" />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tick={{ fill: "#94a3b8", fontSize: 11.5 }}
                  />
                  <YAxis
                    domain={[0, 2000]}
                    ticks={[0, 500, 1000, 1500, 2000]}
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tick={{ fill: "#94a3b8", fontSize: 11.5 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "none",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "12px",
                      padding: "8px 12px"
                    }}
                    itemStyle={{ color: "#ffffff" }}
                    formatter={(value) => [`${value} RPM`, "Engine Speed"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="rpm"
                    stroke="#e5252a"
                    strokeWidth={2.4}
                    fillOpacity={1}
                    fill="url(#rpmGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Signals View: SAE J1939 Decoded Parameters */}
      {activeCategory === "signals" && (
        <div className="hl-card">
          <div className="hl-card-header">
            <div>
              <h3 className="hl-card-title">SAE J1939 CAN Parameters for {vehicle.vehicleNo}</h3>
              <p className="hl-card-subtitle">Complete PGN & SPN broadcast register stream</p>
            </div>
          </div>

          <table className="hl-table">
            <thead>
              <tr>
                <th>Signal Name</th>
                <th>SPN</th>
                <th>PGN</th>
                <th>Decoded Value</th>
                <th>Formula / Scaling</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Engine Speed</strong></td>
                <td className="mono">190</td>
                <td className="mono">61444 (0xF004)</td>
                <td className="mono highlight">{vehicle.engineRpm || 1450} RPM</td>
                <td>raw × 0.125</td>
                <td><span className="status-pill pill-healthy"><span className="status-dot" />Receiving</span></td>
              </tr>
              <tr>
                <td><strong>Vehicle Speed</strong></td>
                <td className="mono">84</td>
                <td className="mono">65265 (0xFEF1)</td>
                <td className="mono highlight">{vehicle.currentSpeed || 62} km/h</td>
                <td>raw × 1/256 km/h</td>
                <td><span className="status-pill pill-healthy"><span className="status-dot" />Receiving</span></td>
              </tr>
              <tr>
                <td><strong>Coolant Temperature</strong></td>
                <td className="mono">110</td>
                <td className="mono">65262 (0xFEEE)</td>
                <td className="mono highlight">{vehicle.coolantTemp || "82 °C"}</td>
                <td>raw - 40 °C</td>
                <td><span className="status-pill pill-healthy"><span className="status-dot" />Receiving</span></td>
              </tr>
              <tr>
                <td><strong>Battery Potential (Voltage)</strong></td>
                <td className="mono">168</td>
                <td className="mono">65271 (0xFEF7)</td>
                <td className="mono highlight">{vehicle.batteryVoltage || "26.4 V"}</td>
                <td>raw × 0.05 V</td>
                <td><span className="status-pill pill-healthy"><span className="status-dot" />Receiving</span></td>
              </tr>
              <tr>
                <td><strong>Fuel Delivery Rate</strong></td>
                <td className="mono">183</td>
                <td className="mono">65266 (0xFEF2)</td>
                <td className="mono highlight">{vehicle.fuelRate || "18.5 L/h"}</td>
                <td>raw × 0.05 L/h</td>
                <td><span className="status-pill pill-healthy"><span className="status-dot" />Receiving</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Advanced CAN Lab View */}
      {activeCategory === "advanced" && (
        <div className="diag-subview-panel">
          <div className="advanced-diag-nav">
            <button
              className={`diag-tab-btn ${advancedTab === "analyzer" ? "active" : ""}`}
              onClick={() => setAdvancedTab("analyzer")}
            >
              CAN Analyzer
            </button>
            <button
              className={`diag-tab-btn ${advancedTab === "monitor" ? "active" : ""}`}
              onClick={() => setAdvancedTab("monitor")}
            >
              CAN Bus Monitor
            </button>
            <button
              className={`diag-tab-btn ${advancedTab === "avl" ? "active" : ""}`}
              onClick={() => setAdvancedTab("avl")}
            >
              AVL Mapping
            </button>
          </div>

          <div className="advanced-diag-content">
            {advancedTab === "analyzer" && (
              <CanAnalyzerScreen
                initialCanId="0CF00400"
                snapshot={snapshot}
                setPage={setPage}
              />
            )}
            {advancedTab === "monitor" && (
              <CanMonitorScreen
                snapshot={snapshot}
                setPage={setPage}
                onSelectCanId={() => setAdvancedTab("analyzer")}
              />
            )}
            {advancedTab === "avl" && (
              <AvlMappingScreen
                snapshot={snapshot}
                setPage={setPage}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
