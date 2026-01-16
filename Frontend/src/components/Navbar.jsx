import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../lib/supabase';

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Failed to parse stored user data', error);
    return null;
  }
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [shrinkProgress, setShrinkProgress] = useState(0); // 0 -> not scrolled, 1 -> fully shrunk
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(() => readStoredUser());
  const navigate = useNavigate();

  const getDashboardPathForUser = (user) => {
    if (!user) return '/login';
    switch (user.role) {
      case 'Admin':
        return '/admin';
      case 'Mentor':
        return '/mentor/dashboard';
      default:
        return '/dashboard';
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const start = 10; // when shrinking starts
      const end = 150; // when fully shrunk (reduced from 220)
      const prog = Math.min(1, Math.max(0, (y - start) / (end - start)));
      setShrinkProgress(prog);
      setScrolled(y > start);
    };

    const handleStorage = (event) => {
      if (event.key === 'user') {
        try {
          setUser(event.newValue ? JSON.parse(event.newValue) : null);
        } catch {
          setUser(null);
        }
      }
    };

    const handleAuthChanged = () => {
      setUser(readStoredUser());
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('auth:changed', handleAuthChanged);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('auth:changed', handleAuthChanged);
    };
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '/about', isRoute: true },
    { name: 'Guidelines', href: '/guidelines', isRoute: true },
    { name: 'Timeline', href: '#timeline' },
    { name: 'Projects', href: '/projects', isRoute: true },
    { name: 'Leaderboard', href: '/leaderboard', isRoute: true },
    { name: 'Rewards', href: '/rewards', isRoute: true },
    { name: 'Resources', href: '/resources', isRoute: true },
    { name: 'FAQ', href: '/faq', isRoute: true },
    { name: 'Contact', href: '/contact', isRoute: true }
  ];

  const handleNavClick = (item) => {
    if (item.isRoute) {
      navigate(item.href);
    } else {
      // For hash links, check if element exists on current page
      const element = document.querySelector(item.href);
      if (element) {
        // Element exists on current page, scroll to it
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Element doesn't exist on current page (e.g., scrolling to #timeline from /about)
        // Navigate to home first, then scroll
        navigate('/');
        setTimeout(() => {
          const targetElement = document.querySelector(item.href);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100); // Small delay to ensure page loads
      }
    }
    setMobileMenuOpen(false);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'auto';
    }

    return () => {
      document.documentElement.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  const handleDashboardClick = () => {
    navigate(getDashboardPathForUser(user));
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('intended_role');
      setUser(null);
      setMobileMenuOpen(false);
      window.dispatchEvent(new Event('auth:changed'));
      navigate('/');
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'glass-effect shadow-lg shadow-cosmic-purple/10'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
        {/* Logo - Responsive sizing with Tailwind */}
        <div className="relative flex items-center">
          {/* Base logo container - scales with Tailwind */}
          <div
            className="flex items-center cursor-pointer transition-all duration-300"
            onClick={() => navigate('/')}
            style={{
              transform: `scale(${1 - 0.08 * shrinkProgress})`, // Barely shrinks to 92% on scroll
              transformOrigin: 'left center'
            }}
          >
            <img
              src="/dscwoc-navbar-logo.png"
              alt="DSCWOC Logo"
              className="object-contain transition-all duration-300 w-20 sm:w-24 md:w-28 lg:w-32"
            />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white p-2 hover:text-cosmic-purple transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item)}
              className="text-gray-300 hover:text-cosmic-purple transition-colors duration-200 relative group"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cosmic-purple to-nebula-pink group-hover:w-full transition-all duration-300"></span>
            </button>
          ))}
        </div>

        {/* Desktop User Section */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="retro-button border-2 border-nebula-pink text-white hover:bg-nebula-pink/15 px-5 py-2 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-nebula-pink/40 hover:-translate-y-0.5 cosmic-glow"
            >
              LOGOUT
            </button>
          ) : (
            <button
              onClick={handleDashboardClick}
              className="retro-button border-2 border-cosmic-purple text-white hover:bg-cosmic-purple/15 px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-lg shadow-cosmic-purple/20 hover:shadow-xl hover:shadow-cosmic-purple/45 hover:-translate-y-0.5 cosmic-glow"
            >
              DASHBOARD
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          {/* Overlay to prevent body scroll */}
          <div
            className="fixed inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/95 md:hidden"
            style={{ top: '64px', zIndex: 40 }}
          />

          <div
            className="md:hidden glass-effect glass-panel mobile-menu-panel absolute top-full left-0 right-0 w-screen"
            style={{ zIndex: 45 }}
          >
            <div className="px-4 pb-4 pt-2 space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className="block w-full text-left menu-item hover:text-cosmic-purple transition-colors duration-200 py-3 px-3 rounded-lg hover:bg-white/10"
                >
                  {item.name}
                </button>
              ))}

              {user ? (
                <div className="pt-3 border-t border-white/10">
                  <button
                    onClick={handleLogout}
                    className="w-full retro-button border-2 border-nebula-pink text-white hover:bg-nebula-pink/15 px-6 py-2.5 rounded-full font-semibold cosmic-glow"
                  >
                    LOGOUT
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleDashboardClick}
                  className="w-full retro-button border-2 border-cosmic-purple text-white hover:bg-cosmic-purple/15 px-6 py-2.5 rounded-full font-semibold mt-3 cosmic-glow"
                >
                  DASHBOARD
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
