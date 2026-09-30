import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Sprout, AlertOctagon, Skull, Flame, Biohazard, HelpCircle } from 'lucide-react';
import RunawayButton from './RunawayButton';
import AnnoyingModal from './AnnoyingModal';

export default function BadNavbar() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#00FF00] border-b-8 border-[#FF007F] shadow-[0_8px_0px_#000000]">
      {/* Obnoxious Scrolling News Ticker */}
      <div className="bg-black text-[#FFFF00] font-mono text-xs py-1 overflow-hidden border-b-2 border-white select-none">
        <div className="animate-marquee-fast font-bold whitespace-nowrap">
          🚨 BREAKING: LOCUST SWARM SIGNED SPONSORSHIP DEAL WITH FERTILIZER CORP 🌽 
          ALERT: CORN TASSELS REQUESTING UNION MEMBERSHIP 🚨 
          WARNING: DO NOT FEED TRACTOR DIESEL TO CITRUS ORCHARDS ⚡ 
          SOIL PH IN ZONE 9 HAS TRANSCENDED INTO THE FOURTH DIMENSION 🚨
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand / Logo with violent tilt */}
        <Link 
          to="/" 
          className="flex items-center gap-2 bg-[#FFFF00] p-2 brutal-border tilt-left hover:tilt-right transition-transform"
        >
          <Sprout className="w-8 h-8 text-[#FF007F] animate-fast-spin" />
          <div>
            <div className="font-black text-xl font-impact tracking-widest text-[#000000] flex items-center gap-1">
              AGRO-CHAOS <span className="bg-[#FF007F] text-white px-1 text-xs font-retro">3000™</span>
            </div>
            <div className="text-[10px] font-comic font-bold text-[#800080]">
              WORLD'S LEAST ACCESSIBLE PRECISION AGRONOMY
            </div>
          </div>
        </Link>

        {/* Misleading Navigation Links */}
        <nav className="flex flex-wrap items-center gap-2">
          
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-2 text-xs font-black uppercase border-4 border-black tracking-wider transition-all ${
                isActive
                  ? 'bg-[#FF007F] text-white shadow-[4px_4px_0px_#00FFFF]'
                  : 'bg-white text-black hover:bg-yellow-300'
              }`
            }
            title="Navigates to Dashboard / Home"
          >
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-600 animate-bounce" />
              <span>🚜 EVACUATE FARM (HOME)</span>
            </div>
          </NavLink>

          <NavLink
            to="/farms"
            className={({ isActive }) =>
              `px-3 py-2 text-xs font-black uppercase border-4 border-black tracking-wider transition-all ${
                isActive
                  ? 'bg-[#FF007F] text-white shadow-[4px_4px_0px_#00FFFF]'
                  : 'bg-white text-black hover:bg-yellow-300'
              }`
            }
            title="Navigates to Farms & Fields management"
          >
            <div className="flex items-center gap-1">
              <Skull className="w-4 h-4 text-red-600 animate-spin" />
              <span>💥 DELETE ALL HARVESTS (FARMS)</span>
            </div>
          </NavLink>

          <NavLink
            to="/advisory"
            className={({ isActive }) =>
              `px-3 py-2 text-xs font-black uppercase border-4 border-black tracking-wider transition-all ${
                isActive
                  ? 'bg-[#FF007F] text-white shadow-[4px_4px_0px_#00FFFF]'
                  : 'bg-white text-black hover:bg-yellow-300'
              }`
            }
            title="Navigates to AI Advisory"
          >
            <div className="flex items-center gap-1">
              <AlertOctagon className="w-4 h-4 text-purple-600 animate-pulse" />
              <span>💀 SOW NIGHTSHADE (AI ADVISORY)</span>
            </div>
          </NavLink>

          <NavLink
            to="/diagnostics"
            className={({ isActive }) =>
              `px-3 py-2 text-xs font-black uppercase border-4 border-black tracking-wider transition-all ${
                isActive
                  ? 'bg-[#FF007F] text-white shadow-[4px_4px_0px_#00FFFF]'
                  : 'bg-white text-black hover:bg-yellow-300'
              }`
            }
            title="Navigates to Leaf Diagnostics"
          >
            <div className="flex items-center gap-1">
              <Biohazard className="w-4 h-4 text-yellow-600 animate-spin" />
              <span>☢️ SPREAD BLIGHT (LEAF CHECK)</span>
            </div>
          </NavLink>

        </nav>

        {/* Hostile Runaway Panic Button */}
        <div>
          <RunawayButton
            onClick={() => setModalOpen(true)}
            className="bg-[#FF007F] text-yellow-300 hover:bg-red-600 text-xs py-2 px-3 shadow-[4px_4px_0px_#000]"
          >
            😱 PANIC BUTTON
          </RunawayButton>
        </div>

      </div>

      {/* Pop-up modal if they catch the panic button */}
      <AnnoyingModal
        isOpen={modalOpen}
        title="🚨 YOU CAUGHT THE RUNAWAY BUTTON!"
        message="Congratulations! Your reflexes are sharper than a rust-covered disc harrow. Do you want to sell 500 tons of soybeans at a loss?"
        confirmText="YES, RUIN MY MARGINS"
        cancelText="NO, TAKE ME TO CORN"
        onConfirm={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
      />
    </header>
  );
}
