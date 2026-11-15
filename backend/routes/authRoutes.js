const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  seedAdmin
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

// Quick developer helper endpoint to trigger admin seeding during local integration
router.post('/seed-admin', async (req, res) => {
  await seedAdmin();
  res.json({
    success: true,
    message: 'Admin seed verified (admin@aquasense.ai / AdminPassword123!)'
  });
});

module.exports = router;
