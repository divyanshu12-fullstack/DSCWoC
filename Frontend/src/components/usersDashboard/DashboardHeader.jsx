import { Rocket, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from '../../lib/supabase'

export function DashboardHeader({ avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false)
  const [signOutError, setSignOutError] = useState(null)
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setSignOutLoading(true)
      await signOut()
      localStorage.removeItem('user')
      localStorage.removeItem('access_token')
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      setSignOutError(error.message || 'Logout error')
    } finally {
      setSignOutLoading(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      {signOutError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/10 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-white mb-2">Error</h3>
            <p className="text-red-400 mb-4">{signOutError}</p>
            <button
              onClick={() => setSignOutError(null)}
              className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
              <img
                src="/dscwoc-navbar-logo.png"
                alt="DSCWOC Logo"
                className="object-contain transition-all duration-300 w-15 h-12"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gradient-cosmic">
                DSCWoC - 26
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Contributor Dashboard
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate("/")}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/projects")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => navigate("/leaderboard")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Leaderboard
            </button>
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/30">
                <img
                  src={avatar}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="hidden md:inline bg-red-500/20 hover:bg-red-500/30 text-red-300 px-2 py-2 rounded-lg transition-colors duration-200"
            >
              {signOutLoading ? <LoaderCircle className='animate-spin' /> : <span className="">Logout</span>}
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-1.5 py-1.5 rounded-lg transition-colors duration-200 md:hidden -mr-3"
            >
              {signOutLoading ? <LoaderCircle className='animate-spin' /> : <LogOut size={20}/>}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate("/")}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => navigate("/projects")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Projects
              </button>
              <button
                onClick={() => navigate("/leaderboard")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Leaderboard
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}