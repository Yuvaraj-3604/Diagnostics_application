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

const ENGINE_HOURLY_TREND = [
  { time: "9:00", rpm: 1120, load: 48, temp: 80 },
  { time: "9:10", rpm: 1290, load: 58, temp: 82 },
  { time: "9:20", rpm: 1240, load: 54, temp: 83 },
  { time: "9:30", rpm: 1490, load: 72, temp: 86 },
  { time: "9:40", rpm: 1380, load: 65, temp: 85 },
  { time: "9:50", rpm: 1540, load: 76, temp: 87 },
  { time: "10:00", rpm: 1450, load: 64, temp: 86 }
];

const FUEL_HOURLY_TREND = [
  { time: "9:00", rate: 16.8, economy: 4.8 },
  { time: "9:10", rate: 18.5, economy: 4.4 },
  { time: "9:20", rate: 17.6, economy: 4.6 },
  { time: "9:30", rate: 21.2, economy: 3.9 },
  { time: "9:40", rate: 19.5, economy: 4.1 },
  { time: "9:50", rate: 22.8, economy: 3.7 },
  { time: "10:00", rate: 19.2, economy: 4.2 }
];

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

      {/* Main View: Live Metrics */}
      {activeCategory === "live" && (
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
                <strong className="param-box-val">{vehicle.engineRpm?.toLocaleString() || "1,320"}</strong>
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
                <strong className="param-box-val">{vehicle.currentSpeed || 38}</strong>
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
                <strong className="param-box-val">{vehicle.fuelLevel || 54}</strong>
                <span className="param-box-unit">%</span>
              </div>
              <div className="param-box-spark-bar">
                <div className="spark-bar-fill fill-amber" style={{ width: `${vehicle.fuelLevel || 54}%` }} />
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
                <strong className="param-box-val">{vehicle.coolantTemp || "86 °C"}</strong>
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
                <strong className="param-box-val">{vehicle.batteryVoltage || "21.8 V"}</strong>
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
                <strong className="param-box-val">{vehicle.fuelRate || "19.2 L/h"}</strong>
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
                <span>Active: <strong>{vehicle.engineRpm || 1320} RPM</strong></span>
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

      {/* Engine Dedicated Diagnostics View */}
      {activeCategory === "engine" && (
        <div className="diagnostics-screen-body">
          {/* 6 Engine Cards Grid */}
          <div className="diag-six-cards-grid">
            <div className="hl-card diag-param-box">
              <div className="param-box-top">
                <span className="param-box-label">Engine RPM</span>
                <div className="param-box-icon-wrap icon-green">
                  <Activity size={18} />
                </div>
              </div>
              <div className="param-box-val-line">
                <strong className="param-box-val">{vehicle.engineRpm?.toLocaleString() || "1,320"}</strong>
                <span className="param-box-unit">rpm</span>
              </div>
              <div className="param-box-spark-bar">
                <div className="spark-bar-fill fill-green" style={{ width: "66%" }} />
              </div>
            </div>

            <div className="hl-card diag-param-box">
              <div className="param-box-top">
                <span className="param-box-label">Engine Load</span>
                <div className="param-box-icon-wrap icon-blue">
                  <Gauge size={18} />
                </div>
              </div>
              <div className="param-box-val-line">
                <strong className="param-box-val">64</strong>
                <span className="param-box-unit">%</span>
              </div>
              <div className="param-box-spark-bar">
                <div className="spark-bar-fill fill-blue" style={{ width: "64%" }} />
              </div>
            </div>

            <div className="hl-card diag-param-box">
              <div className="param-box-top">
                <span className="param-box-label">Coolant Temp</span>
                <div className="param-box-icon-wrap icon-red">
                  <Thermometer size={18} />
                </div>
              </div>
              <div className="param-box-val-line">
                <strong className="param-box-val">{vehicle.coolantTemp || "86 °C"}</strong>
              </div>
              <div className="param-box-spark-bar">
                <div className="spark-bar-fill fill-red" style={{ width: "72%" }} />
              </div>
            </div>

            <div className="hl-card diag-param-box">
              <div className="param-box-top">
                <span className="param-box-label">Oil Pressure</span>
                <div className="param-box-icon-wrap icon-amber">
                  <Droplets size={18} />
                </div>
              </div>
              <div className="param-box-val-line">
                <strong className="param-box-val">42.5</strong>
                <span className="param-box-unit">psi</span>
              </div>
              <div className="param-box-spark-bar">
                <div className="spark-bar-fill fill-amber" style={{ width: "82%" }} />
              </div>
            </div>

            <div className="hl-card diag-param-box">
              <div className="param-box-top">
                <span className="param-box-label">Intake Air Temp</span>
                <div className="param-box-icon-wrap icon-blue">
                  <Thermometer size={18} />
                </div>
              </div>
              <div className="param-box-val-line">
                <strong className="param-box-val">34</strong>
                <span className="param-box-unit">°C</span>
              </div>
              <div className="param-box-spark-bar">
                <div className="spark-bar-fill fill-blue" style={{ width: "40%" }} />
              </div>
            </div>

            <div className="hl-card diag-param-box">
              <div className="param-box-top">
                <span className="param-box-label">Operating Hours</span>
                <div className="param-box-icon-wrap icon-purple">
                  <Zap size={18} />
                </div>
              </div>
              <div className="param-box-val-line">
                <strong className="param-box-val">3,842</strong>
                <span className="param-box-unit">hrs</span>
              </div>
              <div className="param-box-spark-bar">
                <div className="spark-bar-fill fill-purple" style={{ width: "58%" }} />
              </div>
            </div>
          </div>

          {/* Engine Trend Chart */}
          <div className="hl-card rpm-chart-card">
            <div className="hl-card-header">
              <h3 className="hl-card-title">Engine RPM & Load Profile (Last 1 Hour)</h3>
              <div className="rpm-current-pill">
                <span>Load: <strong>64%</strong> · RPM: <strong>{vehicle.engineRpm || 1320}</strong></span>
              </div>
            </div>

            <div className="rpm-area-chart-wrap" style={{ height: 260, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={ENGINE_HOURLY_TREND}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="engineRpmGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e5252a" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#e5252a" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="engineLoadGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf2f7" />
                  <XAxis dataKey="time" tickLine={false} axisLine={{ stroke: "#e2e8f0" }} tick={{ fill: "#94a3b8", fontSize: 11.5 }} />
                  <YAxis tickLine={false} axisLine={{ stroke: "#e2e8f0" }} tick={{ fill: "#94a3b8", fontSize: 11.5 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "8px", color: "#ffffff", fontSize: "12px" }}
                  />
                  <Area type="monotone" dataKey="rpm" stroke="#e5252a" strokeWidth={2.4} fillOpacity={1} fill="url(#engineRpmGrad)" name="RPM" />
                  <Area type="monotone" dataKey="load" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#engineLoadGrad)" name="Load %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Engine J1939 Telematics Verification */}
          <div className="hl-card" style={{ marginTop: "20px" }}>
            <div className="hl-card-header">
              <h3 className="hl-card-title">Engine Subsystem Health (SAE J1939)</h3>
              <span className="status-pill badge-healthy">6 of 6 Subsystems Normal</span>
            </div>
            <div className="engine-subsystems-table-wrap">
              <table className="hl-table">
                <thead>
                  <tr>
                    <th>Parameter (SPN)</th>
                    <th>Measured Value</th>
                    <th>Threshold</th>
                    <th>Health Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>SPN 190</strong> · Engine Speed</td>
                    <td>{vehicle.engineRpm?.toLocaleString() || "1,320"} RPM</td>
                    <td>600 – 2,200 RPM</td>
                    <td><span className="status-pill badge-healthy">Normal</span></td>
                  </tr>
                  <tr>
                    <td><strong>SPN 110</strong> · Coolant Temperature</td>
                    <td>{vehicle.coolantTemp || "86 °C"}</td>
                    <td>75 – 95 °C</td>
                    <td><span className="status-pill badge-healthy">Optimal</span></td>
                  </tr>
                  <tr>
                    <td><strong>SPN 100</strong> · Engine Oil Pressure</td>
                    <td>42.5 psi</td>
                    <td>&gt; 25.0 psi</td>
                    <td><span className="status-pill badge-healthy">Good</span></td>
                  </tr>
                  <tr>
                    <td><strong>SPN 92</strong> · Percent Engine Load</td>
                    <td>64 %</td>
                    <td>0 – 100 %</td>
                    <td><span className="status-pill badge-healthy">In Range</span></td>
                  </tr>
                  <tr>
                    <td><strong>SPN 102</strong> · Boost Pressure</td>
                    <td>1.8 bar</td>
                    <td>1.2 – 2.2 bar</td>
                    <td><span className="status-pill badge-healthy">Optimal</span></td>
                  </tr>
                  <tr>
                    <td><strong>SPN 105</strong> · Intake Manifold Temp</td>
                    <td>34 °C</td>
                    <td>&lt; 55 °C</td>
                    <td><span className="status-pill badge-healthy">Cool</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Fuel Dedicated Diagnostics View */}
      {activeCategory === "fuel" && (
        <div className="diagnostics-screen-body">
          {/* 6 Fuel Cards Grid */}
          <div className="diag-six-cards-grid">
            <div className="hl-card diag-param-box">
              <div className="param-box-top">
                <span className="param-box-label">Fuel Level</span>
                <div className="param-box-icon-wrap icon-amber">
                  <Fuel size={18} />
                </div>
              </div>
              <div className="param-box-val-line">
                <strong className="param-box-val">{vehicle.fuelLevel || 54}</strong>
                <span className="param-box-unit">%</span>
              </div>
              <div className="param-box-spark-bar">
                <div className="spark-bar-fill fill-amber" style={{ width: `${vehicle.fuelLevel || 54}%` }} />
              </div>
            </div>

            <div className="hl-card diag-param-box">
              <div className="param-box-top">
                <span className="param-box-label">Fuel Rate</span>
                <div className="param-box-icon-wrap icon-purple">
                  <Droplets size={18} />
                </div>
              </div>
              <div className="param-box-val-line">
                <strong className="param-box-val">{vehicle.fuelRate || "19.2 L/h"}</strong>
              </div>
              <div className="param-box-spark-bar">
                <div className="spark-bar-fill fill-purple" style={{ width: "58%" }} />
              </div>
            </div>

            <div className="hl-card diag-param-box">
              <div className="param-box-top">
                <span className="param-box-label">Fuel Economy</span>
                <div className="param-box-icon-wrap icon-green">
                  <Gauge size={18} />
                </div>
              </div>
              <div className="param-box-val-line">
                <strong className="param-box-val">4.2</strong>
                <span className="param-box-unit">km/L</span>
              </div>
              <div className="param-box-spark-bar">
                <div className="spark-bar-fill fill-green" style={{ width: "70%" }} />
              </div>
            </div>

            <div className="hl-card diag-param-box">
              <div className="param-box-top">
                <span className="param-box-label">DEF / AdBlue</span>
                <div className="param-box-icon-wrap icon-blue">
                  <Battery size={18} />
                </div>
              </div>
              <div className="param-box-val-line">
                <strong className="param-box-val">78</strong>
                <span className="param-box-unit">%</span>
              </div>
              <div className="param-box-spark-bar">
                <div className="spark-bar-fill fill-blue" style={{ width: "78%" }} />
              </div>
            </div>

            <div className="hl-card diag-param-box">
              <div className="param-box-top">
                <span className="param-box-label">Fuel Rail Pressure</span>
                <div className="param-box-icon-wrap icon-red">
                  <Zap size={18} />
                </div>
              </div>
              <div className="param-box-val-line">
                <strong className="param-box-val">1,450</strong>
                <span className="param-box-unit">bar</span>
              </div>
              <div className="param-box-spark-bar">
                <div className="spark-bar-fill fill-red" style={{ width: "75%" }} />
              </div>
            </div>

            <div className="hl-card diag-param-box">
              <div className="param-box-top">
                <span className="param-box-label">Total Fuel Consumed</span>
                <div className="param-box-icon-wrap icon-amber">
                  <Fuel size={18} />
                </div>
              </div>
              <div className="param-box-val-line">
                <strong className="param-box-val">18,420</strong>
                <span className="param-box-unit">L</span>
              </div>
              <div className="param-box-spark-bar">
                <div className="spark-bar-fill fill-amber" style={{ width: "65%" }} />
              </div>
            </div>
          </div>

          {/* Fuel Consumption Trend Chart */}
          <div className="hl-card rpm-chart-card">
            <div className="hl-card-header">
              <h3 className="hl-card-title">Fuel Rate & Economy Trend (Last 1 Hour)</h3>
              <div className="rpm-current-pill">
                <span>Rate: <strong>{vehicle.fuelRate || "19.2 L/h"}</strong> · Economy: <strong>4.2 km/L</strong></span>
              </div>
            </div>

            <div className="rpm-area-chart-wrap" style={{ height: 260, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={FUEL_HOURLY_TREND}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="fuelRateGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="fuelEconGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf2f7" />
                  <XAxis dataKey="time" tickLine={false} axisLine={{ stroke: "#e2e8f0" }} tick={{ fill: "#94a3b8", fontSize: 11.5 }} />
                  <YAxis tickLine={false} axisLine={{ stroke: "#e2e8f0" }} tick={{ fill: "#94a3b8", fontSize: 11.5 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "8px", color: "#ffffff", fontSize: "12px" }}
                  />
                  <Area type="monotone" dataKey="rate" stroke="#9333ea" strokeWidth={2.4} fillOpacity={1} fill="url(#fuelRateGrad)" name="Rate (L/h)" />
                  <Area type="monotone" dataKey="economy" stroke="#16a34a" strokeWidth={2} fillOpacity={1} fill="url(#fuelEconGrad)" name="Economy (km/L)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fuel System & Emissions Parameters */}
          <div className="hl-card" style={{ marginTop: "20px" }}>
            <div className="hl-card-header">
              <h3 className="hl-card-title">Fuel Injection & Emissions Telemetry</h3>
              <span className="status-pill badge-healthy">Common Rail Injection Healthy</span>
            </div>
            <div className="engine-subsystems-table-wrap">
              <table className="hl-table">
                <thead>
                  <tr>
                    <th>Parameter (SPN)</th>
                    <th>Live Measurement</th>
                    <th>Reference / Range</th>
                    <th>System Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>SPN 96</strong> · Fuel Level Ratio</td>
                    <td>{vehicle.fuelLevel || 54} %</td>
                    <td>Approx. 340 km range</td>
                    <td><span className="status-pill badge-healthy">Adequate</span></td>
                  </tr>
                  <tr>
                    <td><strong>SPN 183</strong> · Engine Fuel Rate</td>
                    <td>{vehicle.fuelRate || "19.2 L/h"}</td>
                    <td>14.0 – 26.0 L/h</td>
                    <td><span className="status-pill badge-healthy">Normal Cruising</span></td>
                  </tr>
                  <tr>
                    <td><strong>SPN 1761</strong> · Diesel Exhaust Fluid (DEF)</td>
                    <td>78 %</td>
                    <td>&gt; 15 % Required</td>
                    <td><span className="status-pill badge-healthy">SCR Dosing Active</span></td>
                  </tr>
                  <tr>
                    <td><strong>SPN 157</strong> · Common Rail High Pressure</td>
                    <td>1,450 bar</td>
                    <td>1,200 – 1,600 bar</td>
                    <td><span className="status-pill badge-healthy">Stable</span></td>
                  </tr>
                  <tr>
                    <td><strong>SPN 97</strong> · Water-In-Fuel Indicator</td>
                    <td>Sensor Dry (0 ppm)</td>
                    <td>Moisture Free</td>
                    <td><span className="status-pill badge-healthy">Clear</span></td>
                  </tr>
                  <tr>
                    <td><strong>DPF Differential Pressure</strong></td>
                    <td>12 mbar (18% Soot Load)</td>
                    <td>&lt; 45 mbar</td>
                    <td><span className="status-pill badge-healthy">Filter Clean</span></td>
                  </tr>
                </tbody>
              </table>
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
