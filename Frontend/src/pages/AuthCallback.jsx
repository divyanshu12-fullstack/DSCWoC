import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Starfield from '../components/Starfield'

const AuthCallback = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase automatically handles the OAuth callback
        // We just need to get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          throw sessionError
        }

        if (!session) {
          throw new Error('No session found. Please try logging in again.')
        }

        // Send the session to our backend to create/update user
        const getApiUrl = () => {
          const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL
          
          console.log('Environment check:', {
            VITE_API_URL: import.meta.env.VITE_API_URL,
            VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
            hostname: window.location.hostname,
            envUrl: envUrl
          })
          
          if (envUrl) {
            return String(envUrl).replace(/\/+$/, '').replace(/\/api(?:\/v1)?$/, '')
          }
          
          // For production deployed on Railway
          if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            return 'https://dscwoc-production.up.railway.app'
          }
          
          return 'http://localhost:5000'
        }
        const apiUrl = getApiUrl()
        console.log('Final API URL:', apiUrl)
        
        // Get the intended role from localStorage (set during login)
        const intendedRole = localStorage.getItem('intended_role') || 'contributor'
        console.log('Intended role:', intendedRole)
        
        // Clean up the intended_role from localStorage
        localStorage.removeItem('intended_role')
        
        let response
        try {
          response = await fetch(`${apiUrl}/api/v1/auth/github/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              access_token: session.access_token,
              refresh_token: session.refresh_token,
              intended_role: intendedRole,
            }),
          })
        } catch (fetchError) {
          console.error('Fetch error:', fetchError)
          throw new Error('Cannot connect to server. Please make sure the backend is running on ' + apiUrl)
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Server error: ' + response.status }));
          console.error('Backend error:', errorData);
          
          // Handle specific error for mentor login attempt by non-mentor
          if (response.status === 403) {
            throw new Error(errorData.message || 'You are not authorized to use this login method.');
          }
          
          throw new Error(errorData.message || 'Server error: ' + response.status)
        }

        const result = await response.json()

        if (result.status === 'success') {
          // Store user data in localStorage for the frontend
          localStorage.setItem('user', JSON.stringify(result.data.user))
          localStorage.setItem('access_token', session.access_token)
          
          // Check if there's a mentor request note (user tried mentor login but is contributor)
          if (result.data.mentorRequestNote) {
            localStorage.setItem('auth_notice', result.data.mentorRequestNote)
          }
          
          // Handle admin login attempt
          if (intendedRole === 'admin') {
            if (result.data.user.role !== 'Admin') {
              // User tried admin login but is not an admin
              setError(`Access Denied: You are logged in as "${result.data.user.role}". Only Administrators can access the admin panel.`)
              setLoading(false)
              setTimeout(() => navigate('/admin'), 3000)
              return
            }
            // Admin user - go to admin panel
            navigate('/admin')
            return
          }
          
          // Handle mentor login attempt
          if (intendedRole === 'mentor') {
            if (result.data.user.role === 'Contributor') {
              // Contributor tried mentor login
              setError('Access Denied: You are not authorized as a Mentor. Please use "Continue with GitHub" for contributor login.')
              setLoading(false)
              setTimeout(() => navigate('/login'), 3000)
              return
            }
          }
          
          // Handle contributor login attempt by mentor/admin
          if (intendedRole === 'contributor') {
            if (result.data.user.role === 'Mentor' || result.data.user.role === 'Admin') {
              // Mentor/Admin tried contributor login - that's fine, redirect to their dashboard
              const redirectUrl = result.data.user.role === 'Admin' ? '/admin' : '/mentor/dashboard'
              navigate(redirectUrl)
              return
            }
          }
          
          // Default redirect based on user role
          const redirectUrl = result.data.redirectUrl || '/dashboard'
          navigate(redirectUrl)
        } else {
          throw new Error(result.message || 'Authentication failed')
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        setError(err.message || 'Authentication failed')
        setLoading(false)
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      }
    }

    handleAuthCallback()
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-space-black via-midnight-blue to-space-black">
        <Starfield />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-stellar-cyan/20 rounded-full mb-4 animate-pulse">
              <span className="text-2xl">🚀</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Completing Authentication...
            </h2>
            <p className="text-gray-300">
              Please wait while we set up your account
            </p>
            
            {/* Loading Animation */}
            <div className="mt-6 flex justify-center">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-stellar-cyan rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-stellar-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-stellar-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-space-black via-midnight-blue to-space-black">
        <Starfield />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-md">
            <div className="bg-white/5 backdrop-blur-lg border border-red-500/30 rounded-2xl p-8 shadow-2xl">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
                  <span className="text-2xl">❌</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Authentication Failed
                </h2>
                <p className="text-gray-300 mb-4">
                  {error}
                </p>
                <p className="text-gray-400 text-sm">
                  Redirecting to login page...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default AuthCallback