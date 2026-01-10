import { Trophy, Medal, Crown, TrendingUp } from "lucide-react";

const rankIcons = {
  1: <Crown className="w-5 h-5 text-yellow-400" />,
  2: <Medal className="w-5 h-5 text-gray-300" />,
  3: <Medal className="w-5 h-5 text-amber-600" />,
};

function LeaderboardSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="w-40 h-6 bg-muted rounded animate-pulse" />
      </div>
      <div className="divide-y divide-border">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
            <div className="w-8 h-8 bg-muted rounded-full" />
            <div className="w-10 h-10 bg-muted rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="w-32 h-4 bg-muted rounded" />
              <div className="w-20 h-3 bg-muted rounded" />
            </div>
            <div className="w-16 h-6 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LeaderboardPreview({ entries, currentUserId, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Leaderboard
        </h2>
        <LeaderboardSkeleton />
      </div>
    );
  }

  const topEntries = entries.slice(0, 10);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Leaderboard
        </h2>
        <a
          href="/leaderboard"
          className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
        >
          View All
          <TrendingUp className="w-4 h-4" />
        </a>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="divide-y divide-border">
          {topEntries.map((entry) => {
            const isCurrentUser = entry.userId === currentUserId;
            
            return (
              <div
                key={entry.userId}
                className={`p-4 flex items-center gap-4 transition-colors ${
                  isCurrentUser
                    ? "bg-primary/10 border-l-2 border-l-primary"
                    : "hover:bg-muted/30"
                }`}
              >
                {/* Rank */}
                <div className="w-8 flex justify-center">
                  {rankIcons[entry.rank] || (
                    <span className="text-sm font-bold text-muted-foreground">
                      #{entry.rank}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full overflow-hidden ring-2 ${
                  entry.rank === 1 ? "ring-yellow-400" :
                  entry.rank === 2 ? "ring-gray-300" :
                  entry.rank === 3 ? "ring-amber-600" :
                  isCurrentUser ? "ring-primary" : "ring-transparent"
                }`}>
                  <img
                    src={entry.avatar}
                    alt={entry.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${isCurrentUser ? "text-primary" : "text-foreground"}`}>
                    {entry.name}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {entry.prCount} PRs
                  </p>
                </div>

                {/* Points */}
                <div className="text-right">
                  <p className={`font-bold tabular-nums ${
                    entry.rank <= 3 ? "text-gradient-stellar" : "text-foreground"
                  }`}>
                    {entry.points.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
