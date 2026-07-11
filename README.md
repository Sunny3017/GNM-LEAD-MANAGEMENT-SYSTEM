# GNM Lead Management System

A complete MERN stack application for real estate inventory and lead management.

## Project Structure
```
.
├── backend/    # Node.js/Express/MongoDB API
└── frontend/   # React/Redux/Tailwind CSS client
```

## Prerequisites
- Node.js (v16 or later)
- MongoDB (running locally or MongoDB Atlas)

## Setup Instructions

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in backend directory (already created):
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/gnm-lead-management
   JWT_SECRET=your-jwt-secret-key-change-this-in-production
   JWT_EXPIRE=30d
   ```

4. Seed the admin user:
   ```bash
   npm run seed
   ```
   Default admin credentials:
   - Email: admin@gnm.com
   - Mobile: 9876543210
   - Password: admin123

5. Start the backend server:
   ```bash
   npm start
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

## Features

### Admin
- Add, edit, and manage employees
- Approve/reject properties added by employees
- Create, assign, and manage leads
- View dashboard with analytics

### Employee
- Search properties with advanced filters
- Add new properties (pending admin approval)
- View and update assigned leads
- Add follow-up notes
