import React, { useState } from 'react';
import { sounds } from './SoundEffects';

export default function HostileDoNotClickButton() {
  const [dodgeCount, setDodgeCount] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [popups, setPopups] = useState([]);

  const taunts = [
    "⚠️ RESTRICTED: DO NOT CLICK",
    "✋ STEP AWAY FROM THIS BUTTON",
    "🛑 I WARNED YOU NOT TO HOVER!",
    "🚨 TRACTOR SAFETY CODE VIOLATION",
    "⚠️ WHY ARE YOU STILL TRYING?"
  ];

  const handleHover = () => {
    if (dodgeCount >= 4) return; // Allow click after 4 dodges so they can trigger the popup cascade!
    sounds.playWhoosh();
    const rx = (Math.random() - 0.5) * 80;
    const ry = (Math.random() - 0.5) * 40;
    setPosition({ x: rx, y: ry });
    setDodgeCount(prev => prev + 1);
  };

  const handleClick = () => {
    sounds.playBuzzer();
    setPosition({ x: 0, y: 0 });
    setDodgeCount(0);
    // Spawn 3 cascading error dialogs!
    setPopups([
      {
        id: 1,
        title: "SECURITY INCIDENT: UNAUTHORIZED INTERACTION (0x80041)",
        message: "You clicked the forbidden statutory button. A digital report has been transmitted to county extension services.",
        top: 120,
        left: 100
      },
      {
        id: 2,
        title: "SUBSURFACE SENSOR WARNING: NITROGEN DELETER (0x80042)",
        message: "Excessive cursor vibration detected over restricted button area. Soil microbiome disturbed by 0.003%.",
        top: 200,
        left: 180
      },
      {
        id: 3,
        title: "ADMINISTRATIVE ORDER: FORM 90-A REQUIRED (0x80043)",
        message: "You must manually dismiss all 3 dialog boxes to re-certify your agricultural operator license.",
        top: 280,
        left: 260
      }
    ]);
  };

  const closePopup = (id) => {
    sounds.playWhoosh();
    setPopups(prev => prev.filter(p => p.id !== id));
  };

  return (
    <>
      <div className="inline-block relative">
        <button
          type="button"
          onMouseEnter={handleHover}
          onClick={handleClick}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: 'transform 0.12s ease-out'
          }}
          className="win-btn !bg-[#ffebee] border !border-red-700 text-red-900 font-bold text-[10px] select-none shadow"
        >
          {taunts[Math.min(dodgeCount, taunts.length - 1)]}
        </button>
      </div>

      {/* The Cascading Multiple Popups */}
      {popups.map((p) => (
        <div
          key={p.id}
          style={{ top: `${p.top}px`, left: `${p.left}px` }}
          className="fixed z-50 w-80 win-window shadow-2xl border-2 border-black animate-fade-in"
        >
          <div className="win-titlebar !bg-[#800000]">
            <div className="flex items-center gap-1 text-[10px] font-bold truncate">
              <span>🛑</span>
              <span>{p.title}</span>
            </div>
            <button
              onClick={() => closePopup(p.id)}
              className="win-btn !p-0 !px-1 text-[10px] font-bold"
            >
              ✕
            </button>
          </div>
          <div className="p-3 text-[11px] space-y-2 bg-[#ffffea]">
            <div className="flex items-start gap-2">
              <span className="text-xl">⚠️</span>
              <p className="text-gray-900 leading-snug">{p.message}</p>
            </div>
          </div>
          <div className="p-1.5 bg-[#d4d0c8] flex justify-end">
            <button
              type="button"
              onClick={() => closePopup(p.id)}
              className="win-btn text-[10px] font-bold !px-3"
            >
              Dismiss Alert
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
