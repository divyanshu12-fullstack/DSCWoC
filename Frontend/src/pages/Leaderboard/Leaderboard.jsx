import { useEffect, useLayoutEffect, useMemo, useRef, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useLeaderboard } from '../../hooks/useApi';
import Navbar from '../../components/Navbar';
import LeaderboardSkeleton from '../../components/Leaderboard/LeaderboardSkeleton';
import LeaderboardSocialLinks from '../../components/Leaderboard/LeaderboardSocialLinks';
import LeaderboardPodium from '../../components/Leaderboard/LeaderboardPodium';
import './Leaderboard.css';
import Footer from "../../components/Footer";

// Lazy load Starfield for performance
const Starfield = lazy(() => import('../../components/Starfield'));

// Constants for pagination
const ITEMS_PER_PAGE = 30;
const LAUNCH_DATE = new Date('2026-01-16T15:30:00Z'); // 9:00 PM IST

const formatLeaderboardDateTime = (date) => {
    try {
        const formatted = new Intl.DateTimeFormat('en-IN', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata',
        }).format(date);

        // Tweak to resemble: Thu, 08 Jan, 06:46:39 pm
        // Intl returns: Thu, 08 Jan, 06:46:39 pm
        return formatted;
    } catch {
        return date.toLocaleString();
    }
};

