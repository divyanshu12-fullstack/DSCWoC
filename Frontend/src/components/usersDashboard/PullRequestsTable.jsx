import { ExternalLink, GitPullRequest, Check, X, Clock, FileCode } from "lucide-react";
import { format } from "date-fns";

const statusConfig = {
  open: {
    icon: Clock,
    label: "Open",
    className: "bg-star-blue/20 text-star-blue",
  },
  merged: {
    icon: Check,
    label: "Merged",
    className: "bg-emerald-500/20 text-emerald-400",
  },
  rejected: {
    icon: X,
    label: "Rejected",
    className: "bg-red-500/20 text-red-500 py-1",
  },
};

function TableSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="w-40 h-6 bg-muted rounded animate-pulse" />
      </div>
      <div className="divide-y divide-border">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
            <div className="w-8 h-8 bg-muted rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="w-3/4 h-4 bg-muted rounded" />
              <div className="w-1/3 h-3 bg-muted rounded" />
            </div>
            <div className="w-20 h-6 bg-muted rounded-full" />
            <div className="w-16 h-4 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass-card p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
        <FileCode className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No Pull Requests Yet</h3>
      <p className="text-muted-foreground max-w-sm mx-auto">
        Start contributing to projects and your pull requests will appear here.
      </p>
    </div>
  );
}

export function PullRequestsTable({ pullRequests, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <GitPullRequest className="w-5 h-5 text-primary" />
          Pull Requests
        </h2>
        <TableSkeleton />
      </div>
    );
  }

  if (pullRequests.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <GitPullRequest className="w-5 h-5 text-primary" />
          Pull Requests
        </h2>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
        <GitPullRequest className="w-5 h-5 text-primary" />
        Pull Requests
        <span className="text-sm font-normal text-muted-foreground">({pullRequests.length})</span>
      </h2>

      <div className="glass-card overflow-hidden hidden md:block max-h-[485px] rounded-lg border border-cosmos-indigo/15 overflow-y-auto [scrollbar-gutter:stable] [scrollbar-width:thin] [scrollbar-color:rgba(100,100,100,0.5) transparent] hover:[scrollbar-color:rgba(150,150,150,0.8) transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted/50 hover:[&::-webkit-scrollbar-thumb]:bg-muted/80 relative">
        <div className="w-full">
          <table className="w-full">
            <thead className="sticky top-0 bg-midnight-blue z-10">
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Title</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Repository</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Points</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Created</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pullRequests.map((pr) => {
                const status = statusConfig[pr.status];
                const StatusIcon = status.icon;

                return (
                  <tr key={pr.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <span className="font-medium text-foreground line-clamp-1">
                        {pr.title}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground text-nowrap overflow-hidden">
                        {pr.owner}/{pr.repository}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`font-semibold tabular-nums ${pr.points > 0 ? "text-primary" : "text-muted-foreground"}`}>
                        +{pr.points}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(pr.createdAt), "MMM d, yyyy")}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <a
                        href={`https://github.com/${pr.owner}/${pr.repository}/pull/${pr.prNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-md hover:bg-muted inline-flex transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-3 md:hidden max-h-[400px] overflow-y-auto">
          {pullRequests.map((pr) => {
            const status = statusConfig[pr.status];
            const StatusIcon = status.icon;

            return (
              <div key={pr.id} className="glass-card p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-medium text-foreground text-sm line-clamp-2">
                    {pr.title}
                  </h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${status.className}`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {pr.owner}/{pr.repository}
                  </span>
                  <span className={`font-semibold ${pr.points > 0 ? "text-primary" : "text-muted-foreground"}`}>
                    +{pr.points} pts
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>{format(new Date(pr.createdAt), "MMM d, yyyy")}</span>
                  <a
                    href={`https://github.com/${pr.owner}/${pr.repository}/pull/${pr.prNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    View PR
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
