import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Starfield from '../components/Starfield'

// Reusable Reward Card Component
const RewardCard = ({ tier, icon, title, rewards }) => {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 sm:p-8 hover:bg-white/10 transition-all duration-300 hover:border-cosmic-purple/50">
      <div className="flex items-center space-x-3 mb-4">
        <div className="text-4xl">{icon}</div>
        <div>
          <div className="text-sm text-cosmic-purple font-semibold">{tier}</div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
      </div>

      <div className="space-y-3">
        {rewards.map((reward, idx) => (
          <div key={idx} className="flex items-start space-x-2">
            <span className="text-stellar-cyan mt-1">✓</span>
            <span className="text-gray-300 text-sm">{reward}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => setIsRevealed(!isRevealed)}
        className="mt-4 text-sm font-semibold text-cosmic-purple hover:text-nebula-pink transition-colors duration-200"
      >
        {isRevealed ? '— Hide Details' : '+ View Full Details'}
      </button>

      {isRevealed && (
        <div className="mt-4 pt-4 border-t border-cosmic-purple/30 animate-fadeIn">
          <p className="text-xs text-gray-400 leading-relaxed">
            Unlock these rewards by achieving excellence in contributions, mentorship, and community impact.
            Every PR merged brings you closer to recognition.
          </p>
        </div>
      )}
    </div>
  )
}

// Blurred Content Reveal Component
const BlurredSection = ({ title, children }) => {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <div className="relative">
      <div
        className={`transition-all duration-500 ${
          isRevealed ? 'blur-none' : 'blur-sm pointer-events-none'
        }`}
      >
        {children}
      </div>

      {!isRevealed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl">
          <button
            onClick={() => setIsRevealed(true)}
            className="retro-button bg-gradient-to-r from-cosmic-purple to-nebula-pink hover:from-galaxy-violet hover:to-nebula-pink text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cosmic-purple/50 hover:-translate-y-0.5"
          >
            🔓 Reveal {title}
          </button>
        </div>
      )}
    </div>
  )
}


