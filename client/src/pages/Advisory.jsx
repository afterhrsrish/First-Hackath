import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, AlertOctagon, ShieldCheck, HeartHandshake, Zap, CheckCircle2 } from 'lucide-react';
import { fireObnoxiousConfetti } from '../components/ConfettiBomb';
import { sounds } from '../components/SoundEffects';
import RunawayButton from '../components/RunawayButton';
import ChaoticCaptcha from '../components/ChaoticCaptcha';
import AnnoyingModal from '../components/AnnoyingModal';

const CROP_CATALOG = [
  { name: 'Corn (Maize)', icon: '🌽', defaultStage: 'Tasseling' },
  { name: 'Winter Wheat', icon: '🌾', defaultStage: 'Vegetative' },
  { name: 'Soybeans', icon: '🌱', defaultStage: 'Pod Development' },
  { name: 'Wine Grapes', icon: '🍇', defaultStage: 'Fruit Set' },
  { name: 'Cotton', icon: '☁️', defaultStage: 'Boll Opening' },
  { name: 'Rice (Paddy)', icon: '🍚', defaultStage: 'Tillering' },
  { name: 'Potatoes', icon: '🥔', defaultStage: 'Tuber Bulking' },
  { name: 'Alfalfa', icon: '🌿', defaultStage: 'Pre-Bloom' },
  { name: 'Sunflowers', icon: '🌻', defaultStage: 'Ray Floret Stage' },
  { name: 'Barley', icon: '🍺', defaultStage: 'Dough Stage' }
];

