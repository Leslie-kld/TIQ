const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

const login = async (req, res) => {
  const { email, password } = req.body;

try {
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const mockToken = `mock-jwt-${user.id}-${Date.now()}`;

  res.json({
    message: 'Login successful',
    token: mockToken,
    role: user.role,
    id: user.id,
    email: user.email
  });
} catch (error) {
  console.error('Error during login:', error);
  res.status(500).json({ message: 'Internal server error' });
}
}
module.exports = { login };