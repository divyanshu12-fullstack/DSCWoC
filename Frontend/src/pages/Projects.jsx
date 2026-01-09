import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Starfield from '../components/Starfield'
import { useProjects, useProjectFilters, useMyProjects, useCreateProject } from '../hooks/useApi'

// Difficulty badge colors
const difficultyColors = {
  Beginner: 'bg-green-500/20 text-green-300 border-green-500/30',
  Intermediate: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Advanced: 'bg-red-500/20 text-red-300 border-red-500/30',
}

// Project Card Component
const ProjectCard = ({ project, onClick }) => {
  return (
    <div
      onClick={() => onClick(project)}
      className="group cursor-pointer rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 
                 hover:border-cyan-400/50 hover:bg-white/10 transition-all duration-300
                 hover:shadow-lg hover:shadow-cyan-500/10"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors">
            {project.name}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            {project.github_owner}/{project.github_repo}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${difficultyColors[project.difficulty]}`}>
          {project.difficulty}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
        {project.description || 'No description available'}
      </p>

      {/* Tech Stack */}
      {project.tech_stack?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech_stack.slice(0, 4).map((tech, idx) => (
            <span key={idx} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
              {tech}
            </span>
          ))}
          {project.tech_stack.length > 4 && (
            <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-400">
              +{project.tech_stack.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-400 pt-4 border-t border-white/10">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {project.stats?.stars || 0}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {project.stats?.forks || 0}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          {project.stats?.contributors || 0}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
          </svg>
          {project.stats?.mergedPRs || 0} PRs
        </span>
      </div>

      {/* Mentor */}
      {project.mentor && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
          <img
            src={project.mentor.avatar_url || `https://github.com/${project.mentor.github_username}.png`}
            alt={project.mentor.github_username}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-gray-400">
            Mentored by <span className="text-cyan-300">{project.mentor.fullName || project.mentor.github_username}</span>
          </span>
        </div>
      )}
    </div>
  )
}

// Project Detail Modal
const ProjectModal = ({ project, onClose }) => {
  if (!project) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#0a0f1e] to-[#05070f] 
                      border border-white/20 rounded-2xl p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-white">{project.name}</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${difficultyColors[project.difficulty]}`}>
              {project.difficulty}
            </span>
          </div>
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            {project.github_owner}/{project.github_repo}
          </a>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
          <p className="text-gray-300">{project.description || 'No description available'}</p>
        </div>

        {/* Tech Stack */}
        {project.tech_stack?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map((tech, idx) => (
                <span key={idx} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {project.tags?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-white/5 rounded-xl">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{project.stats?.stars || 0}</div>
            <div className="text-xs text-gray-400">Stars</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{project.stats?.forks || 0}</div>
            <div className="text-xs text-gray-400">Forks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{project.stats?.contributors || 0}</div>
            <div className="text-xs text-gray-400">Contributors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{project.stats?.mergedPRs || 0}</div>
            <div className="text-xs text-gray-400">Merged PRs</div>
          </div>
        </div>

        {/* Mentor */}
        {project.mentor && (
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl mb-6">
            <img
              src={project.mentor.avatar_url || `https://github.com/${project.mentor.github_username}.png`}
              alt={project.mentor.github_username}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="text-white font-medium">{project.mentor.fullName || project.mentor.github_username}</div>
              <div className="text-gray-400 text-sm">Project Mentor</div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <a
          href={project.github_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-3 bg-gradient-to-r from-cyan-500 to-blue-500 
                     hover:from-cyan-400 hover:to-blue-400 text-white font-medium rounded-xl transition-all"
        >
          View on GitHub →
        </a>
      </div>
    </div>
  )
}


// Add Project Modal
const AddProjectModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    github_url: '',
    name: '',
    description: '',
    difficulty: 'Intermediate',
    tags: '',
    tech_stack: '',
  })
  const [error, setError] = useState('')
  
  const createProject = useCreateProject()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await createProject.mutateAsync({
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        tech_stack: formData.tech_stack ? formData.tech_stack.split(',').map(t => t.trim()).filter(Boolean) : [],
      })
      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-gradient-to-br from-[#0a0f1e] to-[#05070f] 
                      border border-white/20 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Add New Project</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              GitHub Repository URL *
            </label>
            <input
              type="url"
              required
              placeholder="https://github.com/owner/repo"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white 
                         placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Project Name (optional - fetched from GitHub)
            </label>
            <input
              type="text"
              placeholder="My Awesome Project"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white 
                         placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description (optional)
            </label>
            <textarea
              rows={3}
              placeholder="Brief description of the project..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white 
                         placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white 
                         focus:outline-none focus:border-cyan-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              placeholder="web, api, machine-learning"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white 
                         placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tech Stack (comma-separated)
            </label>
            <input
              type="text"
              placeholder="React, Node.js, MongoDB"
              value={formData.tech_stack}
              onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white 
                         placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            disabled={createProject.isPending}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 
                       text-white font-medium rounded-xl transition-all disabled:opacity-50"
          >
            {createProject.isPending ? 'Creating...' : 'Add Project'}
          </button>
        </form>
      </div>
    </div>
  )
}

// Main Projects Page
const Projects = () => {
  const navigate = useNavigate()
  const [selectedProject, setSelectedProject] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    difficulty: '',
    search: '',
    tech: '',
  })

  // Get user from localStorage
  const [user, setUser] = useState(null)
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const isMentorOrAdmin = user?.role === 'Mentor' || user?.role === 'Admin'

  // Fetch data
  const { data: projectsData, isLoading, error } = useProjects(filters)
  const { data: filtersData } = useProjectFilters()
  const { data: myProjectsData } = useMyProjects()

  const projects = projectsData?.data?.projects || []
  const pagination = projectsData?.data?.pagination || {}
  const myProjects = myProjectsData?.data?.projects || []
  const availableTechStacks = filtersData?.data?.techStacks || []

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#05070f] via-[#0a0f1e] to-[#05070f]">
      <Starfield />

      <div className="relative z-10">
        <Navbar />

        <main className="pt-20 sm:pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Header */}
          <header className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80 mb-2">Projects Dock</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">🚀 Open Source Projects</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Explore projects, find issues to work on, and start contributing to open source.
            </p>
          </header>

          {/* My Projects Section (for Mentors/Admins) */}
          {isMentorOrAdmin && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">My Projects</h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 
                             text-white font-medium rounded-lg transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Project
                </button>
              </div>

              {myProjects.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {myProjects.map(project => (
                    <ProjectCard key={project._id} project={project} onClick={setSelectedProject} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-gray-400">You haven't added any projects yet.</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-4 text-cyan-400 hover:text-cyan-300"
                  >
                    Add your first project →
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search projects..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white 
                           placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Difficulty Filter */}
            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white 
                         focus:outline-none focus:border-cyan-500"
            >
              <option value="">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            {/* Tech Stack Filter */}
            <select
              value={filters.tech}
              onChange={(e) => handleFilterChange('tech', e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white 
                         focus:outline-none focus:border-cyan-500"
            >
              <option value="">All Tech</option>
              {availableTechStacks.map(tech => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" />
                <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400">Failed to load projects. Please try again.</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-gray-400 text-lg">No projects found</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map(project => (
                  <ProjectCard key={project._id} project={project} onClick={setSelectedProject} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.currentPage === 1}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white 
                               disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-400">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={!pagination.hasMore}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white 
                               disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
      {showAddModal && (
        <AddProjectModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  )
}

export default Projects
