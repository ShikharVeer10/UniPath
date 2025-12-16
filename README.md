🎓 College Admission Predictor

A machine learning–powered web application that predicts a student’s probability of admission to a university based on academic profile parameters such as GRE score, TOEFL score, CGPA, research experience, and more.

This project demonstrates an end-to-end ML pipeline — from data preprocessing and model training to backend APIs and deployment-ready structure.

🚀 Project Overview

College admissions are influenced by multiple academic and profile-based factors. This project aims to:

Train a machine learning model to predict admission probability

Provide a REST API for predictions

Offer a clean backend architecture suitable for production

Be fully reproducible and GitHub-ready

🧠 Machine Learning Approach

Problem Type: Regression

Target Variable: Chance of Admit

Models Used:

Linear Regression

Ridge / Lasso Regression

(Extendable to XGBoost / Random Forest)

Evaluation Metrics:

R² Score

Mean Squared Error (MSE)

📊 Features Used

GRE Score

TOEFL Score

University Rating

Statement of Purpose (SOP) Strength

Letter of Recommendation (LOR) Strength

CGPA

Research Experience

🏗️ Project Structure
college-admission-predictor/
│
├── app/
│   ├── main.py              # FastAPI entry point
│   ├── models/              # ML model loading & prediction logic
│   ├── schemas/             # Pydantic request/response schemas
│   ├── crud/                # Database / prediction CRUD logic
│   ├── core/                # Config, settings, security
│   └── routers/             # API routes
│
├── ml/
│   ├── data/                # Dataset
│   ├── train.py             # Model training script
│   ├── evaluate.py          # Model evaluation
│   └── model.pkl            # Trained model
│
├── notebooks/
│   └── analysis.ipynb       # EDA & experimentation
│
├── requirements.txt
├── README.md
└── .gitignore

🔧 Tech Stack

Python

Scikit-learn

Pandas & NumPy

FastAPI

Pydantic

Uvicorn

Matplotlib / Seaborn

🧪 How to Run Locally
1️⃣ Clone the Repository
git clone https://github.com/<your-username>/college-admission-predictor.git
cd college-admission-predictor

2️⃣ Create Virtual Environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

3️⃣ Install Dependencies
pip install -r requirements.txt

4️⃣ Train the Model
python ml/train.py

5️⃣ Start Backend Server
uvicorn app.main:app --reload

6️⃣ Test API

Open browser:

http://127.0.0.1:8000/docs

🔗 API Example

POST /predict

{
  "gre_score": 320,
  "toefl_score": 110,
  "university_rating": 4,
  "sop": 4.5,
  "lor": 4.0,
  "cgpa": 8.9,
  "research": 1
}


Response

{
  "admission_probability": 0.78
}

📈 Results

Achieved strong predictive performance on test data

Model generalizes well for unseen profiles

Modular backend allows easy model upgrades

🧩 Future Improvements

Add authentication & user history

Improve model using ensemble methods

Frontend dashboard (React / Streamlit)

RAG-based university recommendation system

Model explainability using SHAP

👨‍💻 Author

Shikhar Veeramachieni
Machine Learning & AI Enthusiast

⭐ Why This Project Matters

This project showcases:

Real-world ML problem solving

Clean backend architecture

Reproducibility & deployment readiness

Strong foundation for AI-driven decision systems
