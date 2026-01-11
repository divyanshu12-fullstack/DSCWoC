import Navbar from '../components/Navbar'
import Starfield from '../components/Starfield'

const Guidelines = () => {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-space-black via-midnight-blue to-space-black">
      <Starfield />

      <div className="relative z-10">
        <Navbar />
        <br />
        <br />

        <main className="pt-20 sm:pt-24 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <section className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">📜 Participation Guidelines</h1>
            <p className="text-sm text-gray-300">To ensure a smooth, fair, and impactful experience for everyone, please carefully read and follow the guidelines below.</p>
          </section>
          <br />

          <section className="mb-6 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-blue-500/5 border border-cyan-400/20 rounded-xl p-5 hover:border-cyan-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
            <h2 className="text-xl font-semibold text-cyan-100 mb-3">🔐 Eligibility & Registration</h2>
            <br />
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-2">
              <li>Participation is open to all students, regardless of year, branch, or prior open-source experience.</li>
              <li>Registration is mandatory for all roles: Contributor, Mentor, and Project Admin.</li>
              <li>Each participant can register for only one role.</li>
              <li className="flex items-center gap-2">
                <span className="inline-block bg-red-500/20 border border-red-400/50 text-red-300 px-3 py-1 rounded-full text-xs font-semibold">DEADLINE</span>
                <span>The registration deadline is <strong className="text-red-300">15th January 2026</strong>.</span>
              </li>
              <li>Access to the exclusive GSoC guidance session is granted only to registered participants.</li>
            </ul>
          </section>

          <section className="mb-6 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-purple-500/5 border border-purple-400/20 rounded-xl p-5 hover:border-purple-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
            <h2 className="text-xl font-semibold text-purple-100 mb-3">👥 Roles & Responsibilities</h2>
            <br />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-cyan-600/10 to-cyan-500/5 border border-cyan-400/30 rounded-lg p-4 hover:border-cyan-400/60 hover:bg-gradient-to-br hover:from-cyan-600/15 hover:to-cyan-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 cursor-pointer">
                <h3 className="text-lg font-medium text-cyan-200 mb-1">🔹 Contributors</h3>
                <span className="inline-block bg-gradient-to-r from-cyan-600/30 to-cyan-500/20 border border-cyan-400/60 text-cyan-100 px-2 py-1 rounded text-xs font-semibold mb-3">CORE ROLE</span>
                <ul className="list-disc pl-5 text-sm text-gray-300 space-y-2 mt-2">
                  <li>Follow GitHub workflows: fork, create a feature branch, commit with clear messages, and open PRs referencing the related issue.</li>
                  <li>Claim issues before starting work, and post a short plan on the issue so maintainers know the intent.</li>
                  <li>Write focused, testable changes; include tests or validation steps where applicable.</li>
                  <li>Provide a clear PR description: purpose, changes, how to test, and any trade-offs.</li>
                  <li>Respond to review comments respectfully and iterate on feedback within a reasonable timeframe.</li>
                  <li>Expected time commitment: try to be consistently active (even small, regular contributions are valued).</li>
                  <li className="text-yellow-300 font-semibold">⚠️ Low-effort, spammy, or copied PRs will be rejected and may lead to disqualification.</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-pink-600/10 to-pink-500/5 border border-pink-400/30 rounded-lg p-4 hover:border-pink-400/60 hover:bg-gradient-to-br hover:from-pink-600/15 hover:to-pink-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/30 cursor-pointer">
                <h3 className="text-lg font-medium text-pink-200 mb-1">🔹 Mentors</h3>
                <span className="inline-block bg-gradient-to-r from-pink-600/30 to-pink-500/20 border border-pink-400/60 text-pink-100 px-2 py-1 rounded text-xs font-semibold mb-3">GUIDANCE ROLE</span>
                <ul className="list-disc pl-5 text-sm text-gray-300 space-y-2 mt-2">
                  <li>Help contributors get started: triage newcomer issues, provide onboarding tips, and point to docs.</li>
                  <li>Review PRs promptly (aim for 48–72 hours) with actionable, constructive feedback.</li>
                  <li>Verify that code follows project standards, tests pass, and the PR includes clear rationale.</li>
                  <li>Encourage learning: explain why changes are needed, suggest improvements, and point to resources.</li>
                  <li>Be available for periodic check-ins and help resolve blockers or merge conflicts.</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-violet-600/10 to-purple-500/5 border border-purple-400/30 rounded-lg p-4 hover:border-purple-400/60 hover:bg-gradient-to-br hover:from-violet-600/15 hover:to-purple-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 cursor-pointer">
                <h3 className="text-lg font-medium text-purple-200 mb-1">🔹 Project Admins</h3>
                <span className="inline-block bg-gradient-to-r from-purple-600/30 to-purple-500/20 border border-purple-400/60 text-purple-100 px-2 py-1 rounded text-xs font-semibold mb-3">LEADERSHIP ROLE</span>
                <ul className="list-disc pl-5 text-sm text-gray-300 space-y-2 mt-2">
                  <li>Define a clear roadmap, label issues by difficulty (Beginner / Intermediate / Advanced), and maintain a CONTRIBUTING.md.</li>
                  <li>Create well-scoped issues with acceptance criteria and example inputs/outputs where relevant.</li>
                  <li>Ensure CI, tests, and linters are set up and that PRs run automated checks before merge.</li>
                  <li>Coordinate with mentors to assign reviewers and keep contributors informed about priorities.</li>
                  <li>Keep the project inclusive: welcome first-time contributors, provide clear onboarding steps, and review newcomer PRs carefully.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-6 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-pink-500/5 border border-orange-400/20 rounded-xl p-5 hover:border-orange-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20">
            <h2 className="text-xl font-semibold text-orange-100 mb-3">🧾 Contribution Rules</h2>
            <br />
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-2">
              <li>All contributions must be made only through GitHub.</li>
              <li className="text-yellow-300 font-semibold bg-yellow-500/10 border-l-2 border-yellow-400 pl-3 py-1">⚡ Plagiarism or direct copying of code without attribution is strictly prohibited.</li>
              <li>Follow proper commit messages, clean code practices, and project-specific contribution guidelines.</li>
              <li className="text-cyan-300 font-semibold">✓ Final evaluation will focus on quality over quantity.</li>
            </ul>
          </section>

          <section className="mb-6 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 border border-green-400/20 rounded-xl p-5 hover:border-green-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
            <h2 className="text-xl font-semibold text-green-100 mb-3">📊 Leaderboard & Evaluation</h2>
            <br />
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-2">
              <li>A live leaderboard will track participant progress.</li>
              <li>Evaluation criteria include quality of contributions, consistency, collaboration, and communication.</li>
              <li>Leaderboard scores are final and non-negotiable.</li>
            </ul>
          </section>







          <section className="mb-12 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">🚀 Final Note</h3>
            <p className="text-sm text-gray-300">DSCWoC’26 is more than an event — it’s a launchpad into real open-source impact. Learn honestly. Contribute responsibly. Build fearlessly.</p>
            <p className="text-sm text-cyan-300 mt-3">Don’t just watch open source. Build it. Contribute. Lead.</p>
          </section>
          <section className="mb-12 text-center bg-gradient-to-r from-cyan-600/15 via-purple-600/15 to-cyan-600/15 border border-cyan-400/40 rounded-xl p-8 hover:border-cyan-400/70 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/40">
            <h2 className="text-2xl font-bold text-cyan-100 mb-4">📢 Join Our Community</h2>
            <p className="text-sm text-gray-300 mb-6 max-w-2xl mx-auto">All official announcements, mentor listings, project releases, and GSoC session details will be shared exclusively through the DSCWoC WhatsApp Community. Be part of the movement!</p>
            <a href="https://chat.whatsapp.com/Gh76zSdTKkvC0cynJ16GxL" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 text-lg font-bold text-white rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 animate-pulse hover:animate-none border border-cyan-300/50">
              🔗 Join WhatsApp Community Now
            </a>
          </section>        </main>
      </div>
    </div>
  )
}

export default Guidelines
