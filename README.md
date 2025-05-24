# Restaunax Technical Assessment - Order Management Dashboard 🍕🚀

## Overview

This project is a full-stack order management dashboard built with Node.js/Express for the backend and React with Material UI for the frontend. It allows restaurant owners to view, create, and update orders in real time, managing statuses like pending, preparing, ready, and delivered.

---

## Setup and Run Instructions

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
Install dependencies:

bash
Copy
Edit
npm install
Seed initial mock data (optional):

bash
Copy
Edit
node seed.js
Start the backend server:

bash
Copy
Edit
npm run dev
The server will run on http://localhost:5000.

Frontend
Navigate to the frontend directory:

bash
Copy
Edit
cd frontend
Install dependencies:

bash
Copy
Edit
npm install
Start the React app:

bash
Copy
Edit
npm start
The app will open at http://localhost:3000.

Implementation Summary
Backend: RESTful API with CRUD operations for orders using Express.

Frontend: React app styled with Material UI components providing a responsive UI.

Data Storage: In-memory data structure seeded with mock orders for simplicity.

Features: Viewing orders by status, detailed order views, and status updates.

Challenges Faced
Maintaining synchronization between frontend state and backend data.

Designing a clean, mobile-responsive UI using Material UI.

Structuring the backend API for clarity and extensibility.
