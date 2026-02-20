// frontend/src/api.js
export async function predictDiabetes(patientData) {
  try {
    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patientData)
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Prediction failed:", err);
    return null;
  }
}