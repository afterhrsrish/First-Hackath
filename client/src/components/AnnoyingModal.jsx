import React from 'react';
import { AlertTriangle, Skull, CheckCircle2, X } from 'lucide-react';
import { fireObnoxiousConfetti } from './ConfettiBomb';
import { sounds } from './SoundEffects';

export default function AnnoyingModal({
  isOpen,
  title = "ATTENTION VALUED FARMER!",
  message = "Are you 100% certain you wish to interact with this button? Photosynthesis could be irreparably disrupted!",
  onConfirm,
  onCancel,
  confirmText = "PROCEED TO DOOM",
  cancelText = "ABORT & CELEBRATE"
}) {
  if (!isOpen) return null;

  const handleCancelClick = () => {
    fireObnoxiousConfetti(0.5, 0.5);
    if (onCancel) onCancel();
  };

  const handleConfirmClick = () => {
    sounds.playBuzzer();
    if (onConfirm) onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-violent-shake">
      <div className="relative max-w-lg w-full bg-[#FFFF00] border-8 border-[#FF007F] p-6 shadow-[12px_12px_0px_#00FF00] tilt-left">
        
        {/* Fake spinning warning */}
        <div className="flex items-center justify-between pb-4 border-b-4 border-dashed border-[#000000]">
          <div className="flex items-center gap-3">
            <Skull className="w-10 h-10 text-[#FF007F] animate-fast-spin" />
            <h2 className="text-2xl font-black font-impact text-black tracking-wider uppercase">
              {title}
            </h2>
          </div>
          <button
            onClick={handleCancelClick}
            className="p-1 bg-[#00FF00] text-black font-black hover:bg-black hover:text-white border-2 border-black"
            title="Misleading close button"
          >
            <X className="w-6 h-6 rotate-45" />
          </button>
        </div>

        {/* Ridiculous message */}
        <div className="py-6 space-y-4">
          <p className="text-lg font-bold font-comic text-[#800080] leading-relaxed">
            {message}
          </p>

          <div className="bg-[#FFF0F5] border-4 border-black p-3 text-xs font-mono text-[#000000]">
            <span className="font-bold blink-classic text-red-600">🚨 SYSTEM WARNING:</span>{" "}
            Submitting this dialog may trigger nitrogen volatilization in your local browser cache.
          </div>
        </div>

        {/* Intentionally switched, confusing buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t-4 border-dashed border-black">
          <button
            type="button"
            onClick={handleCancelClick}
            className="flex-1 py-3 px-4 bg-[#00FF00] hover:bg-[#00CC00] text-black font-black uppercase text-sm border-4 border-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1"
          >
            🎉 {cancelText}
          </button>
          
          <button
            type="button"
            onClick={handleConfirmClick}
            className="flex-1 py-3 px-4 bg-[#FF007F] hover:bg-[#E60073] text-white font-black uppercase text-sm border-4 border-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1"
          >
            ⚠️ {confirmText}
          </button>
        </div>

        {/* Annoying footnote */}
        <div className="text-[10px] text-center text-gray-700 mt-4 font-times italic">
          * By clicking either button, you agree to sow random weeds in your neighbors lawn.
        </div>
      </div>
    </div>
  );
}
