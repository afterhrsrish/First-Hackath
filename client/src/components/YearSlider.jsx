import React, { useState } from 'react';
import { Calendar, HelpCircle } from 'lucide-react';

export default function YearSlider({ value, onChange, label = "SELECT HARVEST / PLANTING DATE" }) {
  const [year, setYear] = useState(2026);
  const [dayOfYear, setDayOfYear] = useState(180);

  const getEraDescription = (yr) => {
    if (yr < 500) return "🏛️ Roman Spelt & Olive Epoch";
    if (yr < 1200) return "⚔️ Medieval Feudal Barley Harvest";
    if (yr < 1800) return "⛵ Age of Sail Potato Revolution";
    if (yr < 1950) return "🚜 Industrial Tractor Dust Bowl Era";
    if (yr <= 2026) return "🤖 Modern AI Crop Confusion";
    if (yr < 2500) return "🚀 Cybernetic GMO Neon Rice";
    return "🛸 Intergalactic Asteroid Soy Terrariums";
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value, 10);
    setYear(newYear);
    // Convert to rough date
    const d = new Date(newYear, 0);
    d.setDate(dayOfYear);
    if (onChange) onChange(d.toISOString().split('T')[0]);
  };

  const handleDayChange = (e) => {
    const newDay = parseInt(e.target.value, 10);
    setDayOfYear(newDay);
    const d = new Date(year, 0);
    d.setDate(newDay);
    if (onChange) onChange(d.toISOString().split('T')[0]);
  };

  return (
    <div className="p-4 bg-[#FFB6C1] border-4 border-[#000000] shadow-[5px_5px_0px_#00FF00] space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-black font-impact text-[#800080] tracking-wide flex items-center gap-2">
          <Calendar className="w-5 h-5 text-black" />
          {label} (WHY USE A CALENDAR?)
        </label>
        <span className="text-xs bg-black text-[#00FF00] px-2 py-0.5 font-mono">
          Year: {year} AD / Day: {dayOfYear}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[11px] font-bold text-gray-700">
          <span>0 AD (Rome)</span>
          <span className="text-[#FF007F] font-black underline">{getEraDescription(year)}</span>
          <span>3000 AD (Alien)</span>
        </div>
        <input
          type="range"
          min="0"
          max="3000"
          value={year}
          onChange={handleYearChange}
          className="w-full h-4 bg-yellow-300 border-2 border-black rounded-none chaotic-slider cursor-grab"
        />
      </div>

      <div className="space-y-1 pt-1">
        <div className="flex justify-between text-[10px] font-mono text-black">
          <span>Day 1 (Jan 1)</span>
          <span className="font-bold">Day {dayOfYear} of 365</span>
          <span>Day 365 (Dec 31)</span>
        </div>
        <input
          type="range"
          min="1"
          max="365"
          value={dayOfYear}
          onChange={handleDayChange}
          className="w-full h-3 bg-green-300 border-2 border-black rounded-none chaotic-slider cursor-grab"
        />
      </div>

      <div className="text-[11px] font-times italic text-black bg-white/70 p-1 border border-black flex items-center gap-1">
        <HelpCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
        <span>Selected Chronological Epoch: <strong>{year}-{String(Math.floor(dayOfYear / 30) + 1).padStart(2, '0')}-15</strong></span>
      </div>
    </div>
  );
}
