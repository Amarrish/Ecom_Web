const express = require('express');
const { registerUser, loginUser, logoutUser, authMiddleware, checkAuth, forgotPassword, resetPassword } = require('../../Controllers/auth/auth-controller');

const router = express.Router();

// Register Route
router.post('/register', registerUser);
// Login Route
router.post('/login', loginUser);
// Logout Route
router.post('/logout', logoutUser);

// reset password routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get('/checkAuth', authMiddleware, checkAuth);

// router.get("/check-auth", authMiddleware, checkAuth, (req, res) => {
//   const user = req.user;
//   res.status(200).json({
//     success: true,
//     message: "Authenticated user!",
//     user,
//   });
// });

module.exports = router;
