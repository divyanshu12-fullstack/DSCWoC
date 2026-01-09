import React from 'react';
import LeaderboardSocialLinks from './LeaderboardSocialLinks';

export default function LeaderboardPodium({ podiumUsers, getAvatarUrl, getPodiumAward }) {
    // Visual order: 2,1,3
    const ordered = [podiumUsers?.[1], podiumUsers?.[0], podiumUsers?.[2]];

    return (
        <section className="terminal-screen rounded-2xl p-4 md:p-5" aria-label="Top 3 contributors">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {ordered.map((user, idx) => {
                    if (!user) {
                        return <div key={idx} className="rounded-2xl border border-white/10 bg-black/20 h-[260px]" />;
                    }

                    const rank = user.rank;
                    const points = user?.stats?.points || 0;
                    const award = getPodiumAward(rank);

                    const medalBg =
                        rank === 1
                            ? 'from-amber-300/15 to-black/20 border-amber-300/25'
                            : rank === 2
                                ? 'from-slate-200/10 to-black/20 border-slate-200/20'
                                : 'from-orange-500/10 to-black/20 border-orange-500/20';

                    return (
                        <div
                            key={user._id || user.id}
                            className={`rounded-2xl border bg-gradient-to-br ${medalBg} px-4 py-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cosmic-purple/40`}
                        >
                            <div className="relative mx-auto mb-3 h-28 w-28 rounded-full border-2 border-white/15 bg-white/5 p-1">
                                {/* Award emoji over head (mobile+desktop) */}
                                {award && (
                                    <div
                                        className={`absolute -top-4 left-1/2 -translate-x-1/2 h-9 w-9 rounded-full grid place-items-center border border-white/15 backdrop-blur bg-black/30 ${rank === 1 ? 'text-[20px]' : 'text-[18px]'}`}
                                        role="img"
                                        aria-label={award.label}
                                        title={award.label}
                                    >
                                        {award.icon}
                                    </div>
                                )}

                                <img
                                    src={getAvatarUrl(user)}
                                    alt={user.fullName || 'User avatar'}
                                    loading="lazy"
                                    className="h-full w-full rounded-full object-cover"
                                />

                                <div
                                    className={`absolute -bottom-3 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full grid place-items-center border-2 border-black/40 font-extrabold text-gray-900 ${rank === 1 ? 'bg-amber-300' : rank === 2 ? 'bg-slate-200' : 'bg-orange-500'}`}
                                    aria-label={`Rank ${rank}`}
                                >
                                    {rank}
                                </div>
                            </div>

                            <div className="mt-4 text-sm font-extrabold tracking-widest text-white/90 truncate">
                                {(user.fullName || 'Unknown User').toUpperCase()}
                            </div>
                            <div className="mt-1 text-sm text-gray-300/90 truncate">@{user.github_username || 'unknown'}</div>

                            <div className="mt-4">
                                <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[11px] tracking-[0.2em] text-white/80">
                                    POINTS {points}
                                </span>
                            </div>

                            <div className="mt-4 flex items-center justify-center gap-3">
                                <LeaderboardSocialLinks githubUsername={user.github_username} linkedInUrl={user?.linkedin_url || user?.linkedInUrl} />
                                <span className="text-[11px] tracking-widest text-gray-300/80">RANK #{rank}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
