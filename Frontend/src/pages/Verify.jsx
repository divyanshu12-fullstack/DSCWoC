import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_VERIFY_URL || 'https://dscwoc-production.up.railway.app/verify';

const Verify = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState({ loading: true });

  useEffect(() => {
    const id = params.get('id');
    if (!id) {
      setStatus({ loading: false, valid: false, message: 'Missing id parameter' });
      return;
    }

    const run = async () => {
      try {
        const res = await fetch(`${API_BASE}?id=${encodeURIComponent(id)}`);
        const data = await res.json();
        setStatus({ loading: false, ...data });
      } catch (err) {
        setStatus({ loading: false, valid: false, message: 'Verification failed' });
      }
    };
    run();
  }, [params]);

  const { loading, valid, name, role, github, linkedin, message } = status;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300 mb-2">DSWC ID Verification</p>
        <h1 className="text-3xl font-bold mb-4">Verify ID</h1>

        {loading && <p className="text-slate-300">Checking authenticity…</p>}

        {!loading && (
          <div className="space-y-4">
            <div className={`rounded-xl p-4 border ${valid ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-red-500/40 bg-red-500/10'}`}>
              <p className="text-lg font-semibold flex items-center gap-2">
                {valid ? '✅ Valid ID' : '❌ Invalid ID'}
              </p>
              {message && <p className="text-sm text-slate-200 mt-1">{message}</p>}
            </div>

            {valid && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Name</p>
                  <p className="text-lg font-semibold">{name}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Role</p>
                  <p className="text-lg font-semibold">{role}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">GitHub</p>
                  <p className="text-lg font-semibold break-all">{github || '—'}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">LinkedIn</p>
                  <p className="text-lg font-semibold break-all">{linkedin || '—'}</p>
                </div>
              </div>
            )}

            <div className="pt-2">
              <Link to="/" className="text-cyan-300 hover:text-cyan-200 text-sm">Back to home</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
