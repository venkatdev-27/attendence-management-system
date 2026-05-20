# Attendance Management System (AMS)

Complete Attendance Management System with separate Admin Dashboard and Student Portal.

## Project Structure

```
AMS/
├── backend/           # Node.js + Express API (port 5000)
├── admin-dashboard/  # React Admin Dashboard (port 3001)
├── student-portal/   # React Student Portal (port 3000)
├── SPEC.md
└── README.md
```

## Quick Start

### 1. Backend
```bash
cd backend
npm install
npm run seed    # Creates admin@ams.com / admin123
npm start       # Runs on port 5000
```

### 2. Admin Dashboard
```bash
cd admin-dashboard
npm install
npm run dev     # Runs on port 3001
# Login: admin@ams.com / admin123
```

### 3. Student Portal
```bash
cd student-portal
npm install
npm run dev     # Runs on port 3000
# Register new students or login
```

## Features

### Backend
- JWT Authentication
- bcrypt password hashing
- MongoDB + Mongoose
- REST APIs
- Student CRUD
- Attendance tracking

### Admin Dashboard (port 3001)
- Dashboard with stats
- Student management
- Attendance management
- Profile

### Student Portal (port 3000)
- Registration/Login
- Mark daily attendance
- View attendance history
- Profile management

## Tech Stack
- **Backend**: Node.js, Express, MongoDB, JWT, bcrypt
- **Frontend**: React, Vite, Tailwind CSS, React Router, Axios