import { useEffect, useMemo, useState } from 'react';
import { Rocket } from 'lucide-react';

const getTimeLeft = (targetDate) => {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  const clamped = Math.max(diff, 0);

  const days = Math.floor(clamped / (1000 * 60 * 60 * 24));
  const hours = Math.floor((clamped / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((clamped / (1000 * 60)) % 60);
  const seconds = Math.floor((clamped / 1000) % 60);

  return { total: diff, days, hours, minutes, seconds };
};

const LaunchCountdown = ({
  target,
  title = 'Launch Window',
  subtitle = 'Systems locked until launch',
  pillLabel = 'Locked',
  note,
}) => {
  const targetDate = useMemo(
    () => (typeof target === 'string' ? new Date(target) : target),
    [target]
  );

  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const isUnlocked = timeLeft.total <= 0;

  const formatUnit = (value) => String(value).padStart(2, '0');

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cosmic-purple/30 bg-gradient-to-br from-slate-950 via-[#0f162c] to-[#0b1124] p-6 shadow-2xl shadow-cosmic-purple/15">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(circle at 18% 18%, rgba(93, 95, 239, 0.14), transparent 32%), radial-gradient(circle at 78% 8%, rgba(236, 72, 153, 0.18), transparent 30%), radial-gradient(circle at 52% 88%, rgba(34, 211, 238, 0.12), transparent 36%)',
        }}
      ></div>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      <div className="absolute inset-y-4 left-4 w-px bg-gradient-to-b from-cyan-500/60 via-transparent to-nebula-pink/50" />
      <div className="absolute inset-x-4 bottom-3 h-px bg-gradient-to-r from-transparent via-galaxy-violet/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent_25%)] opacity-40" />

      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cosmic-purple to-nebula-pink flex items-center justify-center text-xl shadow-inner shadow-black/40">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/80 font-semibold">{pillLabel}</p>
            <h3 className="text-xl font-semibold text-white leading-tight">{title}</h3>
            <p className="text-sm text-slate-200/90">{subtitle}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${isUnlocked ? 'border-emerald-400/40 text-emerald-200 bg-emerald-500/10' : 'border-cosmic-purple/40 text-cosmic-purple bg-cosmic-purple/10'}`}>
          {isUnlocked ? 'Systems online' : 'T-minus'}
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Days', value: formatUnit(timeLeft.days) },
          { label: 'Hours', value: formatUnit(timeLeft.hours) },
          { label: 'Minutes', value: formatUnit(timeLeft.minutes) },
          { label: 'Seconds', value: formatUnit(timeLeft.seconds) },
        ].map((item) => (
          <div
            key={item.label}
            className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3 text-center shadow-lg shadow-cosmic-purple/15"
          >
            <div className="absolute inset-0 opacity-40" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(34,211,238,0.08))' }}></div>
            <p className="text-3xl font-bold text-white tracking-wide relative">{item.value}</p>
            <p className="text-[11px] text-cyan-100/80 uppercase tracking-[0.2em] relative">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="relative mt-4 text-xs text-slate-200/80 leading-relaxed">
        {note || 'Local time is used for this countdown. Systems unlock automatically at T0.'}
      </div>
    </div>
  );
};

export default LaunchCountdown;
