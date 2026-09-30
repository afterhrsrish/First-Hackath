import React, { useState, useEffect } from 'react';

const TIPS = [
  "Did you know? Corn stalks can grow up to 2.5 inches per day in hot July weather. Unfortunately, rapid growth does not excuse late acreage tax filing.",
  "Agronomic Rule #41: Never irrigate foliage at high noon on clay soil unless you enjoy watching soil crust into natural ceramic tile.",
  "Subsidized Fact: The average soybean contains 40% protein and 20% oil, none of which will protect you from administrative audit.",
  "Computer Tip: Pressing Refresh repeatedly will not accelerate corn tasseling. Please allow natural photosynthetic cycles to proceed.",
  "Statutory Notice: Nitrogen volatilization occurs primarily when urea is surface-applied without incorporation or immediate rainfall."
];

export default function TipOfTheDayModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Show Tip of the Day after 4 seconds on startup
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 select-none">
      <div className="w-full max-w-md win-window shadow-2xl animate-fade-in border-2 border-black">
        
        {/* Title bar */}
        <div className="win-titlebar">
          <div className="flex items-center gap-1.5 font-bold">
            <span>💡</span>
            <span>Tip of the Day: Precision Agronomy Terminal</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="win-btn !p-0 !px-1.5 text-xs font-bold leading-none">✕</button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 bg-[#d4d0c8]">
          <div className="flex items-start gap-3 win-sunken bg-white p-3 border border-gray-400">
            <div className="text-3xl flex-shrink-0">💡</div>
            <div className="space-y-1 text-[11px] text-gray-900 leading-relaxed">
              <strong className="block text-[#000080] text-xs">Did you know...</strong>
              <p>{TIPS[tipIndex]}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-gray-600">
            <label className="flex items-center gap-1 cursor-not-allowed opacity-70">
              <input type="checkbox" checked={true} disabled className="cursor-not-allowed" />
              <span>Show Tips on Startup (Administrator Locked)</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#808080]">
            <button
              type="button"
              onClick={() => setTipIndex((i) => (i + 1) % TIPS.length)}
              className="win-btn"
            >
              Next Tip &gt;
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="win-btn font-bold !px-4"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
