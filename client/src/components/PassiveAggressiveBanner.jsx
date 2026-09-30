import React, { useState, useEffect } from 'react';
import { sounds } from './SoundEffects';

const MESSAGES = [
  "⚠️ STATUS ADVISORY: [WHY ARE YOU STILL TRYING? SUBMISSION WILL REQUIRE MANUAL ARBITRATION]",
  "⚠️ CADENCE MONITOR: [REGULATORY VIOLATION: INVALID MOUSE TRAJECTORY DETECTED (SECTION 14)]",
  "⚠️ STATUTORY EFFICIENCY: [OPERATOR AGILITY DEFICIENT: DWELL TIME EXCEEDS PERMISSIBLE QUOTA]",
  "⚠️ ERGONOMIC SURVEILLANCE: [CURSOR TRAJECTORY EXHIBITS ANXIETY: AUDITOR BARTHOLOMEW NOTIFIED]",
  "⚠️ SYSTEM REMINDER: [ALL AGRICULTURAL CLAIMS WILL BE SCRUTINIZED PURSUANT TO FORM 104-E]"
];

export default function PassiveAggressiveBanner() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [erraticCursorWarning, setErraticCursorWarning] = useState(false);

  useEffect(() => {
    // Cycle messages every 10 seconds
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Monitor mouse velocity for erratic cursor movements!
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastTime = Date.now();

    const handleMouseMove = (e) => {
      const now = Date.now();
      const dt = now - lastTime;
      if (dt > 100) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const speed = Math.sqrt(dx * dx + dy * dy) / dt;

        // If speed is very high (erratic whipping of cursor)
        if (speed > 4.5 && !erraticCursorWarning) {
          sounds.playBuzzer();
          setErraticCursorWarning(true);
          setTimeout(() => setErraticCursorWarning(false), 4000);
        }

        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = now;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [erraticCursorWarning]);

  return (
    <div className="bg-[#ffffea] border-b-2 border-[#808080] p-1.5 px-3 text-[10px] font-mono select-none flex items-center justify-between text-gray-900 shadow-inner">
      <div className="flex items-center gap-2 truncate">
        {erraticCursorWarning ? (
          <span className="text-red-900 font-bold bg-red-100 p-1 border border-red-500 animate-pulse">
            🚨 ERRATIC MOUSE TRAJECTORY DETECTED: PLEASE GLIDE POINTER WITH GREATER STATUTORY REVERENCE!
          </span>
        ) : (
          <span className="font-bold text-[#800000] tracking-wide">
            {MESSAGES[msgIndex]}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 text-[9px] text-gray-500">
        <span>SECURITY: ACTIVE</span>
        <span className="w-2 h-2 rounded-full bg-green-600 animate-ping inline-block"></span>
      </div>
    </div>
  );
}
