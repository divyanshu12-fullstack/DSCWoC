import React from 'react';

function SkeletonCard({ className = '' }) {
    return <div className={`animate-pulse rounded-2xl border border-white/10 bg-black/20 ${className}`.trim()} />;
}

export default function LeaderboardSkeleton() {
    return (
        <div className="space-y-5">
            {/* Hero */}
            <div className="terminal-screen rounded-2xl p-5 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-3">
                        <div className="h-9 w-64 rounded-lg bg-white/10 animate-pulse" />
                        <div className="h-4 w-44 rounded bg-white/10 animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:min-w-[520px]">
                        <SkeletonCard className="h-[78px]" />
                        <SkeletonCard className="h-[78px]" />
                        <SkeletonCard className="h-[78px]" />
                    </div>
                </div>
                <div className="mt-4 flex flex-col gap-3 md:flex-row md:flex-wrap">
                    <div className="h-10 w-72 rounded-full bg-white/10 animate-pulse" />
                    <div className="h-10 w-60 rounded-full bg-white/10 animate-pulse" />
                </div>
            </div>

            {/* Podium */}
            <div className="terminal-screen rounded-2xl p-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <SkeletonCard className="h-[220px]" />
                    <SkeletonCard className="h-[220px]" />
                    <SkeletonCard className="h-[220px]" />
                </div>
            </div>

            {/* Rows */}
            <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={i} className="h-[84px]" />
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3">
                <div className="h-10 w-20 rounded-full bg-white/10 animate-pulse" />
                <div className="h-10 w-36 rounded-full bg-white/10 animate-pulse" />
                <div className="h-10 w-20 rounded-full bg-white/10 animate-pulse" />
            </div>
        </div>
    );
}
