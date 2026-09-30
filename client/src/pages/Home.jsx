import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [farms, setFarms] = useState([]);
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [resFarms, resAdv] = await Promise.all([
        fetch('/api/farms').then(r => r.json()),
        fetch('/api/advisories').then(r => r.json())
      ]);
      if (resFarms.success) setFarms(resFarms.data || []);
      if (resAdv.success) setAdvisories(resAdv.data || []);
    } catch (err) {
      console.error('Failed to load census data:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalPlots = farms.reduce((acc, f) => acc + (f.plots?.length || 0), 0);
  const totalHectares = farms.reduce((acc, f) => acc + Number(f.total_area_hectares || 0), 0);

  return (
    <div className="p-3 max-w-7xl mx-auto space-y-3">
      
      {/* Official Government Header Banner */}
      <div className="win-window p-3 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#808080] pb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white win-sunken flex items-center justify-center text-2xl font-serif font-bold text-[#000080]">
              🏛️
            </div>
            <div>
              <h1 className="text-sm md:text-base font-bold text-[#000080] tracking-tight uppercase">
                United States Bureau of Precision Agronomy & Land Holding Compliance
              </h1>
              <p className="text-[11px] text-gray-700">
                Official Federal Census & AI Crop Pathogen Advisory Gateway (System Identifier: US-AG-SYS-84)
              </p>
            </div>
          </div>

          <div className="text-right text-[10px] text-gray-600 font-mono">
            <div>TERMINAL REVISION: 8.4.1.2026</div>
            <div>SESSION TIME: {new Date().toLocaleTimeString()}</div>
          </div>
        </div>

        {/* Administrative Status Strip */}
        <div className="bg-[#ffffea] border border-[#808080] p-2 text-[11px] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#800000]">STATUTORY NOTICE:</span>
            <span>All agricultural land parcels and nitrogen intervention requests are logged directly to Supabase Cloud PostgreSQL.</span>
          </div>
          <div className="font-mono text-[10px] bg-white px-2 py-0.5 border border-gray-400">
            AUDIT STANDING: CERTIFIED
          </div>
        </div>
      </div>

      {/* Numerical Census Metrics (Dense Corporate Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Metric 1 */}
        <div className="win-window p-2.5">
          <div className="text-[10px] font-bold text-gray-700 uppercase flex justify-between items-center">
            <span>REGISTERED LAND HOLDINGS</span>
            <span className="text-gray-400 font-mono">F-101</span>
          </div>
          <div className="mt-2 win-sunken p-2 bg-white flex items-baseline justify-between">
            <span className="text-2xl font-mono font-bold text-[#000080]">
              {loading ? '--' : String(farms.length).padStart(4, '0')}
            </span>
            <span className="text-[10px] text-green-800 font-bold">
              PARCELS ACTIVE
            </span>
          </div>
          <div className="text-[10px] text-gray-500 mt-1">
            Persisted in PostgreSQL table: <code className="text-black">public.farms</code>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="win-window p-2.5">
          <div className="text-[10px] font-bold text-gray-700 uppercase flex justify-between items-center">
            <span>CULTIVATED FIELD PLOTS</span>
            <span className="text-gray-400 font-mono">F-102</span>
          </div>
          <div className="mt-2 win-sunken p-2 bg-white flex items-baseline justify-between">
            <span className="text-2xl font-mono font-bold text-[#000080]">
              {loading ? '--' : String(totalPlots).padStart(4, '0')}
            </span>
            <span className="text-[10px] text-blue-800 font-bold">
              ACCREDITED
            </span>
          </div>
          <div className="text-[10px] text-gray-500 mt-1">
            Persisted in PostgreSQL table: <code className="text-black">public.plots</code>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="win-window p-2.5">
          <div className="text-[10px] font-bold text-gray-700 uppercase flex justify-between items-center">
            <span>AGGREGATE COMMITTED AREA</span>
            <span className="text-gray-400 font-mono">F-103</span>
          </div>
          <div className="mt-2 win-sunken p-2 bg-white flex items-baseline justify-between">
            <span className="text-2xl font-mono font-bold text-[#000080]">
              {loading ? '--' : totalHectares.toFixed(2)}
            </span>
            <span className="text-[10px] text-gray-700 font-mono">
              HECTARES
            </span>
          </div>
          <div className="text-[10px] text-gray-500 mt-1">
            Equivalent: {(totalHectares * 2.47105).toFixed(2)} imperial acres
          </div>
        </div>

        {/* Metric 4 */}
        <div className="win-window p-2.5">
          <div className="text-[10px] font-bold text-gray-700 uppercase flex justify-between items-center">
            <span>AI PHYTOSANITARY ADVISORIES</span>
            <span className="text-gray-400 font-mono">F-104</span>
          </div>
          <div className="mt-2 win-sunken p-2 bg-white flex items-baseline justify-between">
            <span className="text-2xl font-mono font-bold text-[#800000]">
              {loading ? '--' : String(advisories.length).padStart(4, '0')}
            </span>
            <span className="text-[10px] text-orange-800 font-bold">
              GEMINI-AI
            </span>
          </div>
          <div className="text-[10px] text-gray-500 mt-1">
            Direct output from <code className="text-black">@google/genai</code>
          </div>
        </div>

      </div>

      {/* Main Content Area: Inspection Log + Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        
        {/* Left 2 Cols: Official Phytosanitary Inspection Log */}
        <div className="lg:col-span-2 win-window p-3 space-y-2">
          <div className="win-titlebar">
            <span>Recent Official Phytosanitary Diagnostic Clearances</span>
            <span className="text-[10px] font-normal">Table: public.advisories</span>
          </div>

          <div className="win-sunken bg-white overflow-x-auto max-h-80">
            <table className="win-table">
              <thead>
                <tr>
                  <th>Clearance ID</th>
                  <th>Plot Name</th>
                  <th>Diagnosed Pathology</th>
                  <th>Urgency Level</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      Querying Supabase PostgreSQL holding ledger...
                    </td>
                  </tr>
                ) : advisories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      Zero diagnostic clearance advisories recorded. Proceed to Tab 3 to initiate an AI consultation.
                    </td>
                  </tr>
                ) : (
                  advisories.map((adv) => (
                    <tr key={adv.id}>
                      <td className="font-mono text-[10px] text-gray-600">
                        {adv.id.slice(0, 8)}...
                      </td>
                      <td className="font-bold text-gray-900">
                        {adv.plots?.plot_name || 'General Sector'}
                      </td>
                      <td className="text-gray-800">
                        {adv.condition_diagnosis}
                      </td>
                      <td>
                        <span className={`px-1.5 py-0.5 text-[9px] font-bold border ${
                          adv.urgency_level === 'CRITICAL' ? 'bg-red-100 text-red-800 border-red-400' :
                          adv.urgency_level === 'HIGH' ? 'bg-orange-100 text-orange-800 border-orange-400' :
                          'bg-yellow-100 text-yellow-800 border-yellow-400'
                        }`}>
                          {adv.urgency_level || 'MEDIUM'}
                        </span>
                      </td>
                      <td className="text-[10px] text-gray-600 font-mono">
                        {new Date(adv.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center text-[10px] text-gray-600 pt-1">
            <span>Showing {advisories.length} historical records</span>
            <Link to="/advisory" className="text-blue-900 font-bold underline">
              + Generate New Diagnostic Advisory via Gemini AI →
            </Link>
          </div>
        </div>

        {/* Right Col: Statutory Action Panel */}
        <div className="win-window p-3 space-y-3">
          <div className="win-titlebar">
            <span>Administrative Directives</span>
          </div>

          <div className="space-y-2 text-[11px]">
            <p className="text-gray-800 leading-snug">
              Select an administrative task to perform certified crop telemetry updates:
            </p>

            <div className="space-y-1.5 pt-1">
              <Link
                to="/farms"
                className="block w-full text-left win-btn !py-1.5 text-[11px] font-bold"
              >
                📁 Open Farm & Field Parcel Registry
              </Link>
              <Link
                to="/advisory"
                className="block w-full text-left win-btn !py-1.5 text-[11px] font-bold"
              >
                🔬 Execute Gemini AI Crop Diagnostic Protocol
              </Link>
              <Link
                to="/diagnostics"
                className="block w-full text-left win-btn !py-1.5 text-[11px] font-bold"
              >
                📷 Optical Leaf Pathology Sensor Chamber
              </Link>
            </div>
          </div>

          {/* Micro Regulatory Notes */}
          <div className="win-sunken-gray p-2 text-[10px] space-y-1 text-gray-700">
            <div className="font-bold text-gray-900">Operator Responsibility Notice:</div>
            <p>
              Users must ensure all submitted parcel boundaries adhere to County Orthophoto Map Standards. 
              Discrepancies exceeding 0.05 hectares will be referred to Agricultural Arbitration.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
