import { useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'https://dscwoc-production.up.railway.app/api/v1';

const GenerateId = () => {
  const [email, setEmail] = useState('');
  const [linkedinId, setLinkedinId] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Email is required');
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
      formData.append('photo', file);
      formData.append('email', email.trim());
      formData.append('linkedinId', linkedinId.trim());

      const res = await fetch(`${API_BASE}/id/generate`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg?.message || 'Generation failed');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'DSWC_ID.png';
      a.click();
      URL.revokeObjectURL(url);
      setSuccess('ID card generated. Download started.');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">DSCWoC ID System</p>
            <h1 className="text-3xl font-bold mt-2">Generate ID Card</h1>
            <p className="text-slate-300 mt-2">Upload your photo and provide your registration email and LinkedIn ID to generate your official ID.</p>
          </div>
          <Link to="/" className="text-cyan-300 hover:text-cyan-200 text-sm">Back home</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-cyan-300">
              Registration Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              required
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
            />
            <p className="text-xs text-slate-400">Use the email you registered with for DSCWoC 2026</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-cyan-300">
              LinkedIn ID <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={linkedinId}
              onChange={(e) => setLinkedinId(e.target.value)}
              placeholder="e.g., john-doe-123"
              required
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
            />
            <p className="text-xs text-slate-400">Your LinkedIn profile ID (the part after linkedin.com/in/)</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-cyan-300">
              Profile Photo <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={onFileChange}
                required
                className="w-full text-sm text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 file:cursor-pointer cursor-pointer"
              />
            </div>
            <p className="text-xs text-slate-400">JPG or PNG, max 2MB. Use a clear headshot with good lighting.</p>
          </div>

          {error && <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-100 flex items-start gap-2">
            <span className="text-lg">⚠️</span>
            <span>{error}</span>
          </div>}
          {success && <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-100 flex items-start gap-2">
            <span className="text-lg">✅</span>
            <span>{success}</span>
          </div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-4 font-semibold text-lg shadow-lg hover:shadow-cyan-500/50 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Generating your ID...
              </>
            ) : (
              <>
                🎨 Generate & Download ID Card
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GenerateId;
