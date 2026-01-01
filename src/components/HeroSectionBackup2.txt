import { useRef } from 'react';

const HeroSection = () => {
  const spaceshipRef = useRef(null);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left: Text Content */}
        <div className="space-y-4 sm:space-y-6 animate-fade-in text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            DSC WINTER OF CODE
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl font-light nebula-text">
            EXPLORE. BUILD. CONTRIBUTE.
          </p>
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-xl mx-auto md:mx-0">
            A 4-week open-source mission where student developers learn, collaborate, 
            and contribute to real projects under expert mentorship.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
            <button className="retro-button bg-gradient-to-r from-cosmic-purple to-nebula-pink hover:from-galaxy-violet hover:to-nebula-pink text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cosmic-purple/50 hover:-translate-y-1 flex items-center justify-center gap-2 cosmic-glow">
              <span>🚀</span>
              JOIN THE MISSION
            </button>
            <button className="retro-button border-2 border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple/20 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cosmic-purple/30">
              <span>🛰️</span>
              BECOME A MENTOR
            </button>
          </div>
        </div>

        {/* Right: 3D Astronaut Coding */}
        <div className="relative flex items-center justify-center mt-8 md:mt-0" style={{ perspective: '2000px' }}>
          <div 
            ref={spaceshipRef}
            className="relative w-full max-w-[280px] sm:max-w-[350px] md:max-w-[450px] aspect-square"
            style={{
              transformStyle: 'preserve-3d',
              filter: 'drop-shadow(0 20px 40px rgba(139, 92, 246, 0.6)) drop-shadow(0 10px 20px rgba(236, 72, 153, 0.4))',
            }}
          >
            {/* Astronaut coding on laptop */}
            <svg viewBox="0 0 400 400" className="w-full h-full" style={{ 
              filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.8))',
            }}>
              <defs>
                <linearGradient id="suitGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f0f9ff"/>
                  <stop offset="30%" stopColor="#e0e7ff"/>
                  <stop offset="70%" stopColor="#c7d2fe"/>
                  <stop offset="100%" stopColor="#a5b4fc"/>
                </linearGradient>
                
                <linearGradient id="suitShadow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#64748b" stopOpacity="0.6"/>
                </linearGradient>
                
                <linearGradient id="visorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa"/>
                  <stop offset="30%" stopColor="#3b82f6"/>
                  <stop offset="70%" stopColor="#2563eb"/>
                  <stop offset="100%" stopColor="#1e40af"/>
                </linearGradient>
                
                <radialGradient id="visorReflection" cx="30%" cy="30%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8"/>
                  <stop offset="50%" stopColor="#e0e7ff" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="transparent"/>
                </radialGradient>
                
                <radialGradient id="glowEffect" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2"/>
                </radialGradient>
                
                <linearGradient id="laptopGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#374151"/>
                  <stop offset="30%" stopColor="#1f2937"/>
                  <stop offset="70%" stopColor="#111827"/>
                  <stop offset="100%" stopColor="#030712"/>
                </linearGradient>
                
                <linearGradient id="laptopSide" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#030712"/>
                  <stop offset="50%" stopColor="#111827"/>
                  <stop offset="100%" stopColor="#1f2937"/>
                </linearGradient>
                
                <radialGradient id="screenGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#67e8f9"/>
                  <stop offset="20%" stopColor="#22d3ee"/>
                  <stop offset="50%" stopColor="#06b6d4"/>
                  <stop offset="100%" stopColor="#0891b2"/>
                </radialGradient>
                
                <linearGradient id="keyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4b5563"/>
                  <stop offset="50%" stopColor="#374151"/>
                  <stop offset="100%" stopColor="#1f2937"/>
                </linearGradient>
                
                <filter id="depth3DFilter">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
                  <feOffset dx="6" dy="10" result="offsetblur"/>
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.6"/>
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                
                <filter id="laptopDepth">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="5"/>
                  <feOffset dx="8" dy="12" result="offsetblur"/>
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.7"/>
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                
                <filter id="innerShadow">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                  <feOffset dx="2" dy="2"/>
                  <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1"/>
                  <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/>
                </filter>
              </defs>

              {/* Floating particles around astronaut */}
              <circle cx="80" cy="100" r="3" fill="#a855f7" opacity="0.6" className="animate-pulse"/>
              <circle cx="320" cy="120" r="2" fill="#ec4899" opacity="0.5" className="animate-pulse" style={{ animationDelay: '0.3s' }}/>
              <circle cx="350" cy="200" r="2.5" fill="#8b5cf6" opacity="0.7" className="animate-pulse" style={{ animationDelay: '0.6s' }}/>
              <circle cx="60" cy="250" r="2" fill="#a855f7" opacity="0.5" className="animate-pulse" style={{ animationDelay: '0.9s' }}/>

              {/* Astronaut body - sitting position */}
              <g filter="url(#depth3DFilter)">
                {/* Torso */}
                <ellipse cx="200" cy="200" rx="50" ry="65" 
                  fill="url(#suitGradient)" 
                  stroke="#cbd5e1" 
                  strokeWidth="3"/>
                
                {/* Torso shadow for depth */}
                <ellipse cx="210" cy="210" rx="45" ry="60" 
                  fill="url(#suitShadow)" 
                  opacity="0.3"/>
                
                {/* Chest control panel */}
                <rect x="170" y="170" width="60" height="20" rx="4"
                  fill="#6366f1" 
                  opacity="0.6"
                  stroke="#4f46e5" 
                  strokeWidth="2"/>
                
                {/* Panel details */}
                <rect x="175" y="174" width="8" height="12" rx="1"
                  fill="#22d3ee" 
                  opacity="0.8"/>
                <rect x="186" y="174" width="8" height="12" rx="1"
                  fill="#06b6d4" 
                  opacity="0.8"/>
                <rect x="197" y="174" width="8" height="12" rx="1"
                  fill="#0891b2" 
                  opacity="0.8"/>
                <rect x="208" y="174" width="18" height="12" rx="2"
                  fill="#ef4444" 
                  opacity="0.7"
                  className="animate-pulse"/>
                
                {/* Chest pockets/modules */}
                <rect x="172" y="195" width="24" height="30" rx="3"
                  fill="#8b5cf6" 
                  opacity="0.5"
                  stroke="#7c3aed" 
                  strokeWidth="2"/>
                <rect x="204" y="195" width="24" height="30" rx="3"
                  fill="#8b5cf6" 
                  opacity="0.5"
                  stroke="#7c3aed" 
                  strokeWidth="2"/>
                
                {/* Pocket details - lines and rivets */}
                <line x1="178" y1="200" x2="190" y2="200" stroke="#a855f7" strokeWidth="1.5" opacity="0.7"/>
                <line x1="178" y1="205" x2="190" y2="205" stroke="#a855f7" strokeWidth="1.5" opacity="0.7"/>
                <line x1="210" y1="200" x2="222" y2="200" stroke="#a855f7" strokeWidth="1.5" opacity="0.7"/>
                <line x1="210" y1="205" x2="222" y2="205" stroke="#a855f7" strokeWidth="1.5" opacity="0.7"/>
                <circle cx="176" cy="198" r="1.5" fill="#cbd5e1"/>
                <circle cx="192" cy="198" r="1.5" fill="#cbd5e1"/>
                <circle cx="208" cy="198" r="1.5" fill="#cbd5e1"/>
                <circle cx="224" cy="198" r="1.5" fill="#cbd5e1"/>
                
                {/* Life support tubes */}
                <path d="M 185,210 Q 180,220 185,235" 
                  fill="none" 
                  stroke="#a855f7" 
                  strokeWidth="3"
                  opacity="0.8"/>
                <path d="M 215,210 Q 220,220 215,235" 
                  fill="none" 
                  stroke="#a855f7" 
                  strokeWidth="3"
                  opacity="0.8"/>
                
                {/* Tube connectors */}
                <circle cx="185" cy="210" r="3" fill="#7c3aed" stroke="#6366f1" strokeWidth="1"/>
                <circle cx="215" cy="210" r="3" fill="#7c3aed" stroke="#6366f1" strokeWidth="1"/>
                <circle cx="185" cy="235" r="3" fill="#7c3aed" stroke="#6366f1" strokeWidth="1"/>
                <circle cx="215" cy="235" r="3" fill="#7c3aed" stroke="#6366f1" strokeWidth="1"/>
                
                {/* NASA/Mission patch */}
                <ellipse cx="165" cy="210" rx="12" ry="15" 
                  fill="#1e40af" 
                  opacity="0.8"
                  stroke="#3b82f6" 
                  strokeWidth="2"/>
                <text x="165" y="214" 
                  fontSize="10" 
                  fill="#60a5fa" 
                  textAnchor="middle"
                  fontWeight="bold"
                  style={{ fontFamily: 'monospace' }}>DSC</text>
                
                {/* Helmet */}
                <ellipse cx="200" cy="130" rx="45" ry="50" 
                  fill="url(#suitGradient)" 
                  stroke="#cbd5e1" 
                  strokeWidth="4"/>
                
                {/* Helmet shadow depth */}
                <ellipse cx="207" cy="135" rx="40" ry="45" 
                  fill="url(#suitShadow)" 
                  opacity="0.2"/>
                
                {/* Helmet glass/visor */}
                <ellipse cx="200" cy="130" rx="38" ry="42" 
                  fill="url(#visorGradient)" 
                  opacity="0.85"/>
                
                {/* Visor reflection highlights */}
                <ellipse cx="185" cy="115" rx="18" ry="22" 
                  fill="url(#visorReflection)"/>
                <ellipse cx="210" cy="125" rx="10" ry="12" 
                  fill="rgba(255, 255, 255, 0.3)"/>
                
                {/* Helmet rim with bolts */}
                <ellipse cx="200" cy="170" rx="46" ry="12" 
                  fill="#94a3b8" 
                  stroke="#64748b" 
                  strokeWidth="3"/>
                {[...Array(8)].map((_, i) => {
                  const angle = (i * Math.PI * 2) / 8;
                  const x = 200 + Math.cos(angle) * 42;
                  const y = 170 + Math.sin(angle) * 10;
                  return <circle key={`bolt-${i}`} cx={x} cy={y} r="2.5" fill="#475569" stroke="#1e293b" strokeWidth="1"/>;
                })}
                
                {/* Helmet antenna */}
                <rect x="197" y="85" width="6" height="20" rx="2"
                  fill="#94a3b8" 
                  stroke="#64748b" 
                  strokeWidth="1.5"/>
                <circle cx="200" cy="82" r="4" fill="#ef4444" className="animate-pulse"/>
                <line x1="200" y1="82" x2="200" y2="77" stroke="#ef4444" strokeWidth="2" opacity="0.6" className="animate-pulse"/>
                
                {/* Left arm with suit joints - positioned to hold laptop */}
                <path d="M 155,190 Q 130,230 120,270" 
                  fill="none" 
                  stroke="url(#suitGradient)" 
                  strokeWidth="22" 
                  strokeLinecap="round"/>
                <path d="M 157,192 Q 132,232 122,272" 
                  fill="none" 
                  stroke="url(#suitShadow)" 
                  strokeWidth="18" 
                  strokeLinecap="round"
                  opacity="0.3"/>
                
                {/* Left elbow joint */}
                <circle cx="137" cy="230" r="10" 
                  fill="#94a3b8" 
                  stroke="#64748b" 
                  strokeWidth="2"/>
                <circle cx="137" cy="230" r="6" 
                  fill="#64748b"/>
                
                {/* Left hand holding laptop side */}
                <ellipse cx="120" cy="275" rx="12" ry="16" 
                  fill="url(#suitGradient)" 
                  stroke="#cbd5e1" 
                  strokeWidth="2.5"
                  transform="rotate(-15 120 275)"/>
                <ellipse cx="120" cy="275" rx="8" ry="12" 
                  fill="#e0e7ff"
                  transform="rotate(-15 120 275)"/>
                
                {/* Right arm with suit joints - positioned to hold laptop */}
                <path d="M 245,190 Q 270,230 280,270" 
                  fill="none" 
                  stroke="url(#suitGradient)" 
                  strokeWidth="22" 
                  strokeLinecap="round"/>
                <path d="M 243,192 Q 268,232 278,272" 
                  fill="none" 
                  stroke="url(#suitShadow)" 
                  strokeWidth="18" 
                  strokeLinecap="round"
                  opacity="0.3"/>
                
                {/* Right elbow joint */}
                <circle cx="263" cy="230" r="10" 
                  fill="#94a3b8" 
                  stroke="#64748b" 
                  strokeWidth="2"/>
                <circle cx="263" cy="230" r="6" 
                  fill="#64748b"/>
                
                {/* Right hand holding laptop side */}
                <ellipse cx="280" cy="275" rx="12" ry="16" 
                  fill="url(#suitGradient)" 
                  stroke="#cbd5e1" 
                  strokeWidth="2.5"
                  transform="rotate(15 280 275)"/>
                <ellipse cx="280" cy="275" rx="8" ry="12" 
                  fill="#e0e7ff"
                  transform="rotate(15 280 275)"/>
                
                {/* Legs with suit segments */}
                <ellipse cx="180" cy="280" rx="22" ry="52" 
                  fill="url(#suitGradient)" 
                  stroke="#cbd5e1" 
                  strokeWidth="2.5"/>
                <ellipse cx="220" cy="280" rx="22" ry="52" 
                  fill="url(#suitGradient)" 
                  stroke="#cbd5e1" 
                  strokeWidth="2.5"/>
                
                {/* Leg shadows */}
                <ellipse cx="185" cy="285" rx="18" ry="48" 
                  fill="url(#suitShadow)" 
                  opacity="0.2"/>
                <ellipse cx="225" cy="285" rx="18" ry="48" 
                  fill="url(#suitShadow)" 
                  opacity="0.2"/>
                
                {/* Knee joints */}
                <ellipse cx="180" cy="290" rx="12" ry="8" 
                  fill="#94a3b8" 
                  stroke="#64748b" 
                  strokeWidth="2"/>
                <ellipse cx="220" cy="290" rx="12" ry="8" 
                  fill="#94a3b8" 
                  stroke="#64748b" 
                  strokeWidth="2"/>
                
                {/* Boots with treads */}
                <ellipse cx="180" cy="325" rx="20" ry="16" 
                  fill="#94a3b8" 
                  stroke="#64748b" 
                  strokeWidth="2.5"/>
                <ellipse cx="220" cy="325" rx="20" ry="16" 
                  fill="#94a3b8" 
                  stroke="#64748b" 
                  strokeWidth="2.5"/>
                
                {/* Boot treads */}
                <ellipse cx="180" cy="328" rx="16" ry="10" 
                  fill="#475569"/>
                <ellipse cx="220" cy="328" rx="16" ry="10" 
                  fill="#475569"/>
                <line x1="170" y1="328" x2="190" y2="328" stroke="#1e293b" strokeWidth="2"/>
                <line x1="210" y1="328" x2="230" y2="328" stroke="#1e293b" strokeWidth="2"/>
              </g>

              {/* Laptop in front of astronaut - Enhanced 3D with astronaut holding it */}
              <g filter="url(#laptopDepth)">
                {/* Laptop base - 3D perspective tilted */}
                <path d="M 125,270 L 275,270 L 280,300 L 120,300 Z" 
                  fill="url(#laptopGradient)" 
                  stroke="#4b5563" 
                  strokeWidth="2.5"/>
                
                {/* Base left side (3D depth) */}
                <path d="M 120,300 L 118,303 L 278,303 L 280,300 Z" 
                  fill="url(#laptopSide)" 
                  opacity="0.8"/>
                
                {/* Base front edge (3D depth) */}
                <path d="M 118,303 L 120,300 L 125,270 L 123,273 Z" 
                  fill="#030712" 
                  opacity="0.9"/>
                
                {/* Trackpad */}
                <rect x="170" y="278" width="60" height="16" rx="3"
                  fill="#1f2937" 
                  stroke="#374151" 
                  strokeWidth="1.5"
                  filter="url(#innerShadow)"/>
                <rect x="173" y="281" width="54" height="10" rx="2"
                  fill="#111827" 
                  opacity="0.8"/>
                
                {/* Keyboard area with detailed keys */}
                <rect x="130" y="273" width="140" height="4" rx="1"
                  fill="#111827" 
                  opacity="0.6"/>
                
                {/* Key rows - more realistic */}
                {[...Array(4)].map((_, row) => (
                  <g key={`row-${row}`}>
                    {[...Array(13)].map((_, col) => (
                      <rect 
                        key={`key-${row}-${col}`} 
                        x={133 + col * 10.5} 
                        y={275 + row * 4} 
                        width="9" 
                        height="3" 
                        rx="0.5"
                        fill="url(#keyGradient)" 
                        stroke="#1f2937" 
                        strokeWidth="0.4"
                        opacity="0.8"/>
                    ))}
                  </g>
                ))}
                
                {/* Special keys with glow */}
                <rect x="133" y="287" width="16" height="3" rx="0.5"
                  fill="#6366f1" 
                  opacity="0.7"
                  className="animate-pulse"
                  style={{ animationDuration: '2s' }}/>
                <rect x="248" y="287" width="16" height="3" rx="0.5"
                  fill="#06b6d4" 
                  opacity="0.7"
                  className="animate-pulse"
                  style={{ animationDuration: '2s', animationDelay: '1s' }}/>
                
                {/* Laptop screen - 3D perspective more prominent */}
                <path d="M 140,270 L 260,270 L 250,160 L 150,160 Z" 
                  fill="url(#laptopGradient)" 
                  stroke="#4b5563" 
                  strokeWidth="3.5"/>
                
                {/* Screen left side (3D depth) */}
                <path d="M 150,160 L 146,164 L 256,164 L 260,160 Z" 
                  fill="#030712" 
                  opacity="0.9"/>
                
                {/* Screen back edge (3D depth) */}
                <path d="M 146,164 L 150,160 L 140,270 L 136,274 Z" 
                  fill="#111827" 
                  opacity="0.7"/>
                
                {/* Screen bezel */}
                <path d="M 143,267 L 257,267 L 248,168 L 152,168 Z" 
                  fill="#1f2937" 
                  stroke="#374151" 
                  strokeWidth="2"/>
                
                {/* Screen display with enhanced glow - brighter and more visible */}
                <path d="M 148,262 L 252,262 L 244,176 L 156,176 Z" 
                  fill="url(#screenGlow)" 
                  opacity="0.98"
                  className="animate-pulse"
                  style={{ animationDuration: '3s' }}/>
                
                {/* Screen inner glow - stronger */}
                <path d="M 151,258 L 249,258 L 242,182 L 159,182 Z" 
                  fill="#67e8f9" 
                  opacity="0.4"
                  className="animate-pulse"
                  style={{ animationDuration: '2s' }}/>
                
                {/* VS Code window header bar */}
                <path d="M 156,185 L 244,185 L 243,177 L 157,177 Z" 
                  fill="#1e293b" 
                  opacity="0.95"/>
                
                {/* VS Code control buttons */}
                <circle cx="161" cy="181" r="2" fill="#ef4444" opacity="0.9"/>
                <circle cx="169" cy="181" r="2" fill="#facc15" opacity="0.9"/>
                <circle cx="177" cy="181" r="2" fill="#22c55e" opacity="0.9"/>
                
                {/* VS Code title and file tabs */}
                <rect x="185" y="178" width="35" height="5" rx="1"
                  fill="#0c4a6e" 
                  opacity="0.8"/>
                <text x="202" y="182" 
                  fontSize="3.5" 
                  fill="#67e8f9" 
                  textAnchor="middle"
                  fontWeight="bold"
                  style={{ fontFamily: 'monospace' }}>
                  mission.jsx
                </text>
                
                {/* Line numbers sidebar */}
                <rect x="157" y="188" width="8" height="70" 
                  fill="#0c4a6e" 
                  opacity="0.5"/>
                
                {/* Line numbers */}
                <g style={{ fontFamily: 'monospace', fontSize: '4px', fill: '#64748b' }}>
                  <text x="159" y="194">1</text>
                  <text x="159" y="200">2</text>
                  <text x="159" y="206">3</text>
                  <text x="159" y="212">4</text>
                  <text x="159" y="218">5</text>
                  <text x="159" y="224">6</text>
                  <text x="159" y="230">7</text>
                  <text x="159" y="236">8</text>
                  <text x="159" y="242">9</text>
                  <text x="159" y="248">10</text>
                  <text x="159" y="254">11</text>
                </g>
                
                {/* Enhanced code with proper syntax highlighting and realistic formatting */}
                <g style={{ fontFamily: 'monospace' }}>
                  {/* Line 1 - import React */}
                  <text x="168" y="194" fontSize="4.5" fill="#c084fc" fontWeight="500">import</text>
                  <text x="192" y="194" fontSize="4.5" fill="#e0e7ff">React</text>
                  <text x="210" y="194" fontSize="4.5" fill="#c084fc" fontWeight="500">from</text>
                  <text x="228" y="194" fontSize="4.5" fill="#fbbf24">'react'</text>
                  
                  {/* Line 2 - import gsap */}
                  <text x="168" y="200" fontSize="4.5" fill="#c084fc" fontWeight="500">import</text>
                  <text x="192" y="200" fontSize="4.5" fill="#e0e7ff">gsap</text>
                  <text x="210" y="200" fontSize="4.5" fill="#c084fc" fontWeight="500">from</text>
                  <text x="228" y="200" fontSize="4.5" fill="#fbbf24">'gsap'</text>
                  
                  {/* Line 3 - blank */}
                  
                  {/* Line 4 - function declaration */}
                  <text x="168" y="212" fontSize="4.5" fill="#c084fc" fontWeight="500">const</text>
                  <text x="192" y="212" fontSize="4.5" fill="#60a5fa" fontWeight="bold">DSCWinterOfCode</text>
                  <text x="237" y="212" fontSize="4.5" fill="#64748b">=</text>
                  <text x="241" y="212" fontSize="4.5" fill="#22d3ee">()</text>
                  <text x="246" y="212" fontSize="4.5" fill="#fbbf24">=&gt;</text>
                  <text x="254" y="212" fontSize="4.5" fill="#fbbf24">{'{'}</text>
                  
                  {/* Line 5 - const mission */}
                  <text x="171" y="218" fontSize="4.5" fill="#c084fc" fontWeight="500">const</text>
                  <text x="195" y="218" fontSize="4.5" fill="#e0e7ff">mission</text>
                  <text x="221" y="218" fontSize="4.5" fill="#64748b">=</text>
                  <text x="228" y="218" fontSize="4.5" fill="#22d3ee">{'{'}</text>
                  
                  {/* Line 6 - name property */}
                  <text x="177" y="224" fontSize="4.5" fill="#e0e7ff">name:</text>
                  <text x="199" y="224" fontSize="4.5" fill="#4ade80">'Open Source'</text>
                  <text x="236" y="224" fontSize="4.5" fill="#64748b">,</text>
                  
                  {/* Line 7 - status property */}
                  <text x="177" y="230" fontSize="4.5" fill="#e0e7ff">status:</text>
                  <text x="204" y="230" fontSize="4.5" fill="#4ade80">'Active'</text>
                  <text x="228" y="230" fontSize="4.5" fill="#64748b">,</text>
                  
                  {/* Line 8 - contributors property */}
                  <text x="177" y="236" fontSize="4.5" fill="#e0e7ff">contributors:</text>
                  <text x="222" y="236" fontSize="4.5" fill="#a78bfa">1000</text>
                  <text x="237" y="236" fontSize="4.5" fill="#64748b">+</text>
                  
                  {/* Line 9 - closing brace */}
                  <text x="171" y="242" fontSize="4.5" fill="#22d3ee">{'}'}</text>
                  
                  {/* Line 10 - return statement */}
                  <text x="171" y="248" fontSize="4.5" fill="#f472b6" fontWeight="500">return</text>
                  <text x="197" y="248" fontSize="4.5" fill="#22d3ee">&lt;</text>
                  <text x="201" y="248" fontSize="4.5" fill="#60a5fa">Mission</text>
                  <text x="227" y="248" fontSize="4.5" fill="#e0e7ff">data</text>
                  <text x="240" y="248" fontSize="4.5" fill="#64748b">=</text>
                  <text x="244" y="248" fontSize="4.5" fill="#22d3ee">{'{'}</text>
                  <text x="247" y="248" fontSize="4.5" fill="#e0e7ff">mission</text>
                  <text x="257" y="248" fontSize="4.5" fill="#22d3ee">{'}'}</text>
                  <text x="260" y="248" fontSize="4.5" fill="#22d3ee">/&gt;</text>
                  
                  {/* Line 11 - closing brace */}
                  <text x="168" y="254" fontSize="4.5" fill="#fbbf24">{'}'}</text>
                </g>
                
                {/* Cursor blinking at end of line */}
                <rect x="172" y="251" width="1.5" height="5" 
                  fill="#22d3ee" 
                  className="animate-pulse"
                  style={{ animationDuration: '1s' }}/>
                
                {/* Status bar at bottom */}
                <rect x="156" y="256" width="88" height="4" 
                  fill="#1e293b" 
                  opacity="0.95"/>
                <text x="159" y="259" fontSize="3" fill="#22d3ee" style={{ fontFamily: 'monospace' }}>
                  JSX
                </text>
                <text x="230" y="259" fontSize="3" fill="#4ade80" style={{ fontFamily: 'monospace' }}>
                  ✓ Saved
                </text>
                
                {/* Screen glow reflection on environment - stronger */}
                <ellipse cx="200" cy="220" rx="70" ry="55" 
                  fill="#06b6d4" 
                  opacity="0.12"
                  style={{ mixBlendMode: 'screen' }}/>
                
                {/* Screen glow reflection on helmet - stronger */}
                <ellipse cx="200" cy="130" rx="35" ry="32" 
                  fill="#0891b2" 
                  opacity="0.25"/>
                
                {/* Strong screen edge lighting */}
                <path d="M 148,262 L 156,176" 
                  stroke="#67e8f9" 
                  strokeWidth="1.5" 
                  opacity="0.6"/>
                <path d="M 252,262 L 244,176" 
                  stroke="#67e8f9" 
                  strokeWidth="1.5" 
                  opacity="0.6"/>
                
                {/* Laptop hinge detail */}
                <ellipse cx="200" cy="270" rx="45" ry="4" 
                  fill="#374151" 
                  stroke="#4b5563" 
                  strokeWidth="1.5"/>
                <circle cx="178" cy="270" r="2.5" fill="#64748b"/>
                <circle cx="222" cy="270" r="2.5" fill="#64748b"/>
                
                {/* Apple/Brand logo on laptop lid */}
                <circle cx="200" cy="268" r="3" 
                  fill="#e0e7ff" 
                  opacity="0.3"/>
              </g>

              {/* Backpack/life support - Enhanced - Moved behind laptop */}
              <g opacity="0" style={{ display: 'none' }}>
                {/* Main backpack unit - Hidden to avoid overlap */}
                <rect x="182" y="200" width="36" height="50" rx="4"
                  fill="#94a3b8" 
                  stroke="#64748b" 
                  strokeWidth="2.5"
                  transform="rotate(-8 200 225)"/>
                
                {/* Backpack depth shadow */}
                <rect x="186" y="204" width="32" height="46" rx="3"
                  fill="#475569" 
                  opacity="0.6"
                  transform="rotate(-8 200 225)"/>
                
                {/* Backpack panels */}
                <rect x="185" y="205" width="30" height="18" rx="2"
                  fill="#64748b" 
                  stroke="#475569" 
                  strokeWidth="1.5"
                  transform="rotate(-8 200 214)"/>
                <rect x="185" y="227" width="30" height="18" rx="2"
                  fill="#64748b" 
                  stroke="#475569" 
                  strokeWidth="1.5"
                  transform="rotate(-8 200 236)"/>
                
                {/* Status indicator panel */}
                <rect x="188" y="208" width="24" height="10" rx="1"
                  fill="#1e293b" 
                  opacity="0.8"
                  transform="rotate(-8 200 213)"/>
                
                {/* LED indicators with labels */}
                <circle cx="193" cy="213" r="2.5" 
                  fill="#ef4444" 
                  className="animate-pulse"
                  transform="rotate(-8 200 213)"/>
                <text x="198" y="214" 
                  fontSize="3" 
                  fill="#e0e7ff" 
                  style={{ fontFamily: 'monospace' }}
                  transform="rotate(-8 200 213)">O₂</text>
                
                <circle cx="207" cy="213" r="2.5" 
                  fill="#22c55e" 
                  className="animate-pulse" 
                  style={{ animationDelay: '0.5s' }}
                  transform="rotate(-8 200 213)"/>
                <text x="212" y="214" 
                  fontSize="3" 
                  fill="#e0e7ff" 
                  style={{ fontFamily: 'monospace' }}
                  transform="rotate(-8 200 213)">PWR</text>
                
                {/* Temperature gauge */}
                <rect x="190" y="230" width="20" height="4" rx="1"
                  fill="#1e293b"
                  transform="rotate(-8 200 232)"/>
                <rect x="191" y="231" width="14" height="2" rx="0.5"
                  fill="#06b6d4"
                  className="animate-pulse"
                  style={{ animationDuration: '2s' }}
                  transform="rotate(-8 200 232)"/>
                
                {/* Oxygen tank tubes */}
                <rect x="186" y="215" width="4" height="25" rx="2"
                  fill="#cbd5e1" 
                  stroke="#94a3b8" 
                  strokeWidth="1"
                  transform="rotate(-8 200 227)"/>
                <rect x="210" y="215" width="4" height="25" rx="2"
                  fill="#cbd5e1" 
                  stroke="#94a3b8" 
                  strokeWidth="1"
                  transform="rotate(-8 200 227)"/>
                
                {/* Connection ports */}
                <circle cx="188" cy="243" r="3" 
                  fill="#475569" 
                  stroke="#1e293b" 
                  strokeWidth="1.5"/>
                <circle cx="212" cy="243" r="3" 
                  fill="#475569" 
                  stroke="#1e293b" 
                  strokeWidth="1.5"/>
                
                {/* Straps */}
                <rect x="175" y="205" width="6" height="40" rx="3"
                  fill="#64748b" 
                  opacity="0.7"
                  transform="rotate(-8 178 225)"/>
                <rect x="219" y="205" width="6" height="40" rx="3"
                  fill="#64748b" 
                  opacity="0.7"
                  transform="rotate(-8 222 225)"/>
              </g>

              {/* Cosmic glow around astronaut */}
              <ellipse cx="200" cy="240" rx="150" ry="120" 
                fill="url(#glowEffect)" 
                opacity="0.3"/>
            </svg>

            {/* Enhanced warp trail effect */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-3 bg-gradient-to-r from-transparent via-nebula-pink/60 to-transparent blur-md animate-pulse"></div>
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-1 bg-gradient-to-r from-transparent via-cosmic-purple/80 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
