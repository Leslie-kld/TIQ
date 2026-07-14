const express = require('express');
require('dotenv').config();
const authRoutes = require('./routes/auth.routes');
const ticketRoutes = require('./routes/ticket.routes');
const { PrismaClient } = require('./generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');
process.on('exit', (code) => console.log('Process exiting with code:', code));
process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const app = express();

app.use(express.json());
app.use(require('cors')());
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});