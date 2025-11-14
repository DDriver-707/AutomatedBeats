# Automated Beats

Automated Beats is a modern web app for creating automated, genre-specific drum patterns and melodies right in the browser. It combines real-time audio, a FL Studio–style pattern editor, and one-click MP3 export so you can go from idea to downloadable beat in minutes.

---

## About Us

We’re two students who wanted to challenge ourselves, show our skills, and build something around the thing we love most — music. **Automated Beats** is our way of mixing creativity with code, turning passion into a project we’re proud to share.

---

## Features

### 🎵 Beat Creation Engine

- **Genre-Aware Patterns** – Pre-built patterns for multiple genres with genre-specific BPM and feel.  
- **16-Step Drum Machine** – Classic step sequencer for kick, snare, hats, open hat, bass, and melody.  
- **Customizable Patterns** – Toggle individual steps per instrument in a FL Studio–style grid.  

### 🎚 Sound & Samples

- **Multi-Sample Support** – Each instrument can cycle through multiple samples per genre.  
- **Randomize Samples & Patterns** – One-click randomization per instrument or for the whole kit.  
- **Track Volumes** – Per-track volume sliders so you can balance your mix.  

### 💿 Export

- **Offline Rendering** – Renders your beat using an `OfflineAudioContext` so export matches what you hear.  
- **MP3 Download** – One-click export to MP3 using a client-side encoder (no backend required).  

### 🎨 UI & Experience

- **Y2K-Inspired Design** – Neon gradients, glowing controls, and a dark production-style theme.  
- **Responsive Layout** – Works on laptops, desktops, and modern mobile browsers.  
- **Smooth Animations** – Framer Motion driving page and control transitions.  
- **Visual Feedback** – Current step highlighting and simple audio visualization while playing.

---

## Tech Stack

- **React + TypeScript** (Vite)
- **Web Audio API** for real-time and offline audio rendering
- **Tailwind CSS** (CDN) for styling
- **Framer Motion** for animations
- **@breezystack/lamejs** for client-side MP3 encoding

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning and personal projects.