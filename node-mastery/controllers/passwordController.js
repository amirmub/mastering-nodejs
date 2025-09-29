const User = require("../models/userModel");
const crypto = require("crypto");

async function forgotPassword(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    // Generate raw reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log("Reset token:", resetToken);
    
    // Hash and store in DB
    const updatedToken = user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
      
    console.log("Updated token:", updatedToken);

    // Set expiration (10 minutes)
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // // Send raw token (not hashed) in URL
    // const resetURL = `${req.protocol}://${req.get(
    //   "host"
    // )}/api/v1/reset-password/${resetToken}`;

    // console.log("Reset URL:", resetURL);

    res.status(200).json({
      status: "success",
      message: "Password reset link sent to email!",
    });
  } catch (error) {
    console.log(error);
   return res.status(500).json({ status: "error", message: error.message });
  }
}

async function resetPassword(req, res) {
  // Logic for password reset (send reset email)
}

module.exports = { resetPassword, forgotPassword };
