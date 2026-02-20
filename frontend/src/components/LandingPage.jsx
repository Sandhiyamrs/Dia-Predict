import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Activity, ShieldCheck, Zap, ArrowRight, HeartPulse } from 'lucide-react';

const LandingPage = ({ onStart }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="landing-container"
      style={{ padding: '4rem 1rem', overflow: 'hidden' }}
      ref={containerRef}
    >
      {/* Hero Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ marginBottom: '4rem', position: 'relative' }}
      >
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', opacity: 0.1, zIndex: -1 }}>
          <HeartPulse size={400} color="#8b5cf6" />
        </div>

        <h1 style={{ fontSize: '4.5rem', marginBottom: '1.5rem', letterSpacing: '-0.05em' }}>
          Predicting Health.<br />
          <span style={{ color: '#0f172a' }}>Protecting Futures.</span>
        </h1>

        <p style={{ maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '1.25rem', color: '#64748b' }}>
          Harness the power of AI to assess your diabetes risk instantly.
          Early detection is the first step towards a healthier life.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary"
          onClick={onStart}
          style={{ padding: '1.2rem 3rem', fontSize: '1.2rem', boxShadow: '0 20px 25px -5px rgba(14, 165, 233, 0.4)' }}
        >
          Start Assessment <ArrowRight size={20} />
        </motion.button>
      </motion.div>

      {/* Features Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        maxWidth: '1000px',
        margin: '6rem auto'
      }}>
        {[
          { icon: Zap, title: "Instant Analysis", desc: "Get results in seconds powered by advanced Random Forest algorithms." },
          { icon: Activity, title: "Precision AI", desc: "Trained on thousands of clinical records for high accuracy." },
          { icon: ShieldCheck, title: "Privacy First", desc: "Your health data is processed in real-time and never stored." }
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            className="glass-card"
            style={{ padding: '2.5rem', textAlign: 'left' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2 }}
            whileHover={{ y: -10 }}
          >
            <div style={{
              background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              color: '#7c3aed'
            }}>
              <feature.icon size={30} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{feature.title}</h3>
            <p style={{ fontSize: '1rem', color: '#64748b' }}>{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default LandingPage;
