import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';
import { sounds } from './SoundEffects';

const CHALLENGES = [
  { question: "What is 14 × 3 - 7?", answer: "35" },
  { question: "Type the word 'PHOTOSYNTHESIS' backwards:", answer: "SISEHTNYYSOTOHP", alt: "sisehtnyysotohp" },
  { question: "If a cow eats 25kg alfalfa daily, how much does 1 cow eat in 3 days? (kg):", answer: "75" },
  { question: "Chemical symbol for Potash / Potassium:", answer: "K", alt: "k" },
  { question: "How many stomachs does a cow have?", answer: "4" }
];

export default function ChaoticCaptcha({ onVerified, title = "AGRICULTURAL BOT DEFENSE TEST" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isSolved, setIsSolved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currentChallenge = CHALLENGES[currentIndex];

  const handleVerify = (e) => {
    e.preventDefault();
    const clean = userInput.trim().toUpperCase();
    const correct = currentChallenge.answer.toUpperCase();
    const altCorrect = currentChallenge.alt?.toUpperCase();

    if (clean === correct || clean === altCorrect) {
      sounds.playConfettiDing();
      setIsSolved(true);
      setErrorMessage('');
      if (onVerified) onVerified(true);
    } else {
      sounds.playBuzzer();
      setErrorMessage(`WRONG! You might be a Colorado Potato Beetle! Try again.`);
      setUserInput('');
    }
  };

  const cycleChallenge = () => {
    setCurrentIndex((prev) => (prev + 1) % CHALLENGES.length);
    setUserInput('');
    setErrorMessage('');
  };

  if (isSolved) {
    return (
      <div className="p-3 bg-[#00FF00] border-4 border-black text-black font-black flex items-center justify-between shadow-[4px_4px_0px_#000]">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-900" />
          <span>✅ HUMAN / CERTIFIED TRACTOR OPERATOR VERIFIED!</span>
        </div>
        <button
          type="button"
          onClick={() => { setIsSolved(false); if (onVerified) onVerified(false); }}
          className="text-xs underline font-normal text-purple-900"
        >
          (Fail intentionally)
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-orange-400 border-4 border-dashed border-red-700 shadow-[6px_6px_0px_#000] tilt-right">
      <div className="flex items-center justify-between pb-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-900 animate-bounce" />
          <span className="font-black text-xs font-retro text-black">{title}</span>
        </div>
        <button
          type="button"
          onClick={cycleChallenge}
          className="p-1 bg-yellow-200 border border-black hover:bg-white text-xs font-bold flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" /> New Task
        </button>
      </div>

      <form onSubmit={handleVerify} className="mt-3 space-y-2">
        <p className="font-comic font-bold text-sm text-black bg-yellow-100 p-2 border border-black">
          🚜 {currentChallenge.question}
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type verified answer..."
            className="flex-1 px-3 py-2 border-2 border-black font-mono text-sm uppercase bg-white focus:bg-pink-100 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-impact tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
          >
            SOLVE!
          </button>
        </div>

        {errorMessage && (
          <p className="text-xs font-bold text-red-900 bg-white/80 p-1 border border-red-500 animate-pulse">
            🚨 {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
}
