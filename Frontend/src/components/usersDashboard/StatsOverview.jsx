import { GitPullRequest, GitMerge, Trophy, TrendingUp } from "lucide-react";

function StatCard({ icon, label, value, trend, glowClass, isLoading }) {
  if (isLoading) {
    return (
      <div className="stat-card animate-pulse">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-lg bg-muted" />
          <div className="w-16 h-5 bg-muted rounded" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="w-24 h-8 bg-muted rounded" />
          <div className="w-20 h-4 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className={`stat-card group ${glowClass}`}>
      <div className="flex items-start justify-between">
        <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
          {icon}
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-sm text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl md:text-4xl font-bold text-foreground tabular-nums">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </div>
    </div>
  );
}

export function StatsOverview({ totalPRs, mergedPRs, totalPoints, rank, isLoading }) {
  const stats = [
    {
      icon: <GitPullRequest className="w-6 h-6 text-stellar-cyan" />,
      label: "Total Pull Requests",
      value: totalPRs,
      glowClass: "hover:shadow-[0_0_30px_hsl(189_100%_62%/0.2)]",
    },
    {
      icon: <GitMerge className="w-6 h-6 text-cosmic-purple" />,
      label: "Merged PRs",
      value: mergedPRs,
      glowClass: "hover:shadow-[0_0_30px_hsl(256_100%_68%/0.2)]",
    },
    {
      icon: <Trophy className="w-6 h-6 text-supernova-orange" />,
      label: "Total Points",
      value: totalPoints,
      glowClass: "hover:shadow-[0_0_30px_hsl(25_95%_53%/0.2)]",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-nebula-pink" />,
      label: "Leaderboard Rank",
      value: `#${rank}`,
      glowClass: "hover:shadow-[0_0_30px_hsl(330_81%_60%/0.2)]",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          {...stat}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
