# Attendance Management System - Specification Document

## Project Overview
- **Project Name**: AMS (Attendance Management System)
- **Project Type**: Full-stack Web Application (SaaS Dashboard)
- **Core Functionality**: A comprehensive attendance tracking system for training institutes with student self-service and admin management capabilities
- **Target Users**: Training institute administrators and students

---

## Technology Stack

### Backend
- **Runtime**: Node.js v22+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt
- **Environment**: dotenv

### Frontend
- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS 3+
- **Routing**: React Router DOM v6
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Icons**: Lucide React

---

## UI/UX Specification

### Color Palette
```css
Primary: #6366F1 (Indigo-500)
Primary Dark: #4F46E5 (Indigo-600)
Primary Light: #818CF8 (Indigo-400)
Secondary: #10B981 (Emerald-500)
Accent: #F59E0B (Amber-500)
Background: #F8FAFC (Slate-50)
Surface: #FFFFFF
Text Primary: #1E293B (Slate-800)
Text Secondary: #64748B (Slate-500)
Error: #EF4444 (Red-500)
Success: #22C55E (Green-500)
Warning: #F59E0B (Amber-500)
Dark Mode Background: #0F172A (Slate-900)
Dark Mode Surface: #1E293B (Slate-800)
```

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, tracking-tight
- **Body**: Regular, leading-relaxed
- **Code**: JetBrains Mono

### Responsive Breakpoints
- Mobile: < 360px
- Mobile Large: 360px - 640px
- Tablet: 640px - 1024px
- Laptop: 1024px - 1280px
- Desktop: > 1280px

### Layout Structure

#### Landing Page
- Hero section with gradient background
- Features section with cards
- Call-to-action buttons
- Footer with links

#### Login/Register Pages
- Centered card layout
- Form with validation
- Animated background
- Social login options (future)

#### Admin Dashboard
- Collapsible sidebar (240px width)
- Top navbar with user menu
- Main content area with grid
- Stats cards at top
- Charts and tables below

#### Student Dashboard
- Top navbar
- Quick stats
- Attendance history table
- Profile section

### Components

#### Cards
- Rounded corners (12px)
- Subtle shadow
- Gradient borders on hover
- Smooth scale animation

#### Tables
- Striped rows
- Hover effects
- Sortable columns
- Pagination controls

#### Forms
- Floating labels
- Validation states
- Loading states
- Error messages

#### Buttons
- Primary: Indigo gradient
- Secondary: Outlined
- Danger: Red
- Icon buttons with tooltips

#### Modals
- Backdrop blur
- Slide-in animation
- Close on escape/click outside

---

## Database Schema

### Users Collection
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String (required),
  role: String (enum: ['student', 'admin'], default: 'student'),
  course: String (required),
  createdAt: Date (default: now),
  updatedAt: Date
}
```

### Attendance Collection
```javascript
{
  studentId: ObjectId (ref: User, required),
  date: Date (required),
  status: String (enum: ['present', 'absent'], required),
  markedBy: ObjectId (ref: User),
  createdAt: Date (default: now)
}
```

---

## API Endpoints

### Authentication
- POST /api/auth/register - Student registration
- POST /api/auth/login - User login
- GET /api/auth/me - Get current user

### Students (Admin only)
- GET /api/students - Get all students
- GET /api/students/:id - Get single student
- POST /api/students - Create student
- PUT /api/students/:id - Update student
- DELETE /api/students/:id - Delete student

### Attendance
- POST /api/attendance/mark - Mark attendance (student self)
- POST /api/attendance/admin-mark - Mark attendance (admin)
- GET /api/attendance/student/:id - Get student attendance
- GET /api/attendance/date/:date - Get attendance by date
- PUT /api/attendance/:id - Update attendance
- DELETE /api/attendance/:id - Delete attendance
- GET /api/attendance/stats - Get attendance statistics

### Admin Dashboard
- GET /api/admin/stats - Dashboard statistics
- GET /api/admin/today - Today's attendance

---

## Security Requirements

1. **Password Hashing**: bcrypt with 10 rounds
2. **JWT Tokens**: 7-day expiration
3. **Protected Routes**: Middleware validation
4. **Role-based Access**: Admin-only endpoints
5. **Input Validation**: Server-side validation
6. **Duplicate Prevention**: Email uniqueness, one-attendance-per-day

---

## Functionality Specification

### Student Features
1. Register with unique email
2. Login with email/password
3. View own profile
4. Mark daily attendance (once per day)
5. View attendance history
6. View attendance percentage

### Admin Features
1. Login with admin credentials
2. View dashboard with stats
3. CRUD students
4. Mark/manage attendance
5. View attendance by date
6. Search and filter
7. Pagination

---

## Acceptance Criteria

### Authentication
- [ ] Students can register with validation
- [ ] Students can login and receive JWT
- [ ] Admins can login with special credentials
- [ ] Protected routes redirect to login

### Student Dashboard
- [ ] Shows personal stats
- [ ] Can mark attendance once daily
- [ ] Can view attendance history
- [ ] Profile shows all details

### Admin Dashboard
- [ ] Shows total students count
- [ ] Shows today's present/absent
- [ ] Can add/edit/delete students
- [ ] Can manage all attendance
- [ ] Search functionality works

### UI/UX
- [ ] Responsive on all devices
- [ ] Dark mode support
- [ ] Smooth animations
- [ ] Loading states shown
- [ ] Error handling displayed