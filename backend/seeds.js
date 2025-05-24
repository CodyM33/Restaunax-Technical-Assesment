// seeds.js
const seedOrders = () => {
  const customers = [
    'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Tom Brown',
    'Lisa Davis', 'Chris Martinez', 'Emma Taylor', 'Ryan Anderson', 'Sofia Rodriguez',
    'David Garcia', 'Maria Lopez', 'Kevin White', 'Rachel Green', 'James Miller',
    'Emily Clark', 'Daniel Harris', 'Olivia Lewis', 'Matthew Hall', 'Ava Young',
    'Joshua Allen', 'Abigail King', 'Andrew Wright', 'Charlotte Scott', 'Brandon Torres',
    'Mia Nguyen', 'Tyler Hill', 'Amelia Adams', 'Zachary Nelson', 'Chloe Baker',
    'Ethan Mitchell', 'Ella Perez', 'Jacob Roberts', 'Grace Turner', 'Nathan Phillips',
    'Lily Campbell', 'Benjamin Parker', 'Hannah Evans', 'Logan Edwards', 'Victoria Collins',
    'Alexander Stewart', 'Natalie Sanchez', 'Jackson Morris', 'Samantha Rogers', 'Lucas Reed',
    'Avery Cook', 'Jayden Morgan', 'Brooklyn Bell', 'Elijah Murphy', 'Leah Bailey',
    'Caleb Rivera', 'Zoe Cooper', 'Christian Richardson', 'Aria Cox', 'Dylan Howard',
    'Audrey Ward', 'Aaron Peterson', 'Lucy Gray', 'Gavin Ramirez', 'Penelope James',
    'Hunter Watson', 'Stella Brooks', 'Jonathan Kelly', 'Nora Sanders', 'Jordan Price',
    'Camila Bennett', 'Isaac Wood', 'Ellie Barnes', 'Adam Ross', 'Claire Henderson',
    'Connor Coleman', 'Layla Jenkins', 'Jason Perry', 'Scarlett Powell', 'Charles Long',
    'Ariana Patterson', 'Dominic Hughes', 'Savannah Flores', 'Owen Washington', 'Hazel Butler',
    'Angel Foster', 'Anna Simmons', 'Thomas Bryant', 'Bella Russell', 'Sebastian Griffin',
    'Skylar Diaz', 'Carter Hayes', 'Genesis Myers', 'Lincoln Ford', 'Elena Hamilton',
    'Eli Graham', 'Violet Sullivan', 'Henry Wallace', 'Naomi West', 'Julian Cole',
    'Peyton Stone', 'Levi Warren', 'Madelyn Hart', 'Asher Elliott', 'Claire Freeman'
  ];

  const menuItems = [
    { name: 'Margherita Pizza', price: 12.99 },
    { name: 'Pepperoni Pizza', price: 14.99 },
    { name: 'BBQ Chicken Pizza', price: 16.99 },
    { name: 'Chicken Pasta', price: 13.99 },
    { name: 'Beef Pasta', price: 15.99 },
    { name: 'Caesar Salad', price: 8.99 },
    { name: 'Greek Salad', price: 9.99 },
    { name: 'Veggie Burger', price: 10.99 },
    { name: 'Beef Burger', price: 12.99 },
    { name: 'Chicken Sandwich', price: 11.99 },
    { name: 'French Fries', price: 3.99 },
    { name: 'Onion Rings', price: 4.99 },
    { name: 'Sweet Potato Fries', price: 5.99 },
    { name: 'Garlic Bread', price: 4.99 },
    { name: 'Chicken Wings', price: 9.99 },
    { name: 'Buffalo Wings', price: 10.99 },
    { name: 'Fish & Chips', price: 15.99 },
    { name: 'Steak Dinner', price: 24.99 },
    { name: 'Grilled Chicken', price: 18.99 },
    { name: 'Soda', price: 2.49 },
    { name: 'Iced Tea', price: 2.99 },
    { name: 'Milkshake', price: 4.99 }
  ];

  const statuses = ['pending', 'preparing', 'ready', 'delivered'];
  const orderTypes = ['delivery', 'pickup'];

  const orders = [];

  // Pick 15 unique customers
  const shuffledCustomers = [...customers].sort(() => 0.5 - Math.random()).slice(0, 15);

  for (let i = 0; i < shuffledCustomers.length; i++) {
    const customerName = shuffledCustomers[i];

    const hoursAgo = Math.floor(Math.random() * 12);
    const minutesAgo = Math.floor(Math.random() * 60);
    const createdAt = new Date(Date.now() - (hoursAgo * 3600000) - (minutesAgo * 60000));

    const itemCount = Math.floor(Math.random() * 4) + 1;
    const shuffledMenu = [...menuItems].sort(() => 0.5 - Math.random());
    const selectedItems = shuffledMenu
      .filter(item => item && typeof item.price === 'number')
      .slice(0, itemCount);

    if (selectedItems.length === 0) continue;

    const orderItems = selectedItems.map((item, index) => ({
      id: `item-${i}-${index}`,
      name: item.name,
      quantity: Math.floor(Math.random() * 3) + 1,
      price: item.price
    }));

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let status;
    if (hoursAgo < 1) {
      status = Math.random() < 0.7 ? 'pending' : 'preparing';
    } else if (hoursAgo < 3) {
      const rand = Math.random();
      status = rand < 0.3 ? 'pending' : rand < 0.6 ? 'preparing' : 'ready';
    } else {
      const rand = Math.random();
      status = rand < 0.1 ? 'pending' : rand < 0.3 ? 'preparing' : rand < 0.6 ? 'ready' : 'delivered';
    }

    orders.push({
      id: (i + 1).toString(),
      customerName,
      orderType: orderTypes[Math.floor(Math.random() * orderTypes.length)],
      items: orderItems,
      status,
      total: parseFloat(total.toFixed(2)),
      createdAt: createdAt.toISOString()
    });
  }

  return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

module.exports = { seedOrders };
