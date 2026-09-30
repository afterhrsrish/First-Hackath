import React, { useState, useEffect } from 'react';

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
  const [dismissCountdown, setDismissCountdown] = useState(0);

  useEffect(() => {
    // Show auditor after 12 seconds
    const timer = setTimeout(() => {
      setVisible(true);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismissClick = () => {
    if (dismissCountdown > 0) return;
    setDismissCountdown(3);
    const interval = setInterval(() => {
      setDismissCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setVisible(false);
          // Re-arm after 60 seconds
          setTimeout(() => {
            setMsgIndex(i => (i + 1) % AUDITOR_MESSAGES.length);
            setVisible(true);
          }, 60000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-8 right-6 z-40 w-80 win-window shadow-2xl animate-fade-in select-none">
      <div className="win-titlebar !bg-gradient-to-r !from-[#800000] !to-[#b53a3a]">
        <div className="flex items-center gap-1 text-[11px] font-bold">
          <span>📋</span>
          <span>Bartholomew (USDA Compliance Auditor)</span>
        </div>
        <button
          onClick={handleDismissClick}
          className="win-btn !p-0 !px-1 text-[10px] leading-none"
          title="Dismiss auditor notice"
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

      <div className="p-2 bg-[#d4d0c8] flex items-center justify-between">
        <span className="text-[10px] text-gray-600 font-mono">
          Ref: SEC-704/B
        </span>
        <button
          type="button"
          onClick={handleDismissClick}
          disabled={dismissCountdown > 0}
          className="win-btn text-[10px] font-bold"
        >
          {dismissCountdown > 0 ? `Acknowledging (${dismissCountdown}s)...` : "Acknowledge & Dismiss"}
        </button>
      </div>
    </div>
  );
}
