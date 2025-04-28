const User = require('../models/User');

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields (name, email, password, role) are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const newUser = await User.create({ name, email, password, role });
    res.status(201).json(newUser); // Respond with the created user
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error. Could not create user.' });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users); // Respond with all users
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error. Could not fetch users.' });
  }
};

// Get a single user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user); // Respond with the user data
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error. Could not fetch user.' });
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields (name, email, password, role) are required' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    user.name = name;
    user.email = email;
    user.password = password;
    user.role = role;
    await user.save();

    res.status(200).json(user); // Respond with the updated user data
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error. Could not update user.' });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error. Could not delete user.' });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
