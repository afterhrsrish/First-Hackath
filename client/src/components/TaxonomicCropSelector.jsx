import React, { useState, useEffect } from 'react';

const TAXONOMY = {
  "Poaceae (Gramineae - True Cereals)": [
    { genusSpecies: "Zea mays L.", common: "Corn (Maize)" },
    { genusSpecies: "Triticum aestivum L.", common: "Winter Wheat" },
    { genusSpecies: "Oryza sativa L.", common: "Paddy Rice" },
    { genusSpecies: "Hordeum vulgare L.", common: "Malting Barley" }
  ],
  "Fabaceae (Leguminosae - Nitrogen Fixers)": [
    { genusSpecies: "Glycine max (L.) Merr.", common: "Soybeans" },
    { genusSpecies: "Medicago sativa L.", common: "Alfalfa Hay" }
  ],
  "Vitaceae (Woody Climbing Vines)": [
    { genusSpecies: "Vitis vinifera L.", common: "Wine Grapes" }
  ],
  "Solanaceae (Nightshades & Tubers)": [
    { genusSpecies: "Solanum tuberosum L.", common: "Potatoes" },
    { genusSpecies: "Solanum lycopersicum L.", common: "Field Tomatoes" }
  ],
  "Malvaceae (Mallows)": [
    { genusSpecies: "Gossypium hirsutum L.", common: "Upland Cotton" }
  ],
  "Asteraceae (Composites)": [
    { genusSpecies: "Helianthus annuus L.", common: "Sunflowers" }
  ]
};

export default function TaxonomicCropSelector({ value, onChange, label = "BOTANICAL TAXONOMIC CLASSIFICATION" }) {
  const families = Object.keys(TAXONOMY);
  const [selectedFamily, setSelectedFamily] = useState(families[0]);
  const [selectedSpeciesIndex, setSelectedSpeciesIndex] = useState(0);

  const availableSpecies = TAXONOMY[selectedFamily] || [];
  const currentSelection = availableSpecies[selectedSpeciesIndex] || availableSpecies[0];

  useEffect(() => {
    if (currentSelection && onChange) {
      onChange(currentSelection.common);
    }
  }, [selectedFamily, selectedSpeciesIndex]);

  const handleFamilyChange = (e) => {
    setSelectedFamily(e.target.value);
    setSelectedSpeciesIndex(0);
  };

  return (
    <div className="p-2 win-sunken-gray border border-[#808080] space-y-2 select-none">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-gray-900 uppercase flex items-center gap-1">
          <span>🌿</span>
          <span>{label}</span>
        </label>
        <span className="text-[10px] text-gray-600 font-mono">
          ICBN Standard v2024
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Tier 1: Family */}
        <div>
          <label className="block text-[10px] text-gray-700 font-bold mb-0.5">
            Tier 1: Botanical Family (Class Tracheophyta)
          </label>
          <select
            value={selectedFamily}
            onChange={handleFamilyChange}
            className="w-full text-[11px] !py-1"
          >
            {families.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {/* Tier 2: Genus & Species */}
        <div>
          <label className="block text-[10px] text-gray-700 font-bold mb-0.5">
            Tier 2: Genus & Binomial Epithet
          </label>
          <select
            value={selectedSpeciesIndex}
            onChange={(e) => setSelectedSpeciesIndex(parseInt(e.target.value, 10))}
            className="w-full text-[11px] font-serif italic !py-1"
          >
            {availableSpecies.map((s, idx) => (
              <option key={s.genusSpecies} value={idx}>
                {s.genusSpecies} ({s.common})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Confirmation Badge */}
      <div className="bg-white p-1.5 border border-gray-400 flex items-center justify-between text-[11px]">
        <div>
          <span className="text-gray-600">Selected Agronomic Commodity: </span>
          <strong className="text-blue-900 font-bold font-sans">
            {currentSelection?.common}
          </strong>
        </div>
        <span className="text-[10px] font-mono bg-gray-200 px-1 border border-gray-400">
          Valid Registry Item
        </span>
      </div>
    </div>
  );
}
