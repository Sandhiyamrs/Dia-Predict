import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Activity, Droplet, User, Scale, Microscope,
    Baby, Calculator, Heart, ArrowRight, Loader2, AlertCircle
} from 'lucide-react';

const InputField = ({ label, name, value, onChange, min, max, step, Icon, description }) => (
    <motion.div
        className="input-group"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
    >
        <div className="input-icon">
            <Icon size={20} />
        </div>
        <div className="input-wrapper">
            <label className="input-label" htmlFor={name}>{label}</label>
            <input
                className="styled-input"
                type="number"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                min={min}
                max={max}
                step={step}
                required
                placeholder="0"
            />
            {/* Optional Slider for Interaction */}
            {max && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={step || 1}
                        value={value}
                        onChange={onChange}
                        name={name}
                    />
                </div>
            )}
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{description}</span>
        </div>
    </motion.div>
);

const PredictionForm = ({ onPredict }) => {
    const [formData, setFormData] = useState({
        Pregnancies: 0,
        Glucose: 100,
        BloodPressure: 72,
        SkinThickness: 20,
        Insulin: 0,
        BMI: 30.0,
        DiabetesPedigreeFunction: 0.50,
        Age: 30
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            // Remove trailing slash if present
            API_URL = API_URL.replace(/\/$/, '');

            const response = await fetch(`${API_URL}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Prediction failed');
            const result = await response.json();

            // Artificial delay for better UX (loading state appreciation)
            setTimeout(() => onPredict(result), 800);
        } catch (err) {
            console.error(err);
            setError("Unable to connect to the AI engine. Please ensure the backend server is active.");
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-card"
            style={{ maxWidth: '900px', margin: '2rem auto', padding: '3rem' }}
        >
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{
                    display: 'inline-flex',
                    padding: '1rem',
                    background: '#ede9fe',
                    borderRadius: '50%',
                    color: '#8b5cf6',
                    marginBottom: '1rem'
                }}>
                    <Activity size={32} />
                </div>
                <h2 style={{ marginBottom: '0.5rem' }}>Patient Assessment Form</h2>
                <p>Complete the fields below for an accurate risk prediction.</p>
            </div>

            {error && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    style={{
                        background: '#fef2f2',
                        color: '#ef4444',
                        padding: '1rem',
                        borderRadius: '12px',
                        marginBottom: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        border: '1px solid #fecaca'
                    }}
                >
                    <AlertCircle size={20} />
                    {error}
                </motion.div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <InputField
                        label="Pregnancies"
                        name="Pregnancies"
                        value={formData.Pregnancies}
                        onChange={handleChange}
                        min="0" max="20"
                        Icon={Baby}
                        description="Number of times pregnant"
                    />
                    <InputField
                        label="Glucose (mg/dL)"
                        name="Glucose"
                        value={formData.Glucose}
                        onChange={handleChange}
                        min="0" max="300"
                        Icon={Droplet}
                        description="Plasma glucose concentration"
                    />
                    <InputField
                        label="Blood Pressure (mm Hg)"
                        name="BloodPressure"
                        value={formData.BloodPressure}
                        onChange={handleChange}
                        min="0" max="200"
                        Icon={Heart}
                        description="Diastolic blood pressure"
                    />
                    <InputField
                        label="Skin Thickness (mm)"
                        name="SkinThickness"
                        value={formData.SkinThickness}
                        onChange={handleChange}
                        min="0" max="100"
                        Icon={User}
                        description="Triceps skin fold thickness"
                    />
                    <InputField
                        label="Insulin (mu U/ml)"
                        name="Insulin"
                        value={formData.Insulin}
                        onChange={handleChange}
                        min="0" max="900"
                        Icon={Microscope}
                        description="2-Hour serum insulin"
                    />
                    <InputField
                        label="BMI"
                        name="BMI"
                        value={formData.BMI}
                        onChange={handleChange}
                        min="0" max="70" step="0.1"
                        Icon={Scale}
                        description="Body mass index"
                    />
                    <InputField
                        label="Diabetes Pedigree"
                        name="DiabetesPedigreeFunction"
                        value={formData.DiabetesPedigreeFunction}
                        onChange={handleChange}
                        min="0" max="3" step="0.01"
                        Icon={Calculator}
                        description="Diabetes pedigree function"
                    />
                    <InputField
                        label="Age (years)"
                        name="Age"
                        value={formData.Age}
                        onChange={handleChange}
                        min="0" max="120"
                        Icon={User}
                        description="Age of the patient"
                    />
                </div>

                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <motion.button
                        className="btn-primary"
                        type="submit"
                        disabled={loading}
                        whileHover={!loading ? { scale: 1.05 } : {}}
                        whileTap={!loading ? { scale: 0.95 } : {}}
                        style={{ minWidth: '220px' }}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} /> Analyzing...
                            </>
                        ) : (
                            <>
                                Generate Prediction <ArrowRight size={20} />
                            </>
                        )}
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
};

export default PredictionForm;
