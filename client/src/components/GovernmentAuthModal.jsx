import React, { useState } from 'react';
import { sounds } from './SoundEffects';

// Helper to check if number is prime
function isPrime(n) {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

export default function GovernmentAuthModal({ isOpen, onClose, onAuthenticated }) {
  const [operatorId, setOperatorId] = useState('US-AGRI-0481');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleValidate = (e) => {
    e.preventDefault();
    sounds.playBuzzer();

    const romanNumeralRegex = /[IVXLCDM]/;
    const nonStandardPunctuationRegex = /[¿¡§¶©®™†‡]/;
    const consecutiveVowelsRegex = /[aeiouAEIOU]{2,}/;

    // Rule 1: At least one Roman numeral
    if (!romanNumeralRegex.test(password)) {
      setErrorMessage("REJECTION 0x401: Password lacks mandatory Roman Numeral (must include I, V, X, L, C, D, or M).");
      return;
    }

    // Rule 2: Exactly one non-standard punctuation mark
    const nonStandardMatches = password.match(/[¿¡§¶©®™†‡]/g) || [];
    if (nonStandardMatches.length !== 1) {
      setErrorMessage(`REJECTION 0x402: Must contain exactly one non-standard statutory punctuation mark (e.g., ¿, ¡, §, ¶). Found: ${nonStandardMatches.length}.`);
      return;
    }

    // Rule 3: Prime number of characters
    if (!isPrime(password.length)) {
      setErrorMessage(`REJECTION 0x403: Password length (${password.length} characters) is a composite integer. Statutory cryptography mandates a prime length (e.g., 7, 11, 13, 17, 19).`);
      return;
    }

    // Rule 4: No consecutive vowels
    if (consecutiveVowelsRegex.test(password)) {
      setErrorMessage("REJECTION 0x404: Phonetic security hazard: Consecutive vowels are prohibited pursuant to Executive Circular 1999-B.");
      return;
    }

    // Passed!
    sounds.playConfettiDing();
    setSuccess(true);
    setErrorMessage('');
    setTimeout(() => {
      if (onAuthenticated) onAuthenticated();
      if (onClose) onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 select-none">
      <div className="w-full max-w-md win-window shadow-2xl border-2 border-black animate-fade-in">
        
        <div className="win-titlebar">
          <div className="flex items-center gap-1.5 font-bold">
            <span>🔐</span>
            <span>GOVERNMENT OPERATOR AUTHENTICATION (FORM 89-K)</span>
          </div>
          <button onClick={onClose} className="win-btn !p-0 !px-1.5 text-xs font-bold leading-none">✕</button>
        </div>

        <div className="p-4 space-y-3 bg-[#d4d0c8]">
          <div className="flex items-start gap-2 bg-[#ffffea] border border-[#808080] p-2 text-[11px]">
            <span className="text-xl">⚠️</span>
            <div>
              <strong>STATUTORY CREDENTIAL VERIFICATION:</strong>
              <p className="text-gray-700 text-[10px] mt-0.5">
                Authentication parameters are classified. No validation hints are displayed prior to submission.
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-2 bg-[#ffebee] border border-red-700 text-red-900 text-[10px] font-mono leading-snug animate-violent-shake">
              {errorMessage}
            </div>
          )}

          {success && (
            <div className="p-2 bg-[#e6ffe6] border border-green-700 text-green-900 text-[11px] font-bold font-mono text-center">
              ✓ CREDENTIAL RECOGNIZED: OPERATOR CLEARANCE LEVEL 4 GRANTED
            </div>
          )}

          <form onSubmit={handleValidate} className="space-y-3 text-[11px]">
            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
                Operator Station ID (Preset)
              </label>
              <input
                type="text"
                readOnly
                value={operatorId}
                className="w-full font-mono text-xs bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-0.5">
                Classified Statutory Passphrase:
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter statutory passphrase..."
                className="w-full text-xs font-mono p-1.5"
              />
              <div className="text-[9px] text-gray-500 italic mt-0.5">
                * Note: Zero validation requirements will be disclosed until failed submission.
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#808080]">
              <span className="text-[9px] text-gray-600 font-mono">
                Attempts: Logged to Audit
              </span>
              <div className="flex gap-2">
                <button type="button" onClick={onClose} className="win-btn text-[10px]">
                  Cancel
                </button>
                <button type="submit" className="win-btn font-bold text-[10px] !px-4">
                  Authenticate Clearance →
                </button>
              </div>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}
