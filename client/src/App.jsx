import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BadNavbar from './components/BadNavbar';
import BartholomewAuditor from './components/BartholomewAuditor';
import SessionTimeoutModal from './components/SessionTimeoutModal';
import TipOfTheDayModal from './components/TipOfTheDayModal';
import NitrogenConsentBanner from './components/NitrogenConsentBanner';
import Home from './pages/Home';
import Farms from './pages/Farms';
import Advisory from './pages/Advisory';
import Diagnostics from './pages/Diagnostics';
import PassiveAggressiveBanner from './components/PassiveAggressiveBanner';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between text-black">
      {/* Top Enterprise Application Frame */}
      <div>
        <BadNavbar />
        {/* Passive-Aggressive Condescending Status & Mouse Velocity Banner */}
        <PassiveAggressiveBanner />
        <main className="py-2">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/farms" element={<Farms />} />
            <Route path="/advisory" element={<Advisory />} />
            <Route path="/diagnostics" element={<Diagnostics />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>

      {/* Obnoxious Bureaucratic Floating Auditor & Session Monitors */}
      <BartholomewAuditor />
      <SessionTimeoutModal />
      <TipOfTheDayModal />

      {/* Mandatory Regulatory Data Consent Banner */}
      <NitrogenConsentBanner />

      {/* Classic Enterprise 1999 Status Bar */}
      <footer className="bg-[#d4d0c8] border-t-2 border-[#ffffff] border-b border-[#404040] px-2 py-0.5 text-[11px] text-gray-800 select-none flex items-center justify-between font-sans">
        <div className="flex items-center gap-3">
          <div className="win-sunken px-2 py-0.5 text-[10px] bg-white font-mono">
            READY
          </div>
          <span className="text-[10px] text-gray-600">
            AGRO-SYS v8.4.1 (Build 2026.09.30) • USDA Precision Agronomy Compliance Division
          </span>
        </div>

        <div className="flex items-center gap-1">
          <div className="win-sunken px-2 py-0.5 text-[10px] font-mono bg-[#ece9d8]">
            DB: SUPABASE-PG
          </div>
          <div className="win-sunken px-2 py-0.5 text-[10px] font-mono bg-[#ece9d8]">
            AI: @google/genai
          </div>
          <div className="win-sunken px-2 py-0.5 text-[10px] font-mono bg-[#ece9d8]">
            AUDIT: LVL-3
          </div>
          <div className="win-sunken px-2 py-0.5 text-[10px] font-mono bg-[#ece9d8]">
            CAPS | NUM
          </div>
        </div>
      </footer>
    </div>
  );
}
