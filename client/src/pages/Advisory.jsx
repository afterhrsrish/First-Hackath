import React, { useState, useEffect } from 'react';
import RegulatoryDisclaimerModal from '../components/RegulatoryDisclaimerModal';

const COMMON_CROP_LIST = [
  'Corn (Maize)',
  'Winter Wheat',
  'Soybeans',
  'Wine Grapes',
  'Cotton',
  'Paddy Rice',
  'Potatoes',
  'Alfalfa Hay',
  'Sunflowers',
  'Malting Barley'
];

export default function Advisory() {
  const [plots, setPlots] = useState([]);
  const [selectedPlotId, setSelectedPlotId] = useState('');
  const [cropType, setCropType] = useState('Corn (Maize)');
  const [growthStage, setGrowthStage] = useState('Vegetative (V4-V8)');
  const [queryText, setQueryText] = useState('');
  
  // Loading & Diagnostics stages
  const [isProcessing, setIsProcessing] = useState(false);
  const [diagnosticStage, setDiagnosticStage] = useState('');
  const [advisoryResult, setAdvisoryResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Regulatory waiver modal
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchPlots();
  }, []);

  const fetchPlots = async () => {
    try {
      const res = await fetch('/api/plots');
      const json = await res.json();
      if (json.success && json.data) {
        setPlots(json.data);
        if (json.data.length > 0) {
          setSelectedPlotId(json.data[0].id);
          setCropType(json.data[0].crop_type);
        }
      }
    } catch (err) {
      console.error('Error fetching plots for advisory:', err);
    }
  };

  const handlePlotSelectionChange = (e) => {
    const plotId = e.target.value;
    setSelectedPlotId(plotId);
    const found = plots.find(p => p.id === plotId);
    if (found) {
      setCropType(found.crop_type);
      setGrowthStage(found.growth_stage || 'Vegetative');
    }
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (queryText.trim().length < 15) {
      setErrorMessage('STATUTORY DEFICIENCY: Symptom observation must be at least 15 characters of detailed morphological description.');
      return;
    }
    setErrorMessage('');
    setModalOpen(true);
  };

  const executeAdvisoryGeneration = async () => {
    setModalOpen(false);
    setIsProcessing(true);
    setErrorMessage('');
    setAdvisoryResult(null);

    // Staged progress indicators for bureaucratic realism
    setDiagnosticStage('Step 1/4: Initializing Gemini Phytopathology Neural Gateway (@google/genai)...');
    
    setTimeout(() => {
      setDiagnosticStage('Step 2/4: Cross-referencing USDA Regional Chlorosis & Blight Standards...');
    }, 900);

    setTimeout(() => {
      setDiagnosticStage('Step 3/4: Synthesizing multi-modal organic & chemical treatment protocols...');
    }, 1800);

    try {
      const payload = {
        plot_id: selectedPlotId || '33333333-3333-3333-3333-333333333333',
        crop_type: cropType,
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
        setDiagnosticStage('Step 4/4: Committing certified record to Supabase advisories table...');
        setTimeout(() => {
          setAdvisoryResult(json.data);
          setIsProcessing(false);
        }, 600);
      } else {
        setErrorMessage(json.error || 'Diagnostic computation rejected by server.');
        setIsProcessing(false);
      }
    } catch (err) {
      setErrorMessage(`COMMUNICATION FAULT: ${err.message}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-3 max-w-7xl mx-auto space-y-3">
      
      {/* Title Window */}
      <div className="win-window p-3 space-y-2">
        <div className="win-titlebar">
          <span>AI Phytosanitary Diagnostics & Quarantine Advisory Terminal</span>
          <span className="text-[10px] font-mono">POWERED BY @google/genai</span>
        </div>

        <div className="text-[11px] text-gray-800">
          This certified cognitive gateway interfaces with the Gemini AI reasoning models to generate actionable phytopathological 
          diagnoses, immediate threat evaluations, and chemical/organic recovery protocols.
        </div>

        {errorMessage && (
          <div className="p-2 bg-[#ffe6e6] border border-[#cc0000] text-[#800000] text-[11px] font-mono">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Main Grid: Input Form vs Output Certificate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        
        {/* Left Form: Diagnostic Submission (5 cols) */}
        <div className="lg:col-span-5 win-window p-3 space-y-3">
          <div className="win-titlebar">
            <span>Symptom Submission Dossier</span>
          </div>

          <form onSubmit={handlePreSubmit} className="space-y-3 text-[11px]">
            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
                Target Land Parcel / Registered Field Plot
              </label>
              <select
                value={selectedPlotId}
                onChange={handlePlotSelectionChange}
                className="w-full text-[11px]"
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

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
                  Agronomic Crop Species
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full text-[11px]"
                >
                  {COMMON_CROP_LIST.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
                  Phenological Stage
                </label>
                <select
                  value={growthStage}
                  onChange={(e) => setGrowthStage(e.target.value)}
                  className="w-full text-[11px]"
                >
                  <option value="Vegetative (V4-V8)">Vegetative (V4-V8)</option>
                  <option value="Tasseling / Flowering">Tasseling / Flowering</option>
                  <option value="Grain Fill / Pod Setting">Grain Fill / Pod Setting</option>
                  <option value="Physiological Maturity">Physiological Maturity</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-0.5">
                <label className="text-[10px] font-bold text-gray-700">
                  Detailed Symptom & Morphological Observations
                </label>
                <span className={`text-[10px] font-mono ${queryText.length < 15 ? 'text-red-700 font-bold' : 'text-green-800'}`}>
                  {queryText.length}/15 min chars
                </span>
              </div>
              <textarea
                rows={5}
                required
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Describe leaf lesions, interveinal chlorosis, vascular wilt, insect bite margins, soil dampness, or canopy discoloration..."
                className="w-full text-[11px] p-2 leading-relaxed"
              />
              <div className="text-[10px] text-gray-500 italic mt-0.5">
                Observations must adhere to standard phytopathology terminology where possible.
              </div>
            </div>

            {/* Presets for quick evaluation */}
            <div className="bg-[#f0ece4] p-2 border border-[#808080] space-y-1">
              <span className="text-[10px] font-bold text-gray-700 block">
                Quick Observation Presets:
              </span>
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => setQueryText('Lower leaves exhibit V-shaped chlorosis and necrosis along the midrib with stunted stalk elongation.')}
                  className="win-btn !p-0.5 !px-1.5 text-[10px]"
                >
                  Nitrogen Deficit
                </button>
                <button
                  type="button"
                  onClick={() => setQueryText('Circular brown necrotic spots with yellow halos appearing on upper foliage following high relative humidity.')}
                  className="win-btn !p-0.5 !px-1.5 text-[10px]"
                >
                  Fungal Blight
                </button>
                <button
                  type="button"
                  onClick={() => setQueryText('Upward leaf curling, honeydew deposits with dark sooty mold colonization, and visible clusters of sap-feeding nymphs.')}
                  className="win-btn !p-0.5 !px-1.5 text-[10px]"
                >
                  Aphid Infestation
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isProcessing}
                className="win-btn font-bold !px-6 !py-1 text-xs"
              >
                {isProcessing ? "Processing Diagnostic..." : "Commence Gemini AI Diagnostic Protocol →"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Form: Official Phytosanitary Diagnostic Certificate (7 cols) */}
        <div className="lg:col-span-7 win-window p-3 space-y-3">
          <div className="win-titlebar">
            <span>Official Phytosanitary Inspection Certificate</span>
            <span className="text-[10px] font-mono">STATUS: {advisoryResult ? 'VALID' : 'AWAITING DISPATCH'}</span>
          </div>

          {isProcessing && (
            <div className="p-8 text-center win-sunken bg-white space-y-3">
              <div className="text-xl">🤖</div>
              <div className="font-bold text-xs text-[#000080]">
                {diagnosticStage}
              </div>
              <div className="w-48 mx-auto win-sunken h-4 p-0.5 bg-gray-200">
                <div className="h-full bg-[#000080] animate-pulse w-3/4"></div>
              </div>
              <div className="text-[10px] text-gray-500">
                Engaging Google Gemini neural pathways with strict JSON schema parsing...
              </div>
            </div>
          )}

          {!isProcessing && !advisoryResult && (
            <div className="p-12 text-center win-sunken bg-white space-y-2 text-gray-500">
              <div className="text-3xl">📄</div>
              <div className="font-bold text-xs">NO ACTIVE CERTIFICATE LOADED</div>
              <div className="text-[11px] max-w-sm mx-auto">
                Submit an agronomic observation dossier on the left to invoke the Gemini AI engine and receive a certified diagnostic action plan.
              </div>
            </div>
          )}

          {!isProcessing && advisoryResult && (
            <div className="win-sunken bg-white p-4 space-y-3 text-[11px] select-text">
              
              {/* Certificate Header */}
              <div className="border-b-2 border-black pb-2 flex justify-between items-start">
                <div>
                  <div className="text-[9px] font-mono text-gray-500 tracking-wider">
                    UNITED STATES DEPARTMENT OF AGRICULTURE • FORM 804-AI
                  </div>
                  <h2 className="text-sm font-bold text-[#000080] uppercase tracking-tight mt-0.5">
                    Official Crop Diagnostic Clearance & Action Protocol
                  </h2>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 font-bold font-mono text-xs border ${
                    advisoryResult.urgency_level === 'CRITICAL' ? 'bg-red-100 text-red-900 border-red-600' :
                    advisoryResult.urgency_level === 'HIGH' ? 'bg-orange-100 text-orange-900 border-orange-600' :
                    'bg-yellow-100 text-yellow-900 border-yellow-600'
                  }`}>
                    {advisoryResult.urgency_level} URGENCY
                  </span>
                  <div className="text-[9px] text-gray-500 font-mono mt-1">
                    ID: {advisoryResult.id?.slice(0, 8)}...
                  </div>
                </div>
              </div>

              {/* Pathological Diagnosis Headline */}
              <div className="bg-[#f7f6f2] p-2.5 border border-gray-300">
                <span className="text-[10px] text-gray-500 font-bold uppercase block">
                  Primary Pathological Diagnosis:
                </span>
                <div className="text-base font-bold text-red-900 font-sans">
                  {advisoryResult.condition_diagnosis}
                </div>
                {advisoryResult.summary && (
                  <p className="mt-1 text-gray-700 italic text-[11px]">
                    "{advisoryResult.summary}"
                  </p>
                )}
              </div>

              {/* Immediate Threat */}
              {advisoryResult.action_plan?.immediate_threat && (
                <div className="p-2 bg-[#fff3cd] border border-[#ffeeba] text-[#856404]">
                  <strong className="block text-[10px] uppercase font-bold text-red-800">
                    ⚠️ Immediate 48-72 Hour Threat Matrix:
                  </strong>
                  {advisoryResult.action_plan.immediate_threat}
                </div>
              )}

              {/* Action Plan Steps */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-800 uppercase block">
                  Prescribed Agronomic Action Steps:
                </span>
                <div className="space-y-1">
                  {(advisoryResult.action_plan?.steps || []).map((step, idx) => (
                    <div key={idx} className="p-1.5 bg-gray-50 border border-gray-300 flex items-start gap-2">
                      <span className="font-mono font-bold text-[#000080]">{idx + 1}.</span>
                      <span className="leading-snug">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chemical & Organic Treatments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                {advisoryResult.action_plan?.chemical_or_organic_treatments && (
                  <div className="p-2 bg-gray-50 border border-gray-300">
                    <strong className="text-[10px] uppercase text-gray-700 block mb-1">
                      Chemical / Organic Treatments:
                    </strong>
                    <ul className="list-disc list-inside space-y-0.5 text-[10px] text-gray-800">
                      {advisoryResult.action_plan.chemical_or_organic_treatments.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {advisoryResult.action_plan?.preventative_measures && (
                  <div className="p-2 bg-gray-50 border border-gray-300">
                    <strong className="text-[10px] uppercase text-gray-700 block mb-1">
                      Preventative Agronomic Measures:
                    </strong>
                    <ul className="list-disc list-inside space-y-0.5 text-[10px] text-gray-800">
                      {advisoryResult.action_plan.preventative_measures.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer Stamp */}
              <div className="pt-2 border-t border-gray-300 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                <span>Persisted in Supabase PostgreSQL</span>
                <button
                  type="button"
                  onClick={() => alert(`Certificate ${advisoryResult.id?.slice(0, 8)} exported to system print spooler.`)}
                  className="win-btn !p-0.5 !px-2 text-[10px]"
                >
                  Print Official Certificate
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Regulatory Waiver Modal */}
      <RegulatoryDisclaimerModal
        isOpen={modalOpen}
        onConfirm={executeAdvisoryGeneration}
        onCancel={() => setModalOpen(false)}
        title="STATUTORY INDEMNITY CERTIFICATION (FORM 704-B)"
      />

    </div>
  );
}
