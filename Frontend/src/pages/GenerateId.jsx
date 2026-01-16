import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Starfield from '../components/Starfield';
import { Loader2, Download, X, AlertCircle, CheckCircle2 } from 'lucide-react';

// Use Railway production backend or localhost for development
const API_BASE = (() => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
  
  if (envUrl) {
    // Use the environment variable if set
    return envUrl.endsWith('/api/v1') ? envUrl : `${envUrl}/v1`;
  }
  
  // For production deployed on Railway
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://dscwoc-production.up.railway.app/api/v1';
  }
  
  // Default to localhost for development
  return 'http://localhost:5000/api/v1';
})();

// Utility functions for input sanitization and URL extraction
const sanitizeInput = (input) => {
  if (!input) return '';
  // Remove HTML tags and trim
  return input.replace(/<[^>]*>/g, '').trim();
};

const extractGithubUsername = (input) => {
  if (!input) return '';
  const sanitized = sanitizeInput(input);

  // Check if it's a URL
  if (sanitized.includes('github.com/')) {
    try {
      // Extract username from URL like: https://github.com/username or github.com/username
      const match = sanitized.match(/github\.com\/([a-zA-Z0-9_-]+)/);
      return match ? match[1] : sanitized;
    } catch (e) {
      return sanitized;
    }
  }

  // Return as-is if it's already just a username
  return sanitized;
};

const extractLinkedinUsername = (input) => {
  if (!input) return '';
  const sanitized = sanitizeInput(input);

  // Check if it's a URL
  if (sanitized.includes('linkedin.com/')) {
    try {
      // Extract username from URL like: https://linkedin.com/in/username or linkedin.com/in/username
      const match = sanitized.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/);
      return match ? match[1] : sanitized;
    } catch (e) {
      return sanitized;
    }
  }

  // Return as-is if it's already just a username
  return sanitized;
};

