import { Book, Code, GitBranch, AlertTriangle, CheckCircle } from 'lucide-react';

const Guidelines = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">MISSION <span className="text-cosmic-purple">PROTOCOLS</span></h1>
        <p className="text-gray-400">Standard Operating Procedures (SOP) for all personnel.</p>
      </div>

      <div className="grid gap-8">
        {/* Purpose Section */}
        <div className="glass-effect p-8 rounded-2xl border-l-4 border-stellar-cyan">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Book className="text-stellar-cyan" /> Purpose
          </h2>
          <p className="text-gray-300 leading-relaxed">
            These guidelines ensure clean, maintainable code and smooth collaboration during the Winter of Code. 
            All contributors must strictly follow these protocols to ensure mission success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Tech Stack */}
          <div className="glass-effect p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold text-nebula-blue mb-4 flex items-center gap-2">
              <Code /> Approved Tech Stack
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Frontend', val: 'React.js (v18+)' },
                { label: 'Styling', val: 'Tailwind CSS' },
                { label: 'State', val: 'React Hooks' },
                { label: 'Linting', val: 'ESLint & Prettier' }
              ].map((item, i) => (
                <li key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-gray-400 text-sm">{item.label}</span>
                  <span className="text-white font-mono text-sm">{item.val}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Git Rules */}
          <div className="glass-effect p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold text-pink-500 mb-4 flex items-center gap-2">
              <GitBranch /> Git Workflow
            </h3>
            <div className="space-y-4">
              <div className="bg-black/30 p-3 rounded-lg border border-white/10">
                <p className="text-xs text-gray-500 mb-1">Create Feature Branch</p>
                <code className="text-green-400 text-sm font-mono">git checkout -b feature/your-feature</code>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-300">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <p>Never push directly to <span className="text-white font-bold">main</span>. Always use a Pull Request.</p>
              </div>
            </div>
          </div>
        </div>

        {/* PR Checklist */}
        <div className="glass-effect p-8 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6">Pre-Flight Checklist (PRs)</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {['Code follows SOP', 'Functions documented', 'Error handling added', 'No console errors', 'Tested locally'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                <CheckCircle className="w-5 h-5 text-cosmic-purple" />
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guidelines;