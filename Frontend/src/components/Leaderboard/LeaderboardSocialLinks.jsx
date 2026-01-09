import React from 'react';

export default function LeaderboardSocialLinks({ githubUsername, linkedInUrl, className = '' }) {
    const githubUrl = githubUsername ? `https://github.com/${githubUsername}` : null;

    return (
        <div className={`inline-flex gap-2 ${className}`.trim()} aria-label="Social links">
            {githubUrl && (
                <a
                    className="h-7 w-7 rounded-full border border-white/10 bg-white/5 text-white/80 grid place-items-center transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-cosmic-purple/30"
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub profile"
                >
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
                        <path
                            fill="currentColor"
                            d="M12 .5C5.73.5.75 5.48.75 11.74c0 4.95 3.21 9.15 7.66 10.64.56.1.77-.24.77-.54v-1.9c-3.11.68-3.77-1.33-3.77-1.33-.51-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.14 1.71 1.14.99 1.69 2.6 1.2 3.24.92.1-.71.39-1.2.71-1.47-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.14-3-.11-.28-.49-1.42.11-2.96 0 0 .93-.3 3.04 1.15.88-.25 1.83-.37 2.77-.37.94 0 1.89.12 2.77.37 2.11-1.45 3.04-1.15 3.04-1.15.6 1.54.22 2.68.11 2.96.71.78 1.14 1.78 1.14 3 0 4.29-2.62 5.24-5.11 5.52.4.35.77 1.04.77 2.11v3.13c0 .3.2.65.78.54 4.45-1.49 7.65-5.69 7.65-10.64C23.25 5.48 18.27.5 12 .5z"
                        />
                    </svg>
                </a>
            )}

            {linkedInUrl && (
                <a
                    className="h-7 w-7 rounded-full border border-white/10 bg-white/5 text-white/80 grid place-items-center transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-cosmic-purple/30"
                    href={linkedInUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn profile"
                >
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
                        <path
                            fill="currentColor"
                            d="M20.45 20.45h-3.56v-5.56c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.95v5.65H9.35V9h3.41v1.56h.05c.47-.9 1.61-1.85 3.32-1.85 3.55 0 4.2 2.34 4.2 5.38v6.36zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.23 0z"
                        />
                    </svg>
                </a>
            )}
        </div>
    );
}
