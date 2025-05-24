# Restaunax Order Management Dashboard

## Overview
A full-stack order management system built with Node.js/Express and React with Material UI.  
Allows restaurant owners to view, create, and update orders with real-time status tracking.

## Setup & Run

### Backend
```bash
cd backend
npm install
npm run dev       # start server on http://localhost:5000
```

### Frontend  
```bash
cd frontend
npm install
npm start         # open app on http://localhost:3000
```

###Implementation Overview

The backend is built with Node.js and Express, providing RESTful API endpoints to manage orders — including creating, retrieving, and updating order statuses. For simplicity, data is stored in-memory and seeded with sample orders.

The frontend is a React application styled with Material UI. It displays orders categorized by their status, allows viewing detailed order information, and supports updating order statuses. The UI is responsive, ensuring usability across desktop and mobile devices.

###Challenges
Keeping the frontend state in sync with the backend state

Keeping a clean, mobile-friendly UI

Designing scalable backend routes without bugs