const Rewards = () => {
  const navigate = useNavigate()
  const [prizeRevealed, setPrizeRevealed] = useState(false)

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-space-black via-midnight-blue to-space-black">
      <Starfield />

      <div className="relative z-10">
        <Navbar />
        
        {/* Main Content with padding for navbar */}
        <main className="pt-20 sm:pt-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                🌌 Rewards Vault
              </h2>
              <div className="space-y-2 text-gray-300">
                <p className="text-lg font-semibold text-stellar-cyan">
                  Built by effort.
                </p>
                <p className="text-lg font-semibold text-nebula-pink">
                  Unlocked by contribution.
                </p>
                <p className="text-lg font-semibold text-cosmic-purple">
                  Remembered by impact.
                </p>
              </div>
            </div>

            <div className="mt-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 sm:p-8">
              <p className="text-gray-300 leading-relaxed">
                At DSC Winter of Code, rewards go far beyond cash. We reward consistency, learning, leadership, and real open-source impact — because that's what truly matters in the long run.
              </p>
              <p className="text-sm text-gray-400 mt-4 italic">
                🔒 Some rewards will unlock as the event progresses.
              </p>
            </div>
          </section>

          {/* Prize Pool Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">💰 Prize Pool</h2>

            <BlurredSection title="Prize Details">
              <div className="bg-gradient-to-br from-cosmic-purple/20 to-nebula-pink/20 backdrop-blur-md border border-cosmic-purple/30 rounded-xl p-8 sm:p-12 text-center">
                <div className="space-y-6">
                  <div>
                    <div className="text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cosmic-purple via-nebula-pink to-stellar-cyan mb-2">
                      ₹ XX,XXX+
                    </div>
                    <p className="text-gray-300 text-lg">
                      Worth of rewards, credits & opportunities
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <div className="bg-white/5 rounded-lg p-4 border border-cosmic-purple/40">
                      <div className="text-3xl mb-2">✨</div>
                      <p className="text-sm font-semibold text-white">Cash Prizes</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-nebula-pink/40">
                      <div className="text-3xl mb-2">☁️</div>
                      <p className="text-sm font-semibold text-white">Cloud & Developer Credits</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-stellar-cyan/40">
                      <div className="text-3xl mb-2">🚀</div>
                      <p className="text-sm font-semibold text-white">Leadership Opportunities</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-galaxy-violet/40">
                      <div className="text-3xl mb-2">📜</div>
                      <p className="text-sm font-semibold text-white">Verified Certificates & Digital Badges</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-gray-300">
                      ✨ <span className="font-semibold">Cash Prizes</span> • ☁️ <span className="font-semibold">Cloud & Developer Credits</span> • 🚀 <span className="font-semibold">Leadership Opportunities</span> • 📜 <span className="font-semibold">Verified Certificates & Digital Badges</span> • 📣 <span className="font-semibold">Public Recognition</span>
                    </p>
                  </div>

                  <p className="text-stellar-cyan font-semibold">
                    Every meaningful contribution moves you closer to unlocking more.
                  </p>
                </div>
              </div>
            </BlurredSection>
          </section>

          {/* Leaderboard Rewards Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">🏆 Leaderboard Rewards</h2>

            <div className="space-y-6">
              {/* Top 1-5 */}
              <RewardCard
                tier="TIER 1"
                icon="🥇"
                title="Top 1–5 Contributors"
                rewards={[
                  'Direct invitation to join the DSCWoC Core Team',
                  'Work closely with mentors & organizers',
                  'Cloud Credits (AWS / DigitalOcean / Heroku / Supabase)',
                  'Premium Developer Domain (1 year)',
                  'Elite Contributor Certificate',
                  'Legendary Badge',
                  'Featured across official DSC platforms'
                ]}
              />

              {/* Top 6-15 */}
              <RewardCard
                tier="TIER 2"
                icon="⭐"
                title="Top 6–15 Contributors"
                rewards={[
                  'Cloud & SaaS credits',
                  'Free domain (1 year)',
                  'Top Contributor – Verified Certificate',
                  'Achiever Badge',
                  'Public recognition on website & socials'
                ]}
              />

              {/* All Contributors */}
              <RewardCard
                tier="TIER 3"
                icon="🛰"
                title="All Contributors"
                rewards={[
                  'Verified Participation Certificate',
                  'Open Source Explorer Badge',
                  'GitHub-linked contribution record',
                  'Access to expert sessions & workshops',
                  'Lifetime community membership'
                ]}
              />
            </div>
          </section>

          {/* Special Rewards Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">✨ Special Achievements</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-md border border-stellar-cyan/40 rounded-xl p-6 hover:bg-stellar-cyan/5 transition-all duration-300">
                <div className="text-4xl mb-3">🌟</div>
                <h3 className="text-xl font-bold text-stellar-cyan mb-2">Consistency Champion</h3>
                <p className="text-sm text-gray-300">
                  Awarded to contributors who maintain regular, meaningful contributions throughout the event.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-nebula-pink/40 rounded-xl p-6 hover:bg-nebula-pink/5 transition-all duration-300">
                <div className="text-4xl mb-3">🧑‍🏫</div>
                <h3 className="text-xl font-bold text-nebula-pink mb-2">Mentor's Star</h3>
                <p className="text-sm text-gray-300">
                  For helping and guiding fellow contributors on their open-source journey.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-cosmic-purple/40 rounded-xl p-6 hover:bg-cosmic-purple/5 transition-all duration-300">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="text-xl font-bold text-cosmic-purple mb-2">Innovation Pioneer</h3>
                <p className="text-sm text-gray-300">
                  Recognizing creative and impactful contributions that push boundaries.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-galaxy-violet/40 rounded-xl p-6 hover:bg-galaxy-violet/5 transition-all duration-300">
                <div className="text-4xl mb-3">🤝</div>
                <h3 className="text-xl font-bold text-galaxy-violet mb-2">Community Builder</h3>
                <p className="text-sm text-gray-300">
                  Celebrating those who strengthen the community through collaboration and support.
                </p>
              </div>
            </div>
          </section>

          {/* How to Earn Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">📈 How to Earn Rewards</h2>

            <div className="bg-gradient-to-r from-cosmic-purple/20 to-nebula-pink/20 backdrop-blur-md border border-cosmic-purple/30 rounded-xl p-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cosmic-purple/40 flex items-center justify-center text-stellar-cyan font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Make Meaningful Contributions</h4>
                    <p className="text-sm text-gray-300">Submit pull requests, fix bugs, add features, or improve documentation in approved projects.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cosmic-purple/40 flex items-center justify-center text-stellar-cyan font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Earn Points</h4>
                    <p className="text-sm text-gray-300">Accumulate points based on PR merges, code quality, and community impact.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cosmic-purple/40 flex items-center justify-center text-stellar-cyan font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Climb the Leaderboard</h4>
                    <p className="text-sm text-gray-300">Compete with peers and rise to the top through consistent effort and quality work.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cosmic-purple/40 flex items-center justify-center text-stellar-cyan font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Unlock Special Badges</h4>
                    <p className="text-sm text-gray-300">Achieve milestones to unlock exclusive badges and recognition throughout the event.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-cosmic-purple/20 to-nebula-pink/20 backdrop-blur-md border border-cosmic-purple/30 rounded-xl p-8 sm:p-12 hover:border-cosmic-purple/50 hover:bg-cosmic-purple/15 transition-all duration-300">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Ready to Earn Your Rewards?
              </h3>
              <p className="text-gray-300 mb-6">
                Start contributing to DSC Winter of Code today and watch your achievements unlock!
              </p>
              <button
                onClick={() => navigate('/Dashboard')}
                className="retro-button bg-gradient-to-r from-cosmic-purple to-nebula-pink hover:from-galaxy-violet hover:to-nebula-pink text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cosmic-purple/50 hover:-translate-y-0.5"
              >
                Start Contributing Now
              </button>
            </div>
          </section>
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}

export default Rewards
