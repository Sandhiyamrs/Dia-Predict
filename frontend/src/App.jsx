import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';
import LandingPage from './components/LandingPage';
import PredictionForm from './components/PredictionForm';
import ResultDisplay from './components/ResultDisplay';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [result, setResult] = useState(null);

  const handleStart = () => {
    setCurrentPage('predict');
  };

  const handlePredict = (data) => {
    setResult(data);
    setCurrentPage('result');
  };

  const handleReset = () => {
    setResult(null);
    setCurrentPage('landing');
  };

  return (
    <>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="navbar-glass"
        style={{
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: '70px'
        }}
      >
        <div
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
          onClick={() => setCurrentPage('landing')}
        >
          <div style={{
            background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
            padding: '0.5rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Activity size={24} color="#7c3aed" />
          </div>
          <span style={{
            fontWeight: 800,
            fontSize: '1.5rem',
            background: 'linear-gradient(45deg, #8b5cf6, #d946ef)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            DiaPredict
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <span className="desktop-only" style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
            AI-Powered MedTech
          </span>

        </div>
      </motion.nav>

      {/* Main Content Area */}
      <div style={{ marginTop: '100px', width: '100%', maxWidth: '1200px', padding: '0 1rem', position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {currentPage === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <LandingPage onStart={handleStart} />
            </motion.div>
          )}

          {currentPage === 'predict' && (
            <motion.div
              key="predict"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PredictionForm onPredict={handlePredict} />
            </motion.div>
          )}

          {currentPage === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <ResultDisplay result={result} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#94a3b8',
        fontSize: '0.8rem',
        marginTop: '4rem'
      }}>
        &copy; {new Date().getFullYear()} DiaPredict MedTech AI. All rights reserved. <br />
        Disclaimer: This tool is for informational purposes only and is not a substitute for professional medical advice.
      </footer>
    </>
  );
}

export default App;
