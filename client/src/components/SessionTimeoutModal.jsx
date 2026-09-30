import React, { useState, useEffect } from 'react';

export default function SessionTimeoutModal() {
  const [showWarning, setShowWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(30);

  useEffect(() => {
    // Trigger session warning every 90 seconds
    const sessionTimer = setInterval(() => {
      setShowWarning(true);
      setSecondsRemaining(30);
    }, 90000);

    return () => clearInterval(sessionTimer);
  }, []);

  useEffect(() => {
    let countdown;
    if (showWarning && secondsRemaining > 0) {
      countdown = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [showWarning, secondsRemaining]);

  const handleExtendSession = () => {
    setShowWarning(false);
    setSecondsRemaining(30);
  };

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-md win-window shadow-2xl">
        <div className="win-titlebar !bg-[#800000]">
          <div className="flex items-center gap-1.5 font-bold">
            <span>⏱️</span>
            <span>SECURITY WARNING: ADMINISTRATIVE SESSION TIMEOUT</span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-3xl">⚠️</span>
            <div className="space-y-1 text-[11px] text-gray-900">
              <p className="font-bold">
                Your agricultural terminal session is scheduled to terminate in:
              </p>
              <div className="text-xl font-mono font-bold text-red-700">
                00:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining} SECONDS
              </div>
              <p className="text-[10px] text-gray-600">
                Pursuant to USDA Enterprise Security Circular 2024-9, active holding records and AI consultations are automatically locked if operator interaction is not re-certified.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#808080]">
            <button
              type="button"
              onClick={handleExtendSession}
              className="win-btn font-bold !px-4"
            >
              Extend Session (+90 Seconds)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
