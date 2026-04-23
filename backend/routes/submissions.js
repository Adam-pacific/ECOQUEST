const router = require('express').Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const Submission = require('../models/Submission');
const User = require('../models/User');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const { updateProgress } = require('../utils/userProgress');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Get submissions (student: own; teacher: all pending)
router.get('/', auth, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'student') filter.student = req.user.id;
    else if (req.query.status) filter.status = req.query.status;

    const subs = await Submission.find(filter)
      .populate('student', 'name class')
      .populate('task', 'title category xpReward')
      .sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create submission (student)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { taskId, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const sub = await Submission.create({
      student: req.user.id,
      task: taskId,
      description,
      imageUrl,
      status: 'pending',
    });

    // Notify the teacher who created this task
    const task = await Task.findById(taskId);
    if (task?.createdBy) {
      const student = await User.findById(req.user.id).select('name');
      await Notification.create({
        recipient: task.createdBy,
        sender: req.user.id,
        type: 'submission_received',
        message: `${student?.name || 'A student'} submitted "${task.title}"`,
        taskTitle: task.title,
      });
    }

    res.status(201).json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Teacher review submission
router.put('/:id/review', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Forbidden' });
    const { teacherScore, status } = req.body;

    const sub = await Submission.findById(req.params.id).populate('task');
    if (!sub) return res.status(404).json({ message: 'Submission not found' });

    sub.teacherScore = teacherScore;
    sub.status = status;
    sub.reviewedBy = req.user.id;

    if (status === 'approved') {
      const xp = Math.round((teacherScore / 10) * sub.task.xpReward);
      sub.xpAwarded = xp;
      await User.findByIdAndUpdate(sub.student, { $inc: { xp } });
      await updateProgress(sub.student);
    }

    await sub.save();

    // Notify the student about review result
    const teacher = await User.findById(req.user.id).select('name');
    const notifType = status === 'approved' ? 'submission_approved' : 'submission_rejected';
    const xpMsg = status === 'approved' ? ` (+${sub.xpAwarded} XP)` : '';
    await Notification.create({
      recipient: sub.student,
      sender: req.user.id,
      type: notifType,
      message: `Your "${sub.task?.title}" submission was ${status} by ${teacher?.name || 'your teacher'}${xpMsg}`,
      taskTitle: sub.task?.title || '',
    });

    res.json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
