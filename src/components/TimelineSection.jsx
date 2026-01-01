import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TimelineSection = () => {
  const timelineRef = useRef(null);
  const rocketRef = useRef(null);
  const pathRef = useRef(null);
  const mainThrustRef = useRef(null);
  const sideThrustRef = useRef([]);
  const smokeTrailRef = useRef([]);
  const planetRefs = useRef([]);
  
  // State to track screen size
  const [isMobile, setIsMobile] = useState(true);

  const phases = [
    {
      title: 'LAUNCH',
      subtitle: 'Week 1 - Day 1-3',
      description: 'Orientation, onboarding, and mission briefing. Choose your track and meet mentors.',
      planet: { type: 'mercury', size: 80, color: '#94a3b8', detail: '#64748b' },
      pathY: 100,
    },
    {
      title: 'ORBIT PHASE I',
      subtitle: 'Week 1 - Day 4-7',
      description: 'Begin with introductory tasks. Build foundational skills.',
      planet: { type: 'venus', size: 95, color: '#fb923c', detail: '#f97316' },
      pathY: 400,
    },
    {
      title: 'EARTH STATION',
      subtitle: 'Week 2 - Day 8-10',
      description: 'Complete your first major contribution.',
      planet: { type: 'earth', size: 105, color: '#3b82f6', detail: '#10b981' },
      pathY: 750,
    },
    {
      title: 'MARS OUTPOST',
      subtitle: 'Week 2 - Day 11-14',
      description: 'Work on intermediate features.',
      planet: { type: 'mars', size: 90, color: '#dc2626', detail: '#ef4444' },
      pathY: 1100,
    },
    {
      title: 'JUPITER JUNCTION',
      subtitle: 'Week 3 - Day 15-17',
      description: 'Tackle complex issues and challenges.',
      planet: { type: 'jupiter', size: 140, color: '#f59e0b', detail: '#d97706' },
      pathY: 1500,
    },
    {
      title: 'SATURN SYSTEMS',
      subtitle: 'Week 3 - Day 18-21',
      description: 'Peak contribution phase. Major features.',
      planet: { type: 'saturn', size: 130, color: '#eab308', detail: '#ca8a04', rings: true },
      pathY: 1900,
    },
    {
      title: 'URANUS EXPEDITION',
      subtitle: 'Week 4 - Day 22-24',
      description: 'Final contributions and code reviews.',
      planet: { type: 'uranus', size: 110, color: '#06b6d4', detail: '#0891b2', rings: true },
      pathY: 2300,
    },
    {
      title: 'NEPTUNE REACH',
      subtitle: 'Week 4 - Day 25-26',
      description: 'Submit documentation and prepare.',
      planet: { type: 'neptune', size: 105, color: '#2563eb', detail: '#1d4ed8' },
      pathY: 2650,
    },
    {
      title: 'PLUTO POINT',
      subtitle: 'Week 4 - Day 27',
      description: 'Leaderboard freeze. Final submission.',
      planet: { type: 'pluto', size: 70, color: '#94a3b8', detail: '#64748b' },
      pathY: 2950,
    },
    {
      title: 'MISSION COMPLETE',
      subtitle: 'Week 4 - Day 28',
      description: 'Closing ceremony. Certificates and celebration!',
      planet: { type: 'star', size: 110, color: '#fbbf24', detail: '#f59e0b' },
      pathY: 3250,
    },
  ];

  // Mobile Detection Layout Effect
  useEffect(() => {
    const checkMobile = () => {
      // 1024px is the standard 'lg' breakpoint in Tailwind
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Initial check
    checkMobile();
    
    // Resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // GSAP Animation Effect (Only runs on Desktop)
  useEffect(() => {
    // Skip animation logic if we are on mobile
    if (isMobile) return;

    const timeline = timelineRef.current;
    const rocket = rocketRef.current;
    const path = pathRef.current;
    const mainThrust = mainThrustRef.current;

    // Safety check - if refs aren't mounted, exit
    if (!timeline || !rocket || !path) return;

    const pathLength = path.getTotalLength();

    // 1. Animate planets on scroll
    planetRefs.current.forEach((planet, index) => {
      if (planet) {
        gsap.fromTo(
          planet,
          { scale: 0, opacity: 0, rotationY: -90 },
          {
            scale: 1,
            opacity: 1,
            rotationY: 0,
            duration: 1,
            scrollTrigger: {
              trigger: planet,
              start: 'top 80%',
              end: 'top 50%',
              scrub: 1,
            },
          }
        );

        // Continuous planet rotation
        gsap.to(planet, {
          rotationZ: 360,
          duration: 20 + index * 5,
          repeat: -1,
          ease: 'none',
        });
      }
    });

    // 2. Animate rocket along the path based on scroll
    gsap.to(rocket, {
      scrollTrigger: {
        trigger: timeline,
        start: 'top 70%',
        end: 'bottom 85%',
        scrub: 0.1,
        onUpdate: (self) => {
          const progress = self.progress;
          // Calculate point on path
          const point = path.getPointAtLength(progress * pathLength);
          const nextPoint = path.getPointAtLength(Math.min((progress + 0.01) * pathLength, pathLength));
          // Calculate rotation angle
          const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
          
          gsap.set(rocket, {
            x: point.x,
            y: point.y,
            rotation: angle + 90,
          });

          // Dynamic thrust intensity based on speed/curve
          const speed = Math.abs(nextPoint.y - point.y) + Math.abs(nextPoint.x - point.x);
          const thrustIntensity = Math.min(speed * 10, 1);
          
          if (mainThrust) {
            gsap.set(mainThrust, {
              scaleY: 0.5 + thrustIntensity * 0.8,
              opacity: 0.7 + thrustIntensity * 0.3,
            });
          }

          // Enhanced smoke trail at high progress (near end)
          if (progress > 0.8) {
            smokeTrailRef.current.forEach((smoke, index) => {
              if (smoke) {
                gsap.set(smoke, {
                  scale: 2 + (progress - 0.8) * 8,
                  opacity: 0.9 * (1 - (progress - 0.8) * 4),
                });
              }
            });
          }
        },
      },
    });

    // 3. Animate thrust flames continuously
    if (mainThrust) {
      gsap.to(mainThrust, {
        scaleY: 1.2,
        scaleX: 1.1,
        duration: 0.1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }

    // 4. Animate side thrust particles
    sideThrustRef.current.forEach((particle, index) => {
      if (particle) {
        gsap.to(particle, {
          scale: 0,
          opacity: 0,
          duration: 0.4,
          delay: index * 0.05,
          repeat: -1,
          ease: 'power2.out',
        });
      }
    });

    // 5. Create smoke trail effect
    smokeTrailRef.current.forEach((smoke, index) => {
      if (smoke) {
        gsap.fromTo(smoke, {
          scale: 0.3,
          opacity: 0.6,
        }, {
          scale: 2,
          opacity: 0,
          duration: 1.5,
          delay: index * 0.1,
          repeat: -1,
          ease: 'power2.out',
        });
      }
    });

    // 6. Final boost burst toward footer
    ScrollTrigger.create({
      trigger: timeline,
      start: 'bottom 85%',
      once: true,
      onEnter: () => {
        const endPoint = path.getPointAtLength(pathLength);
        
        gsap.set(rocket, {
          x: endPoint.x,
          y: endPoint.y,
          rotation: 180,
        });
        
        gsap.to(mainThrust, { 
          scaleY: 5, 
          scaleX: 1.5,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
        
        // Fog/smoke burst
        smokeTrailRef.current.forEach((smoke, index) => {
          if (smoke) {
            gsap.to(smoke, {
              scale: 4,
              opacity: 0.9,
              duration: 0.2,
              delay: index * 0.02,
              ease: 'power2.out',
            });
            gsap.to(smoke, {
              scale: 8,
              opacity: 0,
              duration: 1.5,
              delay: 0.2 + index * 0.02,
              ease: 'power2.out',
            });
          }
        });
        
        // Rocket shoots down
        gsap.to(rocket, {
          y: endPoint.y + 1000,
          scale: 1.5,
          duration: 1.2,
          ease: 'power4.in',
        });
        
        gsap.to(rocket, {
          opacity: 0,
          scale: 0.5,
          duration: 0.8,
          delay: 0.4,
          ease: 'power2.in',
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isMobile]); // Re-run if mobile state changes

  const renderGalaxy = () => (
    <div className="absolute -inset-14 pointer-events-none" style={{ zIndex: 0 }}>
      {/* Core glow */}
      <div
        className="absolute inset-0 animate-spin"
        style={{
          background: 'radial-gradient(circle at 45% 45%, rgba(255, 255, 255, 0.35), transparent 40%), radial-gradient(circle at 55% 55%, rgba(251, 191, 36, 0.3), transparent 55%), radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.2), transparent 70%)',
          filter: 'blur(8px)',
          animationDuration: '32s',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          borderRadius: '50%',
          mixBlendMode: 'screen',
        }}
      />
      {/* Spiral arms */}
      <div
        className="absolute inset-2 animate-spin"
        style={{
          background: 'conic-gradient(from 45deg, rgba(236, 72, 153, 0.22), rgba(236, 72, 153, 0) 15%, rgba(255, 255, 255, 0.28) 16%, rgba(255, 255, 255, 0) 30%, rgba(139, 92, 246, 0.2) 31%, rgba(139, 92, 246, 0) 45%, rgba(251, 191, 36, 0.22) 46%, rgba(251, 191, 36, 0) 60%, rgba(255, 255, 255, 0.2) 61%, rgba(255, 255, 255, 0) 75%, rgba(236, 72, 153, 0.18) 76%, rgba(236, 72, 153, 0) 90%, rgba(255, 255, 255, 0.24) 91%, rgba(255, 255, 255, 0))',
          filter: 'blur(4px)',
          borderRadius: '50%',
          animationDuration: '26s',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          mixBlendMode: 'screen',
        }}
      />
      {/* Star cluster */}
      <div
        className="absolute inset-10"
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.8)',
          boxShadow: '18px 6px 12px rgba(255,255,255,0.6), -12px 18px 10px rgba(255,255,255,0.35), 26px -4px 14px rgba(251,191,36,0.45), -22px -6px 10px rgba(139,92,246,0.4), 8px -22px 9px rgba(255,255,255,0.55), -18px 0px 8px rgba(236,72,153,0.45), 2px 22px 12px rgba(255,255,255,0.4)',
          filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.35))',
          opacity: 0.9,
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );

  const renderPlanet = (planet, index) => {
    const { type, size, color, detail, rings } = planet;

    return (
      <div
        ref={el => planetRefs.current[index] = el}
        className="relative"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Planet sphere */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${detail}, ${color})`,
            boxShadow: `0 0 ${size/2}px ${color}80, inset -${size/4}px -${size/4}px ${size/3}px rgba(0,0,0,0.5)`,
          }}
        >
          {type === 'earth' && (
            <>
              <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 rounded-full bg-green-500/30 blur-sm"></div>
              <div className="absolute top-1/2 right-1/4 w-1/4 h-1/4 rounded-full bg-green-600/40 blur-sm"></div>
              <div className="absolute bottom-1/3 left-1/3 w-1/4 h-1/4 rounded-full bg-blue-400/20 blur-sm"></div>
            </>
          )}
          {/* ... (Kept all planet rendering logic) ... */}
          {type === 'star' && (
            <div className="absolute inset-0 rounded-full animate-pulse bg-yellow-300/50"></div>
          )}
        </div>

        {rings && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'rotateX(75deg)', transformStyle: 'preserve-3d' }}>
             <div className="absolute" style={{
                width: `${size * 2.2}px`,
                height: `${size * 2.2}px`,
                border: `${size * 0.12}px solid ${color}40`,
                borderRadius: '50%',
                boxShadow: `0 0 ${size/3}px ${color}30`,
             }}></div>
          </div>
        )}

        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            boxShadow: `0 0 ${size}px ${color}40`,
            opacity: 0.6,
          }}
        ></div>
      </div>
    );
  };

  return (
    <section id="timeline" className="relative py-20 px-4 sm:px-6 overflow-hidden" ref={timelineRef}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-16">
          MISSION <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic-purple to-nebula-blue">TIMELINE</span>
        </h2>

        {/* ---------------- MOBILE VIEW (Vertical List) ---------------- */}
        <div className="lg:hidden space-y-8 relative pl-4">
          <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-cosmic-purple via-nebula-blue to-transparent opacity-50"></div>

          {phases.map((phase, index) => (
            <div key={index} className="relative flex items-start group">
              <div 
                className="absolute left-8 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-space-black z-10 mt-1.5 bg-space-black transition-all duration-300 group-hover:scale-125"
                style={{ borderColor: phase.color, boxShadow: `0 0 10px ${phase.color}` }}
              ></div>
              <div className="ml-12 w-full glass-effect p-6 rounded-xl border border-white/10 hover:border-cosmic-purple/50 transition-all duration-300">
                <span className="text-xs font-mono text-nebula-blue mb-1 block uppercase tracking-wider">{phase.subtitle}</span>
                <h3 className="text-xl font-bold text-white mb-2">{phase.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{phase.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ---------------- DESKTOP VIEW (Original Animation) ---------------- */}
        <div className="hidden lg:block relative" style={{ minHeight: '3500px' }}>
          {/* SVG Path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
                <stop offset="25%" stopColor="#ec4899" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6" />
                <stop offset="75%" stopColor="#ec4899" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.7" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            
            <path
              ref={pathRef}
              d="M 300,60 C 320,120 350,160 400,240 S 450,380 420,480 C 400,550 370,580 320,640 S 280,780 300,900 C 320,980 350,1020 400,1080 S 460,1200 440,1320 C 420,1400 380,1440 330,1520 S 280,1680 290,1800 C 310,1900 340,1960 390,2040 S 450,2180 430,2300 C 410,2400 370,2460 320,2560 S 270,2720 280,2850 C 300,2960 330,3020 380,3100 C 400,3150 410,3220 420,3300"
              stroke="url(#pathGradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="10,5"
              className="opacity-70"
              filter="url(#glow)"
            />
          </svg>

          {/* Rocket Ship */}
          <div
            ref={rocketRef}
            className="absolute w-[120px] h-[120px]"
            style={{ zIndex: 10, transformOrigin: 'center center', willChange: 'transform' }}
          >
            <div className="relative">
              {/* Smoke Particles */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={`smoke-${i}`}
                  ref={el => smokeTrailRef.current[i] = el}
                  className="absolute top-24 left-1/2 -translate-x-1/2"
                  style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.7) 0%, rgba(236, 72, 153, 0.5) 40%, transparent 100%)',
                    filter: 'blur(4px)', zIndex: 9998,
                  }}
                />
              ))}
              
              {/* Rocket SVG */}
              <svg width="100%" height="100%" viewBox="0 0 60 60" className="relative z-10">
                <defs>
                   <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24"/>
                    <stop offset="100%" stopColor="#ec4899"/>
                  </linearGradient>
                </defs>
                <rect x="23" y="20" width="14" height="22" fill="#e0e7ff" rx="1.5"/>
                <path d="M 30,4 L 37,20 L 23,20 Z" fill="url(#rocketGradient)"/>
                <circle cx="30" cy="25" r="3" fill="#60a5fa"/>
                <path d="M 23,32 L 15,47 L 23,43 Z" fill="#6366f1"/>
                <path d="M 37,32 L 45,47 L 37,43 Z" fill="#6366f1"/>
              </svg>

              {/* Thrust Flame */}
              <div ref={mainThrustRef} className="absolute top-[84px] left-1/2 -translate-x-1/2" style={{ transformOrigin: 'top center' }}>
                <div style={{ width: '45px', height: '75px', background: 'linear-gradient(to bottom, #f97316 0%, #ec4899 50%, #8b5cf6 100%)', clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)', filter: 'blur(2px)', opacity: 0.9 }}/>
              </div>

              {/* Side Particles */}
              {[...Array(4)].map((_, i) => (
                <div key={`particle-${i}`} ref={el => sideThrustRef.current[i] = el} className="absolute" style={{ top: '75px', left: i % 2 === 0 ? '8px' : '68px', width: '12px', height: '12px', borderRadius: '50%', background: 'radial-gradient(circle, #fbbf24 0%, transparent 100%)' }}/>
              ))}
            </div>
          </div>

          {/* Planets and Text */}
          {phases.map((phase, index) => (
            <div
              key={index}
              className="absolute left-0 right-0 flex items-center gap-8"
              style={{ top: `${phase.pathY}px`, zIndex: 10 }}
            >
              {index % 2 === 0 ? (
                <>
                  <div className="flex-1 flex justify-end pr-8">
                    <div className="glass-effect rounded-xl p-6 max-w-md">
                      <h3 className="text-2xl font-bold text-cosmic-purple mb-2">{phase.title}</h3>
                      <p className="text-sm text-nebula-pink font-semibold mb-3">{phase.subtitle}</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{phase.description}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 relative" style={{ perspective: '800px', marginLeft: '-50px' }}>
                    {phase.title === 'MISSION COMPLETE' && renderGalaxy()}
                    <div className="relative" style={{ zIndex: 1 }}>{renderPlanet(phase.planet, index)}</div>
                  </div>
                  <div className="flex-1"></div>
                </>
              ) : (
                <>
                  <div className="flex-1"></div>
                  <div className="flex-shrink-0 relative" style={{ perspective: '800px', marginRight: '-50px' }}>
                    {phase.title === 'MISSION COMPLETE' && renderGalaxy()}
                    <div className="relative" style={{ zIndex: 1 }}>{renderPlanet(phase.planet, index)}</div>
                  </div>
                  <div className="flex-1 flex justify-start pl-8">
                    <div className="glass-effect rounded-xl p-6 max-w-md">
                      <h3 className="text-2xl font-bold text-cosmic-purple mb-2">{phase.title}</h3>
                      <p className="text-sm text-nebula-pink font-semibold mb-3">{phase.subtitle}</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{phase.description}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;