const getAvatarUrl = (user) =>
    user?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=8b5cf6&color=fff`;

const getPodiumAward = (rank) => {
    if (rank === 1) return { icon: '👑', label: 'Crown' };
    if (rank === 2) return { icon: '🥈', label: 'Silver medal' };
    if (rank === 3) return { icon: '🥉', label: 'Bronze medal' };
    return null;
};

// Social links + skeleton extracted into components/Leaderboard

/**
 * Leaderboard Page Component
 * 
 * Displays a grid of contributors with filtering options.
 * Features:
 * - Overall and Weekly filter toggle
 * - Grid layout (5 per row on desktop)
 * - Top 5 highlighting with special styling
 * - Mobile pagination (12 per page)
 * - Mobile-first responsive design
 * 
 * @returns {JSX.Element} Leaderboard page component
 */
const Leaderboard = () => {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);

    const [liveNow, setLiveNow] = useState(() => new Date());

    // Countdown timer state
    const [countdown, setCountdown] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isLive: false,
    });

    const launchStartRef = useRef(new Date());

    const launchProgress = useMemo(() => {
        const total = LAUNCH_DATE - launchStartRef.current;
        const remaining = LAUNCH_DATE - new Date();
        if (total <= 0) return 100;
        const pct = ((total - remaining) / total) * 100;
        return Math.min(100, Math.max(0, pct));
    }, [countdown.seconds]);

    // Calculate countdown to launch
    useEffect(() => {
        const calculateCountdown = () => {
            const now = new Date();
            const diff = LAUNCH_DATE - now;

            if (diff <= 0) {
                setCountdown({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    isLive: true,
                });
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                setCountdown({
                    days,
                    hours,
                    minutes,
                    seconds,
                    isLive: false,
                });
            }
        };

        calculateCountdown();
        const interval = setInterval(calculateCountdown, 1000);
        return () => clearInterval(interval);
    }, []);

    // Fetch leaderboard data (paginated)
    const {
        data: leaderboardData,
        isLoading,
        isError,
        error,
        refetch
    } = useLeaderboard(currentPage, ITEMS_PER_PAGE, 'overall');

    // For Last Updated and Live (IST)
    const lastUpdatedAt = useMemo(() => (
        leaderboardData?.data ? new Date() : null
    ), [leaderboardData?.data]);

    // Fetch top 3 (podium)
    const {
        data: podiumData,
        isLoading: podiumLoading,
        isError: podiumError,
    } = useLeaderboard(1, 3, 'overall');

    const users = leaderboardData?.data || [];
    const pagination = leaderboardData?.pagination;
    const totalPages = pagination?.totalPages || 1;

    const podiumUsers = podiumData?.data || [];

    const summary = useMemo(() => {
        const s = leaderboardData?.summary;
        if (s) return s;

        // Fallback: best-effort values from current page
        const points = users.reduce((acc, u) => acc + (u?.stats?.points || 0), 0);
        const mergedPRs = users.reduce((acc, u) => acc + (u?.stats?.mergedPRs || 0), 0);
        return {
            contributors: pagination?.totalItems || users.length,
            totalPoints: points,
            totalMergedPRs: mergedPRs,
        };
    }, [leaderboardData?.summary, pagination?.totalItems, users]);

    useEffect(() => {
        const id = setInterval(() => setLiveNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    // Prevent initial scroll-restoration/layout-shift nudging the page down.
    const hasForcedScroll = useRef(false);
    useLayoutEffect(() => {
        if (hasForcedScroll.current) return;
        hasForcedScroll.current = true;
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }));
    }, []);

    /**
     * Handle page navigation
     * @param {number} page - Target page number
     */
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            // Scroll to top of content when changing pages
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="leaderboard-container">
            {/* Starfield Background - Lazy loaded for performance */}
            <Suspense fallback={<div className="fixed inset-0 bg-slate-950" />}>
                <Starfield />
            </Suspense>

            {/* Navigation */}
            <Navbar />

            {/* Countdown Timer Overlay - Shows before launch */}
            {!countdown.isLive && (
                <div className="countdown-overlay">
                    <div className="ship-console">
                        <div className="ship-grid" aria-hidden="true" />
                        <div className="ship-header">
                            <div className="ship-pill">Status • Locked</div>
                            <p className="ship-subtitle">Leaderboard launch sequence engaged</p>
                            <h2 className="ship-title">Launch in</h2>
                            <p className="ship-meta">Goes live on 16 Jan, 9:00 PM IST</p>
                        </div>

                        <div className="ship-countdown">
                            {[{
                                label: 'Days',
                                value: String(countdown.days).padStart(2, '0'),
                            }, {
                                label: 'Hours',
                                value: String(countdown.hours).padStart(2, '0'),
                            }, {
                                label: 'Minutes',
                                value: String(countdown.minutes).padStart(2, '0'),
                            }, {
                                label: 'Seconds',
                                value: String(countdown.seconds).padStart(2, '0'),
                            }].map((item) => (
                                <div key={item.label} className="ship-countdown-tile">
                                    <div className="ship-countdown-value">{item.value}</div>
                                    <div className="ship-countdown-label">{item.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="ship-progress">
                            <div className="ship-progress-track">
                                <div
                                    className="ship-progress-fill"
                                    style={{ width: `${launchProgress.toFixed(1)}%` }}
                                />
                            </div>
                            <div className="ship-progress-meta">
                                <span>Pre-flight checks</span>
                                <span>{launchProgress.toFixed(0)}% complete</span>
                            </div>
                        </div>

                        <div className="ship-actions">
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSdcSsjLNUcR0K--noBp3AhwmuEYRIRVfjRHIPTqZ68jHtI90g/viewform?usp=dialog"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ship-button primary"
                            >
                                Register Crew
                            </a>
                            <Link to="/guidelines" className="ship-button ghost">View Guidelines</Link>
                        </div>

                        <div className="ship-badges">
                            <span className="ship-badge">Autolock at T0</span>
                            <span className="ship-badge">Dock ID: DSC-WOC-2026</span>
                            <span className="ship-badge">Timezone: IST</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="leaderboard-content">
                <div className="lb-page">
                    {/* Hero card */}
                    <section className="lb-hero" aria-label="Leaderboard summary">
                        <div className="lb-hero-left">
                            <h1 className="lb-title">DSCWoC 2026<br /><span className="lb-title-accent">Leaderboard.</span></h1>
                        </div>

                        <div className="lb-hero-right">
                            <div className="lb-metric transition-all duration-300 hover:shadow-lg hover:shadow-cosmic-purple/30 hover:-translate-y-0.5">
                                <div className="lb-metric-k">Contributors</div>
                                <div className="lb-metric-v">{summary?.contributors ?? '—'}</div>
                            </div>
                            <div className="lb-metric lb-metric-purple transition-all duration-300 hover:shadow-lg hover:shadow-cosmic-purple/30 hover:-translate-y-0.5">
                                <div className="lb-metric-k">Total Points</div>
                                <div className="lb-metric-v">{(summary?.totalPoints ?? 0).toLocaleString()}</div>
                            </div>
                            <div className="lb-metric lb-metric-green transition-all duration-300 hover:shadow-lg hover:shadow-cosmic-purple/30 hover:-translate-y-0.5">
                                <div className="lb-metric-k">Merged PRs</div>
                                <div className="lb-metric-v">{(summary?.totalMergedPRs ?? 0).toLocaleString()}</div>
                            </div>
                        </div>

                        <div className="lb-hero-bottom">
                            <div className="lb-pill transition-all duration-300 hover:shadow-lg hover:shadow-cosmic-purple/20 hover:-translate-y-0.5">
                                <span className="lb-pill-dot lb-dot-green" aria-hidden="true" />
                                <span className="lb-pill-k">Last updated</span>
                                <span className="lb-pill-v">{lastUpdatedAt ? formatLeaderboardDateTime(lastUpdatedAt) : '—'}</span>
                            </div>
                            <div className="lb-pill transition-all duration-300 hover:shadow-lg hover:shadow-cosmic-purple/20 hover:-translate-y-0.5">
                                <span className="lb-pill-dot lb-dot-blue" aria-hidden="true" />
                                <span className="lb-pill-k">Live (IST)</span>
                                <span className="lb-pill-v">{formatLeaderboardDateTime(liveNow)}</span>
                            </div>
                        </div>
                    </section>

                    {/* Loading State */}
                    {(isLoading || podiumLoading) && <LeaderboardSkeleton />}

                    {/* Error State */}
                    {(isError || podiumError) && (
                        <div className="error-container">
                            <div className="error-icon">⚠️</div>
                            <p className="error-message">
                                {error?.message || 'Failed to load leaderboard'}
                            </p>
                            <button className="retry-btn" onClick={() => refetch()}>
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !isError && users.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">📊</div>
                            <p>No contributors found.</p>
                            <Link to="/" className="retry-btn" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>
                                Back to Home
                            </Link>
                        </div>
                    )}

                    {!isLoading && !podiumLoading && !isError && !podiumError && users.length > 0 && (
                        <>
                            <LeaderboardPodium
                                podiumUsers={podiumUsers}
                                getAvatarUrl={getAvatarUrl}
                                getPodiumAward={getPodiumAward}
                            />

                            {/* List */}
                            <section className="lb-list" aria-label="Leaderboard list">
                                {users.map((user) => {
                                    const rank = user.rank;
                                    const mergedPRs = user?.stats?.mergedPRs ?? 0;
                                    const points = user?.stats?.points ?? 0;
                                    const projects = user?.projectsCount ?? 0;

                                    return (
                                        <article
                                            key={user._id || user.id}
                                            className={`lb-row cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cosmic-purple/40 hover:scale-[1.01] ${rank <= 3 ? `lb-row-top lb-row-top-${rank}` : ''}`.trim()}
                                        >
                                            <div className="lb-row-rank" aria-label={`Rank ${rank}`}>{rank}</div>

                                            <div className="lb-row-user">
                                                <img className="lb-row-avatar" src={getAvatarUrl(user)} alt={user.fullName || 'User avatar'} loading="lazy" />
                                                <div className="lb-row-usertext">
                                                    <div className="lb-row-name">{user.fullName || 'Unknown User'}</div>
                                                    <div className="lb-row-handle">@{user.github_username || 'unknown'}</div>
                                                    <LeaderboardSocialLinks
                                                        githubUsername={user.github_username}
                                                        linkedInUrl={user?.linkedin_url || user?.linkedInUrl}
                                                        className="lb-social-row"
                                                    />
                                                </div>
                                            </div>

                                            <div className="lb-row-stat">
                                                <div className="lb-row-stat-k">Merged PRs</div>
                                                <div className="lb-row-stat-v lb-row-stat-green">{mergedPRs}</div>
                                            </div>

                                            <div className="lb-row-stat">
                                                <div className="lb-row-stat-k">Projects</div>
                                                <div className="lb-row-stat-v lb-row-stat-gold">{projects}</div>
                                            </div>

                                            <div className="lb-row-stat">
                                                <div className="lb-row-stat-k">Points</div>
                                                <div className="lb-row-stat-v">{points}</div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </section>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <nav className="lb-pagination" aria-label="Leaderboard pagination">
                                    <button
                                        className="lb-page-btn"
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Prev
                                    </button>

                                    <div className="lb-page-indicator">
                                        <span className="lb-page-label">PAGE</span>
                                        <span className="lb-page-value">{currentPage}</span>
                                        <span className="lb-page-sep">/</span>
                                        <span className="lb-page-total">{totalPages}</span>
                                    </div>

                                    <button
                                        className="lb-page-btn"
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </nav>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>

    );
};

export default Leaderboard;
