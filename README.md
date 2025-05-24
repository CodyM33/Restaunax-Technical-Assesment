# Restaunax Technical Assessment - Order Management Dashboard 🍕🚀

## Project Overview

This project is a simplified full-stack restaurant order management dashboard built as part of the Restaunax Technical Assessment. It allows restaurant owners to manage orders efficiently by viewing order statuses, updating them, and handling different order types (delivery and pickup).

The backend is powered by Node.js and Express, providing a RESTful API for orders. The frontend is built with React and Material UI, featuring a responsive and intuitive interface.

---

## Features

- **View orders by status:** pending, preparing, ready, delivered
- **Detailed order view:** see customer info, items, total, and timestamps
- **Update order status:** change status to reflect progress
- **Create new orders:** via API for testing and development
- **Mobile-responsive UI:** works well on desktop and mobile devices
- **Mock data seeding:** generates sample orders with varying statuses and types

---

## Project Structure

restaunax-order-management/
├── backend/ # Node.js/Express backend API
│ ├── app.js # Main server file
│ ├── routes/ # API route handlers
│ ├── models/ # Data models or schema definitions (if any)
│ ├── seed.js # Seed script to generate mock orders
│ └── package.json
├── frontend/ # React + Material UI frontend application
│ ├── src/
│ ├── public/
│ └── package.json
└── README.md # Project documentation

### Prerequisites
- Node.js (version 14+ recommended)
- npm (comes with Node.js)

### Backend Setup
1. Navigate to the backend folder:

```bash
cd backend
Install dependencies:

bash
Copy
Edit
npm install
Seed the database (optional but recommended for testing):

bash
Copy
Edit
node seed.js
Start the backend server:

bash
Copy
Edit
npm run dev
(or node app.js if npm run dev is not configured)

The backend API will run on http://localhost:5000 (default).

Frontend Setup
Navigate to the frontend folder:

bash
Copy
Edit
cd frontend
Install dependencies:

bash
Copy
Edit
npm install
Start the React development server:

bash
Copy
Edit
npm start
The frontend will run on http://localhost:3000.

API Endpoints
Method	Endpoint	Description
GET	/orders	List all orders (filter optional)
GET	/orders/:id	Get details of a specific order
PATCH	/orders/:id	Update order status
POST	/orders	Create a new order

Example Order JSON
json
Copy
Edit
{
  "id": "ord_123456",
  "customerName": "Alex Johnson",
  "orderType": "delivery",
  "status": "pending",
  "total": 42.5,
  "createdAt": "2024-05-07T18:30:00Z",
  "items": [
    {
      "id": "item_1",
      "name": "Margherita Pizza",
      "quantity": 2,
      "price": 15.99
    },
    {
      "id": "item_2",
      "name": "Caesar Salad",
      "quantity": 1,
      "price": 8.99
    }
  ]
}
Challenges Faced
Synchronizing frontend state with backend updates

Designing an intuitive UI with Material UI that adapts to different screen sizes

Structuring backend routes for clear, maintainable code

Future Improvements
Implement real-time updates with WebSockets or Server-Sent Events

Add user authentication and role-based access control

Enhance filtering and search capabilities on orders

Containerize the application using Docker for easier deployment

Add analytics dashboards with charts and order statistics

License
This project is licensed under the MIT License.

Contact
Created by CodyM33. For questions or feedback, please open an issue or contact me on GitHub.
