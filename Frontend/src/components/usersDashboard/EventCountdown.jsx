import { useEffect, useState, useMemo } from "react";
import { Rocket, Sparkles, Clock } from "lucide-react";

function calculateTimeLeft(targetDate) {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const difference = target - now;

  if (difference <= 0) {
    return null;
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function getInitialStatus(eventStartDate, eventEndDate) {
  if (!(eventStartDate instanceof Date) || isNaN(eventStartDate.getTime()) ||
    !(eventEndDate instanceof Date) || isNaN(eventEndDate.getTime())) {
    return "ended";
  }

  const now = new Date().getTime();
  const start = eventStartDate.getTime();
  const end = eventEndDate.getTime();

  if (now < start) return "notStarted";
  if (now >= start && now < end) return "inProgress";
  return "ended";
}

function TimeUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="countdown-digit min-w-[60px] md:min-w-[80px] text-center">
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-xs md:text-sm text-muted-foreground mt-2 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export function EventCountdown({ eventStartDate, eventEndDate }) {
  const initialStatus = useMemo(
    () => getInitialStatus(eventStartDate, eventEndDate),
    [eventStartDate, eventEndDate]
  );

  const [status, setStatus] = useState(initialStatus);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!(eventStartDate instanceof Date) || isNaN(eventStartDate.getTime()) ||
      !(eventEndDate instanceof Date) || isNaN(eventEndDate.getTime())) {
      return;
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const start = eventStartDate.getTime();
      const end = eventEndDate.getTime();

      if (now < start) {
        setStatus("notStarted");
        setTimeLeft(calculateTimeLeft(eventStartDate));
      } else if (now >= start && now < end) {
        setStatus("inProgress");
        setTimeLeft(calculateTimeLeft(eventEndDate));
      } else {
        setStatus("ended");
        setTimeLeft(null);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [eventStartDate, eventEndDate]);

  if (status === "ended") {
    return (
      <div className="glass-card p-6 md:p-8 text-center relative overflow-hidden bg-gradient-to-br from-cosmic-purple/10 via-nebula-pink/10 to-stellar-cyan/10">
        <div className="absolute inset-0 bg-gradient-to-r from-cosmic-purple/20 via-nebula-pink/20 to-stellar-cyan/20 animate-pulse" />
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <h3 className="text-2xl md:text-3xl font-bold text-gradient-cosmic">
              Event Ended!
            </h3>
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground">
            Winter of Code has concluded. Thank you for participating!
          </p>
        </div>
      </div>
    );
  }

  if (status === "notStarted" && timeLeft) {
    return (
      <div className="glass-card p-6 md:p-8 glow-border relative overflow-hidden bg-gradient-to-br from-cosmic-purple/10 via-nebula-pink/10 to-stellar-cyan/10">
        <div className="absolute inset-0 bg-gradient-to-r from-cosmic-purple/5 via-nebula-pink/5 to-stellar-cyan/5" />
        <div className="absolute top-4 right-4 opacity-20">
          <Clock className="w-16 h-16 text-primary animate-float" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <h3 className="text-lg md:text-xl font-semibold text-foreground">
              Event Starts In
            </h3>
          </div>

          <div className="flex items-center justify-center gap-2 md:gap-4">
            <TimeUnit value={timeLeft.days} label="Days" />
            <span className="text-2xl md:text-4xl font-bold text-primary self-start mt-2 md:mt-3">:</span>
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <span className="text-2xl md:text-4xl font-bold text-primary self-start mt-2 md:mt-3">:</span>
            <TimeUnit value={timeLeft.minutes} label="Mins" />
            <span className="text-2xl md:text-4xl font-bold text-primary self-start mt-2 md:mt-3">:</span>
            <TimeUnit value={timeLeft.seconds} label="Secs" />
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Get ready for an amazing coding journey! ✨
          </p>
        </div>
      </div>
    );
  }

  if (status === "inProgress" && timeLeft) {
    return (
      <div className="glass-card p-6 md:p-8 glow-border relative overflow-hidden bg-gradient-to-br from-cosmic-purple/10 via-nebula-pink/10 to-stellar-cyan/10 mt-14">
        <div className="absolute inset-0 bg-gradient-to-r from-cosmic-purple/5 via-nebula-pink/5 to-stellar-cyan/5" />
        <div className="absolute top-4 right-4 opacity-20">
          <Rocket className="w-16 h-16 text-primary animate-float" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <h3 className="text-lg md:text-xl font-semibold text-foreground">
              Event Ends In
            </h3>
          </div>

          <div className="flex items-center justify-center gap-2 md:gap-4">
            <TimeUnit value={timeLeft.days} label="Days" />
            <span className="text-2xl md:text-4xl font-bold text-primary self-start mt-2 md:mt-3">:</span>
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <span className="text-2xl md:text-4xl font-bold text-primary self-start mt-2 md:mt-3">:</span>
            <TimeUnit value={timeLeft.minutes} label="Mins" />
            <span className="text-2xl md:text-4xl font-bold text-primary self-start mt-2 md:mt-3">:</span>
            <TimeUnit value={timeLeft.seconds} label="Secs" />
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Make every contribution count! 🚀
          </p>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="glass-card p-6 md:p-8 text-center bg-gradient-to-br from-cosmic-purple/10 via-nebula-pink/10 to-stellar-cyan/10">
        <p className="text-muted-foreground">Loading countdown...</p>
      </div>
    );
  }

  return null;
}