import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TracksSection = () => {
  const trackRefs = useRef([]);

  useEffect(() => {
    trackRefs.current.forEach((track, index) => {
      if (!track) return;

      gsap.fromTo(
        track,
        {
          opacity: 0,
          y: 100,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: track,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const tracks = [
    {
      icon: '📊',
      title: 'Data Science Track',
      description: 'Dive into machine learning, data analysis, and AI projects. Build real-world ML models and contribute to data-driven solutions.',
      gradient: 'from-cosmic-purple to-nebula-pink',
      features: ['Machine Learning', 'Data Analysis', 'AI Projects', 'Python & Libraries'],
    },
    {
      icon: '💻',
      title: 'Computer / Tech Track',
      description: 'Contribute to web development, mobile apps, and software engineering projects. Master Git workflows and collaborative coding.',
      gradient: 'from-nebula-pink to-galaxy-violet',
      features: ['Web Development', 'Mobile Apps', 'Open Source', 'Git Workflows'],
    },
  ];

  return (
    <section id="tracks" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">
          Choose Your Path
        </h2>
        <p className="text-center text-gray-400 mb-20 text-lg">
          Select your mission track and embark on your open-source journey
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {tracks.map((track, index) => (
            <div
              key={index}
              ref={el => trackRefs.current[index] = el}
              className="group relative"
            >
              {/* Glow effect on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${track.gradient} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 rounded-3xl`}></div>
              
              {/* Card */}
              <div className="relative glass-effect rounded-3xl p-8 hover:border-cosmic-purple/50 transition-all duration-500 h-full">
                {/* Icon */}
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-500">
                  {track.icon}
                </div>

                {/* Title */}
                <h3 className={`text-3xl font-bold mb-4 bg-gradient-to-r ${track.gradient} bg-clip-text text-transparent`}>
                  {track.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {track.description}
                </p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-3">
                  {track.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-gray-400"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-nebula-pink"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Hover indicator */}
                <div className="mt-8 text-cosmic-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                  <span>Explore Track</span>
                  <span className="text-xl">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TracksSection;
