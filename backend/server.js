// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { seedOrders } = require('./seeds'); 
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// In-memory database - Use seeded data
let orders = seedOrders();

// GET /orders - List all orders (simple filtering by status optional)
app.get('/orders', (req, res) => {
  const { status } = req.query;
  
  if (status) {
    const filteredOrders = orders.filter(order => order.status === status);
    return res.json(filteredOrders);
  }
  
  res.json(orders);
});

// GET /orders/:id - Retrieve a specific order
app.get('/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  res.json(order);
});

// PATCH /orders/:id - Update order status
app.patch('/orders/:id', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'preparing', 'ready', 'delivered'];
  
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }
  
  const orderIndex = orders.findIndex(o => o.id === req.params.id);
  
  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  orders[orderIndex] = {
    ...orders[orderIndex],
    status
  };
  
  res.json(orders[orderIndex]);
});

// POST /orders - Create a new order (for testing)
app.post('/orders', (req, res) => {
  const { customerName, orderType, items } = req.body;
  
  // Basic validation
  if (!customerName || !orderType || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  // Validate orderType
  if (!['delivery', 'pickup'].includes(orderType)) {
    return res.status(400).json({ message: 'Invalid order type' });
  }
  
  // Validate items
  for (const item of items) {
    if (!item.name || typeof item.quantity !== 'number' || typeof item.price !== 'number') {
      return res.status(400).json({ message: 'Invalid item data' });
    }
  }
  
  // Calculate total
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Create new order
  const newOrder = {
    id: (orders.length + 1).toString(),
    customerName,
    orderType,
    items: items.map((item, index) => ({
      id: `item-${Date.now()}-${index}`,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    })),
    status: 'pending',
    total: parseFloat(total.toFixed(2)),
    createdAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For testing purposes
