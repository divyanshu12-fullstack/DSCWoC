import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from '../hooks/useIsMobile';

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const terminalRef = useRef(null);
  const computerRef = useRef(null);
  const [typedText, setTypedText] = useState('');
  const [currentLine, setCurrentLine] = useState(0);
  const isMobile = useIsMobile();

  const terminalLines = [
    '> INITIALIZING MISSION PROTOCOL...',
    '> SYSTEM STATUS: OPERATIONAL',
    '> LOADING MISSION PARAMETERS...',
    '',
    '=== DSC WINTER OF CODE ===',
    'MISSION BRIEFING:',
    '',
    '📚 LEARN OPEN SOURCE',
    '   Master Git, GitHub workflows, and',
    '   collaborative development practices.',
    '',
    '🔨 BUILD REAL PROJECTS',
    '   Work on production-grade repositories',
    '   that matter to the community.',
    '',
    '👨‍🏫 EXPERT MENTORSHIP',
    '   Get guidance from experienced developers',
    '   throughout your journey.',
    '',
    '🏆 EARN RECOGNITION',
    '   Receive certificates, badges, and',
    '   build your developer portfolio.',
    '',
    '> MISSION DURATION: 4 WEEKS',
    '> STATUS: READY FOR DEPLOYMENT',
    '> AWAITING CREW REGISTRATION...',
  ];

  // Typing effect function (desktop only)
  const startTyping = () => {
    let lineIndex = 0;
    let charIndex = 0;
    let fullText = '';

    const typeInterval = setInterval(() => {
      if (lineIndex < terminalLines.length) {
        if (charIndex < terminalLines[lineIndex].length) {
          fullText += terminalLines[lineIndex][charIndex];
          setTypedText(fullText);
          charIndex++;
        } else {
          fullText += '\n';
          setTypedText(fullText);
          lineIndex++;
          charIndex = 0;
          setCurrentLine(lineIndex);
        }
      } else {
        clearInterval(typeInterval);
      }
    }, 30);
  };

  useEffect(() => {
    const terminal = terminalRef.current;
    const computer = computerRef.current;
    if (isMobile) return undefined;
    
    if (computer) {
      // 3D computer animation
      gsap.fromTo(
        computer,
        { 
          opacity: 0, 
          rotateX: 45,
          rotateY: -30,
          z: -200 
        },
        {
          opacity: 1,
          rotateX: 20,
          rotateY: -15,
          z: 0,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: computer,
            start: 'top 80%',
            onEnter: () => {
              // Start typing effect when terminal comes into view
              startTyping();
            }
          },
        }
      );

      // Gentle floating animation
      gsap.to(computer, {
        rotateY: -10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    if (terminal) {
      gsap.fromTo(
        terminal,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: terminal,
            start: 'top 80%',
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isMobile]);

  const mobileInsights = [
    { label: 'Mission Status', value: 'Active', accent: 'from-cosmic-purple to-nebula-pink' },
    { label: 'Objectives', value: '4 Weeks · 10 Phases', accent: 'from-stellar-cyan to-galaxy-violet' },
    { label: 'Comms Link', value: 'Uplink Stable', accent: 'from-amber-400 to-orange-500' },
    { label: 'Next Milestone', value: 'Orbit Phase I', accent: 'from-emerald-400 to-teal-500' },
  ];

  return (
    <section id="about" className="relative py-32 px-6" style={{ perspective: '1500px' }}>
      {/* Mobile-only HUD bar */}
      <div className="md:hidden max-w-3xl mx-auto mb-16 px-3">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-white mb-1">Mission Briefing</h2>
          <p className="text-xs text-gray-400">HUD · Live mission insights</p>
        </div>

        <div className="w-full rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-md p-3 shadow-lg shadow-cosmic-purple/10">
          <div className="flex items-center gap-2 text-[11px] text-gray-300 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            LIVE FLIGHT HUD
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="px-3 py-2 rounded-full bg-slate-800/70 border border-white/10 text-xs text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Status: Active
            </div>
            <div className="px-3 py-2 rounded-full bg-slate-800/70 border border-white/10 text-xs text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Uplink: Stable
            </div>
            <div className="px-3 py-2 rounded-full bg-slate-800/70 border border-white/10 text-xs text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Power: 98%
            </div>
            <div className="px-3 py-2 rounded-full bg-slate-800/70 border border-white/10 text-xs text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              GPS: Locked
            </div>
            <div className="px-3 py-2 rounded-full bg-slate-800/70 border border-white/10 text-xs text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-400"></span>
              Crew: Synced
            </div>
            <div className="px-3 py-2 rounded-full bg-slate-800/70 border border-white/10 text-xs text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400"></span>
              Next: Orbit Phase I
            </div>
          </div>
        </div>
      </div>

      {/* Desktop GSAP experience */}
      <div className="hidden md:block">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-20">
          MISSION BRIEFING
        </h2>

        {/* 3D Flight Computer */}
        <div 
          ref={computerRef}
          className="relative mx-auto max-w-5xl"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: 'rotateX(20deg) rotateY(-15deg)',
          }}
        >
          {/* Computer Base */}
          <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
            {/* Main Screen */}
            <div 
              className="relative rounded-lg overflow-hidden"
              style={{
                transform: 'translateZ(50px)',
                boxShadow: '0 50px 100px rgba(139, 92, 246, 0.3)',
              }}
            >
              <div className="terminal-screen rounded-lg p-8 relative overflow-hidden">
                {/* Scanline effect */}
                <div className="scanline"></div>
                
                {/* Screen glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-cosmic-purple/10 to-transparent pointer-events-none"></div>
                
                {/* Terminal header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-cosmic-purple/30">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-nebula-pink animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-galaxy-violet animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 rounded-full bg-cosmic-purple animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <div className="terminal-text text-xs">
                    FLIGHT_COMPUTER_MKIII
                  </div>
                </div>

                {/* Terminal content */}
                <div className="terminal-text text-sm md:text-base leading-relaxed font-mono h-[500px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{typedText}</pre>
                  <span className="inline-block w-2 h-5 bg-cosmic-purple animate-pulse ml-1"></span>
                </div>

                {/* Terminal footer */}
                <div className="mt-6 pt-4 border-t border-cosmic-purple/30 terminal-text text-xs flex justify-between">
                  <span>⚡ POWER: 98%</span>
                  <span>📡 UPLINK: ACTIVE</span>
                  <span>🛰️ GPS: LOCKED</span>
                </div>
              </div>
            </div>

            {/* Computer Sides - 3D Effect */}
            <div 
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-900 to-black border-l-2 border-cosmic-purple/20"
              style={{
                transform: 'rotateY(-90deg) translateZ(0)',
                transformOrigin: 'left center',
                width: '40px',
              }}
            ></div>

            <div 
              className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-gray-900 to-black border-r-2 border-nebula-pink/20"
              style={{
                transform: 'rotateY(90deg) translateZ(0)',
                transformOrigin: 'right center',
                width: '40px',
              }}
            ></div>

            {/* Computer Top */}
            <div 
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 border-t-2 border-galaxy-violet/30"
              style={{
                transform: 'rotateX(90deg) translateZ(0)',
                transformOrigin: 'top center',
                height: '40px',
              }}
            ></div>

            {/* Keyboard/Control Panel */}
            <div 
              className="absolute -bottom-20 left-0 right-0 h-20 bg-gradient-to-b from-gray-900 to-black rounded-b-lg"
              style={{
                transform: 'rotateX(-70deg) translateZ(-20px)',
                transformOrigin: 'top center',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)',
              }}
            >
              {/* Keyboard keys effect */}
              <div className="grid grid-cols-12 gap-1 p-3">
                {[...Array(36)].map((_, i) => (
                  <div 
                    key={i}
                    className="h-2 bg-gray-800 rounded-sm border border-cosmic-purple/20"
                    style={{
                      boxShadow: '0 2px 4px rgba(139, 92, 246, 0.1)',
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 border-2 border-nebula-pink/20 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 border-2 border-galaxy-violet/20 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
          </div>
        </div>
        {/* Vision Section with Animated Monitor */}
        <div className="mt-20 pt-16 border-t border-cosmic-purple/20">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 md:mb-16">OUR VISION</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 items-stretch px-4">
            {/* Stat card 1 */}
            <div className="glass-effect p-6 rounded-lg border border-cosmic-purple/40 backdrop-blur-sm">
              <div className="text-2xl font-bold text-cosmic-purple mb-2">4 Weeks</div>
              <p className="text-xs text-gray-400">Intensive hands-on learning journey with expert guidance</p>
            </div>
            {/* Stat card 2 */}
            <div className="glass-effect p-6 rounded-lg border border-galaxy-violet/40 backdrop-blur-sm">
              <div className="text-2xl font-bold text-galaxy-violet mb-2">100+</div>
              <p className="text-xs text-gray-400">Students contributing to real open-source projects</p>
            </div>
            {/* Stat card 3 */}
            <div className="glass-effect p-6 rounded-lg border border-nebula-pink/40 backdrop-blur-sm">
              <div className="text-2xl font-bold text-nebula-pink mb-2">∞ Impact</div>
              <p className="text-xs text-gray-400">Build lasting skills and develop community connections</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-4 items-stretch px-4">
            {/* Animated Monitor - LEFT */}
            <div className="flex justify-center md:justify-start order-2 md:order-1">
              <div className="relative w-56 h-72 md:w-56 md:h-72" style={{ perspective: '1200px' }}>
                <div className="w-full h-full rounded-lg overflow-hidden" style={{boxShadow:'0 20px 50px rgba(139, 92, 246, 0.4)',border:'3px solid #8b5cf6',background:'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.1))'}}>
                  <div className="absolute inset-3 rounded-md bg-gradient-to-br from-cosmic-purple/30 to-nebula-pink/10 overflow-hidden">
                    <svg className="absolute inset-0 w-full h-full opacity-30"><pattern id="visionGrid" x="20" y="20" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#8b5cf6" strokeWidth="0.5"/></pattern><rect width="100%" height="100%" fill="url(#visionGrid)" /></svg>
                    <div className="absolute top-6 left-6 w-3 h-3 rounded-full bg-nebula-pink animate-pulse" style={{boxShadow:'0 0 15px rgba(236, 72, 153, 0.8)'}}></div>
                    <div className="absolute inset-6 flex items-center justify-center pointer-events-none"><div className="text-center"><div className="text-xs text-gray-300 mb-2 font-mono">github.com/dscwoc</div><div className="grid grid-cols-7 gap-1">{[...Array(35)].map((_, i) => (<div key={i} className="w-2.5 h-2.5 rounded-sm bg-green-500" style={{opacity:0.3+Math.random()*0.4,animation:'pulse-commit 2.2s ease-in-out infinite',animationDelay:`${(i*0.06)%2}s`}}/>))}</div><div className="text-xs text-gray-400 mt-2 font-mono">Contribution Graph</div></div></div>
                  </div>
                </div>
                <style>{`@keyframes floatMon{0%,100%{transform:translateY(0px) rotateX(3deg)}50%{transform:translateY(-15px) rotateX(5deg)}}@keyframes pulse-commit{0%,100%{opacity:.3}50%{opacity:1}}`}</style>
                <div className="float-mon absolute inset-0" style={{transformStyle:'preserve-3d',animation:'floatMon 4s ease-in-out infinite'}}></div>
              </div>
            </div>

            {/* Vision Content - STRETCHED LEFT (2 cols) */}
            <div className="space-y-4 order-1 md:order-2 md:col-span-2 px-0 md:px-4">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Empower & Inspire</h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-3">We envision a thriving community where student developers master open-source, build impactful projects, and grow under expert mentorship.</p>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed">Every contribution matters. From your first pull request to shipping production code, we guide you every step. Collaborate with peers, learn from veterans, and build something that makes a difference.</p>
              </div>
              <br />
              <div className="glass-effect p-4 rounded-lg border border-cosmic-purple/40 backdrop-blur-sm">
                <p className="text-gray-200 text-xs md:text-sm leading-relaxed"><span className="font-semibold text-cosmic-purple">DataScience Club VIT Bhopal</span> drives innovation through community initiatives like DSC Winter of Code, empowering the next generation of developers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
};

export default AboutSection;
