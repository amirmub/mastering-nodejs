const express = require("express");
const router = express();
const passwordController = require("../controllers/passwordController");

// Route to  password reset (send reset email)
router.post("/api/v1/forgot-password", passwordController.forgotPassword);

// Route to  password reset (send reset email)
router.patch("/api/v1/reset-password/:token", passwordController.resetPassword);

module.exports = router;
