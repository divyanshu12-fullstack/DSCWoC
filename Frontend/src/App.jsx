import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AboutSection from './components/AboutSection';
import SpaceLoader from './components/SpaceLoader';
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
import Leaderboard from './pages/Leaderboard/Leaderboard';
import Projects from './pages/Projects';

// Loading fallback component
const AnimationFallback = () => (
  <div className="w-full h-screen bg-gradient-to-b from-slate-900 to-slate-950 animate-pulse" />
);

// Home component
const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Minimum loading time for smooth UX
    const minLoadTime = 1500; // 1.5 seconds
    const startTime = Date.now();

    const handleLoad = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minLoadTime - elapsed);

      setTimeout(() => {
        setIsLoading(false);
      }, remaining);
    };

    // Wait for all assets to load
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);
  const { ref: rewardsRef, hasBeenVisible: rewardsVisible } = useIntersectionObserver();
  const { ref: benefitsRef, hasBeenVisible: benefitsVisible } = useIntersectionObserver();
  const { ref: ctaRef, hasBeenVisible: ctaVisible } = useIntersectionObserver();

  return (
    <>
      <SpaceLoader isLoading={isLoading} />
      <div className="relative w-screen overflow-x-hidden" style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease-in' }}>
        {/* Starfield Background - Lazy loaded */}
        <Suspense fallback={<div className="fixed inset-0 bg-slate-950" />}>
          <Starfield />
        </Suspense>

        {/* Content */}
        <div className="relative z-10 w-full">
          <Navbar />
          <div className="pt-16 sm:pt-20">
            <Suspense fallback={<div className="w-full h-screen bg-gradient-to-b from-slate-900 to-slate-950 animate-pulse" />}>
              <HeroSection />
            </Suspense>
            <AboutSection />
            <Suspense fallback={<div className="h-screen bg-gradient-to-b from-slate-900 to-slate-950" />}>
              <TimelineSection />
            </Suspense>

            {/* Rewards Section - Lazy loaded with intersection observer */}
            <div ref={rewardsRef}>
              {rewardsVisible && (
                <Suspense fallback={<div className="h-screen bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950" />}>
                  <RewardsSection />
                </Suspense>
              )}
            </div>

            {/* Benefits Section - Lazy loaded with intersection observer */}
            <div ref={benefitsRef}>
              {benefitsVisible && <BenefitsSection />}
            </div>

            {/* CTA Section - Lazy loaded with intersection observer */}
            <div ref={ctaRef}>
              {ctaVisible && <CTASection />}
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/mentor/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