const GenerateId = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [githubId, setGithubId] = useState('');
  const [linkedinId, setLinkedinId] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [idCardImage, setIdCardImage] = useState('');
  const [detectedRole, setDetectedRole] = useState('');
  const [generationsLeft, setGenerationsLeft] = useState(2);
  const [downloading, setDownloading] = useState(false);

  const onFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
    setError('');
    setSuccess('');
  };

  const handleGithubChange = (e) => {
    const value = e.target.value;
    setGithubId(value);
  };

  const handleGithubBlur = () => {
    // Extract username when user leaves the field
    const extracted = extractGithubUsername(githubId);
    if (extracted !== githubId) {
      setGithubId(extracted);
    }
  };

  const handleLinkedinChange = (e) => {
    const value = e.target.value;
    setLinkedinId(value);
  };

  const handleLinkedinBlur = () => {
    // Extract username when user leaves the field
    const extracted = extractLinkedinUsername(linkedinId);
    if (extracted !== linkedinId) {
      setLinkedinId(extracted);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDetectedRole('');

    // Sanitize all inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedGithub = extractGithubUsername(githubId);
    const sanitizedLinkedin = extractLinkedinUsername(linkedinId);

    if (!sanitizedName) {
      setError('Full name is required');
      return;
    }
    if (!sanitizedEmail) {
      setError('Email is required');
      return;
    }
    if (!sanitizedGithub) {
      setError('GitHub ID is required');
      return;
    }
    if (!sanitizedLinkedin) {
      setError('LinkedIn ID is required');
      return;
    }
    if (!file) {
      setError('Please upload a JPG or PNG photo (≤ 2MB).');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', sanitizedName);
      formData.append('email', sanitizedEmail);
      formData.append('githubId', sanitizedGithub);
      formData.append('linkedinId', sanitizedLinkedin);
      formData.append('photo', file);

      const res = await fetch(`${API_BASE}/id/generate`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        let errMsg = 'Generation failed';
        try {
          const msg = await res.json();
          errMsg = msg?.message || errMsg;
          // Extract generations left from response
          if (msg?.generationsLeft !== undefined) {
            setGenerationsLeft(msg.generationsLeft);
          }
        } catch (e) { }
        throw new Error(errMsg);
      }

      // Get role from response headers
      const role = res.headers.get('X-User-Role') || 'Contributor';
      const genLeft = res.headers.get('X-Generations-Left');

      setDetectedRole(role);
      if (genLeft) {
        setGenerationsLeft(parseInt(genLeft));
      }

      const blob = await res.blob();
      const imageUrl = URL.createObjectURL(blob);

      // Show preview modal instead of instant download
      setIdCardImage(imageUrl);
      setShowPreview(true);
      setSuccess('✅ ID card generated successfully!');

    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Small delay to show feedback
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const a = document.createElement('a');
      a.href = idCardImage;
      a.download = `DSCWoC_2026_${detectedRole || 'ID'}_Card.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      
      // Keep loading state for a moment so user sees the feedback
      await new Promise(resolve => setTimeout(resolve, 300));
    } finally {
      setDownloading(false);
    }
  };

  const handleClosePreview = useCallback(() => {
    setShowPreview(false);
    if (idCardImage) {
      URL.revokeObjectURL(idCardImage);
    }
    setIdCardImage('');
    setName('');
    setEmail('');
    setGithubId('');
    setLinkedinId('');
    setFile(null);
  }, [idCardImage]);

  useEffect(() => {
    if (!showPreview) return;
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handleClosePreview();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showPreview, handleClosePreview]);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-space-black via-midnight-blue to-space-black">
      <Starfield />

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/5 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-semibold">DSCWoC 2026</p>
                <h1 className="text-2xl font-bold text-white mt-1">Generate ID Card</h1>
              </div>
              <button
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm font-medium"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Info Section */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-3">📋 About ID Cards</h2>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Generate your official DSCWoC 2026 ID card with your profile information and QR code for verification.
                  </p>
                </div>
                <div className="bg-white/5 border border-cyan-500/30 rounded-lg p-4">
                  <h3 className="text-cyan-400 font-semibold mb-2">✨ What You'll Get</h3>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>✓ Official ID card PNG</li>
                    <li>✓ Unique auth key</li>
                    <li>✓ QR verification code</li>
                    <li>✓ Profile information</li>
                    <li>✓ Role-based design</li>
                  </ul>
                </div>
                {detectedRole && (
                  <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-4">
                    <h3 className="text-cyan-400 font-semibold mb-2">Your Role</h3>
                    <p className="text-white text-lg font-bold">{detectedRole}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-8 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-cyan-400">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 hover:border-white/20"
                    />
                    <p className="text-xs text-gray-400">As it will appear on your ID card</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-cyan-400">
                      Registration Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 hover:border-white/20"
                    />
                    <p className="text-xs text-gray-400">The email you registered with - your role will be detected automatically</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-cyan-400">
                      GitHub Username <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={githubId}
                      onChange={handleGithubChange}
                      onBlur={handleGithubBlur}
                      placeholder="username or https://github.com/username"
                      required
                      className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 hover:border-white/20"
                    />
                    <p className="text-xs text-gray-400">Paste GitHub URL or username - we'll extract it automatically</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-cyan-400">
                      LinkedIn Profile <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={linkedinId}
                      onChange={handleLinkedinChange}
                      onBlur={handleLinkedinBlur}
                      placeholder="username or https://linkedin.com/in/username"
                      required
                      className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 hover:border-white/20"
                    />
                    <p className="text-xs text-gray-400">Paste LinkedIn URL or username - we'll extract it automatically</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-cyan-400">
                      Profile Photo <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={onFileChange}
                        required
                        className="w-full text-sm text-gray-300 file:mr-3 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-cyan-500 file:to-cyan-600 file:text-white hover:file:from-cyan-600 hover:file:to-cyan-700 file:cursor-pointer cursor-pointer transition-all duration-200"
                      />
                    </div>
                    <p className="text-xs text-gray-400">JPG or PNG, max 2MB. Clear headshot with good lighting</p>
                  </div>

                  {error && (
                    <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-200 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  {success && !showPreview && (
                    <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-200 flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      <span>{success}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 py-3 font-semibold text-white shadow-lg hover:shadow-cyan-500/50 hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5" />
                        Generating your ID...
                      </>
                    ) : (
                      <>
                        Generate ID Card
                      </>
                    )}
                  </button>

                  {loading && (
                    <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-4 py-3 text-sm text-cyan-200 flex items-center gap-3 animate-pulse">
                      <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
                      <span>Your ID card is being generated, please wait...</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={handleClosePreview}
        >
          <div className="flex min-h-[100dvh] items-center justify-center px-4 py-6">
            <div
              className="relative max-w-4xl w-full bg-gradient-to-br from-space-black via-midnight-blue to-space-black border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 overflow-hidden animate-scaleIn max-h-[calc(100vh-4rem)]"
              onClick={(event) => event.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleClosePreview}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500/20 border border-white/20 hover:border-red-500/50 text-white hover:text-red-400 transition-all duration-200 group"
                aria-label="Close preview"
              >
                <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>

              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-cyan-500/30 px-8 py-6 flex-shrink-0">
                <div>
                  <h2 className="text-2xl font-bold text-white">Your ID Card is Ready!</h2>
                  <p className="text-cyan-400 text-sm mt-1">
                    {detectedRole && `Generated as ${detectedRole} • `}
                    High quality • Ready to download
                  </p>
                </div>
              </div>

              {/* ID Card Preview */}
              <div className="p-8 overflow-y-auto flex-1">
                <div className="relative bg-white/5 rounded-xl p-4 border border-white/10">
                  <img
                    src={idCardImage}
                    alt="Generated ID Card"
                    className="w-full h-auto rounded-lg shadow-2xl object-contain"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-white/10 px-8 py-6 flex gap-4 flex-shrink-0">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex-1 inline-flex justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 py-3 font-semibold text-white shadow-lg hover:shadow-cyan-500/50 hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-200"
                >
                  {downloading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download High Quality PNG
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default GenerateId;
