import { Github, Linkedin, Mail, Instagram } from 'lucide-react';
const Footer = () => {
  return (
    <footer className="relative py-12 px-6 border-t border-cosmic-purple/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src="/dscwoc-navbar-logo.png" alt="DSCWOC" className="w-20 h-auto sm:w-28" />
            </div>
            <p className="text-gray-400 text-sm">
              Empowering students through open-source contributions and mentorship.
            </p>
            <div className="mt-4">
              <div className="text-cosmic-purple font-semibold text-sm">Data Science Club, VIT Bhopal — building makers & contributors.</div>
              <div className="mt-2 flex items-center gap-3 text-gray-400 text-xs">
                <span>📧 dsc.vitb@vitbhopal.ac.in</span>
                <span>•</span>
                <span>📍 VIT Bhopal</span>
              </div>
            </div>
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
              {[
                { name: 'GitHub', icon: Github, url: 'https://github.com/cdsvitbhopal', color: 'hover:text-white' },
                { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/data-science-club-vit-bhopal-5b9b02232/', color: 'hover:text-blue-500' },
                { name: 'Email', icon: Mail, url: 'mailto:dsc.vitb@vitbhopal.ac.in', color: 'hover:text-pink-400' },
                { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/dsc_vitb/', color: 'hover:text-pink-500' }
              ].map(({ name, icon: Icon, url, color }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full glass-effect flex items-center justify-center text-cosmic-purple ${color} transition-all duration-300 hover:glow-effect`}
                  aria-label={name}
                  title={name}
                >
                  <Icon size={20} />
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
