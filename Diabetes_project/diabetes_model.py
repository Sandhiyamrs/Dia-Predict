# ================================
# DIABETES PREDICTION PROJECT
# ================================

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import joblib

from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (accuracy_score, confusion_matrix,
                             precision_score, recall_score,
                             f1_score, roc_curve, auc, mean_squared_error)

# ================================
# 1. LOAD DATASET
# ================================

df = pd.read_csv("diabetes.csv")

print("Dataset Loaded Successfully")
print("Dataset Shape:", df.shape)

# ================================
# 2. DATA PREPROCESSING
# ================================

# Replace zero values with NaN for specific columns
cols_with_zero = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']
df[cols_with_zero] = df[cols_with_zero].replace(0, np.nan)

# Fill missing values with median
df.fillna(df.median(), inplace=True)

# Separate features and target
X = df.drop("Outcome", axis=1)
y = df["Outcome"]

# ================================
# 3. TRAIN TEST SPLIT
# ================================

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

print("Training size:", X_train.shape)
print("Testing size :", X_test.shape)

# ================================
# 4. FEATURE SCALING (for Logistic & Linear)
# ================================

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# ================================
# 5. LOGISTIC REGRESSION
# ================================

log_model = LogisticRegression(max_iter=1000)
log_model.fit(X_train_scaled, y_train)

y_pred_log = log_model.predict(X_test_scaled)

print("\nLogistic Regression Accuracy:", accuracy_score(y_test, y_pred_log))

# ================================
# 5b. LINEAR REGRESSION (for experimentation)
# ================================

lin_model = LinearRegression()
lin_model.fit(X_train_scaled, y_train)

y_pred_lin = lin_model.predict(X_test_scaled)
# Convert predictions to 0/1 for comparison
y_pred_lin_class = np.where(y_pred_lin >= 0.5, 1, 0)

print("Linear Regression Accuracy:", accuracy_score(y_test, y_pred_lin_class))
print("Linear Regression MSE:", mean_squared_error(y_test, y_pred_lin))

# ================================
# 6. RANDOM FOREST + GRID SEARCH
# ================================

print("\nTraining Random Forest with GridSearch...")

param_grid = {
    'n_estimators': [100, 200],
    'max_depth': [None, 5, 10],
    'min_samples_split': [2, 5]
}

grid = GridSearchCV(
    RandomForestClassifier(random_state=42),
    param_grid,
    cv=5,
    n_jobs=-1
)

grid.fit(X_train, y_train)

best_rf = grid.best_estimator_

print("Best Parameters Found:", grid.best_params_)

y_pred_rf = best_rf.predict(X_test)

print("Random Forest Accuracy:", accuracy_score(y_test, y_pred_rf))

# ================================
# 7. EVALUATION FUNCTION
# ================================

def evaluate_model(name, y_true, y_pred):
    print("\n==============================")
    print(name)
    print("==============================")
    print("Accuracy :", accuracy_score(y_true, y_pred))
    print("Precision:", precision_score(y_true, y_pred))
    print("Recall   :", recall_score(y_true, y_pred))
    print("F1 Score :", f1_score(y_true, y_pred))
    print("Confusion Matrix:\n", confusion_matrix(y_true, y_pred))


evaluate_model("Logistic Regression", y_test, y_pred_log)
evaluate_model("Linear Regression", y_test, y_pred_lin_class)
evaluate_model("Random Forest", y_test, y_pred_rf)

# ================================
# 8. CROSS VALIDATION
# ================================

print("\nCross Validation Scores")

log_cv = cross_val_score(log_model, X_train_scaled, y_train, cv=5)
lin_cv = cross_val_score(lin_model, X_train_scaled, y_train, cv=5)
rf_cv = cross_val_score(best_rf, X_train, y_train, cv=5)

print("Logistic Regression CV Mean:", log_cv.mean())
print("Linear Regression CV Mean  :", lin_cv.mean())
print("Random Forest CV Mean      :", rf_cv.mean())

# ================================
# 9. OVERFITTING CHECK
# ================================

print("\nTraining Accuracy Comparison")

print("Logistic Train Accuracy :", log_model.score(X_train_scaled, y_train))
print("Linear Train Accuracy   :", lin_model.score(X_train_scaled, y_train))
print("Random Forest Train Accuracy :", best_rf.score(X_train, y_train))

# ================================
# 10. ROC CURVE + AUC
# ================================

y_probs = best_rf.predict_proba(X_test)[:, 1]

fpr, tpr, thresholds = roc_curve(y_test, y_probs)
roc_auc = auc(fpr, tpr)

plt.figure()
plt.plot(fpr, tpr)
plt.plot([0, 1], [0, 1], linestyle='--')
plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")
plt.title(f"ROC Curve (AUC = {roc_auc:.2f})")
plt.show()

print("AUC Score:", roc_auc)

# ================================
# 11. FEATURE IMPORTANCE
# ================================

importances = best_rf.feature_importances_
feature_names = X.columns

feature_importance_df = pd.DataFrame({
    "Feature": feature_names,
    "Importance": importances
}).sort_values(by="Importance", ascending=False)

print("\nFeature Importance:")
print(feature_importance_df)

# ================================
# 12. ACCURACY COMPARISON GRAPH
# ================================

model_names = ['Logistic Regression', 'Linear Regression', 'Random Forest']
accuracies = [
    accuracy_score(y_test, y_pred_log),
    accuracy_score(y_test, y_pred_lin_class),
    accuracy_score(y_test, y_pred_rf)
]

plt.figure(figsize=(8,5))
plt.bar(model_names, accuracies, color=['blue', 'orange', 'green'])
plt.ylim(0, 1)
plt.ylabel("Accuracy")
plt.title("Model Accuracy Comparison")
plt.show()

# ================================
# 13. SAVE MODEL
# ================================

joblib.dump(best_rf, "diabetes_model.pkl")
print("\nModel Saved Successfully")