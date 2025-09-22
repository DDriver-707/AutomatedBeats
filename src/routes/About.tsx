import { Github, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import GraffitiTitleImage from "../components/GraffitiTitleImage";
import { useState } from "react";

// files under public/ are referenced by absolute path:
const leftPng = "/assets/about/character-left.png";
const rightPng = "/assets/about/character-right.png";
const titlePng = "/assets/about/title.png"; // set to undefined if you don't have it

export default function About() {
  const [titleOk, setTitleOk] = useState(true);

  return (
    <main className="relative bg-brick-y2k min-h-[calc(100vh-56px)] overflow-hidden">
      {/* Left character PNG */}
      <motion.img
        src={leftPng}
        alt="Cartoon character — left"
        initial={{ y: 0, rotate: 0 }}
        animate={{ y: [-2, -8, -2], rotate: [0, -1.5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: [0.22, 0.61, 0.36, 1] }}
        className="hidden md:block absolute -left-6 bottom-0 z-10 w-[32vw] max-w-[360px] select-none pointer-events-none"
      />

      {/* Right character PNG */}
      <motion.img
        src={rightPng}
        alt="Cartoon character — right"
        initial={{ y: 0, rotate: 0 }}
        animate={{ y: [-2, -8, -2], rotate: [0, 1.25, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: [0.22, 0.61, 0.36, 1] }}
        className="hidden md:block absolute -right-6 bottom-0 z-10 w-[32vw] max-w-[360px] select-none pointer-events-none"
      />

      {/* Decorative wall tags + doodles (fixed with clip-path) */}
      <div className="wall-art hidden md:block">
        <span className="wall-tag tag-1">808</span>
        <span className="wall-tag tag-2">BEATS</span>
        <span className="wall-tag tag-3">Hip-Hop</span>

        {/* extra doodles */}
        <i className="wall-doodle crown d1" aria-hidden />
        <i className="wall-doodle bolt d2" aria-hidden />
        <i className="wall-doodle star d3" aria-hidden />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">
        {/* Title centered between characters */}
        <div className="flex justify-center">
          {titlePng && titleOk ? (
            <motion.img
              src={titlePng}
              alt="ABOUT US"
              onError={() => setTitleOk(false)}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
              className="w-full max-w-5xl h-auto select-none pointer-events-none drop-shadow-[0_6px_0_rgba(0,0,0,0.55)]"
            />
          ) : (
            <GraffitiTitleImage text="ABOUT US" className="w-full max-w-5xl" />
          )}
        </div>

        {/* Bigger paragraph with graffiti-body look */}
        <p className="mt-8 text-center md:max-w-3xl mx-auto graffiti-body text-xl md:text-2xl leading-relaxed">
          We’re two students who wanted to challenge ourselves, show our skills, and
          build something around the thing we love most — music. Automated Beats is our
          way of mixing creativity with code, turning passion into a project we’re proud
          to share.
        </p>

        {/* Socials heading (bigger) */}
        <h2 className="mt-10 mb-4 text-center graffiti-body text-base md:text-lg tracking-widest uppercase opacity-80">
          Socials
        </h2>

        {/* Socials + arrows wrapper */}
        <div className="relative">
          {/* Curved arrows pointing to each character (desktop only) */}
          <svg
  className="hidden md:block absolute left-[8%] top-[-8px] w-[22vw] max-w-[320px] h-[120px] pointer-events-none z-10"
  viewBox="0 0 320 120"
  aria-hidden
>
  <defs>
    <linearGradient id="arrowLeftGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#22d3ee" />
      <stop offset="60%" stopColor="#38bdf8" />
      <stop offset="100%" stopColor="#0ea5e9" />
    </linearGradient>

    {/* soft glow */}
    <filter id="arrowGlowL" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="g" />
      <feMerge>
        <feMergeNode in="g" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    {/* triangle marker for the tip */}
    <marker
      id="arrowHeadL"
      markerWidth="16"
      markerHeight="16"
      refX="8"
      refY="8"
      orient="auto"
      markerUnits="userSpaceOnUse"
    >
      <path d="M0,0 L16,8 L0,16 Z" fill="url(#arrowLeftGrad)" />
    </marker>
  </defs>

  <path
    d="M300,12 C220,20 150,60 90,86"
    stroke="url(#arrowLeftGrad)"
    strokeWidth="10"
    fill="none"
    strokeLinecap="round"
    filter="url(#arrowGlowL)"
    markerEnd="url(#arrowHeadL)"
  />
</svg>


          <svg
  className="hidden md:block absolute right-[8%] top-[-8px] w-[22vw] max-w-[320px] h-[120px] pointer-events-none z-10"
  viewBox="0 0 320 120"
  aria-hidden
>
  <defs>
    <linearGradient id="arrowRightGrad" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#fbbf24" />
      <stop offset="50%" stopColor="#ef4444" />
      <stop offset="100%" stopColor="#ec4899" />
    </linearGradient>

    <filter id="arrowGlowR" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="g" />
      <feMerge>
        <feMergeNode in="g" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <marker
      id="arrowHeadR"
      markerWidth="16"
      markerHeight="16"
      refX="8"
      refY="8"
      orient="auto"
      markerUnits="userSpaceOnUse"
    >
      <path d="M0,0 L16,8 L0,16 Z" fill="url(#arrowRightGrad)" />
    </marker>
  </defs>

  <path
    d="M20,12 C100,20 170,60 230,86"
    stroke="url(#arrowRightGrad)"
    strokeWidth="10"
    fill="none"
    strokeLinecap="round"
    filter="url(#arrowGlowR)"
    markerEnd="url(#arrowHeadR)"
  />
</svg>


          {/* Socials in two columns (left = you, right = friend) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEFT COLUMN — YOU */}
            <div className="flex flex-col gap-5 items-stretch md:max-w-md md:ml-auto">
              <a
                href="https://www.linkedin.com/in/armando-tamayo-518519335/"
                className="spray-card graffiti-chip social-lg"
                target="_blank"
                rel="noreferrer"
                aria-label="Your LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
                LinkedIn
              </a>
              <a
                href="https://github.com/MandoBug"
                className="spray-card graffiti-chip social-lg"
                target="_blank"
                rel="noreferrer"
                aria-label="Your GitHub"
              >
                <Github className="w-6 h-6" />
                GitHub
              </a>
            </div>

            {/* RIGHT COLUMN — FRIEND */}
            <div className="flex flex-col gap-5 items-stretch md:max-w-md md:mr-auto">
              <a
                href="https://www.linkedin.com/in/desmond-driver-09b6b829b/"
                className="spray-card graffiti-chip social-lg"
                target="_blank"
                rel="noreferrer"
                aria-label="Friend LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
                LinkedIn
              </a>
              <a
                href="https://github.com/DDriver-707"
                className="spray-card graffiti-chip social-lg"
                target="_blank"
                rel="noreferrer"
                aria-label="Friend GitHub"
              >
                <Github className="w-6 h-6" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Top sheen + floor vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/40" />
    </main>
  );
}
