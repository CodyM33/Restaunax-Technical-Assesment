// App.jsx
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Grid,
  Chip,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import RestaurantIcon from '@mui/icons-material/Restaurant';

// API service for backend calls
const API_URL = 'http://localhost:5000';

const fetchOrders = async (statusFilter = '') => {
  try {
    const url = statusFilter 
      ? `${API_URL}/orders?status=${statusFilter}`
      : `${API_URL}/orders`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

const fetchOrderById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/orders/${id}`);
    if (!response.ok) throw new Error('Failed to fetch order');
    return await response.json();
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
};

const updateOrderStatus = async (id, status) => {
  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update order');
    return await response.json();
  } catch (error) {
    console.error('Error updating order:', error);
    return null;
  }
};

const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
};

// Status chip color mapper
const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'preparing':
      return 'info';
    case 'ready':
      return 'success';
    case 'delivered':
      return 'default';
    default:
      return 'default';
  }
};

// Order Details Dialog Component
const OrderDetailsDialog = ({ open, order, onClose }) => {
  if (!order) return null;
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Order #{order.id} - {order.customerName}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle1" gutterBottom>Order Type:</Typography>
              <Typography variant="body1">{order.orderType}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" gutterBottom>Status:</Typography>
              <Chip 
                label={order.status} 
                color={getStatusColor(order.status)} 
                variant="outlined" 
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Items:</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                        <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right"><strong>Total:</strong></TableCell>
                      <TableCell align="right"><strong>${order.total.toFixed(2)}</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Created At:</Typography>
              <Typography variant="body1">{new Date(order.createdAt).toLocaleString()}</Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// Edit Status Dialog Component
const EditStatusDialog = ({ open, order, onClose, onSave }) => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  const handleSave = async () => {
    setLoading(true);
    const updated = await updateOrderStatus(order.id, status);
    setLoading(false);
    if (updated) {
      onSave(updated);
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Order Status</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, minWidth: 250 }}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="preparing">Preparing</MenuItem>
              <MenuItem value="ready">Ready</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSave} 
          color="primary" 
          disabled={loading || status === order.status}
        >
          {loading ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Create Order Dialog Component
const CreateOrderDialog = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    orderType: 'delivery',
    items: [{ name: '', quantity: 1, price: 0 }]
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'name' ? value : Number(value)
    };
    setFormData({ ...formData, items: updatedItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', quantity: 1, price: 0 }]
    });
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const created = await createOrder(formData);
    setLoading(false);
    if (created) {
      onSave(created);
      // Reset form
      setFormData({
        customerName: '',
        orderType: 'delivery',
        items: [{ name: '', quantity: 1, price: 0 }]
      });
    }
  };

  const isFormValid = () => {
    return (
      formData.customerName.trim() !== '' &&
      formData.items.length > 0 &&
      formData.items.every(item => 
        item.name.trim() !== '' && 
        item.quantity > 0 && 
        item.price > 0
      )
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Test Order</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Name"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Order Type</InputLabel>
                <Select
                  name="orderType"
                  value={formData.orderType}
                  label="Order Type"
                  onChange={handleChange}
                >
                  <MenuItem value="delivery">Delivery</MenuItem>
                  <MenuItem value="pickup">Pickup</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Items
              </Typography>
              {formData.items.map((item, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="Item Name"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Quantity"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        InputProps={{ inputProps: { min: 1 } }}
                        required
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Price ($)"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Button 
                        fullWidth 
                        color="error" 
                        variant="outlined"
                        disabled={formData.items.length <= 1}
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={addItem}
                sx={{ mt: 1 }}
              >
                Add Item
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          disabled={loading || !isFormValid()}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main App Component
const App = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [editStatusOpen, setEditStatusOpen] = useState(false);
  const [createOrderOpen, setCreateOrderOpen] = useState(false);

  // Load orders
  const loadOrders = async () => {
    setLoading(true);
    const data = await fetchOrders(statusFilter);
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(() => {
      loadOrders();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [statusFilter]);

  const handleViewOrder = async (id) => {
    const order = await fetchOrderById(id);
    if (order) {
      setSelectedOrder(order);
      setOrderDetailsOpen(true);
    }
  };

  const handleEditStatus = (order) => {
    setSelectedOrder(order);
    setEditStatusOpen(true);
  };

  const handleStatusSave = (updatedOrder) => {
    setOrders(orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
    setEditStatusOpen(false);
  };

  const handleCreateOrder = () => {
    setCreateOrderOpen(true);
  };

  const handleOrderCreated = (newOrder) => {
    setOrders([newOrder, ...orders]);
    setCreateOrderOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <RestaurantIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Restaunax Order Management
          </Typography>
          <IconButton 
            color="inherit" 
            onClick={loadOrders}
            disabled={loading}
          >
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1">
            Order Management Dashboard
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCreateOrder}
          >
            Create Test Order
          </Button>
        </Box>
        
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                Filter by Status:
              </Typography>
              <FormControl sx={{ minWidth: 150 }}>
                <Select
                  value={statusFilter}
                  displayEmpty
                  onChange={(e) => setStatusFilter(e.target.value)}
                  size="small"
                >
                  <MenuItem value="">All Orders</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="preparing">Preparing</MenuItem>
                  <MenuItem value="ready">Ready</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{order.orderType}</TableCell>
                      <TableCell>
                        <Chip 
                          label={order.status} 
                          color={getStatusColor(order.status)} 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                      <TableCell align="center">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewOrder(order.id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="secondary"
                          onClick={() => handleEditStatus(order)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="subtitle1">
                        No orders found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
      
      {/* Dialogs */}
      <OrderDetailsDialog 
        open={orderDetailsOpen} 
        order={selectedOrder}
        onClose={() => setOrderDetailsOpen(false)}
      />
      
      <EditStatusDialog
        open={editStatusOpen}
        order={selectedOrder}
        onClose={() => setEditStatusOpen(false)}
        onSave={handleStatusSave}
      />
      
      <CreateOrderDialog
        open={createOrderOpen}
        onClose={() => setCreateOrderOpen(false)}
        onSave={handleOrderCreated}
      />
    </Box>
  );
};

export default App;
