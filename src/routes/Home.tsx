export default function Home() {
  return (
    <main className="relative min-h-[calc(100vh-56px)]">
      {/* Wood wall */}
      <section className="bg-wood relative">
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Spotlights */}
          <div className="spotlight -top-8 left-10" />
          <div className="spotlight -top-10 left-1/2 -translate-x-1/2" />
          <div className="spotlight -top-8 right-10" />

          {/* Wall gallery */}
          <div className="grid grid-cols-3 gap-10 pt-24">
            <div className="flex flex-col items-center gap-3">
              <div className="record" />
              <p className="text-white/80 text-sm">Classic Vinyl</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="album" />
              <p className="text-white/80 text-sm">Album Cover</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="album" />
              <p className="text-white/80 text-sm">Mixtape</p>
            </div>
          </div>

          {/* Title & CTAs */}
          <h1 className="mt-16 text-4xl md:text-5xl font-bold drop-shadow">
            Welcome to the Lobby
          </h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Choose your path: create a beat, learn how it works, or meet the team.
          </p>
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <a href="#" className="rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">
              <h3 className="text-lg font-semibold">Create Beat</h3>
              <p className="text-white/70 text-sm">Start with a genre and let the site generate.</p>
            </a>
            <a href="/how-to" className="rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">
              <h3 className="text-lg font-semibold">How to Use & Features</h3>
              <p className="text-white/70 text-sm">Step-by-step guide with feature highlights.</p>
            </a>
            <a href="/about" className="rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">
              <h3 className="text-lg font-semibold">About Us</h3>
              <p className="text-white/70 text-sm">Who we are and where to find us.</p>
            </a>
          </div>
        </div>
      </section>

      {/* Floor with furniture */}
      <section className="relative bg-neutral-900 border-t border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 py-10 flex items-end gap-8">
          <div className="couch" />
          <div className="piano" />
        </div>
      </section>
    </main>
  );
}
