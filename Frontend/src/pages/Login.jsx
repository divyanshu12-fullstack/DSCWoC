import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithGitHub, getCurrentUser } from '../lib/supabase'
import Starfield from '../components/Starfield'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        // Check localStorage for existing user
        const storedUser = localStorage.getItem('user')
        const storedToken = localStorage.getItem('access_token')
        
        // Only redirect if we have BOTH user data AND token
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser)
          // Verify the user data has required fields
          if (userData && userData.id && userData.github_username) {
            navigate('/dashboard')
            return
          } else {
            // Invalid user data, clear it
            localStorage.removeItem('user')
            localStorage.removeItem('access_token')
          }
        }
      } catch (err) {
        console.error('Auth check error:', err)
        // Clear potentially corrupted data
        localStorage.removeItem('user')
        localStorage.removeItem('access_token')
      } finally {
        setCheckingAuth(false)
      }
    }
    
    checkUser()
  }, [navigate])

  const [loginType, setLoginType] = useState(null) // Track which button was clicked

  const handleGitHubLogin = async () => {
    try {
      setLoginType('contributor')
      setLoading(true)
      setError('')
      
      // Clear any existing data before login
      localStorage.removeItem('user')
      localStorage.removeItem('access_token')
      
      await signInWithGitHub('contributor')
      // The redirect will be handled by Supabase
      
    } catch (err) {
      console.error('Login error:', err)
      setError('Failed to sign in with GitHub. Please try again.')
      setLoading(false)
      setLoginType(null)
    }
  }

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-space-black via-midnight-blue to-space-black">
        <Starfield />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-stellar-cyan/20 rounded-full mb-4 animate-pulse">
              <span className="text-2xl">🚀</span>
            </div>
            <p className="text-gray-300">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-space-black via-midnight-blue to-space-black">
      {/* Starfield Background */}
      <Starfield />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-stellar-cyan/20 rounded-full mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome to DSC WoC
              </h1>
              <p className="text-gray-300">
                Sign in to start your open source journey
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Login Buttons */}
            <div className="space-y-4">
              {/* GitHub Login for Contributors */}
              <button
                onClick={handleGitHubLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 hover:border-gray-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                {loading && loginType === 'contributor' ? 'Signing in...' : 'Continue with GitHub'}
              </button>
            </div>

            {/* Info Text */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                New to DSC WoC? Your account will be created automatically when you sign in.
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login