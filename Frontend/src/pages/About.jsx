import { useNavigate } from 'react-router-dom'
import Starfield from '../components/Starfield'

const About = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-space-black via-midnight-blue to-space-black">
      <Starfield />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/5 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-white">About DSC Winter of Code</h1>
              <button
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Introduction Section */}
          <section className="mb-8">
            <br />
            <br />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Welcome to DSC Winter of Code
            </h2>
            <p className="text-base text-gray-300 leading-relaxed">
              The flagship open-source initiative by the Data Science Club, VIT Bhopal University 🚀
            </p>
          </section>
          <br />
          <br />
          <br />


          {/* About Content - 2 Column Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-5 hover:bg-white/10 transition-colors duration-300">
              <h3 className="text-lg font-bold text-stellar-cyan mb-2">
                Born Out of Passion
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Born out of curiosity, collaboration, and a love for building in public, DSCWoC is where learning meets real-world impact.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-5 hover:bg-white/10 transition-colors duration-300">
              <h3 className="text-lg font-bold text-nebula-pink mb-2">
                Our Community
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                We are a vibrant community of students, tinkerers, designers, coders, analysts, and data enthusiasts who believe that the best way to learn technology is by contributing to it.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-5 hover:bg-white/10 transition-colors duration-300">
              <h3 className="text-lg font-bold text-cosmic-purple mb-2">
                Guided and Empowered
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Guided by our faculty mentor Dr. Velmurugan, and powered by a passionate core team, DSC Winter of Code creates a safe, beginner-friendly gateway into open source.
              </p>
            </div>

            <div className="bg-gradient-to-r from-cosmic-purple/20 to-nebula-pink/20 backdrop-blur-md border border-cosmic-purple/30 rounded-lg p-5">
              <h3 className="text-lg font-bold text-white mb-2">
                Whether You're...
              </h3>
              <ul className="space-y-1 text-sm text-gray-300">
                <li className="flex items-start space-x-2">
                  <span className="text-stellar-cyan font-bold">✓</span>
                  <span>Opening your first-ever pull request</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-stellar-cyan font-bold">✓</span>
                  <span>Exploring Git & GitHub</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-stellar-cyan font-bold">✓</span>
                  <span>Contributing to real-world projects</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-stellar-cyan font-bold">✓</span>
                  <span>Or mentoring others through their journey</span>
                </li>
              </ul>
            </div>
          </section>
          <br />
          <br />

          {/* What Makes DSCWoC Special */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              What Makes DSC Winter of Code Special?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Card 1 */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 hover:border-stellar-cyan/50 hover:shadow-lg hover:shadow-stellar-cyan/20">
                <div className="text-3xl mb-2">🌌</div>
                <h4 className="text-sm font-bold text-white mb-1">
                  Beginner-Friendly
                </h4>
                <p className="text-xs text-gray-300">
                  No prior experience required. We guide you step by step.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 hover:border-nebula-pink/50 hover:shadow-lg hover:shadow-nebula-pink/20">
                <div className="text-3xl mb-2">🧑‍🚀</div>
                <h4 className="text-sm font-bold text-white mb-1">
                  Mentor-Led Projects
                </h4>
                <p className="text-xs text-gray-300">
                  Expert mentors review PRs and guide contributors.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 hover:border-cosmic-purple/50 hover:shadow-lg hover:shadow-cosmic-purple/20">
                <div className="text-3xl mb-2">🛠</div>
                <h4 className="text-sm font-bold text-white mb-1">
                  Real Projects
                </h4>
                <p className="text-xs text-gray-300">
                  Work on meaningful repositories used beyond the event.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 hover:border-galaxy-violet/50 hover:shadow-lg hover:shadow-galaxy-violet/20">
                <div className="text-3xl mb-2">📈</div>
                <h4 className="text-sm font-bold text-white mb-1">
                  Growth First
                </h4>
                <p className="text-xs text-gray-300">
                  Reward consistency, learning, and collaboration.
                </p>
              </div>

              {/* Card 5 */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 hover:border-stellar-cyan/50 hover:shadow-lg hover:shadow-stellar-cyan/20">
                <div className="text-3xl mb-2">🏅</div>
                <h4 className="text-sm font-bold text-white mb-1">
                  Recognition
                </h4>
                <p className="text-xs text-gray-300">
                  Earn badges, certificates, and public recognition.
                </p>
              </div>
            </div>
          </section>
          <br />
          <br />

          {/* Vision Section with Animated Monitor */}
          <section className="border-t border-cosmic-purple/20 pt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
              OUR VISION
            </h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Stat card 1 */}
              <div className="glass-effect p-4 rounded-lg border border-cosmic-purple/40 backdrop-blur-sm hover:border-cosmic-purple/60 hover:bg-cosmic-purple/10 transition-all duration-300">
                <div className="text-2xl font-bold text-cosmic-purple mb-1">4 Weeks</div>
                <p className="text-xs text-gray-400">Intensive hands-on learning journey with expert guidance</p>
              </div>
              {/* Stat card 2 */}
              <div className="glass-effect p-4 rounded-lg border border-galaxy-violet/40 backdrop-blur-sm hover:border-galaxy-violet/60 hover:bg-galaxy-violet/10 transition-all duration-300">
                <div className="text-2xl font-bold text-galaxy-violet mb-1">100+</div>
                <p className="text-xs text-gray-400">Students contributing to real open-source projects</p>
              </div>
              {/* Stat card 3 */}
              <div className="glass-effect p-4 rounded-lg border border-nebula-pink/40 backdrop-blur-sm hover:border-nebula-pink/60 hover:bg-nebula-pink/10 transition-all duration-300">
                <div className="text-2xl font-bold text-nebula-pink mb-1">∞ Impact</div>
                <p className="text-xs text-gray-400">Build lasting skills and develop community connections</p>
              </div>
            </div>

            {/* Vision Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
              {/* Animated Monitor - LEFT */}
              <div className="flex justify-center md:justify-start order-2 md:order-1">
                <div className="relative w-48 h-64" style={{ perspective: '1200px' }}>
                  <div className="w-full h-full rounded-lg overflow-hidden" style={{ boxShadow: '0 20px 50px rgba(139, 92, 246, 0.4)', border: '3px solid #8b5cf6', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.1))' }}>
                    <div className="absolute inset-3 rounded-md bg-gradient-to-br from-cosmic-purple/30 to-nebula-pink/10 overflow-hidden">
                      <svg className="absolute inset-0 w-full h-full opacity-30">
                        <defs>
                          <pattern id="visionGrid" x="20" y="20" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#8b5cf6" strokeWidth="0.5" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#visionGrid)" />
                      </svg>
                      <div className="absolute top-6 left-6 w-3 h-3 rounded-full bg-nebula-pink animate-pulse" style={{ boxShadow: '0 0 15px rgba(236, 72, 153, 0.8)' }}></div>
                      <div className="absolute inset-6 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                          <div className="text-xs text-gray-300 mb-1 font-mono">github.com/dscwoc</div>
                          <div className="grid grid-cols-7 gap-0.5">
                            {[...Array(35)].map((_, i) => (
                              <div
                                key={i}
                                className="w-2 h-2 rounded-sm bg-green-500"
                                style={{
                                  opacity: 0.3 + Math.random() * 0.4,
                                  animation: 'pulse-commit 2.2s ease-in-out infinite',
                                  animationDelay: `${(i * 0.06) % 2}s`
                                }}
                              />
                            ))}
                          </div>
                          <div className="text-xs text-gray-400 mt-1 font-mono">Contribution Graph</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <style>{`
                    @keyframes floatMon {
                      0%, 100% { transform: translateY(0px) rotateX(3deg); }
                      50% { transform: translateY(-15px) rotateX(5deg); }
                    }
                    @keyframes pulse-commit {
                      0%, 100% { opacity: 0.3; }
                      50% { opacity: 1; }
                    }
                    .float-mon {
                      transform-style: preserve-3d;
                      animation: floatMon 4s ease-in-out infinite;
                    }
                  `}</style>
                  <div className="float-mon absolute inset-0" style={{ transformStyle: 'preserve-3d' }}></div>
                </div>
              </div>

              {/* Vision Content - STRETCHED (2 cols) */}
              <div className="space-y-3 order-1 md:order-2 md:col-span-2">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    Empower & Inspire
                  </h3>
                  <br />
                  <p className="text-sm text-gray-300 leading-relaxed mb-2">
                    We envision a thriving community where student developers master open-source, build impactful projects, and grow under expert mentorship.
                  </p>
                  <br />
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Every contribution matters. From your first pull request to shipping production code, we guide you every step. Collaborate with peers, learn from veterans, and build something that makes a difference.
                  </p>
                </div>
                <div className="glass-effect p-3 rounded-lg border border-cosmic-purple/40 backdrop-blur-sm hover:border-cosmic-purple/60 hover:bg-cosmic-purple/10 transition-all duration-300">
                  <p className="text-gray-200 text-xs leading-relaxed">
                    <span className="font-semibold text-cosmic-purple">DataScience Club VIT Bhopal</span> drives innovation through community initiatives like DSC Winter of Code, empowering the next generation of developers.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <br />
          <br />


          {/* CTA Section */}
          <section className="mt-8 text-center">
            <div className="bg-gradient-to-r from-cosmic-purple/20 to-nebula-pink/20 backdrop-blur-md border border-cosmic-purple/30 rounded-lg p-6 hover:border-cosmic-purple/50 hover:bg-cosmic-purple/15 transition-all duration-300">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Ready to Join the Journey?
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Start your open-source adventure with DSC Winter of Code today. No experience necessary, just enthusiasm!
              </p>
              <button
                onClick={() => navigate('/Dashboard')}
                className="retro-button bg-gradient-to-r from-cosmic-purple to-nebula-pink hover:from-galaxy-violet hover:to-nebula-pink text-white px-8 py-2.5 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cosmic-purple/50 hover:-translate-y-0.5 text-sm"
              >
                Explore DSCWoC
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default About
