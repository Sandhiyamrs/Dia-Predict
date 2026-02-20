import React, { useState } from "react";
import { predictDiabetes } from "../api";

export default function DiabetesForm() {
  const [formData, setFormData] = useState({
    Pregnancies: 0,
    Glucose: 0,
    BloodPressure: 0,
    SkinThickness: 0,
    Insulin: 0,
    BMI: 0,
    DiabetesPedigreeFunction: 0,
    Age: 0,
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const prediction = await predictDiabetes(formData);
    setResult(prediction);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label>{key}: </label>
            <input
              type="number"
              name={key}
              value={formData[key]}
              onChange={handleChange}
            />
          </div>
        ))}
        <button type="submit">Predict</button>
      </form>
      {result && (
        <div>
          <p>Prediction: {result.prediction}</p>
          <p>Probability: {result.probability}</p>
          <p>Risk Level: {result.risk_level}</p>
        </div>
      )}
    </div>
  );
}