import React, { useState, useEffect } from 'react';
import MicroStepperAreaInput from '../components/MicroStepperAreaInput';
import TaxonomicCropSelector from '../components/TaxonomicCropSelector';
import RegulatoryDisclaimerModal from '../components/RegulatoryDisclaimerModal';

export default function Farms() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('register-farm');
  
  // Agonizing 1-item-per-page pagination!
  const [currentPage, setCurrentPage] = useState(0);

  // New Farm State
  const [farmerName, setFarmerName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [location, setLocation] = useState('');
  const [totalArea, setTotalArea] = useState(35.5);
  const [parcelPin, setParcelPin] = useState('US-AG-9021');

  // New Plot State
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [plotName, setPlotName] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('Corn (Maize)');
  const [growthStage, setGrowthStage] = useState('Vegetative (V4-V8)');

  // Modal & Notification
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/farms');
      const json = await res.json();
      if (json.success && json.data) {
        setFarms(json.data);
        if (json.data.length > 0 && !selectedFarmId) {
          setSelectedFarmId(json.data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching farm registry:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreSubmitFarm = (e) => {
    e.preventDefault();
    if (!farmerName.trim() || !farmName.trim() || !location.trim()) {
      setStatusMessage({ type: 'error', text: 'ERROR: All statutory identity fields must be fully completed pursuant to Form 104.' });
      return;
    }
    setPendingAction(() => executeFarmCreation);
    setModalOpen(true);
  };

  const executeFarmCreation = async () => {
    setModalOpen(false);
    setIsSubmitting(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/farms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmer_name: farmerName,
          farm_name: farmName,
          location,
          total_area_hectares: totalArea
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: 'success',
          text: `SUCCESS: Parcel record "${farmName}" successfully persisted to Supabase PostgreSQL holding ledger.`
        });
        setFarmerName('');
        setFarmName('');
        setLocation('');
        fetchFarms();
      } else {
        setStatusMessage({ type: 'error', text: `DATABASE REJECTION: ${data.error}` });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: `TRANSMISSION ERROR: ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreSubmitPlot = (e) => {
    e.preventDefault();
    if (!selectedFarmId || !plotName.trim()) {
      setStatusMessage({ type: 'error', text: 'ERROR: You must assign a plot identifier and link to a verified holding.' });
      return;
    }
    setPendingAction(() => executePlotCreation);
    setModalOpen(true);
  };

  const executePlotCreation = async () => {
    setModalOpen(false);
    setIsSubmitting(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/plots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farm_id: selectedFarmId,
          plot_name: plotName,
          crop_type: selectedCrop,
          growth_stage: growthStage
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: 'success',
          text: `SUCCESS: Field Plot "${plotName}" successfully registered under target farm holding.`
        });
        setPlotName('');
        fetchFarms();
      } else {
        setStatusMessage({ type: 'error', text: `REGISTRATION FAILED: ${data.error}` });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: `ERROR: ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFarm = (farmId, farmTitle) => {
    setPendingAction(() => async () => {
      setModalOpen(false);
      try {
        await fetch(`/api/farms/${farmId}`, { method: 'DELETE' });
        setStatusMessage({ type: 'success', text: `STATUTORY EXPUNGEMENT: Farm "${farmTitle}" purged from ledger.` });
        fetchFarms();
      } catch (err) {
        console.error(err);
      }
    });
    setModalOpen(true);
  };

  const currentFarm = farms[currentPage] || null;

  return (
    <div className="p-3 max-w-7xl mx-auto space-y-3">
      
      {/* Title Window */}
      <div className="win-window p-3 space-y-2">
        <div className="win-titlebar">
          <span>Agricultural Land Holding Registry & Parcel Accreditation (Module 02)</span>
          <span className="text-[10px] font-mono">FORM USDA-AG-409</span>
        </div>

        <div className="text-[11px] text-gray-800">
          This certified module facilitates the entry of cadastral land parcels, legal operators, and field plots. 
          All entries are immutable until audited.
        </div>

        {/* Status Notification Box */}
        {statusMessage.text && (
          <div className={`p-2 border text-[11px] font-mono flex items-center justify-between ${
            statusMessage.type === 'success' 
              ? 'bg-[#e6ffe6] border-[#008000] text-[#006000]' 
              : 'bg-[#ffe6e6] border-[#cc0000] text-[#800000]'
          }`}>
            <span>{statusMessage.text}</span>
            <button
              onClick={() => setStatusMessage({ type: '', text: '' })}
              className="win-btn !p-0 !px-1 text-[10px]"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Main 2-Column Bureaucratic Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        
        {/* Left Form: Tabbed Data Entry Panel (7 cols) */}
        <div className="lg:col-span-7 win-window p-3 space-y-3">
          
          {/* Sub-tabs */}
          <div className="flex items-end border-b border-[#808080] pb-0">
            <button
              type="button"
              onClick={() => setActiveTab('register-farm')}
              className={`px-3 py-1 text-xs select-none ${
                activeTab === 'register-farm' ? 'win-tab-active font-bold' : 'win-tab-inactive'
              }`}
            >
              1. Register Land Holding Parcel
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('add-plot')}
              className={`px-3 py-1 text-xs select-none ${
                activeTab === 'add-plot' ? 'win-tab-active font-bold' : 'win-tab-inactive'
              }`}
            >
              2. Add Crop Plot to Holding
            </button>
          </div>

          {/* Tab 1: Register Land Holding */}
          {activeTab === 'register-farm' && (
            <form onSubmit={handlePreSubmitFarm} className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
                    Cadastral Parcel PIN (Format: US-AG-XXXX)
                  </label>
                  <input
                    type="text"
                    required
                    value={parcelPin}
                    onChange={(e) => setParcelPin(e.target.value)}
                    className="w-full font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
                    Certified Legal Operator Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="e.g., Arthur P. Pendelton"
                    className="w-full text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
                  Holding Trading Name / Agronomic Facility Identifier
                </label>
                <input
                  type="text"
                  required
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="e.g., Red River Valley Grain Holdings LLC"
                  className="w-full text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
                  Geographical Jurisdiction / County & State
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Clay County, MN (Zone 4b)"
                  className="w-full text-[11px]"
                />
              </div>

              {/* The Precision Micro-Stepper Number Input */}
              <MicroStepperAreaInput
                value={totalArea}
                onChange={(val) => setTotalArea(val)}
                label="Statutory Area (Mandatory Metric Stepper)"
              />

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="win-btn font-bold !px-5 !py-1 text-xs"
                >
                  {isSubmitting ? "Persisting to Supabase..." : "Commit Parcel Record to PostgreSQL →"}
                </button>
              </div>
            </form>
          )}

          {/* Tab 2: Add Plot */}
          {activeTab === 'add-plot' && (
            <form onSubmit={handlePreSubmitPlot} className="space-y-3 pt-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
                  Select Associated Land Holding (Parent Entity)
                </label>
                <select
                  value={selectedFarmId}
                  onChange={(e) => setSelectedFarmId(e.target.value)}
                  className="w-full text-[11px]"
                >
                  {farms.length === 0 ? (
                    <option value="">No parent holdings registered</option>
                  ) : (
                    farms.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.farm_name} ({f.farmer_name} - {f.location})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
                  Field Plot Designation / Boundary Quadrant
                </label>
                <input
                  type="text"
                  required
                  value={plotName}
                  onChange={(e) => setPlotName(e.target.value)}
                  placeholder="e.g., North Terraced Drainage Quadrant 3"
                  className="w-full text-[11px]"
                />
              </div>

              {/* 3-Tiered Botanical Taxonomic Crop Selector */}
              <TaxonomicCropSelector
                value={selectedCrop}
                onChange={(crop) => setSelectedCrop(crop)}
                label="Agronomic Botanical Taxonomy Classification"
              />

              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
                  Current Certified Phenological Stage
                </label>
                <select
                  value={growthStage}
                  onChange={(e) => setGrowthStage(e.target.value)}
                  className="w-full text-[11px]"
                >
                  <option value="Emergence (VE)">Emergence (VE)</option>
                  <option value="Vegetative (V4-V8)">Vegetative (V4-V8)</option>
                  <option value="Tillering / Branching">Tillering / Branching</option>
                  <option value="Tasseling / Flowering (R1)">Tasseling / Flowering (R1)</option>
                  <option value="Grain Fill / Pod Setting (R3-R5)">Grain Fill / Pod Setting (R3-R5)</option>
                  <option value="Physiological Maturity (R6)">Physiological Maturity (R6)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || farms.length === 0}
                  className="win-btn font-bold !px-5 !py-1 text-xs"
                >
                  {isSubmitting ? "Sowing Plot..." : "Register Field Plot in Database →"}
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Right Form: Agonizing 1-Item-Per-Page Record Inspector (5 cols) */}
        <div className="lg:col-span-5 win-window p-3 space-y-3">
          <div className="win-titlebar">
            <span>Holding Dossier Card (Single Record Inspector)</span>
            <span className="text-[10px] font-mono">PAGINATION: 1/PAGE</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500 win-sunken">
              Retrieving cadastral records from Supabase...
            </div>
          ) : farms.length === 0 ? (
            <div className="p-8 text-center text-gray-500 win-sunken">
              No holdings found in the active database.
            </div>
          ) : (
            <div className="space-y-3">
              
              {/* Pagination controls */}
              <div className="flex items-center justify-between bg-[#ece9d8] p-1.5 border border-[#808080] text-[11px]">
                <div className="flex gap-1">
                  <button
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(0)}
                    className="win-btn !p-1 text-[10px]"
                    title="First Record"
                  >
                    |&lt;
                  </button>
                  <button
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    className="win-btn !p-1 text-[10px]"
                    title="Previous Record"
                  >
                    &lt; Prev
                  </button>
                </div>

                <span className="font-bold font-mono">
                  RECORD {currentPage + 1} OF {farms.length}
                </span>

                <div className="flex gap-1">
                  <button
                    disabled={currentPage >= farms.length - 1}
                    onClick={() => setCurrentPage(p => Math.min(farms.length - 1, p + 1))}
                    className="win-btn !p-1 text-[10px]"
                    title="Next Record"
                  >
                    Next &gt;
                  </button>
                  <button
                    disabled={currentPage >= farms.length - 1}
                    onClick={() => setCurrentPage(farms.length - 1)}
                    className="win-btn !p-1 text-[10px]"
                    title="Last Record"
                  >
                    &gt;|
                  </button>
                </div>
              </div>

              {/* Dossier Card details */}
              {currentFarm && (
                <div className="win-sunken bg-white p-3 space-y-2 text-[11px]">
                  <div className="border-b border-gray-300 pb-1.5 flex justify-between">
                    <div>
                      <div className="font-bold text-xs text-[#000080]">{currentFarm.farm_name}</div>
                      <div className="text-[10px] text-gray-600 font-mono">UUID: {currentFarm.id}</div>
                    </div>
                    <span className="text-[10px] bg-green-100 text-green-900 border border-green-400 px-1.5 py-0.5 font-bold h-fit">
                      COMPLIANT
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-gray-500 block">Certified Operator:</span>
                      <strong className="text-black">{currentFarm.farmer_name}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Territory / Location:</span>
                      <strong className="text-black">{currentFarm.location}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Surface Area (Hectares):</span>
                      <strong className="text-black font-mono">{currentFarm.total_area_hectares} ha</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Surface Area (Acres):</span>
                      <strong className="text-black font-mono">{(currentFarm.total_area_hectares * 2.47105).toFixed(2)} ac</strong>
                    </div>
                  </div>

                  {/* Registered Plots under this holding */}
                  <div className="pt-2 border-t border-gray-300">
                    <span className="text-[10px] font-bold text-gray-700 block mb-1">
                      Certified Plots ({currentFarm.plots?.length || 0}):
                    </span>
                    {(!currentFarm.plots || currentFarm.plots.length === 0) ? (
                      <div className="text-[10px] text-gray-400 italic">Zero crop plots registered to this holding.</div>
                    ) : (
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {currentFarm.plots.map(p => (
                          <div key={p.id} className="p-1 bg-gray-50 border border-gray-300 flex justify-between items-center text-[10px]">
                            <span className="font-bold">{p.plot_name}</span>
                            <span className="font-mono text-gray-600">{p.crop_type} ({p.growth_stage})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-gray-300 flex justify-between items-center">
                    <span className="text-[9px] text-gray-400 font-mono">
                      Recorded: {new Date(currentFarm.created_at).toLocaleDateString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteFarm(currentFarm.id, currentFarm.farm_name)}
                      className="win-btn !text-red-700 !p-1 text-[10px] font-bold"
                    >
                      Delete Parcel Record
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* Regulatory Waiver Modal */}
      <RegulatoryDisclaimerModal
        isOpen={modalOpen}
        onConfirm={pendingAction || (() => setModalOpen(false))}
        onCancel={() => setModalOpen(false)}
        title="STATUTORY INDEMNITY CERTIFICATION (FORM 704-B)"
      />

    </div>
  );
}
