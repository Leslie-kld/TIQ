const express = require('express');
const router = express.Router();
const { createTicket, getTickets, updateTicketStatus } = require('../controllers/ticket.controller');

router.post('/', createTicket);
router.get('/', getTickets);
router.put('/:id', updateTicketStatus);

module.exports = router;