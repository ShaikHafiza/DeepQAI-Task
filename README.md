# Full Stack Application: Django + React

This is a **full-stack application** combining a **Django backend** with a **React frontend**.  
Django handles the REST API and authentication, using SQLite as the default database, while React powers the client-side interface.

---

## 🗂 Project Layout

project-root/
│── backend/ # Django backend
│── client/ # React frontend


---

## ⚡ Prerequisites

Before you begin, make sure the following are installed:

- [Python 3.x](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/installation/)
- [Node.js](https://nodejs.org/) (with npm or yarn)

---

## 🚀 Setup Instructions

### 1️⃣ Backend (Django)

1. Navigate to the backend folder:

   ```bash
   cd backend

2. Install dependencies:
  ```bash
      pip install -r requirements.txt
```
3. Apply database migrations:
 ```bash
python manage.py migrate
```

4. Start the backend server:
 ```bash
python manage.py runserver

```
The backend will be available at: http://127.0.0.1:8000/



2️⃣ Frontend (React)

1. Open a new terminal and navigate to the client folder:
 ```bash
cd client
```

2. Install dependencies:
 ```bash
npm install
```

3. Start the frontend development server:
 ```bash
npm run dev
```

4. The frontend will run at: http://localhost:5173/
 (default Vite port)


🗄 Database

Uses SQLite by default (db.sqlite3 inside the backend folder).

No additional setup is required.

🔑 Authentication

Powered by Django's default authentication system.

Users can be created via the Django Admin Panel (/admin/) or API endpoints if configured.
