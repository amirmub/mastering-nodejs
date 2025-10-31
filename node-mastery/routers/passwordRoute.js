const express = require("express");
const router = express();

const passwordController = require("../controllers/passwordController");
const authMiddleware = require("../middleware/authMiddleware");

// Route to  password reset (send reset email)
router.post("/forgot-password", passwordController.forgotPassword);

// Route to  password reset (send reset email)
router.patch("/reset-password/:token", passwordController.resetPassword);

// Route to  password reset (send reset email)
router.patch("/update-password", authMiddleware.tokenVerify, passwordController.updatePassword);

module.exports = router;
