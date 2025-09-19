# Automated Beats

A modern web application for automated beat generation with genre-specific patterns and real-time audio synthesis.

## Features

### 🎵 Beat Generation Engine
- **Web Audio API Integration**: Real-time audio synthesis with oscillators, filters, and effects
- **Genre-Specific Patterns**: Pre-configured beat patterns for 6 different genres
- **Customizable Audio**: Volume control, BPM adjustment, and audio effects

### 🎼 Supported Genres
- **Hip Hop/Rap**: Classic boom-bap patterns with melodic elements
- **Emo Rap**: Fast-paced beats with continuous hi-hats and emotional melodies
- **Country**: Simple, steady rhythms perfect for country music
- **EDM**: Four-on-the-floor kicks with rising melodies and heavy effects
- **Rock**: Traditional rock patterns with steady hi-hats
- **Trap**: Complex kick patterns with rapid hi-hat rolls

### 🎛️ Interactive Features
- **Real-time Visualization**: Live pattern visualization showing kick, snare, hi-hat, melody, and bass
- **Audio Visualizer**: Dynamic audio level visualization
- **Random Beat Generator**: Mix and match patterns for unique beats
- **Playback Controls**: Play, pause, stop, and volume adjustment

### 🎨 Modern UI
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: Framer Motion powered transitions
- **Dark Theme**: Professional music production aesthetic
- **Visual Feedback**: Real-time step highlighting and audio visualization

## Technical Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Framer Motion** for animations
- **Web Audio API** for real-time audio synthesis
- **Tailwind CSS** for styling
- **React Router** for navigation

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to `http://localhost:5173` and click "Create a Beat"

## Usage

1. **Select a Genre**: Choose from Hip Hop, Emo Rap, Country, EDM, Rock, or Trap
2. **Play the Beat**: Click the play button to start automated beat generation
3. **Adjust Volume**: Use the volume slider to control audio levels
4. **Try Random Mode**: Click the shuffle button for randomized beat patterns
5. **Visualize Patterns**: Watch the real-time pattern visualization and audio levels

## Audio Features

### Beat Engine
- **16-Step Patterns**: Standard drum machine style patterns
- **Multiple Instruments**: Kick, snare, hi-hat, open hat, melody, and bass
- **Genre-Specific BPM**: Each genre has its characteristic tempo
- **Audio Effects**: Reverb, delay, and distortion for each genre

### Sound Synthesis
- **Oscillators**: Sine, triangle, sawtooth, and noise generators
- **Filters**: High-pass filters for hi-hats and noise shaping
- **Envelopes**: ADSR envelopes for natural sound shaping
- **Effects Chain**: Reverb, delay, and distortion processing

## Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

**Note**: Audio requires user interaction to start (browser security requirement).

## Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── AudioVisualizer.tsx
│   └── PatternVisualizer.tsx
├── engine/             # Audio processing engine
│   ├── BeatEngine.ts   # Core beat generation
│   └── GenreConfigs.ts # Genre-specific patterns
├── routes/             # Page components
│   ├── Create.tsx      # Main beat creation interface
│   ├── Home.tsx        # Landing page
│   ├── About.tsx       # About page
│   └── HowTo.tsx       # Instructions
└── App.tsx             # Main application
```

### Key Components

- **BeatEngine**: Web Audio API wrapper for real-time audio synthesis
- **GenreConfigs**: Pre-defined beat patterns and audio settings
- **PatternVisualizer**: Real-time pattern display with step highlighting
- **AudioVisualizer**: Dynamic audio level visualization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning and personal projects.