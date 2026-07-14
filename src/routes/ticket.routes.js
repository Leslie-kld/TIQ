const express = require('express');
const router = express.Router();
const { createTicket } = require('../controllers/ticket.controller');

router.post('/', createTicket);

module.exports = router;