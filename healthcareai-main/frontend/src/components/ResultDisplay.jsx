import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, RefreshCcw, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const CircularProgress = ({ value, color }) => {
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <svg className="circular-chart" viewBox="0 0 200 200" width="200" height="200">
            <circle
                className="circle-bg"
                cx="100" cy="100" r={radius}
            />
            <motion.circle
                className="circle"
                stroke={color}
                cx="100" cy="100" r={radius}
                strokeDasharray={`${circumference} ${circumference}`}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                transform="rotate(-90 100 100)"
            />
            <text x="100" y="105" textAnchor="middle" className="percentage" style={{ fontSize: '3rem', fill: '#1e293b' }}>{(value).toFixed(1)}%</text>
            <text x="100" y="130" textAnchor="middle" className="risk-label-svg" style={{ fontSize: '0.8rem', fill: '#64748b' }}>PROBABILITY</text>
        </svg>
    );
};

const ResultDisplay = ({ result, onReset }) => {
    const { prediction, probability, risk_level, feature_importance } = result;
    const probPercentage = probability * 100;

    // Determine theme based on risk
    const isHighRisk = risk_level === "High";
    const isMediumRisk = risk_level === "Medium";

    const themeColor = isHighRisk ? "#ef4444" : isMediumRisk ? "#f59e0b" : "#10b981";
    const Icon = isHighRisk ? AlertTriangle : isMediumRisk ? Info : CheckCircle;

    // Sort features
    const sortedFeatures = feature_importance
        ? Object.entries(feature_importance).sort(([, a], [, b]) => b - a)
        : [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={{ maxWidth: '850px', margin: '2rem auto', padding: '3rem 2rem', textAlign: 'center' }}
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                style={{
                    display: 'inline-flex',
                    padding: '1rem',
                    borderRadius: '50%',
                    background: `${themeColor}20`,
                    color: themeColor,
                    marginBottom: '1rem'
                }}
            >
                <Icon size={48} />
            </motion.div>

            <h2 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Assessment Complete</h2>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                Based on the provided vitals, the analysis is complete.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem' }}>
                <div style={{ position: 'relative', width: '220px', height: '220px' }}>
                    <CircularProgress value={probPercentage} color={themeColor} />
                </div>

                <h3 style={{ fontSize: '2rem', margin: '1rem 0', color: themeColor }}>
                    {risk_level} Risk Level
                </h3>

                <p style={{ maxWidth: '500px', margin: '0 auto', color: '#475569' }}>
                    {prediction === 1
                        ? "The model suggests a high probability of diabetes. It is recommended to consult a healthcare professional for further diagnosis."
                        : "The model suggests a low probability of diabetes. Maintain a healthy lifestyle to keep your risk low."}
                </p>
            </div>

            {sortedFeatures.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{ textAlign: 'left', marginTop: '3rem', background: 'rgba(255,255,255,0.5)', padding: '2rem', borderRadius: '16px' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '0.5rem' }}>
                        <Activity size={20} color="#64748b" />
                        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#334155' }}>Key Contributing Factors</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {sortedFeatures.map(([name, value], index, array) => {
                            const maxVal = array[0][1];
                            const widthPercent = (value / maxVal) * 100;

                            return (
                                <div key={name} className="feature-row">
                                    <div className="feature-name">{name}</div>
                                    <div className="feature-bar-bg">
                                        <motion.div
                                            className="feature-bar-fill"
                                            style={{
                                                background: themeColor,
                                                opacity: 0.8
                                            }}
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${widthPercent}%` }}
                                            transition={{ duration: 1, delay: index * 0.1 }}
                                        />
                                    </div>
                                    <div className="feature-value">{(value * 100).toFixed(1)}%</div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            <motion.button
                className="btn-primary"
                onClick={onReset}
                style={{ marginTop: '3rem', background: '#64748b' }}
                whileHover={{ scale: 1.05, background: '#475569' }}
                whileTap={{ scale: 0.95 }}
            >
                <RefreshCcw size={18} /> Start New Assessment
            </motion.button>
        </motion.div>
    );
};

export default ResultDisplay;
