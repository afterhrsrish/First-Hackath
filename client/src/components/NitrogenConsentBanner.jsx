import React, { useState } from 'react';

export default function NitrogenConsentBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-[#ffffea] border-t-2 border-b-2 border-[#808080] p-2 text-[10px] text-gray-900 select-none shadow-md z-30 relative">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-base">🍪</span>
          <div>
            <strong className="text-[#800000]">MANDATORY PHYTOSANITARY DATA CONSENT:</strong>{" "}
            This federal terminal utilizes 14 essential regulatory cookies to monitor phosphorus runoff telemetry, 
            track tractor operator keystroke conviction, and optimize soil pH caches.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => alert("Administrative Restriction: Individual cookie parameterization requires Form 409-C signed in blue ink.")}
            className="win-btn text-[10px]"
          >
            Customize 14 Permissions...
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="win-btn font-bold text-[10px] !bg-[#d4d0c8]"
          >
            Acknowledge &amp; Accept All 14 Regulations
          </button>
        </div>
      </div>
    </div>
  );
}
