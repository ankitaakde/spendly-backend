# Spendly — Full-Stack Expense Tracker

**A full-stack personal expense management application built with React and Python FastAPI.**

Spendly helps users manage their daily expenses through secure authentication, expense tracking, filtering, and analytics. It includes a React frontend connected to a FastAPI backend with PostgreSQL database integration.

## Live Demo

- **Frontend:** https://spendly-backend-roan.vercel.app/
- **Backend API:** https://spendly-backend-15og.onrender.com
- **API Documentation:** https://spendly-backend-15og.onrender.com/docs

## Features

- **User Authentication** — User signup and login.
- **JWT Authentication** — Secure token-based authentication.
- **Dashboard** — View expense summaries and analytics.
- **Expense Management** — Add and view personal expenses.
- **Expense Filtering** — Filter expenses by month, category, and search.
- **Recent Expenses** — View recently added transactions.
- **Data Visualization** — Expense charts and summaries.
- **Database Integration** — PostgreSQL with SQLAlchemy.
- **Responsive Frontend** — React-based user interface.
- **API Documentation** — Interactive Swagger UI.

## Technologies Used

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Vite

### Backend
- Python
- FastAPI
- SQLAlchemy
- JWT
- Pydantic
- Uvicorn
- Bcrypt

### Database & Deployment
- PostgreSQL
- Render — Backend Hosting
- Vercel — Frontend Hosting
- Git & GitHub

## Project Structure

```text
spendly-backend/
├── app/
│   ├── core/
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   └── main.py
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

## Backend Setup

### 1. Create a Virtual Environment

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the project root using `.env.example` as a reference.

```env
SECRET_KEY=your_own_secret_key
DATABASE_URL=your_database_connection_url
```

Never upload your real `.env` file or secret keys to GitHub.

### 4. Run the Backend

```powershell
cd app
uvicorn main:app --reload
```

Backend: `http://127.0.0.1:8000`

Swagger: `http://127.0.0.1:8000/docs`

## Frontend Setup

### 1. Open the Frontend Folder

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the React Application

```bash
npm run dev
```

Frontend: `http://localhost:5173`

## Deployment

- Frontend deployed on Vercel.
- Backend deployed on Render.
- PostgreSQL database configured for online data storage.

## Future Improvements

- Improve automated testing.
- Add more expense analytics.
- Enhance dashboard functionality.
- Add additional reporting features.

## Author

**Ankit Aakde**

Python Backend Developer | React | FastAPI | REST APIs

---

*Spendly — Track your expenses, understand your spending, and make better decisions.*
