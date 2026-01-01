import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '/about', isRoute: true },
    { name: 'Timeline', href: '#timeline' },
    { name: 'Tracks', href: '#tracks' },
    { name: 'Projects', href: '#projects' },
    { name: 'Rewards', href: '/rewards', isRoute: true },
    { name: 'FAQ', href: '/faq', isRoute: true },
    { name: 'Contact', href: '/contact', isRoute: true }
  ];

  const handleNavClick = (item) => {
    if (item.isRoute) {
      navigate(item.href);
    } else {
      // Smooth scroll to section
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
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

  const handleJoinMission = () => {
    if (user) {
      // Redirect based on role
      switch (user.role) {
        case 'Admin':
          navigate('/admin');
          break;
        case 'Mentor':
          navigate('/mentor/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-effect shadow-lg shadow-cosmic-purple/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
        {/* Logo */}
        <div 
          className={`flex items-center space-x-2 cursor-pointer transition-all duration-300 ${
            scrolled 
              ? 'w-12 h-12 sm:w-16 sm:h-16' 
              : 'w-24 h-24 sm:w-40 sm:h-40'
          }`}
          onClick={() => navigate('/')}
        >
          <img 
            src="/clubLogo.png" 
            alt="DSC Club Logo" 
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
          />
          <span className="text-lg sm:text-xl font-bold text-white">DSC WoC</span>
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
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar_url}
                alt={user.fullName}
                className="w-8 h-8 rounded-full border-2 border-stellar-cyan"
              />
              <span className="text-white text-sm">{user.fullName}</span>
              <button
                onClick={handleJoinMission}
                className="retro-button bg-gradient-to-r from-cosmic-purple to-nebula-pink hover:from-galaxy-violet hover:to-nebula-pink text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cosmic-purple/50 hover:-translate-y-0.5"
              >
                DASHBOARD
              </button>
            </div>
          ) : (
            <button
              onClick={handleJoinMission}
              className="retro-button bg-gradient-to-r from-cosmic-purple to-nebula-pink hover:from-galaxy-violet hover:to-nebula-pink text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cosmic-purple/50 hover:-translate-y-0.5"
            >
              Sign IN
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          {/* Overlay to prevent body scroll */}
          <div className="fixed inset-0 bg-black/50 md:hidden" style={{ top: '64px', zIndex: 40 }} />
          
          <div className="md:hidden glass-effect border-t border-cosmic-purple/20 absolute top-full left-0 right-0 w-screen" style={{ zIndex: 45 }}>
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className="block w-full text-left text-gray-300 hover:text-cosmic-purple transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-cosmic-purple/10"
                >
                  {item.name}
                </button>
              ))}
              
              {user ? (
                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={user.avatar_url}
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full border-2 border-stellar-cyan"
                    />
                    <span className="text-white text-sm">{user.fullName}</span>
                  </div>
                  <button
                    onClick={handleJoinMission}
                    className="w-full retro-button bg-gradient-to-r from-cosmic-purple to-nebula-pink text-white px-6 py-2.5 rounded-full font-semibold"
                  >
                    DASHBOARD
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleJoinMission}
                  className="w-full retro-button bg-gradient-to-r from-cosmic-purple to-nebula-pink text-white px-6 py-2.5 rounded-full font-semibold mt-3"
                >
                  JOIN MISSION
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
