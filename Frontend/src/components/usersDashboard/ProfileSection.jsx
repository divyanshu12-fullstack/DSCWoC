import { Github, Building2, Shield } from "lucide-react";

const roleColors = {
  contributor: "bg-stellar-cyan/20 text-stellar-cyan",
  mentor: "bg-cosmic-purple/20 text-cosmic-purple",
  admin: "bg-nebula-pink/20 text-nebula-pink",
};

export function ProfileSection({ user, rank, isLoading }) {
  if (isLoading) {
    return (
      <div className="glass-card p-6 animate-pulse">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-muted" />
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="h-8 w-48 bg-muted rounded mx-auto md:mx-0" />
            <div className="h-5 w-32 bg-muted rounded mx-auto md:mx-0" />
            <div className="h-5 w-40 bg-muted rounded mx-auto md:mx-0" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 md:p-8 glow-border">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-4 ring-primary/30 ring-offset-2 ring-offset-background">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-midnight-blue flex items-center justify-center border-2 border-primary shadow-nebula-pink">
            <span className="text-lg font-bold text-gradient-cosmic">#{rank}</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {user.name}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-muted-foreground mb-4">
            <a
              href={`https://github.com/${user.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>@{user.githubUsername}</span>
            </a>
            <span className="text-border">•</span>
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              {user.college}
            </span>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium capitalize ${roleColors[user.role]}`}>
              <Shield className="w-3.5 h-3.5" />
              {user.role}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="hidden lg:flex items-center gap-6 text-center">
          <div className="px-6 border-r border-border">
            <p className="text-3xl font-bold text-gradient-stellar">{user.totalPoints.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Points</p>
          </div>
          <div className="px-6 border-r border-border">
            <p className="text-3xl font-bold text-foreground">{user.mergedPRs}</p>
            <p className="text-sm text-muted-foreground">Merged PRs</p>
          </div>
          <div className="px-6">
            <p className="text-3xl font-bold text-foreground">#{rank}</p>
            <p className="text-sm text-muted-foreground">Rank</p>
          </div>
        </div>
      </div>
    </div>
  );
}
