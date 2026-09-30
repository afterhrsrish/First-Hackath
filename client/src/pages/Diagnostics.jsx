import React, { useState } from 'react';
import { Camera, Upload, AlertTriangle, CheckCircle, Flame, Bug, RefreshCw, Skull } from 'lucide-react';
import { fireObnoxiousConfetti } from '../components/ConfettiBomb';
import { sounds } from '../components/SoundEffects';
import AnnoyingModal from '../components/AnnoyingModal';

const SAMPLE_LEAVES = [
  { name: 'Yellow Striped Corn Leaf', crop: 'Corn (Maize)', symptoms: 'Interveinal chlorosis and yellow striping along lower leaves', icon: '🌽' },
  { name: 'Brown Spot Vineyard Leaf', crop: 'Wine Grapes', symptoms: 'Circular brown necrotic lesions with yellow halos on leaf surface', icon: '🍇' },
  { name: 'Curled Aphid Soybean Leaf', crop: 'Soybeans', symptoms: 'Severe upward leaf cupping with sticky honeydew residues and dark sooty mold', icon: '🌱' },
  { name: 'Powdery White Wheat Blade', crop: 'Winter Wheat', symptoms: 'Fluffy white talcum-powder like fungal patches covering upper leaf surfaces', icon: '🌾' }
];

