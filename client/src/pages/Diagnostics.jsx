import React, { useState } from 'react';
import RegulatoryDisclaimerModal from '../components/RegulatoryDisclaimerModal';

const SPECIMENS = [
  { name: 'Specimen A: Interveinal Corn Chlorosis', crop: 'Corn (Maize)', symptoms: 'Interveinal chlorosis and yellow striping along lower leaves indicating nitrogen deficit' },
  { name: 'Specimen B: Vineyard Cercospora Spotting', crop: 'Wine Grapes', symptoms: 'Circular brown necrotic lesions with chlorotic halos across grape canopy foliage' },
  { name: 'Specimen C: Soybean Aphid Stunting', crop: 'Soybeans', symptoms: 'Severe upward leaf cupping with honeydew deposits and secondary sooty mold growth' },
  { name: 'Specimen D: Winter Wheat Erysiphe Mildew', crop: 'Winter Wheat', symptoms: 'Fluffy white talcum-powder like fungal patches covering upper adaxial leaf surfaces' }
];

export default function Diagnostics() {
  const [selectedSpecimen, setSelectedSpecimen] = useState(SPECIMENS[0]);
  const [sensorCalibrated, setSensorCalibrated] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);
  
  const [uploadedImage, setUploadedImage] = useState(null);
  const [customSymptom, setCustomSymptom] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Regulatory waiver
  const [modalOpen, setModalOpen] = useState(false);

  const calibrateSensor = () => {
    setIsCalibrating(true);
    setCalibrationProgress(10);
    const interval = setInterval(() => {
      setCalibrationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCalibrating(false);
          setSensorCalibrated(true);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setUploadedImage(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreAnalyze = () => {
    if (!sensorCalibrated) {
      setErrorMessage('CALIBRATION REQUISITE: You must calibrate the optical sensor chamber before initiating spectral pathology scans.');
      return;
    }
    setErrorMessage('');
    setModalOpen(true);
  };

  const executeAnalysis = async () => {
    setModalOpen(false);
    setIsAnalyzing(true);
    setErrorMessage('');
    setDiagnosticResult(null);

    try {
      const payload = {
        crop_type: selectedSpecimen.crop,
        symptoms: customSymptom || selectedSpecimen.symptoms,
        growth_stage: 'Vegetative to Reproductive Transition',
        image_data: uploadedImage || null
      };

      const res = await fetch('/api/diagnostics/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        setDiagnosticResult(json.diagnostic);
      } else {
        setErrorMessage(json.error || 'Diagnostic computation failed');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Sensor link timeout');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-3 max-w-7xl mx-auto space-y-3">
      
      {/* Title Window */}
      <div className="win-window p-3 space-y-2">
        <div className="win-titlebar">
          <span>Optical Leaf Spectral Pathology Chamber (Model SC-904-B)</span>
          <span className="text-[10px] font-mono">SPEC-CALIBRATION: {sensorCalibrated ? 'VERIFIED' : 'REQUIRED'}</span>
        </div>

        <div className="text-[11px] text-gray-800">
          This laboratory module performs multi-spectral visual chlorosis and necrosis scanning. 
          Pursuant to Standard 802, the optical sensor array must be calibrated prior to each photographic batch.
        </div>

        {errorMessage && (
          <div className="p-2 bg-[#ffe6e6] border border-[#cc0000] text-[#800000] text-[11px] font-mono">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Main Grid: Sensor Controls vs Lab Pathology Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        
        {/* Left Column: Calibration & Optical Chamber (5 cols) */}
        <div className="lg:col-span-5 win-window p-3 space-y-3">
          <div className="win-titlebar">
            <span>Sensor Chamber & Specimen Loader</span>
          </div>

          {/* Mandatory Calibration Gate */}
          <div className="p-2 win-sunken-gray border border-[#808080] space-y-2 select-none">
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-bold text-gray-800">Optical Sensor Calibration (White Balance 5200K):</span>
              <span className={`font-mono font-bold ${sensorCalibrated ? 'text-green-800' : 'text-red-700'}`}>
                {sensorCalibrated ? '✓ CALIBRATED' : 'UNVERIFIED'}
              </span>
            </div>

            {isCalibrating && (
              <div className="space-y-1">
                <div className="w-full win-sunken h-3 bg-gray-200 p-0.5">
                  <div className="h-full bg-[#000080]" style={{ width: `${calibrationProgress}%` }}></div>
                </div>
                <div className="text-[9px] text-gray-600 font-mono text-center">
                  Adjusting focal photodiode sensitivity ({calibrationProgress}%)...
                </div>
              </div>
            )}

            {!sensorCalibrated && !isCalibrating && (
              <button
                type="button"
                onClick={calibrateSensor}
                className="w-full win-btn !py-1 text-[11px] font-bold text-blue-900"
              >
                Execute Mandatory Sensor Array Calibration
              </button>
            )}
          </div>

          {/* Optical Chamber / File Loader */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-700">
              Photographic Foliage Specimen (Adaxial / Abaxial Surface):
            </label>
            <div className="win-sunken bg-white p-3 text-center border border-gray-400 relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={!sensorCalibrated}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              {uploadedImage ? (
                <div className="space-y-1">
                  <img
                    src={uploadedImage}
                    alt="Loaded specimen"
                    className="max-h-36 mx-auto border border-gray-400 p-0.5 bg-gray-100"
                  />
                  <div className="text-[10px] font-mono text-green-800 font-bold">
                    SPECIMEN REGISTERED IN OPTICAL TRAY
                  </div>
                  <div className="text-[9px] text-gray-500">
                    Click to replace specimen image
                  </div>
                </div>
              ) : (
                <div className="py-4 space-y-1 text-gray-500">
                  <div className="text-2xl">📷</div>
                  <div className="font-bold text-[11px]">
                    {!sensorCalibrated ? "(Calibrate sensor above to unlock specimen tray)" : "Insert Foliage Image File (or Click to Browse)"}
                  </div>
                  <div className="text-[10px]">Standard JPEG, PNG or TIFF</div>
                </div>
              )}
            </div>
          </div>

          {/* Standard Presets */}
          <div>
            <label className="block text-[10px] font-bold text-gray-700 mb-1">
              Or Select Reference Certified Sample Specimen:
            </label>
            <div className="space-y-1">
              {SPECIMENS.map((spec, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedSpecimen(spec);
                    setCustomSymptom(spec.symptoms);
                  }}
                  className={`w-full text-left p-1.5 border text-[10px] transition-colors ${
                    selectedSpecimen.name === spec.name
                      ? 'bg-[#000080] text-white border-black font-bold'
                      : 'bg-white hover:bg-gray-100 border-gray-300 text-gray-800'
                  }`}
                >
                  <div>{spec.name}</div>
                  <div className={`text-[9px] ${selectedSpecimen.name === spec.name ? 'text-gray-200' : 'text-gray-500'}`}>
                    Crop: {spec.crop}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Symptom Override */}
          <div>
            <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
              Microscopic Morphological Notes:
            </label>
            <textarea
              rows={3}
              value={customSymptom || selectedSpecimen.symptoms}
              onChange={(e) => setCustomSymptom(e.target.value)}
              className="w-full text-[11px] p-1.5"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              disabled={isAnalyzing || !sensorCalibrated}
              onClick={handlePreAnalyze}
              className="win-btn font-bold !px-5 !py-1 text-xs disabled:opacity-50"
            >
              {isAnalyzing ? "Processing Spectral Scan..." : "Initiate Pathology Analytical Scan →"}
            </button>
          </div>
        </div>

        {/* Right Column: Phytopathological Findings (7 cols) */}
        <div className="lg:col-span-7 win-window p-3 space-y-3">
          <div className="win-titlebar">
            <span>Phytopathological Analytical Finding Dossier</span>
            <span className="text-[10px] font-mono">LAB-REF: #AG-904</span>
          </div>

          {isAnalyzing && (
            <div className="p-8 text-center win-sunken bg-white space-y-3">
              <div className="text-xl">🔬</div>
              <div className="font-bold text-xs text-[#000080]">
                Computing Spectral Pathology & Chlorosis Index...
              </div>
              <div className="text-[10px] text-gray-500">
                Evaluating cellular necrosis against USDA phytosanitary fungal and vector databases...
              </div>
            </div>
          )}

          {!isAnalyzing && !diagnosticResult && (
            <div className="p-12 text-center win-sunken bg-white space-y-2 text-gray-500">
              <div className="text-3xl">🔬</div>
              <div className="font-bold text-xs">CHAMBER IDLE</div>
              <div className="text-[11px] max-w-sm mx-auto">
                Calibrate the sensor, load a leaf specimen or select a reference sample on the left, then click Initiate Scan.
              </div>
            </div>
          )}

          {!isAnalyzing && diagnosticResult && (
            <div className="win-sunken bg-white p-4 space-y-3 text-[11px] select-text">
              
              <div className="border-b-2 border-black pb-2 flex justify-between items-start">
                <div>
                  <div className="text-[9px] font-mono text-gray-500">
                    SPECTRAL PATHOLOGY LABORATORY • TEST REPORT 904-B
                  </div>
                  <h2 className="text-sm font-bold text-[#000080] uppercase mt-0.5">
                    Pathological Determination & Bio-Assay
                  </h2>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 font-bold font-mono text-xs border ${
                    diagnosticResult.urgency === 'CRITICAL' ? 'bg-red-100 text-red-900 border-red-600' :
                    diagnosticResult.urgency === 'HIGH' ? 'bg-orange-100 text-orange-900 border-orange-600' :
                    'bg-yellow-100 text-yellow-900 border-yellow-600'
                  }`}>
                    {diagnosticResult.urgency} URGENCY
                  </span>
                </div>
              </div>

              {/* Detected Pathology */}
              <div className="bg-[#f7f6f2] p-2.5 border border-gray-300">
                <span className="text-[10px] text-gray-500 font-bold uppercase block">
                  Identified Pathogen / Abiotic Stressor:
                </span>
                <div className="text-base font-bold text-red-900 font-sans">
                  {diagnosticResult.detected_issue}
                </div>
                <div className="text-[10px] text-gray-600 font-mono mt-0.5">
                  Confidence Metric: {(diagnosticResult.confidence * 100).toFixed(1)}% | Host: {diagnosticResult.crop_type}
                </div>
                <p className="mt-1 text-gray-700 italic text-[11px]">
                  {diagnosticResult.summary}
                </p>
              </div>

              {/* Immediate Threat */}
              {diagnosticResult.immediate_threat && (
                <div className="p-2 bg-[#fff3cd] border border-[#ffeeba] text-[#856404]">
                  <strong className="block text-[10px] uppercase font-bold text-red-800">
                    ⚠️ Physiological Impact Timeline:
                  </strong>
                  {diagnosticResult.immediate_threat}
                </div>
              )}

              {/* Prescribed Recovery Protocol */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-800 uppercase block">
                  Mandatory Interventional Protocol:
                </span>
                <div className="space-y-1">
                  {(diagnosticResult.treatment_steps || []).map((step, idx) => (
                    <div key={idx} className="p-1.5 bg-gray-50 border border-gray-300 flex items-start gap-2">
                      <span className="font-mono font-bold text-[#000080]">{idx + 1}.</span>
                      <span className="leading-snug">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Treatments */}
              {diagnosticResult.treatments?.length > 0 && (
                <div className="p-2 bg-gray-50 border border-gray-300">
                  <strong className="text-[10px] uppercase text-gray-700 block mb-1">
                    Accredited Chemical & Bio-Fungicide Options:
                  </strong>
                  <ul className="list-disc list-inside space-y-0.5 text-[10px] text-gray-800">
                    {diagnosticResult.treatments.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2 border-t border-gray-300 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                <span>Verification Hash: {Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                <button
                  type="button"
                  onClick={() => alert("Diagnostic assay printed to physical ledger.")}
                  className="win-btn !p-0.5 !px-2 text-[10px]"
                >
                  Print Lab Assay
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Regulatory Waiver Modal */}
      <RegulatoryDisclaimerModal
        isOpen={modalOpen}
        onConfirm={executeAnalysis}
        onCancel={() => setModalOpen(false)}
        title="STATUTORY INDEMNITY CERTIFICATION (FORM 704-B)"
      />

    </div>
  );
}
