import React, { useEffect, useRef } from 'react';

export type WeatherEffectType = 'sunny' | 'rainy' | 'windy' | 'storm' | 'auto';

interface WeatherAtmosphereEffectProps {
  weatherCode: number;
  windSpeed: number;
  precipitation: number;
  overrideEffect?: WeatherEffectType;
}

interface RainParticle {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  tilt: number;
}

interface SunMoteParticle {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  opacity: number;
  pulsePhase: number;
}

interface LeafParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  oscillateSpeed: number;
  oscillateAmp: number;
  color: string;
}

export const WeatherAtmosphereEffect: React.FC<WeatherAtmosphereEffectProps> = ({
  weatherCode,
  windSpeed,
  precipitation,
  overrideEffect = 'auto'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Determine active atmosphere mode based on weather code, wind speed, or manual override
  const getActiveMode = (): 'sunny' | 'rainy' | 'windy' | 'storm' => {
    if (overrideEffect !== 'auto') {
      return overrideEffect === 'sunny' ? 'sunny' : 
             overrideEffect === 'rainy' ? 'rainy' : 
             overrideEffect === 'windy' ? 'windy' : 'storm';
    }

    // Thunderstorm
    if (weatherCode >= 95) return 'storm';
    // Rain
    if (precipitation > 0.1 || (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
      return 'rainy';
    }
    // High wind
    if (windSpeed > 14) {
      return 'windy';
    }
    // Clear / Sunny
    if (weatherCode === 0 || weatherCode === 1) {
      return 'sunny';
    }
    // Moderate conditions default to gentle breeze or sunny
    return windSpeed > 10 ? 'windy' : 'sunny';
  };

  const activeMode = getActiveMode();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 780);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // 1. Initialize Rain Particles
    const rainCount = activeMode === 'storm' ? 120 : activeMode === 'rainy' ? 70 : 0;
    const rainParticles: RainParticle[] = Array.from({ length: rainCount }, () => ({
      x: Math.random() * (width + 100) - 50,
      y: Math.random() * height,
      length: 14 + Math.random() * 22,
      speed: 12 + Math.random() * 16,
      opacity: 0.2 + Math.random() * 0.5,
      tilt: -2.5 - Math.random() * 2,
    }));

    // 2. Initialize Sun Motes (Golden Bokeh)
    const sunMoteCount = activeMode === 'sunny' ? 24 : 0;
    const sunMotes: SunMoteParticle[] = Array.from({ length: sunMoteCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 1.5 + Math.random() * 3.5,
      speedY: -0.3 - Math.random() * 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: 0.2 + Math.random() * 0.6,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    // 3. Initialize Wind Leaves
    const leafColors = [
      '#65a30d', // fresh green
      '#84cc16', // lime leaf
      '#4d7c0f', // deep tropical green
      '#eab308', // golden leaf
      '#ca8a04', // amber leaf
    ];
    const leafCount = activeMode === 'windy' ? 14 : activeMode === 'storm' ? 8 : 0;
    const leaves: LeafParticle[] = Array.from({ length: leafCount }, () => ({
      x: Math.random() * (width + 120) - 60,
      y: Math.random() * height,
      size: 10 + Math.random() * 10,
      speedX: 2.2 + Math.random() * 3.5,
      speedY: 0.4 + Math.random() * 0.9,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 4,
      oscillateSpeed: 0.02 + Math.random() * 0.03,
      oscillateAmp: 1.5 + Math.random() * 2.5,
      color: leafColors[Math.floor(Math.random() * leafColors.length)],
    }));

    // Helper to draw a natural tropical leaf path
    const drawLeaf = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string
    ) => {
      c.save();
      c.translate(x, y);
      c.rotate((rotation * Math.PI) / 180);
      c.fillStyle = color;
      c.beginPath();
      c.moveTo(0, -size);
      c.bezierCurveTo(size * 0.6, -size * 0.5, size * 0.6, size * 0.5, 0, size);
      c.bezierCurveTo(-size * 0.6, size * 0.5, -size * 0.6, -size * 0.5, 0, -size);
      c.closePath();
      c.fill();

      // Leaf center stem vein
      c.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(0, -size * 0.8);
      c.lineTo(0, size * 0.8);
      c.stroke();
      c.restore();
    };

    // Lightning Flash State for Storm
    let lightningTimer = 0;
    let lightningAlpha = 0;

    let time = 0;

    // Animation Loop
    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // ==========================================
      // 1. EFEK CAHAYA MATAHARI (SUNNY) — POJOK ATAS
      // ==========================================
      if (activeMode === 'sunny') {
        // Posisi tepat di pojok atas kanan layar
        const sunX = width;
        const sunY = 0;

        // A. Pendaran Cahaya Utama di Pojok Atas (Atmospheric Corner Flare)
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 340);
        sunGlow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        sunGlow.addColorStop(0.12, 'rgba(254, 240, 138, 0.7)');
        sunGlow.addColorStop(0.3, 'rgba(251, 191, 36, 0.35)');
        sunGlow.addColorStop(0.65, 'rgba(245, 158, 11, 0.12)');
        sunGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 340, 0, Math.PI * 2);
        ctx.fill();

        // B. God-Rays (Sinar Cahaya Memancar dari Pojok Atas ke Bawah-Kiri)
        const rayCount = 10;
        const pulse = Math.sin(time * 1.6) * 0.08 + 0.22;
        for (let i = 0; i < rayCount; i++) {
          // Sudut memancar ke bawah dan ke kiri (antara 90° dan 180°)
          const baseAngle = (Math.PI * 0.52) + (i / rayCount) * (Math.PI * 0.44);
          const angle = baseAngle + Math.sin(time * 0.4 + i) * 0.03;
          const beamLength = height * 0.85;
          const raySpread = 0.08 + Math.sin(time * 0.7 + i * 1.5) * 0.02;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(sunX, sunY);
          ctx.arc(sunX, sunY, beamLength, angle - raySpread, angle + raySpread);
          ctx.closePath();

          const rayGrad = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, beamLength);
          rayGrad.addColorStop(0, `rgba(255, 255, 255, ${pulse * 1.4})`);
          rayGrad.addColorStop(0.2, `rgba(254, 240, 138, ${pulse * 0.9})`);
          rayGrad.addColorStop(0.5, `rgba(251, 191, 36, ${pulse * 0.4})`);
          rayGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
          ctx.fillStyle = rayGrad;
          ctx.fill();
          ctx.restore();
        }

        // C. Cincin Lens Flare Halus Menyerong ke Kiri-Bawah
        const flareDistances = [0.25, 0.45, 0.65];
        flareDistances.forEach((dist, idx) => {
          const fx = sunX - width * dist;
          const fy = sunY + height * dist * 0.55;
          const fr = 12 + idx * 16;
          ctx.save();
          ctx.beginPath();
          ctx.arc(fx, fy, fr, 0, Math.PI * 2);
          ctx.fillStyle = idx === 1 
            ? 'rgba(254, 240, 138, 0.12)' 
            : 'rgba(251, 191, 36, 0.08)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fill();
          ctx.restore();
        });

        // D. Golden Bokeh Motes (Partikel Berpendar Mengambang)
        sunMotes.forEach((mote) => {
          mote.y += mote.speedY;
          mote.x += mote.speedX + Math.sin(time + mote.pulsePhase) * 0.3;
          if (mote.y < -10) {
            mote.y = height + 10;
            mote.x = Math.random() * width;
          }

          const currentOpacity = mote.opacity * (0.6 + Math.sin(time * 2 + mote.pulsePhase) * 0.4);
          ctx.beginPath();
          ctx.arc(mote.x, mote.y, mote.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(254, 243, 199, ${currentOpacity})`;
          ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // ==========================================
      // 2. EFEK HUJAN & BADAI (RAINY / STORM)
      // ==========================================
      if (activeMode === 'rainy' || activeMode === 'storm') {
        // Storm Lightning Sheet Flash
        if (activeMode === 'storm') {
          lightningTimer++;
          if (lightningTimer > 180 + Math.random() * 240) {
            lightningAlpha = 0.6 + Math.random() * 0.3;
            lightningTimer = 0;
          }
          if (lightningAlpha > 0) {
            ctx.fillStyle = `rgba(224, 231, 255, ${lightningAlpha})`;
            ctx.fillRect(0, 0, width, height);
            lightningAlpha *= 0.85; // fast fade
          }
        }

        ctx.strokeStyle = activeMode === 'storm' 
          ? 'rgba(199, 210, 254, 0.65)' 
          : 'rgba(186, 230, 253, 0.55)';
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';

        rainParticles.forEach((drop) => {
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x + drop.tilt * 2, drop.y + drop.length);
          ctx.stroke();

          drop.y += drop.speed;
          drop.x += drop.tilt;

          // Reset raindrop when it falls below screen
          if (drop.y > height) {
            drop.y = -20;
            drop.x = Math.random() * (width + 80) - 30;

            // Subtle splash ripple at bottom
            if (Math.random() > 0.7) {
              ctx.beginPath();
              ctx.ellipse(drop.x, height - 3, 4, 1.5, 0, 0, Math.PI * 2);
              ctx.strokeStyle = 'rgba(224, 242, 254, 0.3)';
              ctx.stroke();
            }
          }
        });
      }

      // ==========================================
      // 3. EFEK ANGIN & DAUN TERBANG (WINDY)
      // ==========================================
      if (activeMode === 'windy' || activeMode === 'storm') {
        // A. Subtle Wind Breeze Streamlines
        const streamCount = 4;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < streamCount; i++) {
          const yPos = 120 + i * 160 + Math.sin(time + i) * 20;
          const startX = ((time * 120 + i * 180) % (width + 300)) - 150;
          ctx.beginPath();
          ctx.moveTo(startX, yPos);
          ctx.bezierCurveTo(
            startX + 50, yPos - 12,
            startX + 120, yPos + 12,
            startX + 200, yPos
          );
          ctx.stroke();
        }

        // B. Fluttering Tumbling Leaves
        leaves.forEach((leaf) => {
          leaf.x += leaf.speedX;
          leaf.y += leaf.speedY + Math.sin(time * 3 + leaf.oscillateSpeed) * leaf.oscillateAmp;
          leaf.rotation += leaf.rotationSpeed;

          drawLeaf(ctx, leaf.x, leaf.y, leaf.size, leaf.rotation, leaf.color);

          // Wrap around screen
          if (leaf.x > width + 40) {
            leaf.x = -30;
            leaf.y = Math.random() * (height * 0.85);
          }
          if (leaf.y > height + 20) {
            leaf.y = -20;
          }
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeMode]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-[38px]">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};
