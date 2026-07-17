const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
    },
    description: {
    type: String,
    required: true
    },
    priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
    },
    status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', ],   
    default: 'Open'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }

});

module.exports = mongoose.model('Ticket', ticketSchema);


