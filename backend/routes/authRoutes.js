import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  seedAdmin
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

// Quick developer helper endpoint to trigger admin seeding during local integration
router.post('/seed-admin', async (request, response) => {
  await seedAdmin();
  response.json({
    success: true,
    message: 'Admin seed verified (admin@aquasense.ai / AdminPassword123!)'
  });
});

export default router;
