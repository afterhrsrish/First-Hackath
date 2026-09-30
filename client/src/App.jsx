import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import BadNavbar from './components/BadNavbar';
import Home from './pages/Home';
import Farms from './pages/Farms';
import Advisory from './pages/Advisory';
import Diagnostics from './pages/Diagnostics';
import { fireObnoxiousConfetti } from './components/ConfettiBomb';
import { sounds } from './components/SoundEffects';

export default function App() {
  const [clickCount, setClickCount] = useState(0);

  const handleRandomChaoticClick = () => {
    setClickCount(prev => prev + 1);
    if ((clickCount + 1) % 7 === 0) {
      fireObnoxiousConfetti();
    }
  };

  return (
    <div 
      onClick={handleRandomChaoticClick}
      className="min-h-screen bg-[#FFFF00] flex flex-col justify-between selection:bg-[#FF007F] selection:text-[#00FF00]"
    >
      <div>
        <BadNavbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/farms" element={<Farms />} />
            <Route path="/advisory" element={<Advisory />} />
            <Route path="/diagnostics" element={<Diagnostics />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>

      {/* Obnoxious Footer */}
      <footer className="bg-black text-[#00FF00] border-t-8 border-[#FF007F] p-6 font-mono text-xs select-none">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="font-impact text-lg text-[#FFFF00] tracking-wider">
              🌽 AGRO-CHAOS PRECISION AGRICULTURE ASSISTANT © 2026-3000
            </div>
            <p className="font-comic text-[11px] text-[#FFB6C1] mt-1">
              Engineered with extreme malice by the Worst UI Society. Powered by Supabase & Google GenAI SDK.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                sounds.playBuzzer();
                alert("🚨 BEEP BOOP! You clicked the useless sound button. Your ears are now conditioned for farm labor.");
              }}
              className="px-3 py-1 bg-[#FF007F] text-white font-black uppercase text-[10px] border border-white hover:bg-white hover:text-black"
            >
              🔊 TEST LOUD BUZZER
            </button>

            <button
              onClick={() => fireObnoxiousConfetti()}
              className="px-3 py-1 bg-[#00FF00] text-black font-black uppercase text-[10px] border border-black hover:bg-yellow-300"
            >
              🎉 GRATUITOUS CONFETTI
            </button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-800 text-[10px] text-gray-500 font-times italic flex flex-wrap justify-between">
          <span>Disclaimer: Not responsible for spontaneous corn pollination or tractor software mutinies.</span>
          <span>Designed to cause moderate psychological bewilderment.</span>
        </div>
      </footer>
    </div>
  );
}
