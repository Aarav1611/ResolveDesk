# ResolveDesk — Smart Complaint Management System

A full-stack MEAN (MongoDB, Express.js, Angular, Node.js) complaint management system designed for college environments. Features auto-priority detection, 48-hour escalation logic, role-based dashboards, and a modern Angular Material UI.

---

## 🏗️ Project Architecture

```
AWD Project-ResolveDesk/
├── backend/
│   ├── config/db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Register / Login / JWT
│   │   └── complaintController.js   # CRUD + Stats
│   ├── middleware/auth.js           # JWT protect + role authorize
│   ├── models/
│   │   ├── User.js                  # User schema (bcrypt hashing)
│   │   └── Complaint.js            # Complaint schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── complaintRoutes.js
│   ├── services/
│   │   ├── priorityService.js       # Keyword-based priority detection
│   │   └── escalationService.js     # 48h auto-escalation cron job
│   ├── server.js                    # Express entry point
│   ├── seed.js                      # Sample data seeder
│   └── .env                         # Environment variables
│
└── frontend/                        # Angular 21 standalone app
    └── src/app/
        ├── guards/auth.guard.ts     # Auth + role-based route guards
        ├── interceptors/jwt.interceptor.ts
        ├── models/interfaces.ts     # TypeScript interfaces
        ├── services/
        │   ├── auth.service.ts
        │   └── complaint.service.ts
        └── pages/
            ├── login/
            ├── register/
            ├── student-dashboard/
            └── admin-dashboard/
```

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** running locally on `mongodb://localhost:27017`
- **Angular CLI** (installed globally or via npx)

### 1. Start MongoDB

Make sure MongoDB is running locally. Default connection: `mongodb://localhost:27017/resolvedesk`

### 2. Backend Setup

```bash
cd backend
npm install          # Install dependencies (already done if cloned)
node seed.js         # Seed sample data (admin + students + complaints)
npm run dev          # Start with nodemon (or: node server.js)
```

Backend runs at: **http://localhost:5000**

### 3. Frontend Setup

```bash
cd frontend
npm install          # Install dependencies (already done if cloned)
ng serve             # Start Angular dev server
```

Frontend runs at: **http://localhost:4200**

---

## 🔐 Sample Login Credentials

| Role    | Email                    | Password    |
|---------|--------------------------|-------------|
| Admin   | admin@resolvedesk.com    | admin123    |
| Student | aarav@student.com        | student123  |
| Student | priya@student.com        | student123  |

> Run `node seed.js` in the backend directory to create these accounts.

---

## 🧠 Key Business Logic

### Auto-Priority Detection
Complaints are automatically assigned a priority based on keywords in the title/description:
- **🔴 HIGH**: electricity, power, water leak, fire, short circuit, gas leak
- **🟡 MEDIUM**: internet, wifi, network, connectivity
- **🟢 LOW**: everything else

### 48-Hour Escalation
A cron job runs every hour and checks for unresolved complaints older than 48 hours. Any matching complaint is automatically marked as **Escalated**.

---

## 📡 API Endpoints

| Method | Endpoint                       | Access  | Description              |
|--------|--------------------------------|---------|--------------------------|
| POST   | `/api/auth/register`           | Public  | Register a new user      |
| POST   | `/api/auth/login`              | Public  | Login and get JWT token  |
| GET    | `/api/auth/me`                 | Private | Get current user profile |
| GET    | `/api/complaints`              | Private | Get complaints (filtered)|
| POST   | `/api/complaints`              | Student | Create new complaint     |
| GET    | `/api/complaints/stats`        | Admin   | Dashboard statistics     |
| GET    | `/api/complaints/:id`          | Private | Get single complaint     |
| PUT    | `/api/complaints/:id/status`   | Admin   | Update complaint status  |
| PUT    | `/api/complaints/:id/feedback` | Student | Add feedback             |
| DELETE | `/api/complaints/:id`          | Admin   | Delete a complaint       |

---

## 🎨 UI Features

- **Angular Material** components (cards, tables, toolbars, forms)
- **Role-based routing** (students and admins see different dashboards)
- **Priority color coding**: Red (High), Yellow (Medium), Green (Low)
- **Status badges**: color-coded chips for Pending, In Progress, Resolved, Escalated
- **Responsive design** with mobile breakpoints
- **JWT interceptor** auto-attaches auth tokens to API calls

---

## 🛠️ Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Frontend   | Angular 21, Angular Material, SCSS |
| Backend    | Node.js, Express.js                |
| Database   | MongoDB, Mongoose                  |
| Auth       | JWT, bcryptjs                      |
| Scheduling | node-cron                          |
