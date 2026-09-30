import React, { useState } from 'react';

/**
 * Agonizing 3-tier cascading confirmation modal
 * Stage 1: Basic bureaucratic confirmation
 * Stage 2: Ecological resource impact calculation
 * Stage 3: The Deceptive Button: "Click 'DO NOT CLICK' to proceed. 'PROCEED' will cancel!"
 */
export default function CascadeConfirmationModal({
  isOpen,
  title = "USDA STATUTORY TRANSACTION VERIFICATION",
  actionName = "commit this agricultural data",
  onFinalConfirm,
  onCancel
}) {
  const [stage, setStage] = useState(1);
  const [swappedButtons, setSwappedButtons] = useState(false);

  if (!isOpen) return null;

  const handleStage1Next = () => {
    setStage(2);
  };

  const handleStage2Next = () => {
    setStage(3);
  };

  const handleFinalSuccess = () => {
    setStage(1);
    if (onFinalConfirm) onFinalConfirm();
  };

  const handleAbort = () => {
    setStage(1);
    if (onCancel) onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 select-none">
      <div className="w-full max-w-lg win-window shadow-2xl animate-fade-in border-2 border-black">
        
        {/* Title bar */}
        <div className="win-titlebar">
          <div className="flex items-center gap-1.5 font-bold">
            <span>🛡️</span>
            <span>{title} — [CONFIRMATION LEVEL {stage} OF 3]</span>
          </div>
          <button onClick={handleAbort} className="win-btn !p-0 !px-1.5 text-xs font-bold leading-none">✕</button>
        </div>

        {/* Content based on Stage */}
        <div className="p-4 space-y-3">
          
          {/* Progress bar showing 3 stages */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-gray-700 font-mono">
              <span>Security Interlock Progress</span>
              <span className="font-bold">Stage {stage}/3</span>
            </div>
            <div className="w-full win-sunken h-3.5 bg-gray-200 p-0.5">
              <div
                className="h-full bg-[#000080] transition-all duration-300"
                style={{ width: `${(stage / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* STAGE 1: The standard bureaucratic question */}
          {stage === 1 && (
            <div className="space-y-2 text-[11px]">
              <div className="flex items-start gap-2 bg-[#ffffea] border border-[#808080] p-2">
                <span className="text-xl">⚠️</span>
                <div>
                  <strong>INTERLOCK LEVEL 1: INTENT VERIFICATION</strong>
                  <p className="mt-0.5 text-gray-700">
                    Are you certain you possess lawful administrative authority to {actionName}? 
                    This will alter state in Supabase Cloud PostgreSQL.
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 italic">
                Statutory Reference: CFR Title 7, Chapter IX, § 981.42
              </p>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#808080]">
                <button type="button" onClick={handleAbort} className="win-btn">
                  Cancel Transaction
                </button>
                <button type="button" onClick={handleStage1Next} className="win-btn font-bold !px-4">
                  Yes, I Possess Authority →
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: The ridiculous environmental/cloud impact */}
          {stage === 2 && (
            <div className="space-y-2 text-[11px]">
              <div className="flex items-start gap-2 bg-[#ffebee] border border-[#808080] p-2">
                <span className="text-xl">⚡</span>
                <div>
                  <strong>INTERLOCK LEVEL 2: COMPUTATIONAL & NITROGEN IMPACT</strong>
                  <p className="mt-0.5 text-gray-700">
                    Transmitting this payload will consume approximately 0.042 kWh of cloud compute and trigger an active phytosanitary audit record.
                  </p>
                </div>
              </div>
              <div className="win-sunken bg-white p-2 font-mono text-[10px] space-y-0.5 text-gray-700">
                <div>[x] Carbon Offset Allocation: PENDING</div>
                <div>[x] Supabase TLS 1.3 Handshake: VERIFIED</div>
                <div>[x] Local Extension Notification: QUEUED</div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#808080]">
                <button type="button" onClick={handleAbort} className="win-btn">
                  Abort & Save Compute
                </button>
                <button type="button" onClick={handleStage2Next} className="win-btn font-bold !px-4">
                  Proceed to Final Interlock →
                </button>
              </div>
            </div>
          )}

          {/* STAGE 3: THE DECEPTIVE BUTTON TRICK */}
          {stage === 3 && (
            <div className="space-y-3 text-[11px]">
              <div className="flex items-start gap-2 bg-[#fff3cd] border border-[#856404] p-2.5">
                <span className="text-2xl">🚨</span>
                <div>
                  <strong className="text-red-900 block text-xs">
                    FINAL INTERLOCK LEVEL 3: INVERSE BUTTON TEST
                  </strong>
                  <p className="mt-1 text-gray-900 font-bold leading-snug">
                    READ CAREFULLY! To prevent accidental automated submission, the button labels have been inverted:
                  </p>
                  <p className="mt-1 text-red-800 font-mono text-[10px] bg-white p-1 border border-red-300">
                    👉 Click <strong>"DO NOT CLICK / CANCEL"</strong> to commit the transaction.
                    <br />
                    👉 Clicking <strong>"PROCEED / CONFIRM"</strong> will abort everything.
                  </p>
                </div>
              </div>

              {/* The inverted buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-[#808080]">
                <button
                  type="button"
                  onClick={handleAbort}
                  className="win-btn text-gray-800 font-bold"
                  title="This button will cancel despite saying Proceed!"
                >
                  PROCEED &amp; CONFIRM (ABORTS TRANSACTION)
                </button>
                <button
                  type="button"
                  onClick={handleFinalSuccess}
                  className="win-btn font-bold !px-4 !bg-[#ffffcc] border-2 !border-red-800 text-red-900 hover:!bg-yellow-200"
                  title="This is the true confirmation button!"
                >
                  ⚠️ DO NOT CLICK (COMMITS TRANSACTION)
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
