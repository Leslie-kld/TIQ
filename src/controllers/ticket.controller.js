const prisma = require('../config/prisma');

const createTicket = async (req, res) => {
  const { title, description, priority, createdById } = req.body;

  try {
    if (!title || !description || !priority || !createdById) {
      return res.status(400).json({ message: 'Title, description, priority, and createdById are required' });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority,
        createdById
      }
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createTicket };