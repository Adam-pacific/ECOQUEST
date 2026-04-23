const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update profile
router.put('/me', auth, async (req, res) => {
  try {
    const { name, class: userClass, school, interests, ecoLevel } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (userClass !== undefined) update.class = userClass;
    if (school !== undefined) update.school = school;
    if (interests !== undefined) update.interests = interests;
    if (ecoLevel !== undefined) update.ecoLevel = ecoLevel;
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all students (teacher only)
router.get('/students', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Forbidden' });
    const students = await User.find({ role: 'student' }).select('-password').sort({ xp: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
