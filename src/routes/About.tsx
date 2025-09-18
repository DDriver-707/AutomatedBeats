import { Instagram, Github, Music2, Headphones } from "lucide-react";

export default function About() {
  return (
    <main className="bg-brick min-h-[calc(100vh-56px)]">
      <div className="max-w-6xl mx-auto px-4 py-14 relative">
        <h1 className="text-6xl md:text-7xl font-black text-white drop-shadow-[0_6px_0_rgba(0,0,0,0.55)] tracking-tight -rotate-2">
          ABOUT US
        </h1>

        {/* Cartoon placeholders (swap with your illustration later) */}
        <div className="mt-10 flex items-end gap-10">
          <div className="relative">
            <div className="w-36 h-48 bg-gradient-to-b from-fuchsia-500 to-purple-700 rounded-xl rotate-3 shadow-2xl border-4 border-white/20 flex items-center justify-center">
              <Headphones className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -bottom-4 left-2 w-20 h-3 bg-black/60 blur rounded-full" />
          </div>
          <div className="relative">
            <div className="w-36 h-48 bg-gradient-to-b from-cyan-400 to-blue-700 rounded-xl -rotate-3 shadow-2xl border-4 border-white/20 flex items-center justify-center">
              <Music2 className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -bottom-4 left-2 w-20 h-3 bg-black/60 blur rounded-full" />
          </div>

          <p className="ml-2 text-white/90 max-w-xl leading-relaxed">
            We’re two friends building a beat creator that turns your genre picks
            into instant instrumentals. Y2K vibe, modern stack, lots of love for
            music and clean UX.
          </p>
        </div>

        {/* Socials sprayed on the wall */}
        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          <a href="https://instagram.com/yourhandle" className="rounded-xl border border-white/20 bg-white/10 p-4 hover:bg-white/20 transition flex items-center gap-3">
            <Instagram className="w-5 h-5" /> Instagram
          </a>
          <a href="https://github.com/yourrepo" className="rounded-xl border border-white/20 bg-white/10 p-4 hover:bg-white/20 transition flex items-center gap-3">
            <Github className="w-5 h-5" /> GitHub
          </a>
          <a href="#" className="rounded-xl border border-white/20 bg-white/10 p-4 hover:bg-white/20 transition flex items-center gap-3">
            <Music2 className="w-5 h-5" /> Sound/Links
          </a>
        </div>
      </div>
    </main>
  );
}
