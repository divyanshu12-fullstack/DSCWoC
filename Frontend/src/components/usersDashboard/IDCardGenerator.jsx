import { useState } from 'react';
import { Loader2, Download, X, AlertCircle, CheckCircle2, Ticket } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api/v1'
    : 'https://dscwoc-production.up.railway.app/api/v1');

export function IDCardGenerator({ user, isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [idCardImage, setIdCardImage] = useState('');
  const [detectedRole, setDetectedRole] = useState('');
  const [generationsLeft, setGenerationsLeft] = useState(2);

  if (!isOpen) return null;

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

    if (!file) {
      setError('Please upload a profile photo');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', user.fullName);
      formData.append('email', user.email);
      formData.append('githubId', user.github_username);
      formData.append('linkedinId', user.linkedinUrl || '');
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
      
      // Show preview modal
      setIdCardImage(imageUrl);
      setShowPreview(true);
      setSuccess('✅ ID card generated successfully!');
      setFile(null);
      
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
  };

  const handleClose = () => {
    setFile(null);
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-space-black via-midnight-blue to-space-black border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 w-full max-w-md animate-scaleIn">
          
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  Generate ID Card
                </h2>
                <p className="text-cyan-400 text-xs mt-1">Quick ID generation</p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Pre-filled fields (read-only) */}
            <div className="space-y-3 pb-4 border-b border-white/10">
              <div>
                <label className="text-xs text-cyan-400 uppercase tracking-wider">Full Name</label>
                <div className="text-white font-semibold mt-1">{user.fullName}</div>
              </div>
              <div>
                <label className="text-xs text-cyan-400 uppercase tracking-wider">Email</label>
                <div className="text-white font-semibold mt-1 truncate text-sm">{user.email}</div>
              </div>
              <div>
                <label className="text-xs text-cyan-400 uppercase tracking-wider">GitHub</label>
                <div className="text-white font-semibold mt-1">{user.github_username}</div>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-cyan-400">
                Profile Photo <span className="text-red-400">*</span>
              </label>
              <div>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={onFileChange}
                  required
                  className="w-full text-xs text-gray-300 file:mr-2 file:py-2 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gradient-to-r file:from-cyan-500 file:to-cyan-600 file:text-white hover:file:from-cyan-600 hover:file:to-cyan-700 file:cursor-pointer cursor-pointer"
                />
              </div>
              {file && (
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {file.name}
                </p>
              )}
              <p className="text-xs text-gray-400">JPG or PNG, max 2MB</p>
            </div>

            {/* Stats */}
            {/* Generation counter hidden from user view */}

            {/* Messages */}
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
            {success && !showPreview && (
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 py-2.5 font-semibold text-white text-sm shadow-lg hover:shadow-cyan-500/50 hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  Generating...
                </>
              ) : (
                <>Generate ID Card</>
              )}
            </button>

            <p className="text-xs text-center text-gray-400">
              You can also generate from the dedicated ID page for more customization
            </p>
          </form>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-2xl w-full bg-gradient-to-br from-space-black via-midnight-blue to-space-black border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 overflow-hidden">
            
            {/* Close Button */}
            <button
              onClick={handleClosePreview}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500/20 border border-white/20 hover:border-red-500/50 text-white hover:text-red-400 transition-all group"
              aria-label="Close preview"
            >
              <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-cyan-500/30 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Your ID Card is Ready!</h2>
              <p className="text-cyan-400 text-sm mt-1">
                {detectedRole && `Generated as ${detectedRole}`}
              </p>
            </div>

            {/* Preview */}
            <div className="p-6">
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <img
                  src={idCardImage}
                  alt="Generated ID Card"
                  className="w-full h-auto rounded shadow-lg"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-white/10 px-6 py-4 flex gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 inline-flex justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 py-2 font-semibold text-white text-sm shadow-lg hover:shadow-cyan-500/50 hover:from-cyan-600 hover:to-cyan-700 transition-all"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={handleClosePreview}
                className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
