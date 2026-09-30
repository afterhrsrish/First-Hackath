import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

export default function BadNavbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const location = useLocation();

  const handleMenuClick = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  return (
    <header className="bg-[#d4d0c8] select-none border-b-2 border-[#404040]">
      {/* OS Style Main Window Titlebar */}
      <div className="win-titlebar">
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-xs">🌾</span>
          <span className="tracking-wide">
            AGRO-SYS Enterprise v8.4.1 [AGRI-COMPLIANCE-PORTAL / USDA-SEC-409] - [Operator: AGENT_4091]
          </span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button className="win-btn !p-0 !px-1.5 !h-4 text-[10px] leading-none" title="Minimize">_</button>
          <button className="win-btn !p-0 !px-1.5 !h-4 text-[10px] leading-none" title="Maximize">□</button>
          <button className="win-btn !p-0 !px-1.5 !h-4 text-[10px] leading-none" title="Close Application">✕</button>
        </div>
      </div>

      {/* Classic Menu Bar (File, Edit, Agronomy, etc.) */}
      <div className="flex items-center px-1 py-0.5 border-b border-[#808080] text-[11px] bg-[#d4d0c8] relative">
        <div className="relative">
          <button
            onClick={() => handleMenuClick('file')}
            className={`px-2 py-0.5 hover:bg-[#000080] hover:text-white ${activeMenu === 'file' ? 'bg-[#000080] text-white' : ''}`}
          >
            <u>F</u>ile
          </button>
          {activeMenu === 'file' && (
            <div className="absolute top-full left-0 mt-0.5 w-48 win-window p-0.5 shadow-lg z-50">
              <Link to="/farms" onClick={() => setActiveMenu(null)} className="block px-3 py-1 hover:bg-[#000080] hover:text-white text-[11px]">
                New Farm Holding (Ctrl+N)
              </Link>
              <Link to="/advisory" onClick={() => setActiveMenu(null)} className="block px-3 py-1 hover:bg-[#000080] hover:text-white text-[11px]">
                New Phytosanitary Advisory
              </Link>
              <div className="border-t border-[#808080] my-0.5" />
              <button onClick={() => alert("Print Form 409: Printer offline or missing dot-matrix ribbon.")} className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-[11px]">
                Print Form 409-B (Ctrl+P)
              </button>
              <button onClick={() => setActiveMenu(null)} className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-[11px]">
                Exit Station (Alt+F4)
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => handleMenuClick('agronomy')}
            className={`px-2 py-0.5 hover:bg-[#000080] hover:text-white ${activeMenu === 'agronomy' ? 'bg-[#000080] text-white' : ''}`}
          >
            <u>A</u>gronomy
          </button>
          {activeMenu === 'agronomy' && (
            <div className="absolute top-full left-0 mt-0.5 w-56 win-window p-0.5 shadow-lg z-50">
              <Link to="/advisory" onClick={() => setActiveMenu(null)} className="block px-3 py-1 hover:bg-[#000080] hover:text-white text-[11px]">
                Launch Gemini AI Reasoning
              </Link>
              <Link to="/diagnostics" onClick={() => setActiveMenu(null)} className="block px-3 py-1 hover:bg-[#000080] hover:text-white text-[11px]">
                Leaf Spectral Pathology Lab
              </Link>
              <div className="border-t border-[#808080] my-0.5" />
              <button onClick={() => alert("Nitrogen Coefficient: 1.42 lbs/bu. Soil moisture index nominal.")} className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-[11px]">
                Query Soil Nitrate Coefficient
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => handleMenuClick('compliance')}
            className={`px-2 py-0.5 hover:bg-[#000080] hover:text-white ${activeMenu === 'compliance' ? 'bg-[#000080] text-white' : ''}`}
          >
            <u>C</u>ompliance
          </button>
          {activeMenu === 'compliance' && (
            <div className="absolute top-full left-0 mt-0.5 w-60 win-window p-0.5 shadow-lg z-50">
              <button onClick={() => alert("Statutory Audit Status: Holding verified. Zero unresolved pesticide notices.")} className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-[11px]">
                Verify Sub-Section 409 Standing
              </button>
              <button onClick={() => alert("Water Rights Ledger: Allocation balanced under Title 7.")} className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-[11px]">
                Inspect Hydrological Ledger
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => handleMenuClick('help')}
            className={`px-2 py-0.5 hover:bg-[#000080] hover:text-white ${activeMenu === 'help' ? 'bg-[#000080] text-white' : ''}`}
          >
            <u>H</u>elp
          </button>
          {activeMenu === 'help' && (
            <div className="absolute top-full left-0 mt-0.5 w-64 win-window p-0.5 shadow-lg z-50">
              <button onClick={() => alert("AGRO-SYS Enterprise v8.4.1\nBuild 2026.09.30-STABLE\nUSDA Precision Agriculture Division\nArchitecture: React 18 + Node.js + Supabase + Google GenAI")} className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-[11px]">
                About AGRO-SYS Enterprise...
              </button>
              <button onClick={() => alert("Operator manual: Please submit a written request in triplicate to the local Extension Office.")} className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-[11px]">
                Technical Reference Manual (PDF)
              </button>
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-3 pr-2 text-[10px] text-gray-700">
          <span className="font-mono">DB: SUPABASE-POSTGRESQL (SSL)</span>
          <span className="font-mono">AI: GEMINI-PRO (ONLINE)</span>
        </div>
      </div>

      {/* Enterprise Tabs Navigation */}
      <div className="px-2 pt-2 flex items-end gap-1 bg-[#d4d0c8] border-b border-[#ffffff]">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `px-3 text-xs flex items-center gap-1.5 cursor-pointer select-none ${
              isActive ? 'win-tab-active' : 'win-tab-inactive hover:bg-[#c4c0b8]'
            }`
          }
        >
          <span>📊</span>
          <span>Land Holding Census (Form-104)</span>
        </NavLink>

        <NavLink
          to="/farms"
          className={({ isActive }) =>
            `px-3 text-xs flex items-center gap-1.5 cursor-pointer select-none ${
              isActive ? 'win-tab-active' : 'win-tab-inactive hover:bg-[#c4c0b8]'
            }`
          }
        >
          <span>🚜</span>
          <span>Farm & Parcel Registry</span>
        </NavLink>

        <NavLink
          to="/advisory"
          className={({ isActive }) =>
            `px-3 text-xs flex items-center gap-1.5 cursor-pointer select-none ${
              isActive ? 'win-tab-active' : 'win-tab-inactive hover:bg-[#c4c0b8]'
            }`
          }
        >
          <span>🤖</span>
          <span>Gemini AI Phytosanitary Advisor</span>
        </NavLink>

        <NavLink
          to="/diagnostics"
          className={({ isActive }) =>
            `px-3 text-xs flex items-center gap-1.5 cursor-pointer select-none ${
              isActive ? 'win-tab-active' : 'win-tab-inactive hover:bg-[#c4c0b8]'
            }`
          }
        >
          <span>🔬</span>
          <span>Spectral Pathology Lab</span>
        </NavLink>
      </div>
    </header>
  );
}
