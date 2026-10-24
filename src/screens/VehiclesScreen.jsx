import React, { useState } from "react";
import {
  Search, Plus, ChevronRight, Truck, CheckCircle2, AlertTriangle,
  WifiOff, ArrowRight, X, Edit3, Check
} from "lucide-react";
import truckThumbnail from "../assets/hauloop-truck.png";

export default function VehiclesScreen({
  vehicles,
  onSelectVehicle,
  onAddVehicle,
  onUpdateVehicle,
  searchQuery,
  setSearchQuery,
  statusFilter = "all",
  setStatusFilter
}) {
  const [internalStatusFilter, setInternalStatusFilter] = useState("all");
  const currentFilter = setStatusFilter ? statusFilter : internalStatusFilter;
  const updateFilter = (val) => {
    if (setStatusFilter) setStatusFilter(val);
    else setInternalStatusFilter(val);
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  // New vehicle modal form state
  const [newVehNo, setNewVehNo] = useState("");
  const [newMakeModel, setNewMakeModel] = useState("Ashok Leyland 3520");
  const [newDriver, setNewDriver] = useState("");
  const [newYear, setNewYear] = useState("2024");

  // Edit vehicle modal form state
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
    locationName: ""
  });

  const handleOpenEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
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
      locationName: vehicle.locationName || "Coimbatore, Tamil Nadu"
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingVehicle || !editForm.vehicleNo.trim()) return;

    const updated = {
      ...editingVehicle,
      vehicleNo: editForm.vehicleNo.trim().toUpperCase(),
      makeModel: editForm.makeModel.trim() || editingVehicle.makeModel,
      make: editForm.makeModel.split(" ")[0] || editingVehicle.make,
      model: editForm.makeModel.split(" ").slice(1).join(" ") || editingVehicle.model,
      driver: editForm.driver.trim() || editingVehicle.driver,
      driverPhone: editForm.driverPhone.trim() || editingVehicle.driverPhone,
      status: editForm.status,
      engineStatus: editForm.engineStatus,
      batteryStatus: editForm.batteryStatus,
      year: parseInt(editForm.year) || editingVehicle.year,
      fuelLevel: Number(editForm.fuelLevel),
      locationName: editForm.locationName.trim() || editingVehicle.locationName,
      lastUpdated: "Just now"
    };

    if (onUpdateVehicle) {
      onUpdateVehicle(updated);
    }
    setShowEditModal(false);
  };

  // Filter vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.vehicleNo.toLowerCase().includes((searchQuery || "").toLowerCase()) ||
      v.makeModel.toLowerCase().includes((searchQuery || "").toLowerCase()) ||
      v.driver.toLowerCase().includes((searchQuery || "").toLowerCase());

    if (currentFilter === "all") return matchesSearch;
    return matchesSearch && v.status.toLowerCase().replace(" ", "").includes(currentFilter.toLowerCase().replace(" ", ""));
  });

  const handleCreateVehicle = (e) => {
    e.preventDefault();
    if (!newVehNo.trim()) return;

    const newVehicle = {
      id: `veh-${Date.now()}`,
      vehicleNo: newVehNo.trim().toUpperCase(),
      makeModel: newMakeModel,
      make: newMakeModel.split(" ")[0],
      model: newMakeModel.split(" ").slice(1).join(" "),
      year: parseInt(newYear) || 2024,
      fuelType: "Diesel",
      vin: `MB1AA${Math.floor(100000 + Math.random() * 900000)}`,
      driver: newDriver.trim() || "Driver",
      driverPhone: "+91 98000 00000",
      status: "Healthy",
      lastUpdated: "Just now",
      currentSpeed: 0,
      todayDistance: "0 km",
      travelTime: "0h 00m",
      avgSpeed: "0 km/h",
      fuelLevel: 100,
      fuelConsumed: "0 L",
      odometer: "0 km",
      lat: 11.0168,
      lng: 76.9558,
      heading: 0,
      locationName: "Coimbatore Depot, Tamil Nadu",
      lastSeen: "Just now",
      healthScore: 98,
      engineStatus: "Normal",
      batteryStatus: "Good",
      tempStatus: "Normal",
      coolantTemp: "82 °C",
      batteryVoltage: "26.4 V",
      oilPressure: "4.2 bar",
      engineRpm: 1400,
      fuelRate: "18.0 L/h",
      activeDtcCount: 0,
      subsystems: {
        engine: 98,
        battery: 98,
        brakes: 98,
        transmission: 98,
        emissions: 98
      },
      recentFaults: []
    };

    onAddVehicle(newVehicle);
    setShowAddModal(false);
    setNewVehNo("");
    setNewDriver("");
  };

  return (
    <div className="vehicles-screen-container">
      {/* 3. Fleet / Vehicles List Header matching Screen 3 */}
      <div className="screen-page-header">
        <div className="header-titles">
          <h2 className="screen-title">Vehicles</h2>
          <p className="screen-subtitle">Manage and monitor all your vehicles.</p>
        </div>

        <button
          className="hl-btn-primary hl-btn-add"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Filter and Search Bar matching Screen 3 */}
      <div className="vehicles-toolbar">
        <div className="vehicles-search-wrap">
          <Search size={17} className="search-icon" />
          <input
            type="text"
            className="vehicles-search-input"
            placeholder="Search by vehicle number or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchQuery("")}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="vehicles-status-select-wrap">
          <select
            value={currentFilter}
            onChange={(e) => updateFilter(e.target.value)}
            className="vehicles-status-select"
          >
            <option value="all">All Status</option>
            <option value="healthy">Healthy</option>
            <option value="attention">Need Attention</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Vehicles Table matching Screen 3 */}
      <div className="hl-card vehicles-table-card">
        <div className="table-responsive">
          <table className="hl-table vehicles-table">
            <thead>
              <tr>
                <th>Vehicle No.</th>
                <th>Model</th>
                <th>Driver</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th style={{ width: "90px" }}>Action</th>
                <th className="th-chevron"></th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="table-empty-cell">
                    No vehicles found matching "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => {
                  const isNeedAttention = vehicle.status === "Need Attention" || vehicle.status === "Attention";
                  const isOffline = vehicle.status === "Offline";

                  return (
                    <tr
                      key={vehicle.id}
                      className="vehicle-row clickable"
                      onClick={() => onSelectVehicle(vehicle)}
                    >
                      {/* Vehicle No. + Icon */}
                      <td className="td-vehicle-info">
                        <div className="vehicle-cell-wrap">
                          <div className="truck-avatar-wrap">
                            <img
                              src={truckThumbnail}
                              alt="Truck"
                              className="truck-thumb-img"
                            />
                          </div>
                          <span className="veh-reg-no">{vehicle.vehicleNo}</span>
                        </div>
                      </td>

                      {/* Model */}
                      <td className="td-model">
                        <span className="veh-model-text">{vehicle.makeModel}</span>
                      </td>

                      {/* Driver */}
                      <td className="td-driver">
                        <span className="veh-driver-text">{vehicle.driver}</span>
                      </td>

                      {/* Status */}
                      <td className="td-status">
                        <span className={`status-pill ${isOffline ? "pill-offline" : (isNeedAttention ? "pill-attention" : "pill-healthy")}`}>
                          <span className="status-dot" />
                          <span>{vehicle.status}</span>
                        </span>
                      </td>

                      {/* Last Updated */}
                      <td className="td-updated">
                        <span className="updated-text">{vehicle.lastUpdated}</span>
                      </td>

                      {/* Edit Button */}
                      <td className="td-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="hl-btn-row-edit"
                          title={`Edit ${vehicle.vehicleNo}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditModal(vehicle);
                          }}
                        >
                          <Edit3 size={14} />
                          <span>Edit</span>
                        </button>
                      </td>

                      {/* Chevron Action Arrow matching Screen 3 */}
                      <td className="td-chevron">
                        <ChevronRight size={17} className="row-chevron-icon" />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="hl-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="hl-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="hl-modal-header">
              <h3 className="modal-title">Add Vehicle</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowAddModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} className="modal-form">
              <div className="form-group">
                <label>Vehicle Registration Number *</label>
                <input
                  type="text"
                  placeholder="e.g. TN 38 CD 9988"
                  value={newVehNo}
                  onChange={(e) => setNewVehNo(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Model</label>
                <select
                  value={newMakeModel}
                  onChange={(e) => setNewMakeModel(e.target.value)}
                >
                  <option value="Ashok Leyland 3520">Ashok Leyland 3520</option>
                  <option value="Tata Signa 4225">Tata Signa 4225</option>
                  <option value="BharatBenz 2828C">BharatBenz 2828C</option>
                  <option value="Volvo FM 460">Volvo FM 460</option>
                  <option value="Eicher Pro 3015">Eicher Pro 3015</option>
                  <option value="Mahindra Blazo 25">Mahindra Blazo 25</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Manufacturing Year</label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Driver Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh"
                    value={newDriver}
                    onChange={(e) => setNewDriver(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="hl-btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="hl-btn-primary">
                  Register Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {showEditModal && editingVehicle && (
        <div className="hl-modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="hl-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="hl-modal-header">
              <div className="modal-header-icon-title">
                <Edit3 size={18} className="text-primary" />
                <h3 className="modal-title">Edit Vehicle · {editingVehicle.vehicleNo}</h3>
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
                />
              </div>

              <div className="form-group">
                <label>Make & Model *</label>
                <input
                  type="text"
                  value={editForm.makeModel}
                  onChange={(e) => setEditForm({ ...editForm, makeModel: e.target.value })}
                  required
                />
              </div>

              <div className="edit-modal-row">
                <div className="form-group">
                  <label>Assigned Driver</label>
                  <input
                    type="text"
                    value={editForm.driver}
                    onChange={(e) => setEditForm({ ...editForm, driver: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Driver Phone Number</label>
                  <input
                    type="tel"
                    value={editForm.driverPhone}
                    onChange={(e) => setEditForm({ ...editForm, driverPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="edit-modal-row">
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
              <div className="edit-modal-row">
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
    </div>
  );
}
