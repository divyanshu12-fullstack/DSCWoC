const Footer = () => {
  return (
    <footer className="relative py-12 px-6 border-t border-cosmic-purple/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cosmic-purple to-nebula-pink glow-effect"></div>
              <span className="text-xl font-bold text-white">DSC Winter of Code</span>
            </div>
            <p className="text-gray-400 text-sm">
              Empowering students through open-source contributions and mentorship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Timeline', 'Tracks', 'Projects', 'Rewards'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-cosmic-purple transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
            <div className="flex gap-4">
              {['GitHub', 'Twitter', 'Discord', 'LinkedIn'].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="w-10 h-10 rounded-full glass-effect flex items-center justify-center text-cosmic-purple hover:bg-cosmic-purple hover:text-white transition-all duration-300"
                  aria-label={platform}
                >
                  {platform[0]}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-cosmic-purple/10 text-center text-gray-400 text-sm">
          <p>© 2025 DSC Community. All rights reserved. Built with 💜 for open source.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
