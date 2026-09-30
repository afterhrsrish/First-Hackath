import React, { useState } from 'react';

export default function MicroStepperAreaInput({ value, onChange, label = "SURFACE AREA (IN HECTARES)" }) {
  const [currentVal, setCurrentVal] = useState(Number(value) || 25.0);
  const [conversionVerified, setConversionVerified] = useState(true);

  const updateVal = (delta) => {
    const next = Math.max(0.1, parseFloat((currentVal + delta).toFixed(2)));
    setCurrentVal(next);
    setConversionVerified(false);
    if (onChange) onChange(next);
  };

  const handleManualBlur = (e) => {
    let num = parseFloat(e.target.value);
    if (isNaN(num) || num < 0.1) num = 0.1;
    num = parseFloat(num.toFixed(2));
    setCurrentVal(num);
    setConversionVerified(false);
    if (onChange) onChange(num);
  };

  const verifyAcreage = () => {
    setConversionVerified(true);
  };

  return (
    <div className="p-2 win-sunken-gray space-y-2 select-none border border-[#808080]">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-gray-800 uppercase flex items-center gap-1">
          <span>📐</span>
          <span>{label}</span>
        </label>
        <span className="text-[10px] text-gray-600 font-mono">
          USDA Rule 88.4 (Sub-meter Accuracy)
        </span>
      </div>

      {/* Stepper controls */}
      <div className="flex items-center justify-between gap-1 bg-[#d4d0c8] p-1.5 win-sunken">
        <div className="flex items-center gap-0.5">
          <button type="button" onClick={() => updateVal(-100)} className="win-btn !p-1 text-[10px] font-bold">-100</button>
          <button type="button" onClick={() => updateVal(-10)} className="win-btn !p-1 text-[10px] font-bold">-10</button>
          <button type="button" onClick={() => updateVal(-1)} className="win-btn !p-1 text-[10px] font-bold">-1</button>
          <button type="button" onClick={() => updateVal(-0.1)} className="win-btn !p-1 text-[10px] font-bold">-0.1</button>
        </div>

        {/* Display */}
        <div className="px-3 py-1 bg-white border border-[#404040] text-center min-w-[120px]">
          <input
            type="number"
            step="0.1"
            value={currentVal}
            onChange={(e) => {
              setCurrentVal(e.target.value);
              setConversionVerified(false);
            }}
            onBlur={handleManualBlur}
            className="w-20 text-center font-mono font-bold text-xs !border-none !p-0 focus:outline-none"
          />
          <span className="font-mono text-xs text-gray-600 ml-1">ha</span>
        </div>

        <div className="flex items-center gap-0.5">
          <button type="button" onClick={() => updateVal(0.1)} className="win-btn !p-1 text-[10px] font-bold">+0.1</button>
          <button type="button" onClick={() => updateVal(1)} className="win-btn !p-1 text-[10px] font-bold">+1</button>
          <button type="button" onClick={() => updateVal(10)} className="win-btn !p-1 text-[10px] font-bold">+10</button>
          <button type="button" onClick={() => updateVal(100)} className="win-btn !p-1 text-[10px] font-bold">+100</button>
        </div>
      </div>

      {/* Imperial Conversion Check */}
      <div className="flex items-center justify-between text-[10px] text-gray-700 bg-white p-1.5 border border-gray-400">
        <div>
          <span>Equivalent in Imperial Acres: </span>
          <span className="font-mono font-bold text-black">
            {(currentVal * 2.47105).toFixed(4)} acres
          </span>
        </div>
        <button
          type="button"
          onClick={verifyAcreage}
          className={`win-btn !p-0.5 !px-2 text-[10px] ${conversionVerified ? 'text-green-800 font-bold' : 'text-blue-900 font-bold underline'}`}
        >
          {conversionVerified ? "✓ Conversion Verified" : "Re-Verify Conversion (Required)"}
        </button>
      </div>
    </div>
  );
}
