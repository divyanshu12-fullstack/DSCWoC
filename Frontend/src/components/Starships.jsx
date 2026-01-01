import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Starships = () => {
  const spaceshipRefs = useRef([]);
  const [spaceships] = useState(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 80 + 60, // 60-140px
      duration: Math.random() * 25 + 20, // 20-45s
      delay: Math.random() * 8,
      rotation: Math.random() * 360,
      type: i % 3, // 3 different starship types
    }))
  );

  useEffect(() => {
    // Animate roaming starships across entire page
    spaceshipRefs.current.forEach((spaceship, index) => {
      if (!spaceship) return;

      const ship = spaceships[index];
      
      // Create random path points across the entire viewport
      const createRandomPath = () => {
        const points = Array.from({ length: 6 }, () => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
          rotation: Math.random() * 360 - 180,
        }));

        const tl = gsap.timeline({ repeat: -1, delay: ship.delay });
        
        points.forEach((point) => {
          tl.to(spaceship, {
            x: `${point.x}vw`,
            y: `${point.y}vh`,
            rotation: point.rotation,
            duration: ship.duration / points.length,
            ease: 'power1.inOut',
          });
        });

        return tl;
      };

      createRandomPath();

      // Add subtle scale pulsing
      gsap.to(spaceship, {
        scale: 1.1,
        duration: 3 + index * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    return () => {
      gsap.killTweensOf(spaceshipRefs.current);
    };
  }, [spaceships]);

  const StarshipType1 = ({ index }) => (
    <svg viewBox="0 0 120 80" fill="none" className="w-full h-full">
      {/* X-Wing style fighter */}
      {/* Main body */}
      <rect x="50" y="30" width="20" height="20" rx="2" fill={`url(#body1-${index})`} />
      {/* Cockpit */}
      <ellipse cx="60" cy="35" rx="8" ry="6" fill={`url(#cockpit1-${index})`} />
      {/* Wings - Top */}
      <path d="M 45 35 L 25 15 L 30 15 L 45 30 Z" fill={`url(#wing1-${index})`} opacity="0.9" />
      <path d="M 75 35 L 95 15 L 90 15 L 75 30 Z" fill={`url(#wing1-${index})`} opacity="0.9" />
      {/* Wings - Bottom */}
      <path d="M 45 45 L 25 65 L 30 65 L 45 50 Z" fill={`url(#wing1-${index})`} opacity="0.9" />
      <path d="M 75 45 L 95 65 L 90 65 L 75 50 Z" fill={`url(#wing1-${index})`} opacity="0.9" />
      {/* Engine glow */}
      <circle cx="55" cy="50" r="3" fill="#00d9ff" opacity="0.8">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="0.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="65" cy="50" r="3" fill="#00d9ff" opacity="0.8">
        <animate attributeName="opacity" values="1;0.5;1" dur="0.8s" repeatCount="indefinite" />
      </circle>
      {/* Engine trails */}
      <ellipse cx="55" cy="55" rx="2" ry="10" fill="#00d9ff" opacity="0.4">
        <animate attributeName="ry" values="8;14;8" dur="0.6s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="65" cy="55" rx="2" ry="10" fill="#00d9ff" opacity="0.4">
        <animate attributeName="ry" values="14;8;14" dur="0.6s" repeatCount="indefinite" />
      </ellipse>
      
      <defs>
        <linearGradient id={`body1-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0e7ff" />
          <stop offset="100%" stopColor="#c7d2fe" />
        </linearGradient>
        <linearGradient id={`cockpit1-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id={`wing1-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a5b4fc" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
    </svg>
  );

  const StarshipType2 = ({ index }) => (
    <svg viewBox="0 0 120 60" fill="none" className="w-full h-full">
      {/* Millennium Falcon style */}
      {/* Main disc */}
      <ellipse cx="60" cy="30" rx="30" ry="25" fill={`url(#disc2-${index})`} />
      {/* Cockpit offset */}
      <ellipse cx="70" cy="25" rx="10" ry="8" fill={`url(#cockpit2-${index})`} />
      {/* Side mandibles */}
      <path d="M 35 30 Q 20 25 15 30 L 20 35 Q 25 32 35 35 Z" fill={`url(#mandible2-${index})`} />
      <path d="M 85 30 Q 100 25 105 30 L 100 35 Q 95 32 85 35 Z" fill={`url(#mandible2-${index})`} />
      {/* Engine glow */}
      <ellipse cx="60" cy="45" rx="12" ry="4" fill="#4ade80" opacity="0.7">
        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="1.2s" repeatCount="indefinite" />
      </ellipse>
      {/* Engine trail */}
      <ellipse cx="60" cy="50" rx="10" ry="8" fill="#4ade80" opacity="0.3">
        <animate attributeName="ry" values="6;12;6" dur="1s" repeatCount="indefinite" />
      </ellipse>
      
      <defs>
        <radialGradient id={`disc2-${index}`}>
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
        <linearGradient id={`cockpit2-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id={`mandible2-${index}`}>
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
    </svg>
  );

  const StarshipType3 = ({ index }) => (
    <svg viewBox="0 0 100 70" fill="none" className="w-full h-full">
      {/* Enterprise style cruiser */}
      {/* Saucer section */}
      <ellipse cx="50" cy="25" rx="25" ry="15" fill={`url(#saucer3-${index})`} />
      {/* Bridge */}
      <ellipse cx="50" cy="20" rx="8" ry="5" fill={`url(#bridge3-${index})`} />
      {/* Engineering hull */}
      <rect x="45" y="35" width="10" height="15" rx="2" fill={`url(#hull3-${index})`} />
      {/* Nacelles */}
      <ellipse cx="30" cy="45" rx="8" ry="12" fill={`url(#nacelle3-${index})`} />
      <ellipse cx="70" cy="45" rx="8" ry="12" fill={`url(#nacelle3-${index})`} />
      {/* Warp glow */}
      <ellipse cx="30" cy="52" rx="6" ry="4" fill="#a78bfa" opacity="0.8">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="0.7s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="70" cy="52" rx="6" ry="4" fill="#a78bfa" opacity="0.8">
        <animate attributeName="opacity" values="1;0.6;1" dur="0.7s" repeatCount="indefinite" />
      </ellipse>
      {/* Warp trails */}
      <ellipse cx="30" cy="58" rx="4" ry="10" fill="#a78bfa" opacity="0.4">
        <animate attributeName="ry" values="8;15;8" dur="0.9s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="70" cy="58" rx="4" ry="10" fill="#a78bfa" opacity="0.4">
        <animate attributeName="ry" values="15;8;15" dur="0.9s" repeatCount="indefinite" />
      </ellipse>
      
      <defs>
        <radialGradient id={`saucer3-${index}`}>
          <stop offset="0%" stopColor="#e0e7ff" />
          <stop offset="100%" stopColor="#c7d2fe" />
        </radialGradient>
        <linearGradient id={`bridge3-${index}`}>
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id={`hull3-${index}`}>
          <stop offset="0%" stopColor="#ddd6fe" />
          <stop offset="100%" stopColor="#c4b5fd" />
        </linearGradient>
        <linearGradient id={`nacelle3-${index}`}>
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  );

  const getStarshipComponent = (type, index) => {
    switch (type) {
      case 0:
        return <StarshipType1 index={index} />;
      case 1:
        return <StarshipType2 index={index} />;
      case 2:
        return <StarshipType3 index={index} />;
      default:
        return <StarshipType1 index={index} />;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      {spaceships.map((ship, index) => (
        <div
          key={ship.id}
          ref={el => spaceshipRefs.current[index] = el}
          className="absolute"
          style={{
            width: `${ship.size}px`,
            height: `${ship.size * 0.6}px`,
            left: `${ship.x}%`,
            top: `${ship.y}%`,
            transform: `rotate(${ship.rotation}deg)`,
            filter: 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.5))',
          }}
        >
          {getStarshipComponent(ship.type, index)}
        </div>
      ))}
    </div>
  );
};

export default Starships;
