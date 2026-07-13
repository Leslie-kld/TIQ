const express = require('express');
require('dotenv').config();
const authRoutes = require('./routes/auth.routes');
const ticketRoutes = require('./routes/ticket.routes');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(express.json());
app.use(require('cors')());
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});