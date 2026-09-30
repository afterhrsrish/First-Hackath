import confetti from 'canvas-confetti';
import { sounds } from './SoundEffects';

export function fireObnoxiousConfetti(originX = 0.5, originY = 0.5) {
  sounds.playConfettiDing();
  
  // Fire multiple messy chaotic bursts
  confetti({
    particleCount: 120,
    spread: 100,
    origin: { x: originX, y: originY },
    colors: ['#00FF00', '#FF007F', '#FFFF00', '#00FFFF', '#FF6600', '#FFFFFF']
  });

  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 70,
      origin: { x: 0 },
      colors: ['#FF007F', '#00FF00', '#FFFF00']
    });
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 70,
      origin: { x: 1 },
      colors: ['#00FFFF', '#FF007F', '#FFFF00']
    });
  }, 200);
}
