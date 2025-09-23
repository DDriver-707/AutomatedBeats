import React, { useEffect, useMemo, useRef, useState } from "react";
import "./howto.css";
import {
  Music2,
  Compass,
  FilePlus2,
  SlidersHorizontal,
  Share2,
  Wrench,
  LifeBuoy,
  Sparkles,
} from "lucide-react";

type Row = { icon: React.ReactNode; title: string; content: string };

const rows: Row[] = [
  { icon: <Music2 className="size-4" />, title: "Getting Started", content: "Click anywhere to begin exploring the site. Everything is designed to be intuitive and easy to use." },
  { icon: <Compass className="size-4" />, title: "Navigation", content: "Use the menu to move between sections. Pages load quickly and transitions are smooth." },
  { icon: <FilePlus2 className="size-4" />, title: "Creating Content", content: "Hit the ‘New’ button to start. The software guides you through each step of the process." },
  { icon: <SlidersHorizontal className="size-4" />, title: "Customization", content: "Open Settings to pick themes and layouts that fit your workflow." },
  { icon: <Share2 className="size-4" />, title: "Sharing", content: "Use ‘Send’ to share or export to multiple formats when you’re ready." },
  { icon: <Wrench className="size-4" />, title: "Advanced Tools", content: "Filters, templates, and automation live in the Tools menu." },
  { icon: <LifeBuoy className="size-4" />, title: "Help & Support", content: "Check Help or use the contact form if you get stuck." },
  { icon: <Sparkles className="size-4" />, title: "Tips & Tricks", content: "Keyboard shortcuts = speed. Hold ⌘/Ctrl while clicking to open items in a new tab." },
];

/* ---------- Random doodles ---------- */
type Doodle = {
  id: number;
  top: number;
  left: number;
  rotate: number;
  scale: number;
  color: string;
  op: number;
  kind: "star" | "note" | "spiral" | "squiggle" | "ring";
};

const COLOR_PALETTE = [
  "#60a5fa", "#a78bfa", "#22d3ee", "#34d399", "#fbbf24", "#fb7185", "#f472b6",
];

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

export default function HowTo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(2000);
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  // Measure page size so doodles + holes scale with content
  useEffect(() => {
    const measure = () => {
      setWidth(window.innerWidth);
      const h =
        rootRef.current?.scrollHeight ??
        document.documentElement.scrollHeight ??
        document.body.scrollHeight ??
        window.innerHeight;
      setHeight(h);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (rootRef.current) ro.observe(rootRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Distribute holes from near top to near bottom with even spacing
  const holes = useMemo(() => {
    const first = 150;        // first hole down from the top
    const last = Math.max(first + 300, height - 140); // keep a little bottom margin
    const minSpacing = 190;   // make gaps bigger than before
    const available = last - first;
    const count = Math.max(3, Math.ceil(available / minSpacing) + 1); // +1 so last sits near bottom
    const out: number[] = [];
    for (let i = 0; i < count; i++) {
      const y = first + (available * i) / (count - 1);
      out.push(y);
    }
    return out;
  }, [height]);

  // Colorful doodles behind text
  const doodles: Doodle[] = useMemo(() => {
    const count = Math.min(110, Math.max(54, Math.round(height / 36)));
    const arr: Doodle[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        id: i,
        top: rand(100, Math.max(700, height - 150)),
        left: rand(120, Math.max(160, width - 160)),
        rotate: rand(-18, 18),
        scale: rand(0.85, 1.45),
        color: COLOR_PALETTE[Math.floor(rand(0, COLOR_PALETTE.length))],
        op: rand(0.28, 0.5),
        kind: (["star", "note", "spiral", "squiggle", "ring"] as const)[
          Math.floor(rand(0, 5))
        ],
      });
    }
    return arr;
  }, [height, width]);

  return (
    <main className="howto" ref={rootRef}>
      {/* paper + effects */}
      <div className="howto__bg" aria-hidden />
      <div className="howto__shadow" aria-hidden />
      {/* horizontal gradient band closer to the bottom */}
      <div className="howto__band" aria-hidden />
      <div className="howto__torn" aria-hidden />

      {/* red margin & holes (full-height coverage) */}
      <div className="howto__margin howto__abs" aria-hidden />
      {holes.map((t, i) => (
        <div key={i} className="howto__hole howto__abs" style={{ top: t }} aria-hidden />
      ))}

      {/* colorful doodles (BEHIND writing) */}
      <div className="howto__doodleLayer" aria-hidden>
        {doodles.map((d) => (
          <DoodleSVG key={d.id} {...d} />
        ))}
      </div>

      {/* sticky colored tabs on the right edge */}
      <aside className="howto__tabs" aria-hidden>
        <i className="tab t1" />
        <i className="tab t2" />
        <i className="tab t3" />
      </aside>

      {/* content */}
      <section className="howto__content">
        <div className="howto__meta">
          <span className="badge">How-To Guide</span>
          <span className="updated">Last updated <time>today</time></span>
        </div>

        <h1 className="howto__title">Website &amp; Software Instructions</h1>
        <p className="howto__note">(notes scribbled by a very serious musician 📝)</p>
        <div className="howto__rule" />

        <ul className="howto__list">
          {rows.map((row, i) => (
            <li key={i} className="row">
              <span className="row__icon">{row.icon}</span>
              <div className="row__text">
                <h2 className="row__title">{row.title}</h2>
                <p className="row__body">{row.content}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="howto__tip">
          Pro tip: press <kbd className="kbd">⌘/Ctrl</kbd> while clicking to open items in a new tab.
        </p>
      </section>

      {/* defs */}
      <svg width="0" height="0" className="howto__svg">
        <filter id="paperNoise" x="0" y="0" width="100%" height="100%">
          <feTurbulence baseFrequency="0.7" numOctaves="2" type="fractalNoise" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer><feFuncA type="table" tableValues="0 0.03" /></feComponentTransfer>
        </filter>
      </svg>
    </main>
  );
}

function DoodleSVG(d: Doodle) {
  const common = {
    style: {
      top: d.top,
      left: d.left,
      transform: `rotate(${d.rotate}deg) scale(${d.scale})`,
      color: d.color,
      opacity: d.op,
    } as React.CSSProperties,
    className: "howto__doodle",
  };

  switch (d.kind) {
    case "star":
      return (
        <svg {...common} viewBox="0 0 120 120">
          <path d="M60 10 L68 42 L102 42 L74 60 L84 92 L60 74 L36 92 L46 60 L18 42 L52 42 Z" />
        </svg>
      );
    case "note":
      return (
        <svg {...common} viewBox="0 0 80 120">
          <path d="M18 86 q8-6 14 0 v-42 h10 v-8 h10 v54 q-6-6-14 0" fill="none" />
          <circle cx="18" cy="90" r="6" /><circle cx="52" cy="90" r="6" />
        </svg>
      );
    case "spiral":
      return (
        <svg {...common} viewBox="0 0 100 100">
          <path d="M50 50 m-24 0 a24 24 0 1 1 48 0 a18 18 0 1 1 -36 0 a12 12 0 1 1 24 0 a6 6 0 1 1 -12 0" fill="none" />
        </svg>
      );
    case "ring":
      return (
        <svg {...common} viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="44" fill="none" />
          <circle cx="70" cy="70" r="50" fill="none" opacity=".65" />
        </svg>
      );
    default: // squiggle
      return (
        <svg {...common} viewBox="0 0 200 60">
          <path d="M4 32 C 34 10, 66 10, 96 32 S 158 54, 196 30" fill="none" />
        </svg>
      );
  }
}
