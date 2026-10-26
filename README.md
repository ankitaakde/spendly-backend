# Spendly — Expense Tracker Backend

A Python FastAPI backend for managing personal expenses with user authentication and database integration.

## Features

- **FastAPI** — Modern Python framework for building backend applications
- **User Authentication** — User signup and login
- **JWT Authentication** — Token-based authentication
- **Expense Management** — Create and view expenses
- **Expense Filtering** — Filter expenses by month, category, and search
- **Database Integration** — SQLAlchemy for database operations
- **Auto-generated Documentation** — Available at `/docs` and `/redoc`
- **Data Validation** — Pydantic schemas for request validation

## Technologies Used

- Python
- FastAPI
- SQLAlchemy
- JWT
- Pydantic
- Uvicorn

## Setup

### 1. Create a Virtual Environment

**Windows:**

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

Add your own configuration:

```env
SECRET_KEY=your_own_secret_key
DATABASE_URL=your_database_connection_url
```

Use the correct database connection URL for your project.

**Important:** Never upload your real `.env` file or secret keys to GitHub.

### 4. Run the Server

Open the `app` folder:

```powershell
cd app
```

Start the application:

```bash
uvicorn main:app --reload
```

## Application URLs

Once the server is running:

- **Backend:** http://127.0.0.1:8000
- **Swagger Documentation:** http://127.0.0.1:8000/docs
- **ReDoc Documentation:** http://127.0.0.1:8000/redoc

## Main Modules

- **Users** — Signup and login
- **Authentication** — JWT token creation and validation
- **Expenses** — Create, view, and filter expenses
- **Database** — Database sessions and SQLAlchemy models

For available routes, request formats, and responses, check the Swagger documentation.

## Project Structure

```text
spendly-backend/
├── app/
│   ├── core/
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   └── main.py
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

## Development

- **Framework:** FastAPI
- **Server:** Uvicorn
- **Local Port:** 8000
- **Auto-reload:** Enabled

## Future Improvements

- Build a React frontend
- Connect the frontend to the backend
- Add expense summaries and charts
- Deploy the application online

## Author

**Ankit Aakde**

Python Backend Developer — Learning and Building with FastAPI

---

*Spendly — Track your expenses, understand your spending.*