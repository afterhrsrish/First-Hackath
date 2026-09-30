import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, TrendingUp, Skull, Zap, DollarSign, CloudRain, Bug, Wheat, Flame } from 'lucide-react';
import { fireObnoxiousConfetti } from '../components/ConfettiBomb';
import { sounds } from '../components/SoundEffects';
import AnnoyingModal from '../components/AnnoyingModal';
import RunawayButton from '../components/RunawayButton';

export default function Home() {
  const [farms, setFarms] = useState([]);
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: '', message: '' });

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const fetchSummaryData = async () => {
    try {
      const [resFarms, resAdv] = await Promise.all([
        fetch('/api/farms').then(r => r.json()),
        fetch('/api/advisories').then(r => r.json())
      ]);
      if (resFarms.success) setFarms(resFarms.data || []);
      if (resAdv.success) setAdvisories(resAdv.data || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalPlots = farms.reduce((acc, f) => acc + (f.plots?.length || 0), 0);
  const totalHectares = farms.reduce((acc, f) => acc + Number(f.total_area_hectares || 0), 0);

  const triggerAnnoyingAlert = (title, message) => {
    sounds.playBuzzer();
    setModalData({ title, message });
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FFFF00] p-4 md:p-8 space-y-8 select-none">
      
      {/* Blinding Headline Section with Ransom Fonts */}
      <section className="bg-white border-8 border-black p-6 brutal-border tilt-left relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#FF007F] rounded-full blur-xl opacity-60 pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-dashed border-[#FF007F] pb-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black flex flex-wrap items-center gap-2">
              <span className="ransom-font-3 text-[#FF007F]">AGRONOMIC</span>
              <span className="ransom-font-1 text-[#008000] rotate-2">DISASTER</span>
              <span className="ransom-font-2 text-[#0000FF] -rotate-3">COMMAND</span>
              <span className="ransom-font-5 text-red-600">CENTER</span>
            </h1>
            <p className="text-sm md:text-base mt-2 flex flex-wrap gap-1 font-bold">
              <span className="ransom-font-1 text-purple-800">Where artificial</span>
              <span className="ransom-font-2 text-pink-700 underline">intelligence meets</span>
              <span className="ransom-font-4 text-emerald-800 font-serif italic text-lg">absolute visual hostility</span>
              <span className="ransom-font-3 text-red-600 tracking-widest">& agricultural triumph.</span>
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                fireObnoxiousConfetti();
                triggerAnnoyingAlert("WHY DID YOU CLICK THAT?", "You clicked an unlabelled button and 4 gallons of fertilizer evaporated into thin air.");
              }}
              className="px-4 py-2 bg-[#FF007F] hover:bg-black text-[#00FF00] font-black text-sm uppercase brutal-border active:scale-90"
            >
              ⚠️ DO NOT PRESS
            </button>
          </div>
        </div>

        {/* Hazard Marquee */}
        <div className="mt-4 bg-[#FF007F] text-yellow-200 py-1 px-2 font-mono text-xs overflow-hidden border-2 border-black">
          <div className="animate-marquee font-black">
            🌾 CROP HEALTH INDEX: 42.8% [REDUCED DUE TO FONT CHOICE] • WARNING: SOIL SALINITY MEASURED IN TACO SEASONING PACKETS • GEMINI AI SAYS: "WATER CROPS WITH EMOTIONAL SUPPORT" 🌾
          </div>
        </div>
      </section>

      {/* Intentionally Overlapping, Clashing Stat Cards */}
      <section className="relative pt-6">
        <h2 className="text-2xl font-black font-impact text-black uppercase mb-4 flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-[#FF007F] animate-bounce" />
          <span>STATISTICAL TORTURE METRICS (REAL LIVE DATA)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Card 1: Registered Farms - tilted */}
          <div 
            onClick={() => sounds.playConfettiDing()}
            className="bg-[#00FF00] p-6 border-6 border-black shadow-[8px_8px_0px_#FF007F] tilt-right cursor-pointer hover:rotate-6 transition-transform"
          >
            <div className="flex justify-between items-start">
              <Wheat className="w-10 h-10 text-black animate-fast-spin" />
              <span className="text-xs bg-black text-[#00FF00] px-2 py-0.5 font-retro">ACTIVE</span>
            </div>
            <div className="mt-4">
              <div className="text-4xl md:text-5xl font-black font-impact text-black">
                {loading ? '??' : farms.length}
              </div>
              <div className="text-xs font-comic font-bold text-purple-900 mt-1 uppercase">
                FARMS REGISTERED IN SUPABASE
              </div>
              <p className="text-[10px] text-gray-800 mt-2 font-times italic">
                (Clicking this card emits a pleasant chime to lure you into a false sense of security)
              </p>
            </div>
          </div>

          {/* Card 2: Monitored Plots - overlapping */}
          <div 
            onClick={() => sounds.playBuzzer()}
            className="bg-[#FF007F] p-6 border-6 border-black shadow-[8px_8px_0px_#0000FF] tilt-left cursor-pointer hover:-rotate-6 transition-transform -mt-2 lg:-ml-4 z-10"
          >
            <div className="flex justify-between items-start">
              <Bug className="w-10 h-10 text-yellow-300 animate-violent-shake" />
              <span className="text-xs bg-yellow-300 text-black px-2 py-0.5 font-retro">PLOTS</span>
            </div>
            <div className="mt-4">
              <div className="text-4xl md:text-5xl font-black font-impact text-white">
                {loading ? '??' : totalPlots}
              </div>
              <div className="text-xs font-comic font-bold text-yellow-200 mt-1 uppercase">
                CROPS CURRENTLY THREATENED
              </div>
              <p className="text-[10px] text-pink-100 mt-2 font-times italic">
                (Clicking this card triggers an angry buzzer)
              </p>
            </div>
          </div>

          {/* Card 3: Total Area - Low Contrast Torture Card */}
          <div 
            className="low-contrast-trap p-6 border-6 border-[#FFFF00] shadow-[8px_8px_0px_#00FF00] tilt-extreme cursor-pointer"
            onClick={() => triggerAnnoyingAlert("SQUINTING PENALTY", "You were caught squinting at low-contrast white text on pale yellow. You must water 5 sunflowers as penance.")}
          >
            <div className="flex justify-between items-start">
              <DollarSign className="w-10 h-10 text-white" />
              <span className="text-xs bg-white text-yellow-200 px-2 py-0.5 font-retro">HECTARES</span>
            </div>
            <div className="mt-4">
              <div className="text-4xl md:text-5xl font-black font-impact text-white drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                {loading ? '??' : totalHectares.toFixed(1)} ha
              </div>
              <div className="text-xs font-comic font-bold text-white mt-1 uppercase">
                TOTAL ACREAGE (ILLEGIBLE WHITE ON YELLOW)
              </div>
              <p className="text-[9px] text-white/90 mt-2 font-times italic">
                Good luck reading this without increasing monitor contrast!
              </p>
            </div>
          </div>

          {/* Card 4: AI Advisories Generated */}
          <div 
            onClick={() => fireObnoxiousConfetti()}
            className="bg-cyan-300 p-6 border-6 border-black shadow-[8px_8px_0px_#FF6600] tilt-right cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="flex justify-between items-start">
              <Zap className="w-10 h-10 text-orange-600 animate-bounce" />
              <span className="text-xs bg-black text-cyan-300 px-2 py-0.5 font-retro">GEMINI</span>
            </div>
            <div className="mt-4">
              <div className="text-4xl md:text-5xl font-black font-impact text-black">
                {loading ? '??' : advisories.length}
              </div>
              <div className="text-xs font-comic font-bold text-red-700 mt-1 uppercase">
                DIAGNOSTIC ADVISORIES STORED
              </div>
              <p className="text-[10px] text-gray-800 mt-2 font-times italic">
                Powered by @google/genai structured outputs
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Chaotic Split Section: Active Advisories & Live Threat Level */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recent AI Advisories */}
        <div className="lg:col-span-2 bg-[#FFF0F5] border-6 border-[#000000] p-6 shadow-[10px_10px_0px_#00FF00]">
          <div className="flex items-center justify-between pb-3 border-b-4 border-black">
            <h3 className="text-xl font-black font-impact text-black tracking-wide flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              LATEST AI DIAGNOSTICS & THREAT DISPATCHES
            </h3>
            <Link
              to="/advisory"
              className="text-xs font-retro bg-[#00FF00] hover:bg-[#FF007F] hover:text-white text-black p-2 border-2 border-black"
            >
              + NEW ADVISORY
            </Link>
          </div>

          <div className="mt-4 space-y-4 max-h-96 overflow-y-auto pr-2">
            {advisories.length === 0 ? (
              <div className="p-4 bg-yellow-200 border-2 border-black font-comic text-center">
                🌾 No advisories recorded yet. Go generate one with Gemini AI!
              </div>
            ) : (
              advisories.map((adv, idx) => (
                <div
                  key={adv.id || idx}
                  className={`p-4 border-4 border-black ${
                    idx % 2 === 0 ? 'bg-yellow-100 tilt-left' : 'bg-green-100 tilt-right'
                  } shadow-[4px_4px_0px_#000] space-y-2`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-black text-sm font-impact text-[#FF007F]">
                      🚨 {adv.condition_diagnosis}
                    </span>
                    <span className={`text-[10px] font-retro px-2 py-0.5 border border-black ${
                      adv.urgency_level === 'CRITICAL' ? 'bg-red-600 text-white animate-pulse' :
                      adv.urgency_level === 'HIGH' ? 'bg-orange-500 text-black' : 'bg-yellow-400 text-black'
                    }`}>
                      {adv.urgency_level || 'MEDIUM'}
                    </span>
                  </div>

                  <p className="text-xs font-comic text-gray-800">
                    <strong>Farmer Observation:</strong> "{adv.query_text}"
                  </p>

                  {adv.action_plan && (
                    <div className="bg-white/80 p-2 border border-black text-xs font-mono">
                      <div className="font-bold text-red-700">Immediate Action Plan:</div>
                      <ul className="list-disc list-inside mt-1 text-[11px] space-y-0.5">
                        {(adv.action_plan.steps || []).slice(0, 2).map((s, sIdx) => (
                          <li key={sIdx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-[10px] text-gray-500 font-times italic flex justify-between">
                    <span>Target Plot: {adv.plots?.plot_name || 'General Field'}</span>
                    <span>{new Date(adv.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Chaotic Weather & Quick Action Traps */}
        <div className="space-y-6">
          
          {/* Obnoxious Weather Widget */}
          <div className="bg-[#FFFF00] border-6 border-[#FF007F] p-5 shadow-[8px_8px_0px_#000000] tilt-left">
            <h4 className="font-impact text-lg text-black flex items-center gap-2">
              <CloudRain className="w-6 h-6 text-blue-600 animate-bounce" />
              SATELLITE WEATHER DEVASTATION
            </h4>
            
            <div className="mt-3 bg-black text-[#00FF00] p-3 font-mono text-xs space-y-1">
              <div>🌡️ Soil Temp: 114°F (Surface scorched)</div>
              <div>💨 Wind Speed: 88 MPH (Tractor airborne)</div>
              <div>🌧️ Precipitation: Heavy syrup drizzle</div>
              <div className="text-red-400 blink-classic font-bold mt-2">
                ⚠️ FROG TORNADO ADVISORY IN EFFECT
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playBuzzer();
                triggerAnnoyingAlert("PRAYER UNANSWERED", "You requested sunny weather. The server rejected your petition with HTTP status code 418: I'm a teapot.");
              }}
              className="mt-4 w-full py-2 bg-[#00FF00] text-black font-black uppercase text-xs border-2 border-black hover:bg-white active:scale-95"
            >
              ☀️ PRAY FOR BETTER WEATHER
            </button>
          </div>

          {/* Quick Hostile Navigation Box */}
          <div className="bg-purple-200 border-6 border-black p-5 shadow-[8px_8px_0px_#FFFF00] space-y-3">
            <h4 className="font-impact text-lg text-purple-900 uppercase">
              ⚡ HAZARDOUS SHORTCUTS
            </h4>

            <div className="space-y-2">
              <Link
                to="/farms"
                className="block text-center py-2 px-3 bg-[#FF007F] hover:bg-black text-white font-impact text-sm tracking-wider border-2 border-black shadow-[3px_3px_0px_#000]"
              >
                👉 MANAGE FARMS & FIELDS (MAYBE)
              </Link>

              <Link
                to="/advisory"
                className="block text-center py-2 px-3 bg-[#00FF00] hover:bg-white text-black font-impact text-sm tracking-wider border-2 border-black shadow-[3px_3px_0px_#000]"
              >
                🌾 CONSULT GEMINI AI AGRONOMIST
              </Link>

              <Link
                to="/diagnostics"
                className="block text-center py-2 px-3 bg-yellow-400 hover:bg-black hover:text-white text-black font-impact text-sm tracking-wider border-2 border-black shadow-[3px_3px_0px_#000]"
              >
                🔬 UPLOAD INFECTED LEAF PHOTO
              </Link>
            </div>
          </div>

        </div>

      </section>

      {/* Annoying Alert Modal */}
      <AnnoyingModal
        isOpen={modalOpen}
        title={modalData.title}
        message={modalData.message}
        onConfirm={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
      />

    </div>
  );
}
