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

const getTickets = async (req, res) => {
  const { userId, role } = req.query;

  try {
    if (!userId || !role) {
      return res.status(400).json({ message: 'userId and role are required' });
    }

    let tickets;

    if (role === 'Admin') {
      tickets = await prisma.ticket.findMany();
    } else {
      tickets = await prisma.ticket.findMany({
        where: { createdById: Number(userId) }
      });
    }

    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createTicket, getTickets };