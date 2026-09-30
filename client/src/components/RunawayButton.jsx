import React, { useState, useRef } from 'react';
import { sounds } from './SoundEffects';

export default function RunawayButton({
  children,
  onClick,
  className = '',
  maxDodges = 6,
  allowAfterMax = true
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState(0);
  const [tauntIndex, setTauntIndex] = useState(0);
  const btnRef = useRef(null);

  const taunts = [
    '🏃 YOU CANNOT CATCH ME!',
    '💨 TOO SLOW, PLOWBOY!',
    '🚜 TRACTOR TOO SLOW!',
    '🌽 CORN EVASION ACTIVATED!',
    '💥 NICE TRY BUDDY!',
    '😱 ALMOST HAD IT!'
  ];

  const handleHover = () => {
    if (allowAfterMax && dodgeCount >= maxDodges) {
      return; // Finally surrender so user can actually submit!
    }

    sounds.playWhoosh();

    // Calculate a chaotic offset
    const randomX = (Math.random() - 0.5) * 320;
    const randomY = (Math.random() - 0.5) * 220;

    setPosition({ x: randomX, y: randomY });
    setDodgeCount(prev => prev + 1);
    setTauntIndex(Math.floor(Math.random() * taunts.length));
  };

  const handleActualClick = (e) => {
    if (dodgeCount < maxDodges && !allowAfterMax) {
      handleHover();
      return;
    }
    if (onClick) onClick(e);
  };

  return (
    <div className="relative inline-block m-2">
      <button
        ref={btnRef}
        type="button"
        onMouseEnter={handleHover}
        onClick={handleActualClick}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: 'transform 0.15s ease-out'
        }}
        className={`px-6 py-4 font-black uppercase text-xl brutal-border active:scale-95 select-none ${className}`}
      >
        {dodgeCount > 0 && dodgeCount < maxDodges ? taunts[tauntIndex] : children}
        {dodgeCount >= maxDodges && allowAfterMax && (
          <span className="block text-xs text-yellow-300 font-normal">
            (Pity mode unlocked: You may click now!)
          </span>
        )}
      </button>
    </div>
  );
}
