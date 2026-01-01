import { useState } from 'react';
import { Search, Github, ExternalLink } from 'lucide-react';

const Projects = () => {
  // Mock Data mimicking TD1.pdf schema
  const projects = [
    {
      id: 1,
      name: 'Nebula Dashboard',
      desc: 'Real-time visualization of space mission data using React and D3.',
      track: 'Web',
      difficulty: 'Intermediate',
      mentor: 'Sarah Connor',
      tags: ['React', 'D3.js', 'Tailwind']
    },
    {
      id: 2,
      name: 'Orbit Calc AI',
      desc: 'ML model to predict orbital debris trajectories.',
      track: 'AI/ML',
      difficulty: 'Advanced',
      mentor: 'Dr. Smith',
      tags: ['Python', 'TensorFlow', 'NumPy']
    },
    {
      id: 3,
      name: 'Cosmic Mobile',
      desc: 'Cross-platform app for tracking ISS sightings.',
      track: 'App',
      difficulty: 'Beginner',
      mentor: 'John Doe',
      tags: ['Flutter', 'Dart', 'Maps API']
    }
  ];

  const [filter, setFilter] = useState('');
  const [track, setTrack] = useState('All');

  const filtered = projects.filter(p => 
    (track === 'All' || p.track === track) &&
    (p.name.toLowerCase().includes(filter.toLowerCase()) || p.desc.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">MISSION <span className="text-stellar-cyan">PROJECTS</span></h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Explore open-source missions and initiate contribution protocols.</p>
      </div>

      {/* Filter Bar */}
      <div className="glass-effect p-4 rounded-xl mb-8 flex flex-col md:flex-row gap-4 justify-between items-center border border-white/10">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search missions..." 
            className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-stellar-cyan transition-all"
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {['All', 'Web', 'App', 'AI/ML'].map(t => (
            <button 
              key={t}
              onClick={() => setTrack(t)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                track === t ? 'bg-cosmic-purple text-white shadow-lg shadow-cosmic-purple/25' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <div key={p.id} className="glass-effect rounded-2xl p-6 border border-white/5 hover:border-stellar-cyan/50 transition-all duration-300 hover:-translate-y-1 group">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                p.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                p.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {p.difficulty}
              </span>
              <Github className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-stellar-cyan transition-colors">{p.name}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{p.desc}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {p.tags.map(tag => (
                <span key={tag} className="text-xs text-nebula-blue bg-nebula-blue/10 px-2 py-1 rounded">#{tag}</span>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500"></div>
                <span className="text-xs text-gray-300">{p.mentor}</span>
              </div>
              <button className="text-xs font-bold text-white bg-white/10 hover:bg-stellar-cyan hover:text-black px-3 py-1.5 rounded-lg transition-all flex items-center gap-1">
                View Repo <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;