export default function Diagnostics() {
  const [selectedSample, setSelectedSample] = useState(SAMPLE_LEAVES[0]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Annoying modal
  const [modalOpen, setModalOpen] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      sounds.playWhoosh();
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setUploadedImage(uploadEvent.target.result);
        fireObnoxiousConfetti();
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreAnalyze = () => {
    sounds.playBuzzer();
    setModalOpen(true);
  };

  const executeAnalysis = async () => {
    setModalOpen(false);
    setLoading(true);
    setErrorMessage('');
    setDiagnosticResult(null);

    try {
      const payload = {
        crop_type: selectedSample.crop,
        symptoms: customSymptom || selectedSample.symptoms,
        growth_stage: 'Vegetative to Reproductive',
        image_data: uploadedImage || null
      };

      const res = await fetch('/api/diagnostics/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        fireObnoxiousConfetti();
        setDiagnosticResult(json.diagnostic);
      } else {
        sounds.playBuzzer();
        setErrorMessage(json.error || 'Diagnostic failed');
      }
    } catch (err) {
      sounds.playBuzzer();
      setErrorMessage(err.message || 'Error communicating with vision diagnostic service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFF00] p-4 md:p-8 space-y-8 select-none">
      
      {/* Page Header */}
      <section className="bg-white border-8 border-black p-6 brutal-border tilt-left">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black font-impact tracking-wider text-black uppercase flex items-center gap-3">
              <Camera className="w-10 h-10 text-[#FF007F] animate-fast-spin" />
              <span>LEAF SYMPTOM & PATHOLOGY SCANNER</span>
            </h1>
            <p className="font-comic text-sm text-[#800080] font-bold mt-1">
              Upload suspected diseased foliage into our violently tilted image chamber.
            </p>
          </div>

          <div className="bg-[#FF007F] text-yellow-300 font-impact text-sm p-3 border-4 border-black">
            🚨 ROTATED IMAGE CHAMBER READY
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-600 border-4 border-black text-white font-black text-sm flex items-center justify-between shadow-[4px_4px_0px_#000] animate-pulse">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage('')} className="underline text-xs">DISMISS</button>
          </div>
        )}
      </section>

      {/* Main Grid: Rotated Dropzone + Sample Selector */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Rotated Dropzone & Controls */}
        <div className="bg-[#FFF0F5] border-6 border-[#FF007F] p-6 shadow-[10px_10px_0px_#000000] space-y-6 tilt-right">
          
          <h2 className="text-xl font-black font-impact text-black uppercase flex items-center gap-2 border-b-4 border-black pb-3">
            <Flame className="w-6 h-6 text-red-600 animate-bounce" />
            1. VIOLENTLY ROTATED IMAGE DROPZONE
          </h2>

          {/* Rotated Dropzone */}
          <div className="relative p-6 bg-yellow-200 border-6 border-dashed border-[#FF007F] tilt-extreme hover:rotate-0 transition-transform cursor-pointer text-center group">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            
            {uploadedImage ? (
              <div className="space-y-2">
                <img
                  src={uploadedImage}
                  alt="Uploaded leaf"
                  className="max-h-48 mx-auto border-4 border-black shadow-[4px_4px_0px_#00FF00]"
                />
                <p className="font-retro text-xs text-[#FF007F] font-bold">
                  ✅ LEAF SPECIMEN LOADED INTO SENSOR
                </p>
                <p className="text-[10px] font-comic text-black">
                  Click or drag another image to replace
                </p>
              </div>
            ) : (
              <div className="space-y-3 py-6">
                <Upload className="w-12 h-12 text-[#FF007F] mx-auto animate-bounce group-hover:scale-125 transition-transform" />
                <div className="font-impact text-xl text-black uppercase">
                  DROP LEAF IMAGE HERE (OR CLICK)
                </div>
                <p className="text-xs font-comic text-[#800080] font-bold">
                  (Notice how the entire box is tilted 7 degrees to disorient your cursor!)
                </p>
              </div>
            )}
          </div>

          {/* Sample Preset Selector */}
          <div>
            <label className="block text-xs font-black font-comic text-black uppercase mb-2">
              2. OR SELECT A PRESET DISEASED CROP SAMPLE:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_LEAVES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    sounds.playWhoosh();
                    setSelectedSample(sample);
                    setCustomSymptom(sample.symptoms);
                  }}
                  className={`p-3 text-left border-3 border-black text-xs font-comic font-bold transition-all ${
                    selectedSample.name === sample.name
                      ? 'bg-[#00FF00] shadow-[4px_4px_0px_#FF007F] scale-102'
                      : 'bg-white hover:bg-yellow-200'
                  }`}
                >
                  <div className="text-base mb-1">{sample.icon} {sample.name}</div>
                  <div className="text-[10px] text-gray-600 font-times italic truncate">
                    {sample.crop}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Symptom Description Textarea */}
          <div>
            <label className="block text-xs font-black font-comic text-black uppercase mb-1">
              3. LEAF SYMPTOM SPECIFICATION:
            </label>
            <textarea
              rows={3}
              value={customSymptom || selectedSample.symptoms}
              onChange={(e) => setCustomSymptom(e.target.value)}
              className="w-full p-3 bg-yellow-50 border-4 border-black font-mono text-xs focus:bg-pink-100 focus:outline-none"
            />
          </div>

          {/* Submit Action with Confirmation Trap */}
          <button
            type="button"
            onClick={handlePreAnalyze}
            disabled={loading}
            className="w-full py-4 bg-[#FF007F] hover:bg-[#00FF00] hover:text-black text-white font-impact text-xl uppercase tracking-wider border-4 border-black shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 transition-colors"
          >
            {loading ? '⏳ RUNNING PATHOLOGICAL SCAN...' : '🔬 COMMENCE LEAF PATHOLOGY DIAGNOSIS'}
          </button>

        </div>

        {/* Right Column: Diagnostic Intelligence Result */}
        <div className="bg-[#E6FFE6] border-6 border-[#00FF00] p-6 shadow-[10px_10px_0px_#FF007F] tilt-left flex flex-col justify-between">
          
          <div>
            <div className="border-b-4 border-black pb-3 flex items-center justify-between">
              <h2 className="text-xl font-black font-impact text-black uppercase flex items-center gap-2">
                <Bug className="w-6 h-6 text-purple-700 animate-spin" />
                PATHOLOGY LAB RESULTS
              </h2>
              <span className="text-[10px] font-retro bg-black text-[#00FF00] px-2 py-1">
                AI SENSOR READY
              </span>
            </div>

            {loading && (
              <div className="py-24 text-center space-y-4">
                <div className="inline-block p-6 bg-yellow-300 border-4 border-black animate-violent-shake">
                  <Skull className="w-16 h-16 text-red-600 animate-fast-spin mx-auto" />
                </div>
                <div className="font-black text-2xl font-impact text-red-600 blink-classic">
                  ANALYZING CELLULAR NECROSIS & SPORES...
                </div>
                <p className="font-comic text-xs text-gray-800">
                  Cross-referencing global phytopathology databases and spectral chlorosis indices...
                </p>
              </div>
            )}

            {!loading && !diagnosticResult && (
              <div className="py-20 text-center space-y-4">
                <div className="text-6xl animate-bounce">🔬</div>
                <div className="font-impact text-xl text-gray-700 uppercase">
                  DROP LEAF OR SELECT SAMPLE TO DIAGNOSE
                </div>
                <p className="font-comic text-xs text-gray-600 max-w-sm mx-auto">
                  Our system evaluates leaf spots, wilting, powdery mildew, and aphid damage with high precision.
                </p>
              </div>
            )}

            {!loading && diagnosticResult && (
              <div className="mt-4 space-y-4">
                
                {/* Detected Issue Banner */}
                <div className="p-4 bg-white border-4 border-black shadow-[6px_6px_0px_#000]">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[10px] font-retro bg-red-600 text-white px-2 py-0.5">
                        PATHOGEN / DEFICIENCY DETECTED
                      </span>
                      <h3 className="text-2xl font-black font-impact text-red-600 blink-classic mt-1">
                        🚨 {diagnosticResult.detected_issue}
                      </h3>
                    </div>

                    <span className={`text-xs font-retro px-3 py-1 border-2 border-black ${
                      diagnosticResult.urgency === 'CRITICAL' ? 'bg-red-600 text-white animate-pulse' :
                      diagnosticResult.urgency === 'HIGH' ? 'bg-orange-500 text-white' : 'bg-yellow-400 text-black'
                    }`}>
                      {diagnosticResult.urgency} URGENCY
                    </span>
                  </div>

                  <p className="mt-2 text-xs font-comic text-gray-800 font-bold bg-yellow-100 p-2 border border-black">
                    {diagnosticResult.summary}
                  </p>
                </div>

                {/* Immediate Threat */}
                {diagnosticResult.immediate_threat && (
                  <div className="p-3 bg-red-100 border-4 border-red-700 text-red-900 font-comic text-xs">
                    <span className="font-black font-impact text-sm block">⚠️ PATHOLOGY ALERT:</span>
                    {diagnosticResult.immediate_threat}
                  </div>
                )}

                {/* Treatment Steps */}
                <div className="p-4 bg-yellow-100 border-4 border-black shadow-[4px_4px_0px_#000]">
                  <h4 className="font-black font-impact text-sm text-black uppercase mb-2">
                    💉 EMERGENCY CROP INTERVENTION:
                  </h4>
                  <ul className="space-y-1.5 text-xs font-mono">
                    {(diagnosticResult.treatment_steps || []).map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-white p-2 border border-black">
                        <CheckCircle className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Treatments */}
                {diagnosticResult.treatments?.length > 0 && (
                  <div className="p-3 bg-cyan-100 border-2 border-black text-xs">
                    <strong className="font-impact text-cyan-900 block mb-1">
                      RECOMMENDED SPRAYS / FERTIGATION:
                    </strong>
                    <ul className="list-disc list-inside font-comic text-[11px] space-y-1">
                      {diagnosticResult.treatments.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t-2 border-black flex justify-between items-center text-xs font-comic">
            <span>Leaf Diagnostics v3.1</span>
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
        title="⚠️ SPREAD PATHOLOGY TO AI SENSORS?"
        message="Are you certain you wish to upload this diseased leaf to the AI Agronomist? The digital spores may infect your browser tab!"
        onConfirm={executeAnalysis}
        onCancel={() => setModalOpen(false)}
        confirmText="YES, INFECT WITH SPORES"
        cancelText="CANCEL & CELEBRATE"
      />

    </div>
  );
}
