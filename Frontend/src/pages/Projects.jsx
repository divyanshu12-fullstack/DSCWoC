import Navbar from '../components/Navbar'
import Starfield from '../components/Starfield'
import LaunchCountdown from '../components/LaunchCountdown'

const PROJECTS_UNLOCK_TIME = '2026-01-12T12:00:00'

const Projects = () => {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#05070f] via-[#0a0f1e] to-[#05070f]">
      <Starfield />

      <div className="relative z-10">
        <Navbar />

        <main className="pt-20 sm:pt-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-12">
          <header className="text-center space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">Projects Dock</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">🔭 Projects Unlocking Soon</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We are aligning the repositories, mentors, and review crew. Projects open on 12 Jan at 12:00 PM.
              Until then, prep your tools and revisit the briefings.
            </p>
          </header>

          <LaunchCountdown
            target={PROJECTS_UNLOCK_TIME}
            title="Projects Launch Window"
            subtitle="Dock access opens once the mission control window hits T0"
            pillLabel="Locked"
            note="Projects unlock on 12 Jan, 12:00 PM (your local time). Repository links, issues, and submission forms will appear here automatically."
          />

          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-cyan-400/30 bg-white/5 backdrop-blur-md p-6 shadow-lg shadow-cyan-500/10">
              <h3 className="text-xl font-semibold text-white mb-2">What to prep</h3>
              <ul className="text-gray-300 text-sm space-y-2 list-disc list-inside">
                <li>Update your Git, GitHub SSH/HTTPS access, and CLI tooling.</li>
                <li>Review contribution guides and coding standards shared in the briefings.</li>
                <li>Set up local environments for your preferred stacks (JS/TS, Python, etc.).</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-nebula-pink/30 bg-white/5 backdrop-blur-md p-6 shadow-lg shadow-nebula-pink/10">
              <h3 className="text-xl font-semibold text-white mb-2">Heads-up</h3>
              <ul className="text-gray-300 text-sm space-y-2 list-disc list-inside">
                <li>Project scopes and difficulty tags publish at launch.</li>
                <li>Priority issues and mentor office hours will be pinned.</li>
                <li>First submission window closes 48 hours after unlock—plan your first PR.</li>
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Projects
