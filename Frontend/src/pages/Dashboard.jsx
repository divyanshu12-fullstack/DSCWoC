import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from '../lib/supabase'
import { useLeaderboard, useBadges } from '../hooks/useApi'
import Starfield from '../components/Starfield'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  
  // Fetch leaderboard data
  const { data: leaderboardData, isLoading: leaderboardLoading } = useLeaderboard(1, 100)
  // Fetch badges
  const { data: badgesData, isLoading: badgesLoading } = useBadges()

  // Get user's rank from leaderboard
  const getUserRank = () => {
    if (!leaderboardData?.users || !user?.id) return 'N/A'
    const rankIndex = leaderboardData.users.findIndex(u => u._id === user.id)
    return rankIndex >= 0 ? rankIndex + 1 : 'N/A'
  }

  // Get user's badges
  const getUserBadges = () => {
    if (!user?.badges || !badgesData?.badges) return []
    return badgesData.badges.filter(badge => 
      user.badges.includes(badge._id)
    )
  }

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user')
    const accessToken = localStorage.getItem('access_token')
    
    if (userData && accessToken) {
      try {
        const parsedUser = JSON.parse(userData)
        // Verify user data has required fields
        if (parsedUser && parsedUser.id && parsedUser.github_username) {
          setUser(parsedUser)
          setLoading(false)
          return
        }
      } catch (err) {
        console.error('Error parsing user data:', err)
      }
    }
    
    // Clear invalid data and redirect to login
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    setLoading(false)
    navigate('/login', { replace: true })
  }, [navigate])

  const handleLogout = async () => {
    try {
      await signOut()
      localStorage.removeItem('user')
      localStorage.removeItem('access_token')
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-space-black via-midnight-blue to-space-black">
        <Starfield />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-space-black via-midnight-blue to-space-black">
      <Starfield />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/5 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <img
                  src={user.avatar_url}
                  alt={user.fullName}
                  className="w-10 h-10 rounded-full border-2 border-stellar-cyan"
                />
                <div>
                  <h1 className="text-xl font-bold text-white">
                    Welcome, {user.fullName}
                  </h1>
                  <p className="text-gray-300 text-sm">
                    Role: {user.role}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <div className="flex items-center">
                <div className="p-2 bg-stellar-cyan/20 rounded-lg">
                  <span className="text-stellar-cyan text-xl">📝</span>
                </div>
                <div className="ml-4">
                  <p className="text-gray-300 text-sm">Total PRs</p>
                  <p className="text-2xl font-bold text-white">{user.stats?.totalPRs || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <span className="text-green-400 text-xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-gray-300 text-sm">Merged PRs</p>
                  <p className="text-2xl font-bold text-white">{user.stats?.mergedPRs || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <div className="flex items-center">
                <div className="p-2 bg-cosmic-purple/20 rounded-lg">
                  <span className="text-cosmic-purple text-xl">⭐</span>
                </div>
                <div className="ml-4">
                  <p className="text-gray-300 text-sm">Points</p>
                  <p className="text-2xl font-bold text-white">{user.stats?.points || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <span className="text-yellow-400 text-xl">🏆</span>
                </div>
                <div className="ml-4">
                  <p className="text-gray-300 text-sm">Rank</p>
                  <p className="text-2xl font-bold text-white">
                    {leaderboardLoading ? '...' : `#${getUserRank()}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Badges Section */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Your Badges</h2>
            {badgesLoading ? (
              <p className="text-gray-400">Loading badges...</p>
            ) : getUserBadges().length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {getUserBadges().map((badge) => (
                  <div
                    key={badge._id}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 text-center"
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <h3 className="font-medium text-white text-sm">{badge.name}</h3>
                    <p className="text-gray-400 text-xs mt-1">{badge.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No badges earned yet. Start contributing to earn your first badge!</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => navigate('/projects')}
                className="bg-stellar-cyan/20 hover:bg-stellar-cyan/30 text-stellar-cyan border border-stellar-cyan/30 rounded-lg p-4 text-left transition-colors duration-200"
              >
                <h3 className="font-medium mb-2">Submit PR</h3>
                <p className="text-sm opacity-80">Submit a new pull request for validation</p>
              </button>
              
              <button 
                onClick={() => navigate('/projects')}
                className="bg-nebula-blue/20 hover:bg-nebula-blue/30 text-nebula-blue border border-nebula-blue/30 rounded-lg p-4 text-left transition-colors duration-200"
              >
                <h3 className="font-medium mb-2">View Projects</h3>
                <p className="text-sm opacity-80">Browse available projects to contribute</p>
              </button>
              
              <button 
                onClick={() => navigate('/rewards')}
                className="bg-cosmic-purple/20 hover:bg-cosmic-purple/30 text-cosmic-purple border border-cosmic-purple/30 rounded-lg p-4 text-left transition-colors duration-200"
              >
                <h3 className="font-medium mb-2">Leaderboard</h3>
                <p className="text-sm opacity-80">Check your ranking among contributors</p>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard