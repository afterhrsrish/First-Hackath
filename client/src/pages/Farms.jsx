import React, { useState, useEffect } from 'react';
import { Tractor, Sprout, Plus, Trash2, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { fireObnoxiousConfetti } from '../components/ConfettiBomb';
import { sounds } from '../components/SoundEffects';
import AnnoyingModal from '../components/AnnoyingModal';
import YearSlider from '../components/YearSlider';

export default function Farms() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingFarm, setSubmittingFarm] = useState(false);
  const [submittingPlot, setSubmittingPlot] = useState(false);

  // New Farm Form State
  const [newFarm, setNewFarm] = useState({
    farmer_name: '',
    farm_name: '',
    location: '',
    total_area_hectares: 50
  });

  // New Plot Form State
  const [newPlot, setNewPlot] = useState({
    farm_id: '',
    plot_name: '',
    crop_type: 'Corn (Maize)',
    growth_stage: 'Vegetative'
  });

  // Modal traps
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', onConfirm: () => {} });
  const [errorMessage, setErrorMessage] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  // Scrambled crop options that randomly reorder
  const [cropList, setCropList] = useState([
    'Corn (Maize)',
    'Soybeans',
    'Winter Wheat',
    'Wine Grapes',
    'Barley',
    'Cotton',
    'Alfalfa Hay',
    'Sunflowers',
    'Canola',
    'Ghost Peppers'
  ]);

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/farms');
      const json = await res.json();
      if (json.success) {
        setFarms(json.data || []);
        if (json.data && json.data.length > 0 && !newPlot.farm_id) {
          setNewPlot(prev => ({ ...prev, farm_id: json.data[0].id }));
        }
      }
    } catch (err) {
      console.error('Error fetching farms:', err);
    } finally {
      setLoading(false);
    }
  };

  // Frustrating dropdown trick: scrambles every time user clicks or focuses it!
  const scrambleCrops = () => {
    sounds.playWhoosh();
    setCropList(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  const handleCreateFarm = async (e) => {
    e.preventDefault();
    if (!newFarm.farmer_name || !newFarm.farm_name || !newFarm.location) {
      sounds.playBuzzer();
      setErrorMessage('🚨 YOU DARE SUBMIT AN INCOMPLETE FARM RECORD?');
      return;
    }

    setSubmittingFarm(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/farms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFarm)
      });
      const data = await res.json();

      if (data.success) {
        fireObnoxiousConfetti();
        setSuccessBanner(`🎉 FARM "${data.data.farm_name}" HAS BEEN IMPLANTED INTO DATABASE!`);
        setNewFarm({ farmer_name: '', farm_name: '', location: '', total_area_hectares: 50 });
        fetchFarms();
      } else {
        sounds.playBuzzer();
        setErrorMessage(data.error || 'Failed to create farm');
      }
    } catch (err) {
      sounds.playBuzzer();
      setErrorMessage(err.message);
    } finally {
      setSubmittingFarm(false);
    }
  };

  const handleCreatePlot = async (e) => {
    e.preventDefault();
    if (!newPlot.farm_id || !newPlot.plot_name) {
      sounds.playBuzzer();
      setErrorMessage('🚨 SELECT A FARM AND ENTER A PLOT NAME, MORTAL!');
      return;
    }

    setSubmittingPlot(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/plots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlot)
      });
      const data = await res.json();

      if (data.success) {
        fireObnoxiousConfetti();
        setSuccessBanner(`🌽 FIELD PLOT "${data.data.plot_name}" SOWN SUCCESSFULLY!`);
        setNewPlot(prev => ({ ...prev, plot_name: '' }));
        fetchFarms();
      } else {
        sounds.playBuzzer();
        setErrorMessage(data.error || 'Failed to create plot');
      }
    } catch (err) {
      sounds.playBuzzer();
      setErrorMessage(err.message);
    } finally {
      setSubmittingPlot(false);
    }
  };

  const confirmDeleteFarm = (farmId, farmName) => {
    sounds.playBuzzer();
    setModalConfig({
      title: "🔥 PERMANENT OBLITERATION WARNING",
      message: `Are you completely sure you want to annihilate "${farmName}" from Supabase? The crops will weep and all plot data will vaporize!`,
      onConfirm: async () => {
        try {
          await fetch(`/api/farms/${farmId}`, { method: 'DELETE' });
          fireObnoxiousConfetti();
          setSuccessBanner(`💥 FARM "${farmName}" DEMOLISHED.`);
          fetchFarms();
        } catch (err) {
          console.error(err);
        }
        setModalOpen(false);
      }
    });
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FFFF00] p-4 md:p-8 space-y-8 select-none">
      
      {/* Page Header */}
      <section className="bg-white border-8 border-black p-6 brutal-border tilt-right">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black font-impact tracking-wider text-black uppercase flex items-center gap-3">
              <Tractor className="w-10 h-10 text-[#FF007F] animate-fast-spin" />
              <span>FARM & FIELD REPOSITORY (SUPABASE BACKED)</span>
            </h1>
            <p className="font-comic text-sm text-[#800080] font-bold mt-1">
              Warning: Table contains horizontal scrolling spanning approximately 2.4 kilometers.
            </p>
          </div>

          <button
            onClick={() => {
              fireObnoxiousConfetti();
              fetchFarms();
            }}
            className="px-4 py-2 bg-[#00FF00] hover:bg-black hover:text-white text-black font-black uppercase text-xs border-4 border-black shadow-[4px_4px_0px_#000]"
          >
            <RefreshCw className="w-4 h-4 inline mr-1" /> RE-QUERY SUPABASE
          </button>
        </div>

        {/* Success / Error Banners */}
        {successBanner && (
          <div className="mt-4 p-3 bg-[#00FF00] border-4 border-black text-black font-impact text-lg flex items-center justify-between shadow-[4px_4px_0px_#000]">
            <span>{successBanner}</span>
            <button onClick={() => setSuccessBanner('')} className="text-sm font-retro underline">DISMISS</button>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-600 border-4 border-black text-white font-black text-sm flex items-center justify-between shadow-[4px_4px_0px_#000] animate-pulse">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage('')} className="text-sm underline">CLEAR</button>
          </div>
        )}
      </section>

      {/* Two Hostile Forms in Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Form 1: Create Farm */}
        <div className="bg-[#FFF0F5] border-6 border-[#FF007F] p-6 shadow-[8px_8px_0px_#000000] tilt-left">
          <div className="flex items-center gap-2 pb-3 border-b-4 border-black">
            <Plus className="w-6 h-6 text-[#FF007F]" />
            <h2 className="text-xl font-black font-impact text-black uppercase">
              REGISTER A NEW RANCH / FARM
            </h2>
          </div>

          <form onSubmit={handleCreateFarm} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-black font-comic text-gray-800 uppercase mb-1">
                FARMER FULL NAME (FORCED ALL CAPS):
              </label>
              <input
                type="text"
                required
                value={newFarm.farmer_name}
                onChange={(e) => setNewFarm({ ...newFarm, farmer_name: e.target.value.toUpperCase() })}
                placeholder="E.G. BARNABY HIGGINS"
                className="w-full px-3 py-2 bg-yellow-100 border-4 border-black font-mono text-sm uppercase focus:bg-[#00FF00] focus:text-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black font-comic text-gray-800 uppercase mb-1">
                FARM NAME / COMPOUND IDENTIFIER:
              </label>
              <input
                type="text"
                required
                value={newFarm.farm_name}
                onChange={(e) => setNewFarm({ ...newFarm, farm_name: e.target.value })}
                placeholder="E.G. Muddy Boots Plantation"
                className="w-full px-3 py-2 bg-yellow-100 border-4 border-black font-comic text-sm focus:bg-[#FF007F] focus:text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black font-comic text-gray-800 uppercase mb-1">
                  LOCATION / REGION:
                </label>
                <input
                  type="text"
                  required
                  value={newFarm.location}
                  onChange={(e) => setNewFarm({ ...newFarm, location: e.target.value })}
                  placeholder="E.G. Lubbock, TX"
                  className="w-full px-3 py-2 bg-yellow-100 border-4 border-black font-times italic text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black font-comic text-gray-800 uppercase mb-1">
                  ACREAGE (SLIDER OF DOOM):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="1000"
                    value={newFarm.total_area_hectares}
                    onChange={(e) => setNewFarm({ ...newFarm, total_area_hectares: Number(e.target.value) })}
                    className="w-full h-3 bg-pink-300 border-2 border-black chaotic-slider"
                  />
                  <span className="font-mono text-xs font-bold w-14 text-right">
                    {newFarm.total_area_hectares} ha
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submittingFarm}
              className="w-full py-3 bg-[#00FF00] hover:bg-[#FF007F] hover:text-white text-black font-impact text-lg uppercase tracking-wider border-4 border-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 transition-colors"
            >
              {submittingFarm ? '⏳ TRANSMITTING TO SUPABASE...' : '💾 PERSIST FARM RECORD TO DATABASE'}
            </button>
          </form>
        </div>

        {/* Form 2: Create Plot */}
        <div className="bg-[#E6FFE6] border-6 border-[#00FF00] p-6 shadow-[8px_8px_0px_#FF007F] tilt-right">
          <div className="flex items-center gap-2 pb-3 border-b-4 border-black">
            <Sprout className="w-6 h-6 text-green-700" />
            <h2 className="text-xl font-black font-impact text-black uppercase">
              ADD CROP PLOT TO EXISTING FARM
            </h2>
          </div>

          <form onSubmit={handleCreatePlot} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-black font-comic text-gray-800 uppercase mb-1">
                CHOOSE TARGET FARM:
              </label>
              <select
                value={newPlot.farm_id}
                onChange={(e) => setNewPlot({ ...newPlot, farm_id: e.target.value })}
                className="w-full px-3 py-2 bg-white border-4 border-black font-mono text-sm focus:outline-none"
              >
                {farms.length === 0 ? (
                  <option value="">No farms available (Create one first!)</option>
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
              <label className="block text-xs font-black font-comic text-gray-800 uppercase mb-1">
                PLOT / FIELD NAME:
              </label>
              <input
                type="text"
                required
                value={newPlot.plot_name}
                onChange={(e) => setNewPlot({ ...newPlot, plot_name: e.target.value })}
                placeholder="E.G. East Drainage Quadrant B"
                className="w-full px-3 py-2 bg-yellow-100 border-4 border-black font-comic text-sm focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black font-comic text-gray-800 uppercase mb-1 flex items-center justify-between">
                  <span>CROP SPECIES:</span>
                  <button
                    type="button"
                    onClick={scrambleCrops}
                    className="text-[10px] text-red-600 underline font-normal"
                  >
                    (Scramble)
                  </button>
                </label>
                <select
                  value={newPlot.crop_type}
                  onFocus={scrambleCrops}
                  onChange={(e) => setNewPlot({ ...newPlot, crop_type: e.target.value })}
                  className="w-full px-3 py-2 bg-white border-4 border-black font-impact text-sm focus:outline-none"
                >
                  {cropList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black font-comic text-gray-800 uppercase mb-1">
                  PHENOLOGY / STAGE:
                </label>
                <select
                  value={newPlot.growth_stage}
                  onChange={(e) => setNewPlot({ ...newPlot, growth_stage: e.target.value })}
                  className="w-full px-3 py-2 bg-white border-4 border-black font-mono text-sm focus:outline-none"
                >
                  <option value="Emergence">Emergence</option>
                  <option value="Vegetative">Vegetative</option>
                  <option value="Tillering / Branching">Tillering / Branching</option>
                  <option value="Booting / Tasseling">Booting / Tasseling</option>
                  <option value="Flowering / Anthesis">Flowering / Anthesis</option>
                  <option value="Grain Fill / Fruit Set">Grain Fill / Fruit Set</option>
                  <option value="Physiological Maturity">Physiological Maturity</option>
                  <option value="Post-Harvest Rot">Post-Harvest Rot</option>
                </select>
              </div>
            </div>

            {/* Historical planting year slider */}
            <YearSlider label="TARGET SEEDING DATE (CHOOSE HISTORICAL ERA)" />

            <button
              type="submit"
              disabled={submittingPlot || farms.length === 0}
              className="w-full py-3 bg-[#FF007F] hover:bg-[#00FF00] hover:text-black text-white font-impact text-lg uppercase tracking-wider border-4 border-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 transition-colors"
            >
              {submittingPlot ? '⏳ SEEDING FIELD...' : '🌱 SOW PLOT INTO POSTGRESQL'}
            </button>
          </form>
        </div>

      </section>

      {/* The Hostile Horizontal-Scroll Table of Farms & Plots */}
      <section className="bg-white border-8 border-black p-6 shadow-[12px_12px_0px_#0000FF]">
        <div className="flex items-center justify-between pb-3 border-b-4 border-black">
          <h2 className="text-2xl font-black font-impact text-black uppercase flex items-center gap-2">
            <AlertTriangle className="w-7 h-7 text-yellow-500 animate-bounce" />
            <span>EXCRUCIATING HORIZONTAL DATABASE VIEWER</span>
          </h2>
          <span className="text-xs bg-red-600 text-white px-2 py-1 font-retro">
            SCROLL RIGHT TO ESCAPE →→→
          </span>
        </div>

        {/* Scrollable Container with excessive min-width */}
        <div className="mt-4 overflow-x-auto border-4 border-dashed border-[#FF007F] p-2 bg-yellow-50">
          <table className="min-w-[1400px] w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-[#00FF00] font-mono text-xs uppercase">
                <th className="p-3 border-2 border-[#00FF00]">FARM UUID</th>
                <th className="p-3 border-2 border-[#00FF00]">FARM NAME</th>
                <th className="p-3 border-2 border-[#00FF00]">FARMER</th>
                <th className="p-3 border-2 border-[#00FF00]">LOCATION</th>
                <th className="p-3 border-2 border-[#00FF00]">HECTARES</th>
                <th className="p-3 border-2 border-[#00FF00]">PLOTS & CROPS</th>
                <th className="p-3 border-2 border-[#00FF00]">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center font-comic font-bold text-xl text-purple-700">
                    🚜 DIGGING INTO SUPABASE CLOUD... PLEASE STAND BY...
                  </td>
                </tr>
              ) : farms.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center font-comic font-bold text-lg text-red-600">
                    No farms detected. Fill out the pink form above to spawn your agricultural empire!
                  </td>
                </tr>
              ) : (
                farms.map((farm, idx) => (
                  <tr 
                    key={farm.id}
                    className={`border-b-4 border-black ${
                      idx % 2 === 0 ? 'bg-[#FFFFE0]' : 'bg-[#FFFAF0]'
                    } hover:bg-pink-100 transition-colors`}
                  >
                    <td className="p-3 border-2 border-black font-mono text-[9px] text-gray-500 max-w-[120px] truncate">
                      {farm.id}
                    </td>
                    <td className="p-3 border-2 border-black">
                      <span className="font-black text-base font-impact text-black">
                        {farm.farm_name}
                      </span>
                    </td>
                    <td className="p-3 border-2 border-black">
                      <span className="font-comic font-bold text-xs text-[#800080]">
                        {farm.farmer_name}
                      </span>
                    </td>
                    <td className="p-3 border-2 border-black font-times italic text-sm">
                      {farm.location}
                    </td>
                    <td className="p-3 border-2 border-black font-mono font-bold text-sm text-green-700">
                      {farm.total_area_hectares} ha
                    </td>
                    <td className="p-3 border-2 border-black">
                      <div className="flex flex-wrap gap-2 max-w-md">
                        {(!farm.plots || farm.plots.length === 0) ? (
                          <span className="text-[11px] font-times italic text-gray-500">
                            Zero crops sown (barren desert)
                          </span>
                        ) : (
                          farm.plots.map(p => (
                            <span 
                              key={p.id}
                              className="px-2 py-1 bg-[#00FF00] border border-black text-black font-comic font-bold text-xs shadow-[2px_2px_0px_#000]"
                            >
                              🌽 {p.plot_name} ({p.crop_type} - {p.growth_stage})
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="p-3 border-2 border-black">
                      <button
                        onClick={() => confirmDeleteFarm(farm.id, farm.farm_name)}
                        className="p-2 bg-red-600 hover:bg-black text-white font-bold text-xs border-2 border-black shadow-[2px_2px_0px_#000] active:scale-90 flex items-center gap-1"
                        title="Delete farm"
                      >
                        <Trash2 className="w-4 h-4" /> EXTERMINATE
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-2 bg-black text-[#00FFFF] font-mono text-xs flex justify-between">
          <span>SUPABASE SYNC: 🟢 CONNECTED & PERSISTING</span>
          <span>PRESS SHIFT+SCROLL TO NAVIGATE TABLE RIGHT</span>
        </div>
      </section>

      {/* Confirmation Modal */}
      <AnnoyingModal
        isOpen={modalOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalOpen(false)}
        confirmText="YES, OBLITERATE"
        cancelText="CANCEL & CELEBRATE"
      />

    </div>
  );
}
