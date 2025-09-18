// src/pages/Home.tsx — Lobby (modern title, calmer warm neons, doors lower)
// - Title: clean SVG text (Outfit), soft glow, sits above doors.
// - Neons: still warm yellow + gentle breathing, but LESS squiggly (smoother path).
// - Albums & vinyl image arrays unchanged; natural colors.

import { memo, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { DoorOpen, Info, Sparkles, Music } from 'lucide-react';

// ====== Album cover stickers (your original list — unchanged) ======
export type AlbumCover = {
  title: string;
  leftPct: number; // 0..100
  topPct: number;  // 0..100
  rotate?: number;
  imageUrl?: string;
};

const ALBUMS: AlbumCover[] = [
  { title: "Tyler, The Creator – IGOR",             leftPct: 6,  topPct: 42, rotate: -8, imageUrl: "/albums/flower_boy.jpg" },
  { title: "Laufey – Bewitched",                    leftPct: 18, topPct: 58, rotate:  6, imageUrl: "/albums/laufey_bewitched.jpg" },
  { title: "Juice WRLD – Legends Never Die",        leftPct: 35, topPct: 32, rotate: -4, imageUrl: "/albums/juice_drfl.jpg" },
  { title: "TYDE – (Your Fav Album)",               leftPct: 52, topPct: 54, rotate:  8, imageUrl: "/albums/yeat.jpg" },
  { title: "Tyler – Flower Boy",                    leftPct: 70, topPct: 28, rotate: -10, imageUrl: "/albums/ken.jpeg" },
  { title: "Laufey – Everything I Know About Love", leftPct: 86, topPct: 50, rotate:  5, imageUrl: "/albums/red.jpg" },

  // Bottom fill (as provided)
  { title: "Frank Ocean – Blond",                   leftPct: 12, topPct: 78, rotate: -6, imageUrl: "/albums/soso.jpg" },
  { title: "Kendrick Lamar – DAMN.",                leftPct: 30, topPct: 82, rotate:  5, imageUrl: "/albums/damn.jpeg" },
  { title: "Ye – The College Dropout",              leftPct: 48, topPct: 76, rotate: -8, imageUrl: "/albums/ian.jpeg" },
  { title: "SZA – SOS",                             leftPct: 66, topPct: 84, rotate:  7, imageUrl: "/albums/drake.jpg" },
  { title: "Metro – H&V",                           leftPct: 84, topPct: 78, rotate: -4, imageUrl: "/albums/lucki.jpeg" },
];

// ====== Vinyl row (your alternate album images) ======
const VINYL_IMAGES: string[] = [
  '/albums/sza.jpeg',
  '/albums/bag.jpeg',
  '/albums/jcole.jpeg',
  '/albums/wayne.jpeg',
  '/albums/tecca.jpeg',
  '/albums/lane.jpeg',
  '/albums/blakc.jpeg',
  '/albums/tyde.jpeg',
  '/albums/avenoir.jpeg',
];

export default function Home() {
  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden text-white" style={woodWallStyle}>
      {/* Page-local CSS helpers & font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;700;900&display=swap');
        @keyframes floatSlow { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-6px) } }
        .font-title { font-family: 'Outfit', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
        .sticker { box-shadow: 0 14px 24px rgba(0,0,0,.35); }
      `}</style>

      {/* Decorative layer: neon(s) + vinyls + stickers (neons behind) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <VinylRow />

        {/* Top warm neon */}
        <NeonZigZag className="absolute inset-x-0 top-[12svh]" seed={17} />

        {/* Bottom warm neon */}
        <NeonZigZag className="absolute inset-x-0 bottom-[12svh]" seed={29} />

        <AlbumStickers />
        {/* Fine noise overlay for texture; helps banding on gradients */}
        <div className="absolute inset-0 opacity-[.06] mix-blend-overlay" style={noiseLayerStyle} />
      </div>

      {/* Foreground content */}
      <section className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pb-28 pt-40 sm:pt-44">
        {/* Modern + clean title above the doors */}
        <LobbyTitle text="The Lobby" />

        {/* Doors a bit lower so title has space above */}
        <nav className="mt-10 sm:mt-12 grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          <DoorCard href="/about" label="About" subtitle="Who we are" icon={<Info className="h-5 w-5" />} accent="from-indigo-400 to-sky-400" />
          <DoorCard href="/how-to" label="Features" subtitle="Get started" icon={<Sparkles className="h-5 w-5" />} accent="from-fuchsia-400 to-rose-400" />
          <DoorCard href="/create" label="Create a Beat" subtitle="Jump in" icon={<Music className="h-5 w-5" />} accent="from-emerald-400 to-teal-400" focus />
        </nav>
      </section>

      {/* Room vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_50%_0%,transparent_0%,transparent_55%,rgba(0,0,0,.22)_70%,rgba(0,0,0,.55)_100%)]" />
    </main>
  );
}

// === Modern wood wall background ===
const woodWallStyle: CSSProperties = {
  backgroundColor: '#2f2015',
  backgroundImage: [
    'repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 6px)',
    'repeating-linear-gradient(0deg, rgba(0,0,0,0.035) 0px, rgba(0,0,0,0.035) 3px, rgba(255,255,255,0.02) 3px, rgba(255,255,255,0.02) 8px)',
    'radial-gradient(140% 90% at 50% 10%, #7a5133 0%, #5a3a22 42%, #2f2015 100%)',
  ].join(','),
  backgroundBlendMode: 'overlay, overlay, normal',
};

// Subtle noise to reduce banding
const noiseLayerStyle: CSSProperties = {
  backgroundImage:
    "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"160\" height=\"160\" viewBox=\"0 0 160 160\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"1\" stitchTiles=\"stitch\"/></filter><rect width=\"100%\" height=\"100%\" filter=\"url(%23n)\" opacity=\"0.15\"/></svg>')",
  backgroundSize: '160px 160px',
};

// === Door card ===
function DoorCard({
  href,
  label,
  subtitle,
  icon,
  focus,
  accent = 'from-indigo-400 to-sky-400',
}: {
  href: string;
  label: string;
  subtitle?: string;
  icon?: React.ReactNode;
  focus?: boolean;
  accent?: string;
}) {
  return (
    <a
      href={href}
      className={[
        'group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md',
        'transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 focus:outline-none',
        focus ? 'ring-2 ring-offset-0 ring-indigo-400/60' : 'ring-1 ring-white/10',
      ].join(' ')}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 -z-10 rounded-3xl opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r ${accent}`}
      />
      <motion.div
        aria-hidden
        className="absolute -top-6 left-1/4 right-1/4 h-24 rounded-full opacity-40"
        style={{ background: 'linear-gradient(90deg, rgba(255,255,255,.0), rgba(255,255,255,.35), rgba(255,255,255,.0))' }}
        initial={{ x: -30 }}
        whileHover={{ x: 30 }}
        transition={{ type: 'spring', stiffness: 60, damping: 18 }}
      />
      <div className="flex h-full flex-col items-start gap-2">
        <div className="flex items-center gap-2 text-white/90">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
            {icon ?? <DoorOpen className="h-5 w-5" />}
          </span>
          <span className="text-xl font-extrabold leading-none tracking-tight">{label}</span>
        </div>
        {subtitle && <span className="pl-11 text-sm text-white/75">{subtitle}</span>}
        <span className="mt-6 inline-flex items-center gap-2 self-end rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
          Enter
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
        </span>
      </div>
    </a>
  );
}

// === Static Warm Neon ZigZag (calmer, weaves around covers, gentle glow “breathing”) ===
// Reusable: pass a different seed to vary the shape; both lines avoid the same albums.
function NeonZigZag({
  className = '',
  seed = 17,
}: {
  className?: string;
  seed?: number;
}) {
  // Compute album x-positions in the 2400px SVG coordinate space.
  const avoidXs = useMemo(() => ALBUMS.map(a => (a.leftPct / 100) * 2400), []);
  // Build a single, static path that “avoids” those x-positions.
  const path = useMemo(
    () =>
      buildAvoidingPath({
        width: 2400,
        yMin: 26,
        yMax: 134,
        step: 44,          // larger step => smoother, less squiggly
        seed,
        avoidXs,
        avoidPush: 18,     // smaller push => calmer weave
        baseAmp: 0.12,     // base wobble amplitude (was ~0.18)
        spiceAmp: 0.05,    // secondary wobble (was ~0.08)
        jitterAmp: 0.10,   // random jitter (was ~0.18)
        sigma: 150,        // wider influence => smoother detour
      }),
    [avoidXs, seed]
  );

  return (
    <div className={`pointer-events-none ${className}`}>
      <svg className="mx-auto block h-52 w-full opacity-95" viewBox="0 0 2400 160" preserveAspectRatio="none">
        <defs>
          {/* warm yellow core & halo */}
          <linearGradient id={`led-core-${seed}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fde68a" />  {/* amber-200 */}
            <stop offset="100%" stopColor="#facc15" /> {/* amber-400 */}
          </linearGradient>
          <linearGradient id={`led-outer-${seed}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fff3b0" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
          <filter id={`neon-blur-${seed}`} x="-20%" y="-300%" width="140%" height="700%">
            <feGaussianBlur stdDeviation="8" result="b1" />
            <feGaussianBlur in="b1" stdDeviation="10" result="b2" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Static line; only glow/brightness breathes */}
        <motion.g
          initial={{ opacity: 0.92, filter: 'brightness(1)' }}
          animate={{ opacity: [0.92, 1, 0.92], filter: ['brightness(1)', 'brightness(1.07)', 'brightness(1)'] }}
          transition={{ duration: 2.6, ease: 'easeInOut', repeat: Infinity }}
        >
          {/* Outer warm halo */}
          <path d={path} fill="none" stroke={`url(#led-outer-${seed})`} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" filter={`url(#neon-blur-${seed})`} opacity={0.5} />
          {/* Gradient warm glow */}
          <path d={path} fill="none" stroke={`url(#led-core-${seed})`} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" filter={`url(#neon-blur-${seed})`} opacity={0.98} />
          {/* Inner bright filament */}
          <path d={path} fill="none" stroke="#fff8dc" strokeWidth={3.8} strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>
      </svg>
    </div>
  );
}

