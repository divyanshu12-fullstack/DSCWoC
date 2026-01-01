import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from '../hooks/useIsMobile';
import '../styles/MobileBenefits.css';

gsap.registerPlugin(ScrollTrigger);

const BenefitsSection = () => {
  const isMobile = useIsMobile();
  const cardRefs = useRef([]);
  const titleRef = useRef(null);
  const sectionRef = useRef(null);
  const orbitRefs = useRef([]);

  const benefits = [
    {
      icon: '🚀',
      title: 'Launch Credentials',
      description: 'Receive an official astronaut-grade certificate proving your contribution to the open-source galaxy.',
      gradient: 'from-purple-600 via-pink-500 to-red-500',
      orbitColor: 'rgba(168, 85, 247, 0.4)',
    },
    {
      icon: '🌟',
      title: 'Cosmic Badges',
      description: 'Collect unique stellar badges for each mission milestone - your personal constellation of achievements.',
      gradient: 'from-blue-500 via-cyan-400 to-teal-400',
      orbitColor: 'rgba(59, 130, 246, 0.4)',
    },
    {
      icon: '🛸',
      title: 'Stellar Recognition',
      description: 'Climb the galactic leaderboard and earn your place among the top space explorers in the community.',
      gradient: 'from-amber-500 via-orange-400 to-yellow-400',
      orbitColor: 'rgba(245, 158, 11, 0.4)',
    },
    {
      icon: '🌌',
      title: 'Nebula Network',
      description: 'Join an exclusive community of cosmic coders and build connections that span the developer universe.',
      gradient: 'from-indigo-600 via-purple-500 to-pink-500',
      orbitColor: 'rgba(99, 102, 241, 0.4)',
    },
    {
      icon: '🛰️',
      title: 'Mission Swag',
      description: 'Top contributors receive limited edition space-grade merchandise from our interstellar outpost.',
      gradient: 'from-green-500 via-emerald-400 to-teal-400',
      orbitColor: 'rgba(16, 185, 129, 0.4)',
    },
    {
      icon: '💫',
      title: 'Galaxy Pass',
      description: 'Unlock priority access to future DSC missions, workshops, and exclusive cosmic events.',
      gradient: 'from-rose-500 via-fuchsia-500 to-purple-600',
      orbitColor: 'rgba(236, 72, 153, 0.4)',
    },
  ];

  useEffect(() => {
    if (isMobile) return; // Skip GSAP animations on mobile

    // Animate title
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: -50,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 90%',
          },
        }
      );
    }

    // Animate cards with stagger and 3D effect
    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
      });

      tl.fromTo(
        card,
        {
          opacity: 0,
          y: 150,
          rotationY: -45,
          z: -200,
        },
        {
          opacity: 1,
          y: 0,
          rotationY: 0,
          z: 0,
          duration: 1.2,
          delay: index * 0.15,
          ease: 'power3.out',
        }
      );

      // Hover animation
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -20,
          rotationY: 5,
          scale: 1.05,
          duration: 0.6,
          ease: 'power2.out',
        });

        const orbit = orbitRefs.current[index];
        if (orbit) {
          gsap.to(orbit, {
            scale: 1.2,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          rotationY: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power2.inOut',
        });

        const orbit = orbitRefs.current[index];
        if (orbit) {
          gsap.to(orbit, {
            scale: 1,
            opacity: 0.6,
            duration: 0.6,
            ease: 'power2.inOut',
          });
        }
      });

      // Continuous floating animation
      gsap.to(card, {
        y: '+=15',
        duration: 2 + index * 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    // Animate orbits
    orbitRefs.current.forEach((orbit, index) => {
      if (!orbit) return;

      gsap.to(orbit, {
        rotation: 360,
        duration: 20 + index * 5,
        repeat: -1,
        ease: 'none',
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isMobile]);

  // Mobile Optimized Version
  if (isMobile) {
    return (
      <section id="rewards" className="relative py-12 px-3 overflow-hidden w-full" style={{ display: 'block', visibility: 'visible' }}>
        {/* Animated background stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.5 + 0.2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text">
                CREW BENEFITS
              </span>
            </h2>
            <p className="text-xs text-gray-400">
              Unlock cosmic rewards from across the galaxy
            </p>
          </div>

          {/* Mobile Benefits Grid */}
          <div className="mobile-benefits-container">
            <div className="mobile-benefits-grid">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="mobile-benefits-card animate-slideUp"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="mobile-benefits-icon">{benefit.icon}</div>
                  <h3 className="mobile-benefits-title">{benefit.title}</h3>
                  <p className="mobile-benefits-description">{benefit.description}</p>
                  <div
                    className="mobile-benefits-accent"
                    style={{ '--color': benefit.orbitColor }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-8">
            <p className="text-gray-400 text-xs">Ready to claim rewards? 🌠</p>
          </div>
        </div>
      </section>
    );
  }

  // Desktop Version with GSAP
  return (
    <section id="rewards" className="relative py-16 sm:py-20 md:py-32 px-4 sm:px-6 md:px-6 overflow-hidden w-full" style={{ display: 'block', visibility: 'visible', zIndex: 'auto' }}>
      {/* Animated background stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10" style={{ position: 'relative' }}>
        <div ref={titleRef} className="text-center mb-12 md:mb-20" style={{ opacity: 1, position: 'relative', zIndex: 10 }}>
          <h2 className="text-7xl font-bold text-white mb-4 tracking-wider">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text">
              CREW BENEFITS
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Embark on this cosmic journey and unlock rewards from across the galaxy
          </p>
        </div>

        <div ref={sectionRef} className="grid gap-6 md:gap-8 lg:gap-12 perspective-1000 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Orbit ring */}
              <div
                ref={el => orbitRefs.current[index] = el}
                className="absolute inset-0 rounded-full border-2 border-dashed opacity-60 -z-10"
                style={{
                  borderColor: benefit.orbitColor,
                  transform: 'scale(1.1)',
                }}
              />

              {/* Card */}
              <div
                ref={el => cardRefs.current[index] = el}
                className="relative glass-effect rounded-3xl p-6 md:p-8 h-full group cursor-pointer overflow-hidden"
                style={{
                  background: 'rgba(17, 24, 39, 0.7)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  opacity: 1,
                }}
              >
                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />

                {/* Icon with glow effect */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${benefit.gradient}`} />
                  </div>
                  <div className="relative transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 text-7xl">
                    {benefit.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className={`font-bold mb-3 md:mb-4 bg-gradient-to-r ${benefit.gradient} text-transparent bg-clip-text text-2xl`}>
                  {benefit.title}
                </h3>
                <p className="leading-relaxed text-gray-300">
                  {benefit.description}
                </p>

                {/* Decorative corner elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full" />
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-white/30 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Optional: Add a call-to-action */}
        <div className="text-center mt-20">
          <p className="text-gray-400 text-lg">
            Ready to claim your cosmic rewards? 🌠
          </p>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
