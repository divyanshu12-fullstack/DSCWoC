import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Rocket } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const navItems = [
    { name: 'Home', action: () => handleNavClick('home') },
    { name: 'About', action: () => handleNavClick('about') },
    { name: 'Timeline', action: () => handleNavClick('timeline') },
    { name: 'Projects', path: '/projects' },
    { name: 'Guidelines', path: '/guidelines' },
    { name: 'Rewards', action: () => handleNavClick('benefits') },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-effect border-b border-white/10 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center relative">
        
        {/* --- LEFT: Logo --- */}
        <Link to="/" className="flex items-center gap-2 group z-20">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cosmic-purple to-nebula-blue flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cosmic-purple/50 transition-all">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">DSC<span className="text-cosmic-purple">WoC</span></span>
        </Link>

        {/* --- CENTER: Nav Links (Absolute Position for perfect centering) --- */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {navItems.map((item) => (
            item.path ? (
              <Link 
                key={item.name} 
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-cosmic-purple ${location.pathname === item.path ? 'text-cosmic-purple' : 'text-gray-300'}`}
              >
                {item.name}
              </Link>
            ) : (
              <button
                key={item.name}
                onClick={item.action}
                className="text-sm font-medium text-gray-300 hover:text-cosmic-purple transition-colors bg-transparent border-none cursor-pointer"
              >
                {item.name}
              </button>
            )
          ))}
        </div>

        {/* --- RIGHT: CTA & Mobile Toggle --- */}
        <div className="flex items-center gap-4 z-20">
          <Link to="/register" className="hidden md:block retro-button bg-gradient-to-r from-cosmic-purple to-nebula-blue px-6 py-2 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-cosmic-purple/30 transition-all transform hover:-translate-y-0.5 text-white">
            JOIN MISSION
          </Link>

          {/* Mobile Toggle Button */}
          <button className="md:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass-effect border-b border-white/10 animate-fade-in bg-[#0B0F1A]/95 backdrop-blur-xl">
          <div className="flex flex-col p-4 space-y-4">
            {navItems.map((item) => (
              item.path ? (
                <Link 
                  key={item.name} 
                  to={item.path}
                  className={`text-base font-medium p-2 rounded-lg ${location.pathname === item.path ? 'bg-white/10 text-cosmic-purple' : 'text-gray-300'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ) : (
                <button
                  key={item.name}
                  onClick={item.action}
                  className="text-left text-base font-medium text-gray-300 p-2 rounded-lg hover:bg-white/5"
                >
                  {item.name}
                </button>
              )
            ))}
            <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-center bg-cosmic-purple text-white py-3 rounded-xl font-bold">
              JOIN MISSION
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;