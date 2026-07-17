const express = require('express');
require('dotenv').config();
const authRoutes = require('./routes/auth.routes');
const ticketRoutes = require('./routes/ticket.routes');
const prisma = require('./config/prisma');

const app = express();

app.use(express.json());

// In production, only allow requests from your deployed frontend's origin.
// FRONTEND_URL is set as an environment variable on Render once the
// frontend is deployed. Locally, it falls back to Vite's dev server.
app.use(require('cors')({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// Catch-all for any URL that doesn't match a defined route above.
// Without this, hitting a wrong/typo'd endpoint returns Express's
// default HTML error page instead of a clean JSON response.
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Central error handler. Express automatically routes any error passed
// to next(err), or thrown in a non-async handler, here instead of
// crashing the process. It's a safety net behind the try/catch blocks
// already in each controller.
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
