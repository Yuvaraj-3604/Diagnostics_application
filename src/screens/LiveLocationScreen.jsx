import React, { useEffect, useRef, useState } from "react";
import {
  Navigation, MapPin, Gauge, Clock, Fuel, ArrowRight, Play, Pause,
  RotateCw, Plus, Minus, Compass
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ROUTE_WAYPOINTS } from "../data/fleetData.js";

export default function LiveLocationScreen({
  selectedVehicle,
  embedded = false
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [isPlaying, setIsPlaying] = useState(true);
  const [stepIndex, setStepIndex] = useState(1);

  const vehicle = selectedVehicle || {
    vehicleNo: "TN 38 AB 4821",
    makeModel: "Ashok Leyland 3520",
    currentSpeed: 52,
    todayDistance: "84 km",
    travelTime: "2h 15m",
    avgSpeed: "52 km/h",
    lat: 10.9978,
    lng: 76.9558,
    status: "Healthy",
    lastUpdated: "2 min ago"
  };

  // Initialize interactive Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Prevent re-initialization
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const currentCoords = [vehicle.lat, vehicle.lng];

    const map = L.map(mapContainerRef.current, {
      center: currentCoords,
      zoom: 12,
      zoomControl: false
    });

    // Clean OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);

    // Polyline for NH544 Freight Route
    const latLngs = ROUTE_WAYPOINTS.map(p => [p.lat, p.lng]);
    const routeLine = L.polyline(latLngs, {
      color: "#2563eb",
      weight: 5,
      opacity: 0.85,
      dashArray: "1, 0"
    }).addTo(map);

    // Start and End waypoints
    const startIcon = L.divIcon({
      className: "waypoint-marker",
      html: `<div style="background:#0f172a;color:#fff;font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;box-shadow:0 2px 6px rgba(0,0,0,0.3);">Start</div>`,
      iconSize: [40, 20],
      iconAnchor: [20, 10]
    });
    L.marker([ROUTE_WAYPOINTS[0].lat, ROUTE_WAYPOINTS[0].lng], { icon: startIcon }).addTo(map);

    const endIcon = L.divIcon({
      className: "waypoint-marker",
      html: `<div style="background:#e5252a;color:#fff;font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;box-shadow:0 2px 6px rgba(0,0,0,0.3);">Perundurai</div>`,
      iconSize: [65, 20],
      iconAnchor: [32, 10]
    });
    L.marker([ROUTE_WAYPOINTS[ROUTE_WAYPOINTS.length - 1].lat, ROUTE_WAYPOINTS[ROUTE_WAYPOINTS.length - 1].lng], { icon: endIcon }).addTo(map);

    // Custom Red Truck Marker Icon matching mockup
    const truckIconHtml = `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;width:34px;height:34px;border-radius:50%;background:rgba(229,37,42,0.25);animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
        <div style="width:30px;height:30px;border-radius:8px;background:#e5252a;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 12px rgba(229,37,42,0.5);border:2px solid #ffffff;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
        </div>
      </div>
    `;

    const truckIcon = L.divIcon({
      className: "custom-truck-leaflet-icon",
      html: truckIconHtml,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const marker = L.marker(currentCoords, { icon: truckIcon }).addTo(map);
    markerRef.current = marker;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Simulation tick along route waypoints
  useEffect(() => {
    if (!isPlaying || !markerRef.current) return;

    const interval = setInterval(() => {
      setStepIndex((prev) => {
        const next = (prev + 1) % ROUTE_WAYPOINTS.length;
        const pt = ROUTE_WAYPOINTS[next];
        if (markerRef.current) {
          markerRef.current.setLatLng([pt.lat, pt.lng]);
        }
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
      setZoomLevel(mapInstanceRef.current.getZoom());
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
      setZoomLevel(mapInstanceRef.current.getZoom());
    }
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      const pt = ROUTE_WAYPOINTS[stepIndex] || { lat: vehicle.lat, lng: vehicle.lng };
      mapInstanceRef.current.setView([pt.lat, pt.lng], 13);
    }
  };

  return (
    <div className={`live-location-screen-container ${embedded ? "is-embedded" : ""}`}>
      {/* 5. Header (if not embedded) */}
      {!embedded && (
        <div className="screen-page-header">
          <div className="header-titles">
            <h2 className="screen-title">Live Location</h2>
            <p className="screen-subtitle">Track your vehicle in real-time.</p>
          </div>
        </div>
      )}

      {/* Main Map Card matching Panel 5 */}
      <div className="hl-card live-map-card">
        <div className="map-viewport-wrapper">
          {/* Leaflet Map Div */}
          <div ref={mapContainerRef} className="leaflet-map-element" />

          {/* Floating Live Vehicle Badge on Top-Right of Map (Panel 5 exact match) */}
          <div className="map-floating-vehicle-badge">
            <div className="floating-badge-header">
              <span className="badge-veh-no">{vehicle.vehicleNo}</span>
              <span className="badge-moving-pill">
                <span className="badge-pulse-dot" />
                <span>Moving</span>
              </span>
            </div>
            <div className="badge-veh-model">{vehicle.makeModel}</div>

            <div className="badge-meta-grid">
              <div className="badge-meta-row">
                <span className="meta-lbl">Speed</span>
                <strong className="meta-val">{vehicle.currentSpeed} km/h</strong>
              </div>
              <div className="badge-meta-row">
                <span className="meta-lbl">Last Update</span>
                <strong className="meta-val">{vehicle.lastUpdated}</strong>
              </div>
              <div className="badge-meta-row">
                <span className="meta-lbl">Lat / Lng</span>
                <strong className="meta-val mono">
                  {vehicle.lat?.toFixed(4)}, {vehicle.lng?.toFixed(4)}
                </strong>
              </div>
            </div>
          </div>

          {/* Map Interactive Controls */}
          <div className="map-custom-controls">
            <button
              className="map-ctrl-btn"
              onClick={handleZoomIn}
              title="Zoom In"
              aria-label="Zoom In"
            >
              <Plus size={16} />
            </button>
            <button
              className="map-ctrl-btn"
              onClick={handleZoomOut}
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <Minus size={16} />
            </button>
            <button
              className="map-ctrl-btn"
              onClick={handleRecenter}
              title="Recenter on Truck"
              aria-label="Recenter"
            >
              <Compass size={16} />
            </button>
            <button
              className={`map-ctrl-btn ${isPlaying ? "active-play" : ""}`}
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Pause Route Simulation" : "Resume Route Simulation"}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
          </div>
        </div>

        {/* Bottom Trip Details Bar matching Panel 5 */}
        <div className="trip-details-bar">
          <div className="trip-detail-cell">
            <div className="trip-cell-icon">
              <Navigation size={18} className="trip-blue-icon" />
            </div>
            <div className="trip-cell-info">
              <span className="trip-cell-value">{vehicle.todayDistance || "84 km"}</span>
              <span className="trip-cell-label">Distance (Today)</span>
            </div>
          </div>

          <div className="trip-cell-divider" />

          <div className="trip-detail-cell">
            <div className="trip-cell-icon">
              <Clock size={18} className="trip-amber-icon" />
            </div>
            <div className="trip-cell-info">
              <span className="trip-cell-value">{vehicle.travelTime || "2h 15m"}</span>
              <span className="trip-cell-label">Travel Time</span>
            </div>
          </div>

          <div className="trip-cell-divider" />

          <div className="trip-detail-cell">
            <div className="trip-cell-icon">
              <Gauge size={18} className="trip-green-icon" />
            </div>
            <div className="trip-cell-info">
              <span className="trip-cell-value">{vehicle.avgSpeed || "52 km/h"}</span>
              <span className="trip-cell-label">Avg Speed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
