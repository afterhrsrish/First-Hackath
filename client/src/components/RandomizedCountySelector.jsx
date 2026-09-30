import React, { useState } from 'react';
import { sounds } from './SoundEffects';

const INITIAL_COUNTIES = [
  'Lubbock County, TX (Zone 7b)',
  'Aroostook County, ME (Zone 4a)',
  'Fresno County, CA (Zone 9b)',
  'Champaign County, IL (Zone 5b)',
  'Weld County, CO (Zone 5a)',
  'Lancaster County, PA (Zone 6b)',
  'Maricopa County, AZ (Zone 10a)',
  'Cass County, ND (Zone 4a)',
  'Kern County, CA (Zone 9a)',
  'Yakima County, WA (Zone 6a)',
  'Darke County, OH (Zone 6a)',
  'Saline County, KS (Zone 6a)'
];

export default function RandomizedCountySelector({ value, onChange, label = "JURISDICTION / COUNTY CADASTRE" }) {
  const [counties, setCounties] = useState(INITIAL_COUNTIES);
  const [selected, setSelected] = useState(value || INITIAL_COUNTIES[0]);

  // Reshuffle on every focus or click!
  const scrambleList = () => {
    sounds.playWhoosh();
    setCounties(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setSelected(val);
    if (onChange) onChange(val);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-0.5">
        <label className="text-[10px] font-bold text-gray-700 uppercase">
          {label}
        </label>
        <button
          type="button"
          onClick={scrambleList}
          className="text-[9px] text-gray-500 underline font-normal"
        >
          (Re-shuffle Index)
        </button>
      </div>

      <select
        value={selected}
        onFocus={scrambleList}
        onClick={scrambleList}
        onChange={handleChange}
        className="w-full text-[11px] p-1 bg-white border border-[#404040]"
        title="List order scrambles automatically on click pursuant to Section 19"
      >
        {counties.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <div className="text-[9px] text-gray-500 italic mt-0.5">
        * Statutory note: Dropdown list order re-shuffles continuously to ensure operator alertness.
      </div>
    </div>
  );
}
