import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Starfield from '../components/Starfield';
import { Loader2, Download, X, AlertCircle, CheckCircle2 } from 'lucide-react';

// Use localhost for development, Railway for production
const API_BASE = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api/v1'
    : 'https://dscwoc-production.up.railway.app/api/v1');

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

  const onFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDetectedRole('');

    if (!name.trim()) {
      setError('Full name is required');
      return;
    }
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!githubId.trim()) {
      setError('GitHub ID is required');
      return;
    }
    if (!linkedinId.trim()) {
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
      formData.append('name', name.trim());
      formData.append('email', email.trim());
      formData.append('githubId', githubId.trim());
      formData.append('linkedinId', linkedinId.trim());
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
        } catch (e) {}
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

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = idCardImage;
    a.download = `DSCWoC_2026_${detectedRole || 'ID'}_Card.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    URL.revokeObjectURL(idCardImage);
    setIdCardImage('');
    // Reset form
    setName('');
    setEmail('');
    setGithubId('');
    setLinkedinId('');
    setFile(null);
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-space-black via-midnight-blue to-space-black">
      <Starfield />

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0">
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
                      onChange={(e) => setGithubId(e.target.value)}
                      placeholder="github-username"
                      required
                      className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 hover:border-white/20"
                    />
                    <p className="text-xs text-gray-400">Your GitHub profile username</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-cyan-400">
                      LinkedIn Profile <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={linkedinId}
                      onChange={(e) => setLinkedinId(e.target.value)}
                      placeholder="linkedin-profile-url"
                      required
                      className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 hover:border-white/20"
                    />
                    <p className="text-xs text-gray-400">Your LinkedIn profile username or URL</p>
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
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative max-w-4xl w-full bg-gradient-to-br from-space-black via-midnight-blue to-space-black border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 overflow-hidden animate-scaleIn">
            {/* Close Button */}
            <button
              onClick={handleClosePreview}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500/20 border border-white/20 hover:border-red-500/50 text-white hover:text-red-400 transition-all duration-200 group"
              aria-label="Close preview"
            >
              <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-cyan-500/30 px-8 py-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Your ID Card is Ready!</h2>
                <p className="text-cyan-400 text-sm mt-1">
                  {detectedRole && `Generated as ${detectedRole} • `}
                  High quality • Ready to download
                </p>
              </div>
            </div>

            {/* ID Card Preview */}
            <div className="p-8">
              <div className="relative bg-white/5 rounded-xl p-4 border border-white/10">
                <img
                  src={idCardImage}
                  alt="Generated ID Card"
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-white/10 px-8 py-6 flex gap-4">
              <button
                onClick={handleDownload}
                className="flex-1 inline-flex justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 py-3 font-semibold text-white shadow-lg hover:shadow-cyan-500/50 hover:from-cyan-600 hover:to-cyan-700 transition-all duration-200"
              >
                <Download className="w-5 h-5" />
                Download High Quality PNG
              </button>
              <button
                onClick={handleClosePreview}
                className="px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all duration-200 font-semibold"
              >
                Generate Another
              </button>
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
  );};

export default GenerateId;