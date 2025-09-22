// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html","./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      // if you want a named token too:
      borderRadius: {
        '22': '22px',
      },
    },
  },
  plugins: [
    // keep plugins if you added any; the little utility I suggested is optional
  ],
};

export default config;