// ====== Path that avoids album x-ranges with adjustable “calmness” ======
function buildAvoidingPath({
  width, yMin, yMax, step, seed, avoidXs, avoidPush = 18,
  baseAmp = 0.12, spiceAmp = 0.05, jitterAmp = 0.10, sigma = 150,
}: {
  width: number; yMin: number; yMax: number; step: number; seed: number;
  avoidXs: number[]; avoidPush?: number;
  baseAmp?: number; spiceAmp?: number; jitterAmp?: number; sigma?: number;
}) {
  let s = seed >>> 0;
  const rand = () => (s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32;
  const pts: Array<[number, number]> = [];
  const mid = (yMax + yMin) / 2;
  const span = (yMax - yMin);

  // Alternate push direction album-by-album so it visibly weaves around covers
  const dirByIndex = (i: number) => (i % 2 === 0 ? 1 : -1);

  for (let x = 0; x <= width; x += step) {
    // Calmer base wobble + restrained jitter
    const t = x / 210;
    const base = Math.sin(t) * span * baseAmp + Math.sin(t * 0.37 + 1.4) * span * spiceAmp;
    let offset = base + (rand() - 0.5) * span * jitterAmp;

    // Avoidance sum: gaussian bumps centered at album x's
    avoidXs.forEach((ax, i) => {
      const dx = x - ax;
      const influence = Math.exp(-(dx * dx) / (2 * sigma * sigma));
      offset += dirByIndex(i) * influence * avoidPush;
    });

    const y = Math.max(yMin, Math.min(yMax, mid + offset));
    pts.push([x, y]);
  }

  // Smooth with cubic segments
  let d = '';
  pts.forEach((p, i) => {
    const [x, y] = p;
    if (i === 0) d += `M ${x} ${y}`;
    else {
      const [px, py] = pts[i - 1];
      const cx1 = px + step * 0.48, cy1 = py;
      const cx2 = x - step * 0.48, cy2 = y;
      d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x} ${y}`;
    }
  });
  return d;
}

// ====== Decorative vinyl row (uses your alternate album images) ======
const VinylRow = memo(function VinylRow() {
  const imgs = VINYL_IMAGES;
  return (
    <div className="pointer-events-none absolute left-0 right-0 top-0 z-0 flex items-start justify-between gap-6 px-6 py-3">
      {imgs.map((src, i) => (
        <Vinyl key={i} imageUrl={src} size={90} bobDelay={i * 140} />
      ))}
    </div>
  );
});

const Vinyl = memo(function Vinyl({ imageUrl, size = 100, bobDelay = 0 }: { imageUrl?: string; size?: number; bobDelay?: number }) {
  const dim = `${size}px`;
  return (
    <div
      className="relative rounded-full"
      style={{
        width: dim,
        height: dim,
        backgroundImage: [
          'repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,.08) 0 1px, rgba(0,0,0,0) 1.5px 3px)',
          'radial-gradient(circle at 50% 50%, #111 0%, #0b0b0b 55%, #000 78%)',
        ].join(','),
        boxShadow: 'inset 0 0 10px rgba(255,255,255,.06), 0 12px 24px rgba(0,0,0,.38)',
        animation: `floatSlow 5.5s ease-in-out ${bobDelay}ms infinite`,
      }}
    >
      <div className="absolute inset-0 rounded-full ring-1 ring-white/10" />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-black/40"
        style={{ width: size * 0.42, height: size * 0.42, background: '#111' }}
      >
        {imageUrl ? <img src={imageUrl} alt="" className="h-full w-full object-cover" draggable={false} /> : null}
      </div>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: size * 0.06, height: size * 0.06, background: '#000' }}
      />
    </div>
  );
});

// ====== Album stickers (natural colors) ======
const AlbumStickers = memo(function AlbumStickers() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {ALBUMS.map((c) => (
        <AlbumSticker key={c.title} {...c} />
      ))}
    </div>
  );
});

const AlbumSticker = memo(function AlbumSticker({ title, leftPct, topPct, rotate = 0, imageUrl }: AlbumCover) {
  return (
    <div
      className="sticker absolute aspect-square w-28 select-none rounded-xl border-4 border-white/80 bg-white/90 p-1"
      style={{ left: `${leftPct}%`, top: `${topPct}%`, transform: `rotate(${rotate}deg)` }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full rounded-lg object-cover"
          loading="lazy"
          draggable={false}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center rounded-lg text-center text-xs font-extrabold text-black"
          style={{
            background:
              'radial-gradient(110% 130% at 20% 20%, rgba(255,255,255,.85), rgba(255,255,255,.6) 35%, rgba(255,255,255,.3) 55%, rgba(255,255,255,.15) 70%), conic-gradient(from 90deg, #38bdf8, #8b5cf6, #a78bfa, #22d3ee, #38bdf8)',
          }}
        >
          {title}
        </div>
      )}
    </div>
  );
});

// ====== Modern, clean title (SVG text with subtle glow) ======
function LobbyTitle({ text }: { text: string }) {
  return (
    <div className="w-full">
      <svg
        className="mx-auto block"
        viewBox="0 0 1100 140"
        width="100%"
        height="auto"
        aria-label={text}
      >
        <defs>
          {/* Minimal cool-white gradient */}
          <linearGradient id="lobby-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#eaf2ff" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
          {/* Soft, edge-free glow */}
          <filter id="lobby-glow" x="-40%" y="-120%" width="180%" height="300%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="g1" />
            <feGaussianBlur in="SourceAlpha" stdDeviation="14" result="g2" />
            <feMerge>
              <feMergeNode in="g2" />
              <feMergeNode in="g1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Thin outer stroke for definition */}
        <text
          x="50%" y="58%" textAnchor="middle" dominantBaseline="middle"
          className="font-title"
          fontSize="120"
          fill="none"
          stroke="rgba(255,255,255,.45)"
          strokeWidth="6"
          filter="url(#lobby-glow)"
        >
          {text}
        </text>
        {/* Solid fill */}
        <text
          x="50%" y="58%" textAnchor="middle" dominantBaseline="middle"
          className="font-title"
          fontWeight="900"
          fontSize="120"
          fill="url(#lobby-grad)"
          filter="url(#lobby-glow)"
        >
          {text}
        </text>
      </svg>
    </div>
  );
}
