
import { useEffect, useMemo, useState } from 'react'

/**
 * EventCountdown
 * -----------------
 * Production‑ready countdown timer component
 * - Mobile + desktop optimized
 * - GPU‑friendly animations
 * - Zero unnecessary re‑renders
 * - Theme‑aligned (space / cosmic)
 *
 * Props:
 * - targetTime: ISO string or Date (event start/end time)
 * - title?: string
 * - subtitle?: string
 */

export default function EventCountdown({
  targetTime
}) {
  const target = useMemo(() => new Date(targetTime).getTime(), [targetTime])
  const [now, setNow] = useState(() => Date.now())

  /* -------------------- TIMER LOOP (1s) -------------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  /* -------------------- TIME CALC -------------------- */
  const timeLeft = Math.max(target - now, 0)

  const time = useMemo(() => {
    const totalSeconds = Math.floor(timeLeft / 1000)

    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return { days, hours, minutes, seconds }
  }, [timeLeft])

  const isOver = timeLeft <= 0

  /* -------------------- RENDER -------------------- */
  return (
    <section className="relative w-full">
      {/* Glow Background */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cosmic-purple/20 via-nebula-pink/10 to-stellar-cyan/10 blur-2xl" />

      <div className="relative rounded-2xl p-5 sm:p-8">

        {/* Countdown */}
        {!isOver ? (
          <div className="grid grid-cols-4 gap-3 sm:gap-6">
            <TimeBlock label="Days" value={time.days} />
            <TimeBlock label="Hours" value={time.hours} />
            <TimeBlock label="Minutes" value={time.minutes} />
            <TimeBlock label="Seconds" value={time.seconds} pulse />
          </div>
        ) : (
          <div className="text-center">
            <p className="text-2xl font-bold text-stellar-cyan animate-glow  py-6 rounded-2xl">
              Event Live 🚀
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

/* -------------------- SUB COMPONENT -------------------- */

const TimeBlock = ({ label, value, pulse = false }) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        rounded-xl border border-white/10
        bg-midnight-void/70
        px-2 py-4 sm:px-4 sm:py-6
        transition-transform duration-300
        ${pulse ? 'animate-glow' : ''}
      `}
    >
      <span className="text-2xl sm:text-4xl font-extrabold text-white tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-1 text-[10px] sm:text-xs uppercase tracking-widest text-gray-400">
        {label}
      </span>
    </div>
  )
}
