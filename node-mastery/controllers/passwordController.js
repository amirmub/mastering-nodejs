const User = require("../models/userModel");
const crypto = require("crypto");
const sendEmail = require("../utils/email");

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
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expiration (10 minutes)
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // Send raw token (not hashed) in URL
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/reset-password/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset token (valid for 10 min)",
        text: message,
      });

      return res.status(200).json({
        status: "success",
        message: "Token sent to email!",
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      console.log(error);
      

      return res.status(500).json({
        status: "error",
        message: "There was an error sending the email.",
      });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
}


async function resetPassword(req, res) {
  // Logic for password reset (send reset email)
}

module.exports = { resetPassword, forgotPassword };
