import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from '../hooks/useIsMobile';

gsap.registerPlugin(ScrollTrigger);

const TERMINAL_LINES = [
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

const seededNoise = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const AboutSection = () => {
  const terminalRef = useRef(null);
  const computerRef = useRef(null);
  const [typedText, setTypedText] = useState('');
  const isMobile = useIsMobile();

  // Typing effect function (desktop only) - optimized
  const startTyping = useCallback(() => {
    let lineIndex = 0;
    let charIndex = 0;
    let fullText = '';
    let intervalId = null;

    const typeInterval = () => {
      if (lineIndex < TERMINAL_LINES.length) {
        if (charIndex < TERMINAL_LINES[lineIndex].length) {
          fullText += TERMINAL_LINES[lineIndex][charIndex];
          setTypedText(fullText);
          charIndex++;
        } else {
          fullText += '\n';
          setTypedText(fullText);
          lineIndex++;
          charIndex = 0;
        }
        // Increased interval from 30ms to 50ms for better performance
        intervalId = setTimeout(typeInterval, 50);
      }
    };

    typeInterval();

    return () => {
      if (intervalId) clearTimeout(intervalId);
    };
  }, []);

  useEffect(() => {
    const terminal = terminalRef.current;
    const computer = computerRef.current;
    if (isMobile) return undefined;

    let computerFloatTween;
    let computerIntroTween;

    if (computer) {
      gsap.set(computer, { transformOrigin: '50% 50%', yPercent: 0 });

      // Prepare gentle floating animation but keep it paused until intro finishes
      computerFloatTween = gsap.to(computer, {
        yPercent: 4,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        force3D: true,
        paused: true,
      });

      // 3D computer reveal animation
      computerIntroTween = gsap.fromTo(
        computer,
        {
          opacity: 0,
          rotateX: 45,
          rotateY: -30,
          z: -200,
        },
        {
          opacity: 1,
          rotateX: 20,
          rotateY: -15,
          z: 0,
          duration: 1.5,
          ease: 'power3.out',
          onComplete: () => computerFloatTween?.play(),
          scrollTrigger: {
            trigger: computer,
            start: 'top 80%',
            once: true,
            onEnter: () => {
              // Start typing effect when terminal comes into view
              startTyping();
            },
          },
        }
      );
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
      computerFloatTween?.kill();
      computerIntroTween?.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isMobile, startTyping]);

  const contributionCells = useMemo(
    () =>
      Array.from({ length: 35 }, (_, i) => ({
        opacity: 0.3 + seededNoise(i + 1) * 0.4,
        delay: `${(i * 0.06) % 2}s`,
      })),
    []
  );

  return (
    <section id="about" className="relative py-32 px-6" style={{ perspective: '1500px' }}>
      {/* Mobile-only view */}
      <div className="md:hidden max-w-3xl mx-auto px-3">
        {/* About Section - Mission Briefing */}
        <div className="mb-16">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold text-white mb-1">Mission Briefing</h2>
            <p className="text-xs text-cyan-300">Your 4-week journey into open-source</p>
          </div>

          <div className="w-full rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-[#0a0f1c] via-[#0f172a] to-[#0b1323] p-5 shadow-xl shadow-cyan-500/20 space-y-4 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 20% 20%, rgba(34,211,238,0.08), transparent 35%), radial-gradient(circle at 80% 0%, rgba(139,92,246,0.08), transparent 30%)' }}></div>
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>

            {/* Intro Text */}
            <div className="relative">
              <p className="text-sm text-slate-200 leading-relaxed">DSC Winter of Code is an intensive 4-week program designed to introduce students to open-source development. Learn real-world skills, contribute to meaningful projects, and grow as a developer.</p>
            </div>

            {/* What You'll Learn */}
            <div className="relative pt-2 border-t border-cyan-400/20">
              <p className="text-[11px] uppercase tracking-[0.15em] text-cyan-300 font-semibold mb-3">What You Get</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs">
                  <span className="text-nebula-pink font-bold mt-0.5">📚</span>
                  <span className="text-slate-200"><span className="font-semibold">Learn Open Source:</span> Master Git, GitHub workflows, and collaborative development</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <span className="text-cosmic-purple font-bold mt-0.5">🔨</span>
                  <span className="text-slate-200"><span className="font-semibold">Build Real Projects:</span> Contribute to production-grade repositories that matter</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <span className="text-galaxy-violet font-bold mt-0.5">👨‍🏫</span>
                  <span className="text-slate-200"><span className="font-semibold">Expert Mentorship:</span> Get guidance from experienced developers throughout</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <span className="text-emerald-400 font-bold mt-0.5">🏆</span>
                  <span className="text-slate-200"><span className="font-semibold">Earn Recognition:</span> Certificates, badges, and portfolio-building opportunities</span>
                </div>
              </div>

            {/* Learning Outcomes Grid */}
            <div className="grid grid-cols-2 gap-2 relative pt-2 border-t border-cyan-400/20">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-nebula-pink/40 text-xs">
                <p className="text-nebula-pink text-sm font-bold mb-1">📚</p>
                <p className="font-semibold text-white text-xs">Open Source Mastery</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-cosmic-purple/40 text-xs">
                <p className="text-cosmic-purple text-sm font-bold mb-1">🔨</p>
                <p className="font-semibold text-white text-xs">Real-World Coding</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-galaxy-violet/40 text-xs">
                <p className="text-galaxy-violet text-sm font-bold mb-1">👨‍🏫</p>
                <p className="font-semibold text-white text-xs">Expert Guidance</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-emerald-400/40 text-xs">
                <p className="text-emerald-400 text-sm font-bold mb-1">🏆</p>
                <p className="font-semibold text-white text-xs">Portfolio Growth</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile OUR VISION Section */}
        <div className="pt-12 border-t border-cosmic-purple/20">
          <h2 className="text-2xl font-bold text-white text-center mb-8">OUR VISION</h2>

          {/* Stat cards - Mobile optimized */}
          <div className="space-y-3 mb-10">
            <div className="p-4 rounded-lg border border-cosmic-purple/40 bg-slate-900/50 backdrop-blur-sm">
              <div className="text-xl font-bold text-cosmic-purple mb-1">4 Weeks</div>
              <p className="text-xs text-gray-400">Intensive hands-on learning journey with expert guidance</p>
            </div>
            <div className="p-4 rounded-lg border border-galaxy-violet/40 bg-slate-900/50 backdrop-blur-sm">
              <div className="text-xl font-bold text-galaxy-violet mb-1">100+</div>
              <p className="text-xs text-gray-400">Students contributing to real open-source projects</p>
            </div>
            <div className="p-4 rounded-lg border border-nebula-pink/40 bg-slate-900/50 backdrop-blur-sm">
              <div className="text-xl font-bold text-nebula-pink mb-1">∞ Impact</div>
              <p className="text-xs text-gray-400">Build lasting skills and develop community connections</p>
            </div>

          {/* Vision Content */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Empower & Inspire</h3>
              <p className="text-gray-300 leading-relaxed text-sm mb-2">We envision a thriving community where student developers master open-source, build impactful projects, and grow under expert mentorship.</p>
              <p className="text-gray-400 text-xs leading-relaxed">Every contribution matters. From your first pull request to shipping production code, we guide you every step. Collaborate with peers, learn from veterans, and build something that makes a difference.</p>
            </div>

            {/* Info card */}
            <div className="p-4 rounded-lg border border-cosmic-purple/40 bg-slate-900/50 backdrop-blur-sm mt-6">
              <p className="text-gray-200 text-xs leading-relaxed"><span className="font-semibold text-cosmic-purple">DataScience Club VIT Bhopal</span> drives innovation through community initiatives like DSC Winter of Code, empowering the next generation of developers.</p>
            </div>

            {/* Guidelines CTA */}
            <div className="mt-8 pt-6 border-t border-cosmic-purple/20">
              <Link to="/guidelines" className="w-full inline-block px-6 py-3 text-center text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-cosmic-purple to-nebula-pink hover:from-cosmic-purple/80 hover:to-nebula-pink/80 transition-all duration-300 shadow-lg hover:shadow-cosmic-purple/50 border border-cosmic-purple/60">
                📋 View Participation Guidelines
              </Link>
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
                  <div className="absolute inset-0 bg-gradient-to-b from-cosmic-purple/40 to-transparent pointer-events-none"></div>

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
                  <style>{`@keyframes floatMon{0%,100%{transform:translateY(0px) rotateX(3deg)}50%{transform:translateY(-15px) rotateX(5deg)}}@keyframes pulse-commit{0%,100%{opacity:.3}50%{opacity:1}}`}</style>
                  <div className="float-mon absolute inset-0" style={{ transformStyle: 'preserve-3d', animation: 'floatMon 4s ease-in-out infinite' }}></div>
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
                  <div className="w-full h-full rounded-lg overflow-hidden" style={{ boxShadow: '0 20px 50px rgba(139, 92, 246, 0.4)', border: '3px solid #8b5cf6', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.1))' }}>
                    <div className="absolute inset-3 rounded-md bg-gradient-to-br from-cosmic-purple/30 to-nebula-pink/10 overflow-hidden">
                      <svg className="absolute inset-0 w-full h-full opacity-30"><pattern id="visionGrid" x="20" y="20" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#8b5cf6" strokeWidth="0.5" /></pattern><rect width="100%" height="100%" fill="url(#visionGrid)" /></svg>
                      <div className="absolute top-6 left-6 w-3 h-3 rounded-full bg-nebula-pink animate-pulse" style={{ boxShadow: '0 0 15px rgba(236, 72, 153, 0.8)' }}></div>
                      <div className="absolute inset-6 flex items-center justify-center pointer-events-none"><div className="text-center"><div className="text-xs text-gray-300 mb-2 font-mono">github.com/dscwoc</div><div className="grid grid-cols-7 gap-1">{contributionCells.map((cell, i) => (<div key={i} className="w-2.5 h-2.5 rounded-sm bg-green-500" style={{ opacity: cell.opacity, animation: 'pulse-commit 2.2s ease-in-out infinite', animationDelay: cell.delay }} />))}</div><div className="text-xs text-gray-400 mt-2 font-mono">Contribution Graph</div></div></div>
                    </div>
                  </div>
                  <style>{`@keyframes floatMon{0%,100%{transform:translateY(0px) rotateX(3deg)}50%{transform:translateY(-15px) rotateX(5deg)}}@keyframes pulse-commit{0%,100%{opacity:.3}50%{opacity:1}}`}</style>
                  <div className="float-mon absolute inset-0" style={{ transformStyle: 'preserve-3d', animation: 'floatMon 4s ease-in-out infinite' }}></div>
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
