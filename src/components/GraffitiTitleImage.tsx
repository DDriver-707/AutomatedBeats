import { motion } from "framer-motion";

type Props = {
  src?: string;   // optional PNG path e.g. "/assets/about/title.png"
  text?: string;  // fallback text
  className?: string;
};

export default function GraffitiTitleImage({ src, text = "ABOUT US", className = "" }: Props) {
  return (
    <div className={`relative ${className}`} aria-label={text}>
      {src ? (
        <motion.img
          src={src}
          alt={text}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          className="max-w-full h-auto select-none pointer-events-none drop-shadow-[0_6px_0_rgba(0,0,0,0.55)]"
        />
      ) : (
        <motion.h1
          className="font-graffiti-google neon-title text-6xl md:text-8xl tracking-tight -rotate-2"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {text}
        </motion.h1>
      )}
    </div>
  );
}
