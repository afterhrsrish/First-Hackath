import React, { useState, useEffect } from 'react';
import { sounds } from './SoundEffects';

const AUDITOR_MESSAGES = [
  "NOTE: According to USDA Circular 14-A, farmers must retain nitrogen application receipts for 7 fiscal quarters.",
  "COMPLIANCE ALERT: Failure to report soil compaction exceeding 300 PSI within 72 hours incurs an audit review.",
  "DID YOU KNOW? Winter Wheat requires 120 days of vernalization below 40°F before tillering can be officially certified.",
  "STATUTORY REMINDER: Any unauthorized manure dispersal within 200 feet of an unnamed creek is an administrative misdemeanor.",
  "SYSTEM WARNING: The precision agronomy module detects you have not calibrated your seed drill disc harrows this spring."
];

export default function BartholomewAuditor() {
  const [visible, setVisible] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [dismissCountdown, setDismissCountdown] = useState(8); // Forced 8-second countdown
  const [nestedIncidentOpen, setNestedIncidentOpen] = useState(false);

  useEffect(() => {
    // Show auditor after 5 seconds
    const timer = setTimeout(() => {
      setVisible(true);
      setDismissCountdown(8);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Countdown timer whenever visible
  useEffect(() => {
    let interval;
    if (visible && dismissCountdown > 0) {
      interval = setInterval(() => {
        setDismissCountdown(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [visible, dismissCountdown]);

  // FAKE CLOSE BUTTON: Clicking '✕' spawns a second nested audit notification!
  const handleFakeClose = (e) => {
    e.stopPropagation();
    sounds.playBuzzer();
    setNestedIncidentOpen(true);
  };

  const handleDismissClick = () => {
    if (dismissCountdown > 0) return;
    sounds.playWhoosh();
    setVisible(false);
    setNestedIncidentOpen(false);
    // Re-arm after 35 seconds
    setTimeout(() => {
      setMsgIndex(i => (i + 1) % AUDITOR_MESSAGES.length);
      setDismissCountdown(8);
      setVisible(true);
    }, 35000);
  };

  if (!visible) return null;

  return (
    <>
      <div className="fixed bottom-12 right-6 z-40 w-84 win-window shadow-2xl animate-fade-in select-none border-2 border-black">
        <div className="win-titlebar !bg-gradient-to-r !from-[#800000] !to-[#b53a3a]">
          <div className="flex items-center gap-1 text-[11px] font-bold">
            <span>📋</span>
            <span>Bartholomew (USDA Compliance Auditor)</span>
          </div>
          {/* Fake Close Button */}
          <button
            type="button"
            onClick={handleFakeClose}
            className="win-btn !p-0 !px-1.5 text-[10px] leading-none font-bold"
            title="Close audit notification"
          >
            ✕
          </button>
        </div>

        <div className="p-3 bg-[#ffffea] border-b border-[#808080] text-[11px] space-y-2">
          <div className="flex items-start gap-2">
            <div className="w-10 h-10 bg-[#d4d0c8] win-sunken flex items-center justify-center text-xl flex-shrink-0">
              👨‍💼
            </div>
            <div className="text-gray-900 leading-snug">
              <span className="font-bold text-[#800000] block text-[10px] uppercase tracking-wide">
                Mandatory Regulatory Commentary
              </span>
              {AUDITOR_MESSAGES[msgIndex]}
            </div>
          </div>
        </div>

        <div className="p-2 bg-[#d4d0c8] flex items-center justify-between text-[10px]">
          <span className="text-gray-600 font-mono">
            Ref: SEC-704/B - Dispersal within 200ft
          </span>
          <button
            type="button"
            disabled={dismissCountdown > 0}
            onClick={handleDismissClick}
            className="win-btn text-[10px] font-bold !px-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {dismissCountdown > 0
              ? `Acknowledge & Dismiss (${dismissCountdown}s)...`
              : "Acknowledge & Dismiss"}
          </button>
        </div>
      </div>

      {/* Nested Incident Popup spawned by clicking the fake close button */}
      {nestedIncidentOpen && (
        <div className="fixed bottom-36 right-16 z-50 w-80 win-window shadow-2xl border-2 border-red-900 animate-violent-shake">
          <div className="win-titlebar !bg-[#800000]">
            <div className="flex items-center gap-1 text-[10px] font-bold">
              <span>🚨</span>
              <span>AUDIT INCIDENT: PREMATURE DISMISSAL DETECTED</span>
            </div>
          </div>
          <div className="p-3 bg-[#ffebee] text-[11px] space-y-2">
            <p className="font-bold text-red-900">
              REGULATORY CITATION 0x904-B:
            </p>
            <p className="text-gray-900 text-[10px] leading-snug">
              You clicked the close button (✕) before fulfilling the statutory 8-second comprehension requirement. 
              This infraction has been recorded in the session telemetry buffer.
            </p>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setNestedIncidentOpen(false)}
                className="win-btn text-[10px] font-bold !bg-[#d4d0c8]"
              >
                Accept Citation & Return to Waiting
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
