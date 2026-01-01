import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Starfield from './components/Starfield';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Imports
import Home from './pages/Home';
import Projects from './pages/Projects';
import Guidelines from './pages/Guidelines';
import Register from './pages/Register';
import SubmitProject from './pages/SubmitProject';

// Helper to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="relative min-h-screen bg-space-black text-white overflow-x-hidden selection:bg-cosmic-purple selection:text-white">
        {/* Fixed Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Starfield />
        </div>
        
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          
          <main className="flex-grow pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/guidelines" element={<Guidelines />} />
              <Route path="/register" element={<Register />} />
              <Route path="/submit-project" element={<SubmitProject />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;