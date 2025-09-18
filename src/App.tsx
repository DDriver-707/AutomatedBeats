import { NavLink, Outlet } from "react-router-dom";
import { Music2 } from "lucide-react";

export default function App() {
  const linkBase = "px-3 py-2 rounded-lg text-sm font-medium transition";
  const linkActive = "bg-white/10 text-white shadow-glow";
  const linkIdle = "text-white/80 hover:text-white hover:bg-white/10";

  return (
    <div className="min-h-screen">
      {/* Top nav */}
      <header className="sticky top-0 z-50 backdrop-blur bg-neutral-900/60 border-b border-white/10">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Music2 className="w-6 h-6" />
            <span className="text-lg font-semibold">Automated Beats</span>
          </div>
          <div className="flex items-center gap-2">
            <NavLink to="/" end className={({isActive}) => `${linkBase} ${isActive?linkActive:linkIdle}`}>Home</NavLink>
            <NavLink to="/about" className={({isActive}) => `${linkBase} ${isActive?linkActive:linkIdle}`}>About</NavLink>
            <NavLink to="/how-to" className={({isActive}) => `${linkBase} ${isActive?linkActive:linkIdle}`}>How&nbsp;to&nbsp;Use</NavLink>
          </div>
        </nav>
      </header>

      {/* Routed page outlet */}
      <Outlet />
    </div>
  );
}
