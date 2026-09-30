import React, { useState, useRef, useEffect } from 'react';

export default function RegulatoryDisclaimerModal({ isOpen, onConfirm, onCancel, title = "MANDATORY REGULATORY INDEMNITY AGREEMENT (FORM 704-B)" }) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setHasScrolledToBottom(false);
      setAgreedToTerms(false);
    }
  }, [isOpen]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 15) {
      setHasScrolledToBottom(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-xl win-window shadow-xl">
        {/* Title bar */}
        <div className="win-titlebar">
          <div className="flex items-center gap-1.5 font-bold">
            <span>🏛️</span>
            <span>{title}</span>
          </div>
          <button onClick={onCancel} className="win-btn !p-0.5 !px-1.5 text-xs font-bold leading-none">✕</button>
        </div>

        {/* Modal content */}
        <div className="p-3 space-y-3">
          <div className="flex items-start gap-2 bg-[#ffffcc] border border-[#808080] p-2 text-[11px]">
            <span className="text-base">⚠️</span>
            <div>
              <strong>STATUTORY NOTICE:</strong> You must review the entire 1,400-word Agronomic Liability Protocol. 
              The submission confirmation button will remain disabled until you scroll to the absolute bottom of the statutory text.
            </div>
          </div>

          {/* Agonizing scroll box */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="win-sunken h-48 overflow-y-scroll p-3 text-[11px] font-serif leading-relaxed text-gray-800 space-y-2 select-text"
          >
            <h4 className="font-bold uppercase text-center font-sans text-xs">
              UNITED STATES CODE TITLE 7 - AGRICULTURE & PRECISION ADVISORY CODES
            </h4>
            <p className="italic text-center text-[10px]">
              Revision 4.88-B. Sub-section 194-A: Disclaimer of AI Phytopathological Guarantees
            </p>
            <hr className="border-t border-gray-400 my-2" />
            <p>
              1.1 <strong>General Provisions.</strong> Any and all crop diagnostic assessments, agronomic fertilization recommendations, 
              micro-nutrient adjustments, and pesticide interventions generated through this portal (hereinafter referred to as "The System") 
              are subject to Section 409-C of the Agricultural Soil Conservation Act.
            </p>
            <p>
              1.2 <strong>No Warranty on Photosynthetic Yield.</strong> Neither the Department nor the Software Architect makes any 
              express or implied warranties concerning the survival, internodal elongation, chlorophyll density, or bushel yield per acre 
              of crops treated pursuant to AI-generated advisories.
            </p>
            <p>
              1.3 <strong>Nitrogen Volatilization & Runoff Indemnity.</strong> The Operator of the registered Agricultural Holding explicitly 
              covenants and warrants that no foliar nitrogen spray shall be applied within forty-eight (48) hours of anticipated precipitation 
              exceeding 0.25 inches. All hydrological consequences are borne strictly by the holding parcel owner.
            </p>
            <p>
              1.4 <strong>Arthropod & Pathogen Immunity.</strong> In the event that targeted aphid, armyworm, or fungal blight populations 
              exhibit physiological pesticide resistance or genetic mutation, the Operator hereby waives all rights of subrogation, tort claim, 
              or emotional distress caused by visual plant necrosis.
            </p>
            <p>
              1.5 <strong>Soil Compaction Liability.</strong> Heavy equipment passes recommended by this terminal (including tandem-disc harrows, 
              chisel plows, and high-clearance spray rigs) must not be executed upon saturated clay-loam soil matrices exceeding 65% field capacity.
            </p>
            <p>
              1.6 <strong>Statutory Attestation.</strong> By scrolling to this terminal sentence and checking the statutory box below, 
              the undersigned certified agricultural operator affirms under penalty of perjury that all submitted field observation data, 
              leaf discoloration parameters, and crop stage classifications are accurate to within 95% agronomic certainty.
            </p>
            <div className="p-2 bg-gray-100 border border-gray-400 text-center font-mono text-[10px] text-green-900 font-bold">
              [END OF MANDATORY STATUTORY DOCUMENTATION - SCROLL VERIFIED]
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="statutory-cert"
              disabled={!hasScrolledToBottom}
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            <label
              htmlFor="statutory-cert"
              className={`text-[11px] ${!hasScrolledToBottom ? 'text-gray-500 italic' : 'font-bold text-black'}`}
            >
              {!hasScrolledToBottom
                ? "(Scroll to the bottom of the agreement above to enable this checkbox)"
                : "I have read all 6 sections and certify compliance under penalty of administrative delay"}
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-[#808080]">
            <button
              type="button"
              onClick={onCancel}
              className="win-btn"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!hasScrolledToBottom || !agreedToTerms}
              onClick={onConfirm}
              className="win-btn font-bold !px-4 disabled:opacity-50"
            >
              Accept Terms & Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
