# PrimeTrade Assignment

A production-grade, full-stack task management application developed for an evaluation. This project demonstrates a scalable, industry-standard architecture using **FastAPI**, **Prisma ORM**, and **Next.js 14**.

---

## Technical Highlights (Assignment Focus)

* **Stateless Authentication**: Implemented using **JWT (JSON Web Tokens)** with secure storage in cookies for server-side protection and `localStorage` for client-side state.
* **Role-Based Access Control (RBAC)**: Supports `ADMIN` and `USER` roles out of the box.
    * **Admins**: Can view and manage (delete) any task in the system regardless of ownership.
    * **Users**: Restricted to viewing and managing only the tasks they have created.
* **Persistent Logging**: All API activity is recorded in a `server.log` file, ensuring observability and a clear audit trail for system actions.
* **Type Safety**: End-to-end type safety using **Pydantic** models in the backend and **TypeScript Interfaces** in the frontend.

---
## RBAC Demonstration
To verify the implementation of Role-Based Access Control:

Register a new account and select the ADMIN role.

Register a second account as a USER.

Observe that the ADMIN dashboard displays a global view of all tasks, while the USER view is restricted to their own data.

Verify that the server.log file in the backend directory has updated with timestamps for each action.
---

## Tech Stack

### **Backend**
* **Framework**: FastAPI (Python)
* **ORM**: Prisma
* **Database**: PostgreSQL
* **Security**: Passlib (Bcrypt) & Jose (JWT)

### **Frontend**
* **Framework**: Next.js 14 (App Router)
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **API Client**: Axios with Interceptors

---

## 📂 Project Structure

```text
PrimeTrade-Assg/
├── backend/
│   ├── app/
│   │   ├── main.py          # Entry point & API routes
│   │   ├── schemas.py       # Pydantic validation models
│   │   └── database.py      # Prisma client initialization
│   ├── server.log           # Activity logs 
│   └── schema.prisma        # Database schema
└── frontend/
    ├── src/
    │   ├── app/             # Next.js App Router 
    │   ├── lib/             # API configuration
    │   └── middleware.ts    # Route protection logic
    └── tailwind.config.ts   # UI configuration
```
## ⚙️ Setup & Installation

### 1. Environment Configuration

Before running the application, you must set up the following environment files:

**Backend (`backend/.env`):**
```env
DATABASE_URL="your_database_url"
```

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_API_URL="url"
```

### 2. Backend Setup

Navigate to the backend directory and install the necessary Python environment:
```bash
cd backend
pip install -r requirements.txt
```

Initialize the database schema using Prisma:
```bash
npx prisma generate
npx prisma db push
```

Start the FastAPI server:
```bash
python -m uvicorn app.main:app --reload
```

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

Start the Next.js development server:
```bash
npm run dev
```

> **Note:** The application will be accessible at `http://localhost:3000`.
