import React, { useState, useEffect, useRef } from 'react';
import { sounds } from './SoundEffects';

const POPUP_ADS = [
  {
    title: "🔥 HOT LOCAL COMBINES IN YOUR AREA",
    content: "Single John Deere 9870 STS harvesters looking to thresh in your zip code right now! No credit check required.",
    cta: "HARVEST NOW"
  },
  {
    title: "🚨 CRITICAL MALWARE ALERT: CROP_WORM.EXE",
    content: "Your tractor motherboard has been infected with 4,209 potato blight trojans. Do not power off your irrigation pump!",
    cta: "CLEAN MOTHERBOARD"
  },
  {
    title: "🎰 CONGRATULATIONS! 1,000,000TH FARMER!",
    content: "You have won a free lifetime supply of 32% Anhydrous Liquid Nitrogen! Click to claim before evaporation.",
    cta: "CLAIM NITROGEN"
  },
  {
    title: "⚠️ ILLEGAL PHOTOSYNTHESIS DETECTED",
    content: "Sunlight absorption on Plot B exceeds county quota by 14.8 lumens. Federal sunlight tariff invoice attached.",
    cta: "PAY SUNLIGHT TAX"
  },
  {
    title: "🚜 EXTENDED TRACTOR WARRANTY EXPIRED",
    content: "We have been trying to reach you concerning your combine's hydrostatic transmission warranty since 1998.",
    cta: "RENEW WARRANTY"
  }
];

