const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET /api/users — Admin & Manager
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status, search } = req.query;
    const query = {};

    if (role) query.role = role;
    if (status) query.status = status;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];

    // Managers cannot see admins
    if (req.user.role === 'manager') query.role = { $ne: 'admin' };

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Regular users can only view themselves
    if (req.user.role === 'user' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    // Managers cannot view admins
    if (req.user.role === 'manager' && user.role === 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/users — Admin only
exports.createUser = async (req, res) => {
  try {
    const { name, email, role, status, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const generatedPassword = password || Math.random().toString(36).slice(-8) + 'A1!';
    const user = await User.create({
      name, email, role, status,
      password: generatedPassword,
      createdBy: req.user._id,
    });

    res.status(201).json({ user, generatedPassword: !password ? generatedPassword : undefined });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/users/:id — Admin (all fields), Manager (non-admin, no role change), User (own profile)
exports.updateUser = async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'User not found' });

    const { role: requesterRole, _id: requesterId } = req.user;

    if (requesterRole === 'user') {
      if (requesterId.toString() !== req.params.id) return res.status(403).json({ message: 'Forbidden' });
      // Users cannot change their own role
      const { name, password } = req.body;
      if (password) target.password = password;
      if (name) target.name = name;
    } else if (requesterRole === 'manager') {
      if (target.role === 'admin') return res.status(403).json({ message: 'Cannot modify admin users' });
      const { name, email, status } = req.body;
      if (name) target.name = name;
      if (email) target.email = email;
      if (status) target.status = status;
    } else {
      // Admin can update everything
      const { name, email, role, status, password } = req.body;
      if (name) target.name = name;
      if (email) target.email = email;
      if (role) target.role = role;
      if (status) target.status = status;
      if (password) target.password = password;
    }

    target.updatedBy = requesterId;
    await target.save();
    res.json({ user: target });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/users/:id — Admin only (soft delete)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }
    user.status = 'inactive';
    user.updatedBy = req.user._id;
    await user.save();
    res.json({ message: 'User deactivated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
