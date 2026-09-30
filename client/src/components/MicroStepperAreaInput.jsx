import React, { useState } from 'react';
import { sounds } from './SoundEffects';

export default function MicroStepperAreaInput({
  value,
  onChange,
  onVerificationChange,
  label = "STATUTORY SURFACE AREA (STEPPERS ONLY)"
}) {
  const [currentVal, setCurrentVal] = useState(Number(value) || 25.0);
  const [conversionVerified, setConversionVerified] = useState(false);
  const [typingWarning, setTypingWarning] = useState(false);

  const updateVal = (delta) => {
    sounds.playWhoosh();
    const next = Math.max(0.1, parseFloat((currentVal + delta).toFixed(2)));
    setCurrentVal(next);
    setConversionVerified(false);
    if (onVerificationChange) onVerificationChange(false);
    if (onChange) onChange(next);
  };

  const handleAttemptTyping = () => {
    sounds.playBuzzer();
    setTypingWarning(true);
    setTimeout(() => setTypingWarning(false), 3000);
  };

  const verifyAcreage = () => {
    sounds.playConfettiDing();
    setConversionVerified(true);
    if (onVerificationChange) onVerificationChange(true);
  };

  return (
    <div className="p-2 win-sunken-gray space-y-2 select-none border border-[#808080]">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-gray-800 uppercase flex items-center gap-1">
          <span>📐</span>
          <span>{label}</span>
        </label>
        <span className="text-[10px] text-red-800 font-mono font-bold bg-yellow-100 px-1 border border-yellow-400">
          KEYBOARD INPUT BANNED
        </span>
      </div>

      {typingWarning && (
        <div className="p-1 bg-[#ffebee] border border-red-700 text-red-900 text-[10px] font-mono animate-pulse">
          ⚠️ DIRECT TYPING PROHIBITED: Section 88-B dictates acreage must be incremented solely via certified stepper buttons!
        </div>
      )}

      {/* Stepper controls */}
      <div className="flex items-center justify-between gap-1 bg-[#d4d0c8] p-1.5 win-sunken">
        <div className="flex items-center gap-0.5">
          <button type="button" onClick={() => updateVal(-100)} className="win-btn !p-1 text-[10px] font-bold">-100</button>
          <button type="button" onClick={() => updateVal(-10)} className="win-btn !p-1 text-[10px] font-bold">-10</button>
          <button type="button" onClick={() => updateVal(-1)} className="win-btn !p-1 text-[10px] font-bold">-1</button>
          <button type="button" onClick={() => updateVal(-0.1)} className="win-btn !p-1 text-[10px] font-bold">-0.1</button>
        </div>

        {/* Read-Only Display (Direct typing banned!) */}
        <div 
          onClick={handleAttemptTyping}
          className="px-3 py-1 bg-white border border-[#404040] text-center min-w-[120px] cursor-not-allowed"
          title="Direct typing is strictly prohibited by regulation"
        >
          <input
            type="text"
            readOnly
            value={currentVal.toFixed(2)}
            onKeyDown={handleAttemptTyping}
            className="w-20 text-center font-mono font-bold text-xs !border-none !p-0 focus:outline-none cursor-not-allowed bg-transparent"
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

      {/* Mandatory Redundant Re-Verification Button */}
      <div className="flex items-center justify-between text-[10px] text-gray-700 bg-white p-1.5 border border-gray-400">
        <div>
          <span>Imperial Acres Calculation: </span>
          <span className="font-mono font-bold text-black">
            {(currentVal * 2.47105).toFixed(4)} acres
          </span>
        </div>
        <button
          type="button"
          onClick={verifyAcreage}
          className={`win-btn !p-1 !px-2 text-[10px] font-bold ${
            conversionVerified
              ? '!bg-[#e6ffe6] text-green-900 border-green-800'
              : '!bg-[#ffebee] text-red-900 border-red-800 animate-pulse'
          }`}
        >
          {conversionVerified ? "✓ Conversion Legally Verified" : "⚠️ Re-Verify Conversion (Required)"}
        </button>
      </div>

      {!conversionVerified && (
        <div className="text-[9px] text-red-700 font-mono italic">
          * Notice: Form submission is locked until you click "Re-Verify Conversion (Required)".
        </div>
      )}
    </div>
  );
}
