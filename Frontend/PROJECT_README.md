# 🌌 DSC Winter of Code - Landing Page

A stunning, astronomy-themed landing page for DSC Winter of Code, built with React, Vite, and Tailwind CSS. This website represents a serious, calm, space-inspired control center for learning and open source.

## ✨ Features

### Design Elements
- **Starfield Background** - Animated canvas with parallax stars that drift across the viewport
- **Mission Control Navbar** - Transparent navbar with blur effect on scroll
- **Orbital Hero Section** - Rotating celestial sphere with orbit lines and glowing nodes
- **Glass Morphism Cards** - Frosted glass effect with subtle borders
- **Smooth Animations** - Fade-ins, hover effects, and orbital rotations
- **Responsive Design** - Works beautifully on all screen sizes

### Sections
1. **Hero** - Mission launch with CTAs
2. **About** - What is this mission? (4 feature blocks)
3. **Orbit Paths** - Two tracks with orbital visualization
4. **Timeline** - 5 mission phases with beacon-style nodes
5. **Benefits** - Crew benefits with glass effect cards
6. **CTA** - Final call-to-action
7. **Footer** - Mission log with links

## 🚀 Tech Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Canvas API** - For starfield animation

## 🎨 Color System

- **Primary Background**: `#0B0F1A` (Deep Space Black)
- **Secondary Background**: `#0E1629` (Midnight Blue)
- **Primary Accent**: `#4CC9F0` (Stellar Cyan)
- **Secondary Accent**: `#72E0FF` (Nebula Blue)
- **Tertiary Accent**: `#7A5CFF` (Cosmic Purple)

## 📦 Installation

```bash
# Navigate to project directory
cd DSCWoC

# Install dependencies (already done)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Development

The development server is running at: **http://localhost:5173/**

### Project Structure

```
DSCWoC/
├── src/
│   ├── components/
│   │   ├── Starfield.jsx       # Animated starfield background
│   │   ├── Navbar.jsx          # Mission control navbar
│   │   ├── HeroSection.jsx     # Hero with orbital visual
│   │   ├── AboutSection.jsx    # What is this mission?
│   │   ├── TracksSection.jsx   # Orbit paths (tracks)
│   │   ├── TimelineSection.jsx # Mission phases timeline
│   │   ├── BenefitsSection.jsx # Crew benefits
│   │   ├── CTASection.jsx      # Final CTA
│   │   └── Footer.jsx          # Mission log footer
│   ├── App.jsx                 # Main app component
│   ├── index.css               # Global styles + Tailwind
│   └── main.jsx                # Entry point
├── index.html                  # HTML template
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── vite.config.js              # Vite configuration
└── package.json                # Dependencies
```

## 🎯 Design Philosophy

This website follows a strict design philosophy:

- **Calm & Professional** - Not a flashy startup site, but a serious mission control center
- **Space-Inspired** - Deep space visuals with subtle motion
- **Minimal Animation** - Slow, purposeful animations only
- **Depth Through Layers** - Created via opacity, blur, and scale (not heavy shadows)
- **Clean Typography** - Modern, readable fonts without decoration

## 🎬 Animation Guidelines

All animations follow these rules:
- ✅ Slow parallax
- ✅ Orbital motion
- ✅ Fade + slide
- ✅ Soft glow
- ❌ No bounce
- ❌ No neon effects
- ❌ No heavy shadows

## 🛠️ Customization

### Modify Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  'space-black': '#0B0F1A',
  'midnight-blue': '#0E1629',
  'stellar-cyan': '#4CC9F0',
  'nebula-blue': '#72E0FF',
  'cosmic-purple': '#7A5CFF',
}
```

### Adjust Animations
Edit keyframes in `tailwind.config.js`:
```javascript
keyframes: {
  float: { /* ... */ },
  orbit: { /* ... */ },
  glow: { /* ... */ },
}
```

### Modify Content
All section content can be edited directly in their respective component files under `src/components/`.

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

Built for DSC Community. All rights reserved.

## 🤝 Contributing

This is a custom landing page for DSC Winter of Code. For improvements or bug fixes, please reach out to the DSC team.

---

**Built with 💙 for open source**
