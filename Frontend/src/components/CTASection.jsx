const CTASection = () => {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative">
          {/* Glow effect background */}
          <div className="absolute inset-0 bg-gradient-to-r from-cosmic-purple/10 via-nebula-pink/10 to-galaxy-violet/10 opacity-10" aria-hidden="true"></div>

          <div className="relative space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold text-white">
              READY FOR LAUNCH?
            </h2>
            <p className="text-2xl text-gray-300 terminal-text">
              YOUR MISSION BEGINS THIS WINTER.
            </p>
            <button
              onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSdcSsjLNUcR0K--noBp3AhwmuEYRIRVfjRHIPTqZ68jHtI90g/viewform?usp=dialog', '_blank')}
              className="bg-gradient-to-r from-cosmic-purple to-nebula-pink hover:from-galaxy-violet hover:to-nebula-pink text-white px-12 py-4 rounded-full text-xl font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-cosmic-purple/60 hover:-translate-y-2 inline-flex items-center gap-3 cosmic-glow retro-button">
              <span>🚀</span>
              JOIN THE MISSION
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
