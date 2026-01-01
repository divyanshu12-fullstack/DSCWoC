import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const terminalRef = useRef(null);
  const computerRef = useRef(null);
  const [typedText, setTypedText] = useState('');
  const [currentLine, setCurrentLine] = useState(0);

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

  useEffect(() => {
    const terminal = terminalRef.current;
    const computer = computerRef.current;
    
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

    // Typing effect function
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

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section id="about" className="relative py-32 px-6" style={{ perspective: '1500px' }}>
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
      </div>
    </section>
  );
};

export default AboutSection;
