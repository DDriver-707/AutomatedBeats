import { Music2 } from "lucide-react";

const Step = ({ title, detail }: { title: string; detail: string }) => (
  <li className="flex items-start gap-3">
    <span className="mt-1"><Music2 className="w-5 h-5" /></span>
    <div>
      <p className="font-semibold">{title}</p>
      <p className="text-neutral-700">{detail}</p>
    </div>
  </li>
);

export default function HowTo() {
  return (
    <main className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-neutral-950 to-neutral-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative paper rounded-2xl shadow-2xl border border-neutral-200 p-8 md:p-10">
          <div className="burn-corner" />
          <div className="absolute right-6 top-6 text-2xl select-none">🔥</div>

          <h1 className="text-3xl md:text-4xl font-bold">How to Use & Features</h1>
          <p className="mt-2 text-neutral-700">Quick steps to go from idea to beat.</p>

          <ol className="mt-6 space-y-4">
            <Step title="Pick a genre" detail="Hip-hop, trap, lo-fi, EDM…" />
            <Step title="Set the vibe" detail="Tempo & mood (calm, energetic, dreamy)." />
            <Step title="Generate" detail="We draft drums, bass, chords; iterate instantly." />
            <Step title="Tweak features" detail="Mute layers, swap kits, adjust swing, export audio/MIDI." />
          </ol>

          {/* Pencil */}
          <svg className="absolute -bottom-6 right-8 w-48 rotate-12 drop-shadow" viewBox="0 0 300 60" aria-hidden>
            <rect x="20" y="20" width="220" height="18" fill="#fbbf24" />
            <rect x="240" y="20" width="30" height="18" fill="#e5e7eb" />
            <polygon points="270,29 295,20 295,38" fill="#9ca3af" />
            <polygon points="295,20 300,29 295,38" fill="#111827" />
            <rect x="30" y="19" width="8" height="20" fill="#ef4444" />
          </svg>
        </div>
      </div>
    </main>
  );
}
