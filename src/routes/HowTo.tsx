import React from "react";

const HowTo: React.FC = () => {
  const instructions = [
    { symbol: "♪", title: "Getting Started", content: "Click anywhere to begin exploring the website. Everything is designed to be intuitive and easy to use." },
    { symbol: "♫", title: "Navigation", content: "Use the menu buttons to move between different sections. Each page loads quickly and smoothly." },
    { symbol: "♬", title: "Creating Content", content: "Hit the 'New' button to start creating. The software guides you through each step of the process." },
    { symbol: "♭", title: "Customization", content: "Adjust your preferences in the Settings menu. Choose themes and layouts that work best for you." },
    { symbol: "♯", title: "Sharing", content: "Share your work with others using the 'Send' or 'Export' options. Multiple formats are supported." },
    { symbol: "𝄞", title: "Advanced Tools", content: "Access additional features through the Tools menu. These include filters, templates, and automation options." },
    { symbol: "♩", title: "Help & Support", content: "If you need assistance, check the Help section or use the contact form to reach our support team." },
    { symbol: "♪", title: "Tips & Tricks", content: "Use keyboard shortcuts for faster workflow. Hold Ctrl while clicking to open items in new windows." },
  ];

  return (
    <main className="route-howto-paper relative min-h-screen w-full overflow-hidden">
      {/* full-page lined-paper background (route-scoped styles handle this) */}
      <div className="howto-paper-bg fixed inset-0 -z-10 pointer-events-none" />

      {/* BURNED TOP-RIGHT CORNER */}
      <div className="burn-wrap-ht fixed top-0 right-0 w-[240px] h-[240px] pointer-events-none">
        {/* edge cutout (mask) is applied on the wrapper via CSS */}
        <div className="ember-glow-ht absolute bottom-6 left-6 w-44 h-44" />
        <div className="char-ring-ht absolute bottom-7 left-7 w-40 h-40" />
        {/* “flame tongues” */}
        <div className="flame-stack-ht absolute top-0 right-0 w-full h-full">
          <i className="tongue t1" />
          <i className="tongue t2" />
          <i className="tongue t3" />
          <i className="tongue t4" />
        </div>
        {/* drifting smoke plumes */}
        <div className="smoke-ht s1 absolute -top-6 right-10 w-24 h-28" />
        <div className="smoke-ht s2 absolute -top-2 right-4 w-28 h-32" />
      </div>

      {/* PAGE CONTENT */}
      <div className="min-h-screen w-full text-black py-12 px-6 sm:px-10 md:px-12 relative">
        {/* three-hole punches */}
        <div className="absolute left-5 top-20 w-4 h-4 bg-gray-100 rounded-full border border-gray-300 shadow-inner" />
        <div className="absolute left-5 top-1/2 -mt-2 w-4 h-4 bg-gray-100 rounded-full border border-gray-300 shadow-inner" />
        <div className="absolute left-5 bottom-20 w-4 h-4 bg-gray-100 rounded-full border border-gray-300 shadow-inner" />

        {/* NOTE: the paper ruling + red margin is provided by the container below via inline bg-image (so it prints nice) */}
        <div
          className="relative mx-auto max-w-4xl rounded-2xl shadow-2xl border border-neutral-300/70 bg-white/90 backdrop-blur-[1px] pt-8 pb-12 px-6 sm:px-10"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                transparent, transparent 31px, rgba(209,213,219,.9) 31px, rgba(209,213,219,.9) 33px
              ),
              linear-gradient(
                90deg, transparent 0, transparent 40px, #ef4444 40px, #ef4444 42px, transparent 42px
              )
            `,
            backgroundSize: "100% 33px, 100% 100%",
          }}
        >
          {/* page header */}
          <div className="text-right text-blue-700 font-semibold mb-8 text-sm">
            How-To Guide
          </div>
          <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800 tracking-tight">
            Website & Software Instructions
          </h1>

          {/* instructions list */}
          <div className="space-y-8">
            {instructions.map((instruction, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="text-2xl text-blue-600 font-bold pt-1 select-none leading-none">
                  {instruction.symbol}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    {instruction.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-base">
                    {instruction.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* small bottom note */}
          <div className="mt-10 text-center text-xs text-gray-500">
            Tip: Press <span className="px-1 py-0.5 rounded border border-gray-300 bg-white">Ctrl</span> while clicking to open items in a new window.
          </div>
        </div>
      </div>
    </main>
  );
};

export default HowTo;
