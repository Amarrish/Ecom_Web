const express = require('express');
const { registerUser, loginUser, logoutUser, authMiddleware } = require('../../Controllers/auth/auth-controller');

const router = express.Router();

// Register Route
router.post('/register', registerUser);
// Login Route
router.post('/login', loginUser);
// Logout Route
router.post('/logout', logoutUser)

router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user,
  });
});

module.exports = router;