export default function NightmareEngine() {
  const [isActive, setIsActive] = useState(true);
  const [popups, setPopups] = useState([]);
  const [bsodOpen, setBsodOpen] = useState(false);
  const [bsodInput, setBsodInput] = useState('');
  const [captchaOpen, setCaptchaOpen] = useState(false);
  const [captchaTimer, setCaptchaTimer] = useState(4);
  const [selectedGrid, setSelectedGrid] = useState([]);
  const [screenGlitch, setScreenGlitch] = useState(false);
  const [bufferingOverlay, setBufferingOverlay] = useState(false);
  const [bufferCount, setBufferCount] = useState(1);

  const audioCtxRef = useRef(null);
  const audioIntervalRef = useRef(null);
  const popupIntervalRef = useRef(null);
  const speechIntervalRef = useRef(null);

  // Synthesize Dial-up Screech & Perpetual Sound Bites
  const playHarshBleep = (freq = 2400, type = 'sawtooth') => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (!ctx || ctx.state === 'suspended') return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // Audio autoplay policy
    }
  };

  // High-speed robot voice over (Web Speech API)
  const triggerVoiceover = () => {
    if ('speechSynthesis' in window) {
      const phrases = [
        "Warning: Nitrogen volatilization imminent. Yield reduction approaching maximum severity.",
        "Regulatory violation: Section 409 dictates immediate surrender of crop acreage.",
        "Error: Invalid tractor trajectory detected. Please calibrate your disc harrows.",
        "Alert: Subsurface moisture deficit detected. Photosynthesis has been administratively suspended."
      ];
      const utterance = new SpeechSynthesisUtterance(phrases[Math.floor(Math.random() * phrases.length)]);
      utterance.rate = 2.2;
      utterance.pitch = 1.9;
      utterance.volume = 0.5;
      window.speechSynthesis.speak(utterance);
    }
  };

  // 1. Spawning Popups every 1,200ms
  useEffect(() => {
    if (!isActive) return;

    popupIntervalRef.current = setInterval(() => {
      setPopups(prev => {
        if (prev.length > 14) return prev; // Limit max on screen so browser doesn't completely die
        const template = POPUP_ADS[Math.floor(Math.random() * POPUP_ADS.length)];
        const newPopup = {
          id: Date.now() + Math.random(),
          title: template.title,
          content: template.content,
          cta: template.cta,
          top: Math.max(60, Math.floor(Math.random() * (window.innerHeight - 250))),
          left: Math.max(20, Math.floor(Math.random() * (window.innerWidth - 320))),
          dodges: 0
        };
        return [...prev, newPopup];
      });
      playHarshBleep(800 + Math.random() * 2000, 'square');
    }, 1800);

    return () => clearInterval(popupIntervalRef.current);
  }, [isActive]);

  // 2. Audio Harassment Loop (every 1.5s)
  useEffect(() => {
    if (!isActive) return;

    audioIntervalRef.current = setInterval(() => {
      playHarshBleep(3000 + (Math.random() - 0.5) * 1500, 'sawtooth');
    }, 2200);

    speechIntervalRef.current = setInterval(() => {
      triggerVoiceover();
    }, 9000);

    return () => {
      clearInterval(audioIntervalRef.current);
      clearInterval(speechIntervalRef.current);
    };
  }, [isActive]);

  // 3. Screen Glitch / Strobe every 3s
  useEffect(() => {
    if (!isActive) return;
    const glitchInterval = setInterval(() => {
      setScreenGlitch(true);
      setTimeout(() => setScreenGlitch(false), 90);
    }, 3200);
    return () => clearInterval(glitchInterval);
  }, [isActive]);

  // 4. Micro-CAPTCHA Assault every 16 seconds
  useEffect(() => {
    if (!isActive) return;
    const captchaInterval = setInterval(() => {
      setCaptchaOpen(true);
      setCaptchaTimer(4);
      setSelectedGrid([]);
    }, 20000);
    return () => clearInterval(captchaInterval);
  }, [isActive]);

  // CAPTCHA countdown
  useEffect(() => {
    let t;
    if (captchaOpen && captchaTimer > 0) {
      t = setInterval(() => {
        setCaptchaTimer(prev => prev - 1);
      }, 1000);
    } else if (captchaOpen && captchaTimer === 0) {
      // Failed in 4 seconds! Reload screen / wipe!
      playHarshBleep(200, 'sawtooth');
      setCaptchaOpen(false);
      setScreenGlitch(true);
      setTimeout(() => setScreenGlitch(false), 300);
    }
    return () => clearInterval(t);
  }, [captchaOpen, captchaTimer]);

  // 5. Periodic BSOD Drop every 40 seconds
  useEffect(() => {
    if (!isActive) return;
    const bsodInterval = setInterval(() => {
      setBsodOpen(true);
      setBsodInput('');
      playHarshBleep(150, 'sawtooth');
    }, 45000);
    return () => clearInterval(bsodInterval);
  }, [isActive]);

  // Mouse Move Screen Shake listener
  useEffect(() => {
    if (!isActive) return;
    let timeout;
    const handleMove = () => {
      const root = document.getElementById('root');
      if (root) {
        const sx = (Math.random() - 0.5) * 4;
        const sy = (Math.random() - 0.5) * 4;
        root.style.transform = `translate(${sx}px, ${sy}px)`;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          root.style.transform = 'none';
        }, 50);
      }
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [isActive]);

  // Close button dodge: Hovering dodges, clicking spawns TWO MORE!
  const handlePopupHover = (id) => {
    setPopups(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          top: Math.max(60, Math.min(window.innerHeight - 200, p.top + (Math.random() - 0.5) * 80)),
          left: Math.max(20, Math.min(window.innerWidth - 300, p.left + (Math.random() - 0.5) * 120)),
          dodges: p.dodges + 1
        };
      }
      return p;
    }));
  };

  const handlePopupClickClose = (id, e) => {
    e.stopPropagation();
    sounds.playBuzzer();
    // Clicking close SPAWNS TWO MORE!
    setPopups(prev => {
      const filtered = prev.filter(p => p.id !== id);
      const template = POPUP_ADS[Math.floor(Math.random() * POPUP_ADS.length)];
      const spawned1 = {
        id: Date.now() + Math.random(),
        title: "🚨 CLONED: " + template.title,
        content: "Closing that window violated Title 7! Two penalty notices have been generated.",
        cta: "ACKNOWLEDGE PENALTY",
        top: Math.max(60, Math.floor(Math.random() * (window.innerHeight - 250))),
        left: Math.max(20, Math.floor(Math.random() * (window.innerWidth - 320))),
        dodges: 0
      };
      const spawned2 = {
        id: Date.now() + Math.random() + 1,
        title: "⚠️ DUPLICATE SUB-AUDIT SPAWNED",
        content: "Soil nitrate records compromised by unauthorized window termination.",
        cta: "SUBMIT AUDIT",
        top: Math.max(60, Math.floor(Math.random() * (window.innerHeight - 250))),
        left: Math.max(20, Math.floor(Math.random() * (window.innerWidth - 320))),
        dodges: 0
      };
      return [...filtered, spawned1, spawned2];
    });
  };

  const triggerBufferingTrap = () => {
    setBufferingOverlay(true);
    setBufferCount(1);
    const interval = setInterval(() => {
      setBufferCount(c => {
        if (c >= 994) {
          clearInterval(interval);
          setBufferingOverlay(false);
          return 1;
        }
        return c + Math.floor(Math.random() * 45) + 5;
      });
    }, 150);
  };

  return (
    <>
      {/* Visual Glitch / Inverted Strobe overlay */}
      {screenGlitch && (
        <div className="fixed inset-0 z-[100] pointer-events-none bg-black/30 backdrop-invert" />
      )}

      {/* Nightmare Mode Master Panic Switch Bar */}
      <div className="sticky top-0 z-[90] bg-[#FF00FF] text-[#00FF00] font-black text-xs px-2 py-1 flex items-center justify-between border-b-2 border-black select-none font-mono">
        <div className="flex items-center gap-2 truncate">
          <span className="animate-spin text-sm">☢️</span>
          <span>NIGHTMARE SENSORY OVERLOAD ENGINE: {isActive ? 'ENGAGED (ACTIVE OVERCLOCK)' : 'DISARMED'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={triggerBufferingTrap}
            className="win-btn !p-0.5 !px-1.5 text-[10px] !bg-yellow-300 text-black font-bold"
          >
            Trigger Infinite Buffer Loop
          </button>
          <button
            type="button"
            onClick={() => setBsodOpen(true)}
            className="win-btn !p-0.5 !px-1.5 text-[10px] !bg-blue-800 text-white font-bold"
          >
            Force BSOD Crash
          </button>
          <button
            type="button"
            onClick={() => {
              setIsActive(!isActive);
              setPopups([]);
              setCaptchaOpen(false);
              setBsodOpen(false);
            }}
            className="win-btn !p-0.5 !px-2 text-[10px] !bg-black text-[#00FF00] font-bold border border-white"
          >
            {isActive ? "🛑 DISARM CHAOS" : "⚡ ENGAGE NIGHTMARE"}
          </button>
        </div>
      </div>

      {/* Infinite Stacking Popups */}
      {isActive && popups.map((p) => (
        <div
          key={p.id}
          style={{ top: `${p.top}px`, left: `${p.left}px` }}
          className="fixed z-[70] w-72 win-window shadow-2xl border-2 border-black animate-violent-shake select-none"
        >
          <div className="win-titlebar !bg-[#800080]">
            <span className="text-[10px] font-bold truncate">📢 {p.title}</span>
            {/* Runaway close button */}
            <button
              type="button"
              onMouseEnter={() => handlePopupHover(p.id)}
              onClick={(e) => handlePopupClickClose(p.id, e)}
              className="win-btn !p-0 !px-1 text-[10px] font-bold text-red-900 leading-none"
              title="Close window (Spawns 2 more)"
            >
              ✕
            </button>
          </div>

          <div className="p-2.5 bg-[#ffffea] text-[10px] space-y-2">
            <p className="text-gray-900 leading-tight font-bold">{p.content}</p>
            <div className="pt-1 flex justify-between items-center">
              <span className="text-[9px] text-gray-500 font-mono">Dodges: {p.dodges}</span>
              <button
                type="button"
                onClick={(e) => handlePopupClickClose(p.id, e)}
                className="win-btn !p-1 text-[10px] font-bold text-blue-900"
              >
                {p.cta} →
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Continuous Micro-CAPTCHA Modal (4-second countdown!) */}
      {captchaOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 select-none">
          <div className="w-80 win-window shadow-2xl border-4 border-red-700 p-3 space-y-3 bg-[#d4d0c8]">
            <div className="win-titlebar !bg-red-800">
              <span className="text-xs font-bold">🚨 4-SECOND EMERGENCY CAPTCHA ASSAULT</span>
            </div>

            <div className="text-[11px] font-bold text-red-900 leading-snug">
              SELECT ALL COMBINE HARVESTER IMAGES WITH 100% ACCURACY IN {captchaTimer} SECONDS OR RELOAD!
            </div>

            {/* Countdown timer bar */}
            <div className="w-full win-sunken h-3 bg-gray-300 p-0.5">
              <div
                className="h-full bg-red-700 transition-all duration-1000"
                style={{ width: `${(captchaTimer / 4) * 100}%` }}
              />
            </div>

            {/* 3x3 Micro-Image Grid */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-white win-sunken">
              {['🚜', '🌽', '🚜', '🌾', '🚜', '🥔', '🍇', '🚜', '🌱'].map((icon, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    sounds.playWhoosh();
                    setSelectedGrid(prev =>
                      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
                    );
                  }}
                  className={`h-12 flex items-center justify-center text-xl border-2 ${
                    selectedGrid.includes(idx) ? 'border-blue-700 bg-blue-100' : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-[10px] font-mono text-red-800 font-bold">
                Time Remaining: 00:0{captchaTimer}s
              </span>
              <button
                type="button"
                onClick={() => {
                  sounds.playConfettiDing();
                  setCaptchaOpen(false);
                }}
                className="win-btn font-bold text-[10px] !px-3"
              >
                Verify Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Infinite Buffering Loop Overlay */}
      {bufferingOverlay && (
        <div className="fixed inset-0 z-[85] bg-black/80 flex flex-col items-center justify-center p-6 text-white font-mono select-none">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4" />
          <div className="text-sm font-bold text-yellow-300">
            BUFFERING COMPLIANCE ASSETS: {bufferCount} OF 994...
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Re-indexing soil micro-organism phylogenetic tree (Estimated wait: 47 hours, 18 minutes)...
          </div>
          <div className="w-64 h-3 win-sunken bg-gray-800 p-0.5 mt-3">
            <div
              className="h-full bg-yellow-400 transition-all"
              style={{ width: `${(bufferCount / 994) * 100}%` }}
            />
          </div>
          <button
            type="button"
            onClick={() => setBufferingOverlay(false)}
            className="win-btn mt-6 text-black !p-1 text-[10px]"
          >
            Force Cancel Buffering
          </button>
        </div>
      )}

      {/* Fake Blue Screen of Death (BSOD) Drop */}
      {bsodOpen && (
        <div className="fixed inset-0 z-[110] bg-[#0000AA] text-white p-6 md:p-12 font-mono text-xs md:text-sm select-none flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4 max-w-4xl">
            <div className="bg-white text-[#0000AA] px-2 py-0.5 inline-block font-bold">
              AGRO_SYS_FATAL_EXCEPTION_0x000000D1
            </div>

            <p>
              A problem has been detected and AGRO-SYS Enterprise has been halted to prevent damage to your soil nitrogen balance.
            </p>

            <p className="font-bold text-yellow-300">
              DRIVER_IRQL_NOT_LESS_OR_EQUAL: CROP_PHOTOSYNTHESIS_FAILURE.SYS
            </p>

            <p>
              Technical Information:
              <br />
              *** STOP: 0x000000D1 (0x00000000, 0x00000002, 0x00000000, 0xF86B5A89)
              <br />
              *** CROP_DEFICIT.SYS - Address F86B5A89 base at F86B0000, DateStamp 3d50893a
            </p>

            <p className="text-gray-300">
              To clear this crash and restore agricultural operations, you must manually type the unpasteable 20-character recovery sequence:
            </p>

            <div className="p-2 bg-black border border-white text-green-400 font-bold tracking-widest text-base">
              RECOVER-CROP-904-FAIL
            </div>

            <div className="pt-2">
              <input
                type="text"
                value={bsodInput}
                onPaste={(e) => { e.preventDefault(); alert("PASTING PROHIBITED: Manual keyboard typing is mandatory!"); }}
                onChange={(e) => setBsodInput(e.target.value.toUpperCase())}
                placeholder="TYPE STRING EXACTLY..."
                className="w-full max-w-md p-2 bg-black border-2 border-white text-white font-mono uppercase tracking-widest text-sm"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center border-t border-white/40 text-xs">
            <span>Press ESC or Complete String to Resume</span>
            <button
              type="button"
              onClick={() => {
                if (bsodInput === 'RECOVER-CROP-904-FAIL') {
                  setBsodOpen(false);
                  sounds.playConfettiDing();
                } else {
                  sounds.playBuzzer();
                  alert("INVALID RECOVERY STRING: You must type RECOVER-CROP-904-FAIL exactly!");
                }
              }}
              className="px-4 py-1.5 bg-white text-[#0000AA] font-bold text-xs hover:bg-yellow-300 border border-black"
            >
              Verify Recovery Key & Reboot →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