export default function Advisory() {
  const [farms, setFarms] = useState([]);
  const [plots, setPlots] = useState([]);
  const [selectedPlotId, setSelectedPlotId] = useState('');
  
  // Slider-based crop index (0 to 9)
  const [cropIndex, setCropIndex] = useState(0);
  const [growthStage, setGrowthStage] = useState('Vegetative');
  const [queryText, setQueryText] = useState('');
  
  // Captcha gate
  const [captchaPassed, setCaptchaPassed] = useState(false);
  
  // API loading & state
  const [loading, setLoading] = useState(false);
  const [advisoryResult, setAdvisoryResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Annoying confirmation modal
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchFarmsAndPlots();
  }, []);

  const fetchFarmsAndPlots = async () => {
    try {
      const res = await fetch('/api/plots');
      const json = await res.json();
      if (json.success && json.data) {
        setPlots(json.data);
        if (json.data.length > 0) {
          setSelectedPlotId(json.data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching plots:', err);
    }
  };

  const currentCrop = CROP_CATALOG[cropIndex];

  const handleQueryChange = (e) => {
    // Annoying text behavior: Forced ALL CAPS
    setQueryText(e.target.value.toUpperCase());
  };

  const handlePreSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!queryText.trim()) {
      sounds.playBuzzer();
      setErrorMessage('🚨 DESCRIBE THE CROP SYMPTOM BEFORE ASKING GEMINI AI!');
      return;
    }
    if (!captchaPassed) {
      sounds.playBuzzer();
      setErrorMessage('🚨 COMPLETE THE BOT DEFENSE CHALLENGE BELOW FIRST!');
      return;
    }

    sounds.playWhoosh();
    setModalOpen(true);
  };

  const executeAdvisoryGeneration = async () => {
    setModalOpen(false);
    setLoading(true);
    setErrorMessage('');
    setAdvisoryResult(null);

    try {
      const payload = {
        plot_id: selectedPlotId || '33333333-3333-3333-3333-333333333333',
        crop_type: currentCrop.name,
        growth_stage: growthStage,
        query_text: queryText
      };

      const res = await fetch('/api/advisory/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      if (json.success) {
        fireObnoxiousConfetti();
        setAdvisoryResult(json.data);
      } else {
        sounds.playBuzzer();
        setErrorMessage(json.error || 'Failed to generate advisory');
      }
    } catch (err) {
      sounds.playBuzzer();
      setErrorMessage(err.message || 'Network tractor explosion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFF00] p-4 md:p-8 space-y-8 select-none">
      
      {/* Title Banner */}
      <section className="bg-white border-8 border-black p-6 brutal-border tilt-left">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black font-impact tracking-wider text-[#FF007F] uppercase flex items-center gap-3">
              <Bot className="w-10 h-10 text-black animate-fast-spin" />
              <span>GEMINI AI CROP ORACLE & DISRUPTION PORTAL</span>
            </h1>
            <p className="font-comic text-sm text-[#008000] font-bold mt-1">
              Real Google GenAI agronomic analysis locked behind an excruciating user interface.
            </p>
          </div>

          <div className="bg-black text-[#00FF00] font-mono text-xs p-3 border-2 border-dashed border-[#FF007F]">
            <div>AI ENGINE: @google/genai</div>
            <div>STATUS: ONLINE & HOSTILE</div>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-600 border-4 border-black text-white font-black text-sm flex items-center justify-between shadow-[4px_4px_0px_#000] animate-pulse">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage('')} className="underline text-xs">DISMISS</button>
          </div>
        )}
      </section>

      {/* Main Interactive Form Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Form: Unbearable Controls */}
        <div className="bg-[#FFF0F5] border-6 border-[#FF007F] p-6 shadow-[10px_10px_0px_#000000] space-y-6 tilt-right">
          
          <div className="border-b-4 border-black pb-3">
            <h2 className="text-xl font-black font-impact text-black uppercase flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-500 animate-bounce" />
              INPUT AGRICULTURAL ANOMALY
            </h2>
          </div>

          {/* Plot Selector */}
          <div>
            <label className="block text-xs font-black font-comic text-black uppercase mb-1">
              1. TARGET FIELD PLOT (SUPABASE UUID):
            </label>
            <select
              value={selectedPlotId}
              onChange={(e) => setSelectedPlotId(e.target.value)}
              className="w-full px-3 py-2 bg-yellow-100 border-4 border-black font-mono text-xs focus:outline-none"
            >
              {plots.length === 0 ? (
                <option value="33333333-3333-3333-3333-333333333333">Demo Plot: North Corn Hazard Patch</option>
              ) : (
                plots.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.plot_name} — {p.crop_type} ({p.growth_stage})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* SLIDER-BASED CROP SELECTION */}
          <div className="p-4 bg-yellow-200 border-4 border-black shadow-[4px_4px_0px_#FF007F] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black font-impact text-purple-900 uppercase">
                2. SLIDER-BASED CROP SELECTOR (NO DROPDOWN FOR YOU):
              </label>
              <span className="text-xl">
                {currentCrop.icon}
              </span>
            </div>

            <div className="text-center py-2 bg-white border-2 border-black">
              <span className="font-impact text-2xl text-[#FF007F] tracking-wide">
                {currentCrop.name}
              </span>
              <div className="text-[11px] font-comic text-gray-700">
                Slider Value: {cropIndex} of {CROP_CATALOG.length - 1}
              </div>
            </div>

            <input
              type="range"
              min="0"
              max={CROP_CATALOG.length - 1}
              step="1"
              value={cropIndex}
              onChange={(e) => {
                sounds.playWhoosh();
                setCropIndex(parseInt(e.target.value, 10));
              }}
              className="w-full h-4 bg-pink-400 border-2 border-black chaotic-slider cursor-grab"
            />
            
            <div className="flex justify-between text-[9px] font-mono text-black font-bold">
              <span>🌽 Corn</span>
              <span>🌱 Soy</span>
              <span>🍇 Grape</span>
              <span>🍺 Barley</span>
            </div>
          </div>

          {/* Growth Stage Selector */}
          <div>
            <label className="block text-xs font-black font-comic text-black uppercase mb-1">
              3. PHENOLOGICAL STAGE:
            </label>
            <select
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value)}
              className="w-full px-3 py-2 bg-green-100 border-4 border-black font-comic text-sm font-bold focus:outline-none"
            >
              <option value="Emergence & Early Vegetative">Emergence & Early Vegetative</option>
              <option value="Vegetative / Rapid Tillering">Vegetative / Rapid Tillering</option>
              <option value="Tasseling / Flowering / Anthesis">Tasseling / Flowering / Anthesis</option>
              <option value="Grain Fill / Pod Development">Grain Fill / Pod Development</option>
              <option value="Physiological Maturity / Senescence">Physiological Maturity / Senescence</option>
            </select>
          </div>

          {/* Query text area: Forced uppercase */}
          <div>
            <label className="block text-xs font-black font-comic text-black uppercase mb-1">
              4. CROP SYMPTOMS & OBSERVATION (FORCED ALL-CAPS):
            </label>
            <textarea
              rows={4}
              required
              value={queryText}
              onChange={handleQueryChange}
              placeholder="DESCRIBE LESIONS, DISCOLORATION, PEST BITES, WILTING, OR STRANGE ODORS..."
              className="w-full p-3 bg-yellow-50 border-4 border-black font-mono text-sm uppercase focus:bg-[#00FF00] focus:text-black focus:outline-none"
            />
            <div className="text-[10px] font-times italic text-gray-600 mt-1">
              * Any lowercase letters you type will be aggressively capitalized by our punitive JavaScript listener.
            </div>
          </div>

          {/* Bot Defense CAPTCHA Gate */}
          <ChaoticCaptcha 
            onVerified={(ok) => setCaptchaPassed(ok)} 
            title="AGRICULTURAL VERIFICATION CHALLENGE"
          />

          {/* Runaway Submit Button */}
          <div className="text-center pt-2">
            <RunawayButton
              onClick={handlePreSubmit}
              maxDodges={5}
              className="bg-[#00FF00] hover:bg-yellow-300 text-black border-4 border-black shadow-[6px_6px_0px_#000] w-full"
            >
              🚀 CONSULT GEMINI ORACLE (RUNAWAY BUTTON)
            </RunawayButton>
            <p className="text-[10px] font-times italic text-gray-500 mt-1">
              (Button may dart across the screen when hovered. Try to sneak up on it!)
            </p>
          </div>

        </div>

        {/* Right Column: AI Output or Loading State */}
        <div className="bg-[#E6FFE6] border-6 border-[#00FF00] p-6 shadow-[10px_10px_0px_#FF007F] tilt-left flex flex-col justify-between">
          
          <div>
            <div className="border-b-4 border-black pb-3 flex items-center justify-between">
              <h2 className="text-xl font-black font-impact text-black uppercase flex items-center gap-2">
                <AlertOctagon className="w-6 h-6 text-red-600 animate-pulse" />
                ORACULAR AGRONOMIC DIAGNOSTIC
              </h2>
              <span className="text-[10px] font-retro bg-black text-[#00FF00] px-2 py-1">
                JSON REST API
              </span>
            </div>

            {loading && (
              <div className="py-24 text-center space-y-4">
                <div className="inline-block p-6 bg-[#FF007F] border-4 border-black animate-violent-shake">
                  <Bot className="w-16 h-16 text-yellow-300 animate-fast-spin mx-auto" />
                </div>
                <div className="font-black text-2xl font-impact text-[#FF007F] blink-classic">
                  COMMUNING WITH GEMINI NEURAL AGRONOMY ENGINE...
                </div>
                <p className="font-comic text-xs text-gray-800">
                  Measuring stomatal conductance, nitrogen assimilation, and soil microbial respiration...
                </p>
              </div>
            )}

            {!loading && !advisoryResult && (
              <div className="py-20 text-center space-y-4">
                <div className="text-6xl animate-bounce">🌾</div>
                <div className="font-impact text-xl text-gray-700 uppercase">
                  AWAITING FARMER SUBMISSION
                </div>
                <p className="font-comic text-xs text-gray-600 max-w-sm mx-auto">
                  Select your crop with the slider, describe the symptoms, conquer the bot verification test, and catch the runaway button!
                </p>
              </div>
            )}

            {!loading && advisoryResult && (
              <div className="mt-4 space-y-5">
                
                {/* Blinking Diagnosis Headline */}
                <div className="p-4 bg-white border-4 border-black shadow-[6px_6px_0px_#000]">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[10px] font-retro bg-[#FF007F] text-white px-2 py-0.5">
                        DIAGNOSIS
                      </span>
                      <h3 className="text-2xl font-black font-impact text-red-600 blink-classic mt-1">
                        🚨 {advisoryResult.condition_diagnosis}
                      </h3>
                    </div>

                    <span className={`text-xs font-retro px-3 py-1 border-2 border-black ${
                      advisoryResult.urgency_level === 'CRITICAL' ? 'bg-red-600 text-white animate-pulse' :
                      advisoryResult.urgency_level === 'HIGH' ? 'bg-orange-500 text-white' : 'bg-yellow-400 text-black'
                    }`}>
                      {advisoryResult.urgency_level} URGENCY
                    </span>
                  </div>

                  <p className="mt-2 text-xs font-comic text-gray-800 font-bold bg-yellow-100 p-2 border border-black">
                    {advisoryResult.summary || 'Agricultural analysis synthesized by Gemini AI.'}
                  </p>
                </div>

                {/* Immediate Threat Alert */}
                {advisoryResult.action_plan?.immediate_threat && (
                  <div className="p-3 bg-red-100 border-4 border-red-700 text-red-900 font-comic text-xs">
                    <span className="font-black font-impact text-sm block">⚠️ IMMEDIATE 48-72 HOUR THREAT:</span>
                    {advisoryResult.action_plan.immediate_threat}
                  </div>
                )}

                {/* Step-by-Step Action Plan */}
                <div className="p-4 bg-yellow-100 border-4 border-black shadow-[4px_4px_0px_#000]">
                  <h4 className="font-black font-impact text-sm text-black uppercase mb-2">
                    📋 ACTION PROTOCOL (CONCRETE STEPS):
                  </h4>
                  <ul className="space-y-1.5 text-xs font-mono">
                    {(advisoryResult.action_plan?.steps || []).map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-white p-2 border border-black">
                        <CheckCircle2 className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Treatments & Prevention */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {advisoryResult.action_plan?.chemical_or_organic_treatments && (
                    <div className="p-3 bg-cyan-100 border-2 border-black">
                      <strong className="font-impact text-cyan-900 block mb-1">TREATMENTS:</strong>
                      <ul className="list-disc list-inside font-comic text-[11px] space-y-1">
                        {advisoryResult.action_plan.chemical_or_organic_treatments.map((t, idx) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {advisoryResult.action_plan?.preventative_measures && (
                    <div className="p-3 bg-purple-100 border-2 border-black">
                      <strong className="font-impact text-purple-900 block mb-1">PREVENTION:</strong>
                      <ul className="list-disc list-inside font-comic text-[11px] space-y-1">
                        {advisoryResult.action_plan.preventative_measures.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="text-[10px] font-mono text-gray-600 bg-white/70 p-2 border border-black flex justify-between">
                  <span>PERSISTED TO SUPABASE ADVISORIES</span>
                  <span>ID: {advisoryResult.id?.slice(0, 8)}...</span>
                </div>

              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t-2 border-black flex justify-between items-center text-xs font-comic">
            <span>🌾 Agro-Chaos AI Assistant</span>
            <button
              onClick={() => fireObnoxiousConfetti()}
              className="text-[10px] font-retro text-purple-900 underline"
            >
              🎉 Confetti Blast
            </button>
          </div>

        </div>

      </section>

      {/* Confirmation Modal */}
      <AnnoyingModal
        isOpen={modalOpen}
        title="⚠️ TRANSMIT SYMPTOMS TO GOOGLE GEMINI?"
        message="Are you certain you wish to awaken the Gemini AI model? It might point out that your irrigation practices are questionable."
        onConfirm={executeAdvisoryGeneration}
        onCancel={() => setModalOpen(false)}
        confirmText="YES, AWAKEN GEMINI"
        cancelText="CANCEL & CELEBRATE"
      />

    </div>
  );
}
