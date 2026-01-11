import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AboutSection from './components/AboutSection';
import BenefitsSection from './components/BenefitsSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';

// Lazy load heavy animation components
const Starfield = lazy(() => import('./components/Starfield'));
const HeroSection = lazy(() => import('./components/HeroSection'));
const TimelineSection = lazy(() => import('./components/TimelineSection'));
const RewardsSection = lazy(() => import('./components/RewardsSection'));

// Pages
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import About from './pages/About';
import Rewards from './pages/Rewards';
import UsersDashboard from './pages/UsersDashboard.jsx';
import Leaderboard from './pages/Leaderboard/Leaderboard';
import Projects from './pages/Projects';
import Guidelines from './pages/Guidelines';

// Loading fallback component
const AnimationFallback = () => (
  <div className="w-full h-screen bg-gradient-to-b from-slate-900 to-slate-950 animate-pulse" />
);

const HeroSkeleton = () => (
  <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24">
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center w-full">
      <div className="space-y-4 sm:space-y-6">
        <div className="h-10 sm:h-12 md:h-16 lg:h-20 w-[90%] bg-white/10 rounded-lg animate-pulse" />
        <div className="h-7 sm:h-8 md:h-10 w-[70%] bg-white/10 rounded-lg animate-pulse" />
        <div className="h-4 sm:h-5 w-[95%] bg-white/10 rounded-lg animate-pulse" />
        <div className="h-4 sm:h-5 w-[80%] bg-white/10 rounded-lg animate-pulse" />
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
          <div className="h-11 sm:h-12 w-full sm:w-48 bg-white/10 rounded-full animate-pulse" />
          <div className="h-11 sm:h-12 w-full sm:w-48 bg-white/10 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="relative flex items-center justify-center mt-8 md:mt-0">
        <div className="relative w-full max-w-[280px] sm:max-w-[350px] md:max-w-[450px] aspect-square bg-white/10 rounded-2xl animate-pulse" />
      </div>
    </div>
  </section>
);

const SectionSkeleton = ({ className = '' }) => (
  <div className={`w-full rounded-2xl bg-white/5 border border-white/10 animate-pulse ${className}`} />
);

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Avoid the browser restoring scroll position on reload/back-forward.
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
};

// Home component
const Home = () => {
  const [showStarfield, setShowStarfield] = useState(false);

  useEffect(() => {
    // Don't block initial paint/LCP on the heavy canvas background.
    // Defer it until after the first frame (or when idle if supported).
    let cancelled = false;
    const schedule = () => {
      if (cancelled) return;
      setShowStarfield(true);
    };

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(schedule, { timeout: 1500 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback?.(id);
      };
    }

    const raf = window.requestAnimationFrame(() => schedule());
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
    };
  }, []);

  const { ref: rewardsRef, hasBeenVisible: rewardsVisible } = useIntersectionObserver();
  const { ref: benefitsRef, hasBeenVisible: benefitsVisible } = useIntersectionObserver();
  const { ref: ctaRef, hasBeenVisible: ctaVisible } = useIntersectionObserver();

  return (
    <>
      <div className="relative w-screen overflow-x-hidden">
        {/* Starfield Background - Lazy loaded */}
        <div className="fixed inset-0 bg-slate-950" aria-hidden="true" />
        {showStarfield && (
          <Suspense fallback={null}>
            <Starfield />
          </Suspense>
        )}

        {/* Content */}
        <div className="relative z-10 w-full">
          <Navbar />
          <div className="pt-16 sm:pt-20">
            <Suspense fallback={<HeroSkeleton />}>
              <HeroSection />
            </Suspense>
            <AboutSection />
            <Suspense fallback={<div className="h-screen bg-gradient-to-b from-slate-900 to-slate-950" />}>
              <TimelineSection />
            </Suspense>

            {/* Rewards Section - Lazy loaded with intersection observer */}
            <div ref={rewardsRef} className="min-h-[820px]">
              {rewardsVisible ? (
                <Suspense fallback={<SectionSkeleton className="h-[820px]" />}>
                  <RewardsSection />
                </Suspense>
              ) : (
                <SectionSkeleton className="h-[820px]" />
              )}
            </div>

            {/* Benefits Section - Lazy loaded with intersection observer */}
            <div ref={benefitsRef} className="min-h-[720px]">
              {benefitsVisible ? <BenefitsSection /> : <SectionSkeleton className="h-[720px]" />}
            </div>

            {/* CTA Section - Lazy loaded with intersection observer */}
            <div ref={ctaRef} className="min-h-[420px]">
              {ctaVisible ? <CTASection /> : <SectionSkeleton className="h-[420px]" />}
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userdashboard" element={<UsersDashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/mentor/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
