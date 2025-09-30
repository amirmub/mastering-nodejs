const User = require("../models/userModel");
const crypto = require("crypto");
const sendEmail = require("../utils/email");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: 
                     ${resetURL}.\n If you didn't forget your password, please ignore this email!`;

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
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "Token is invalid or has expired",
    });
  }

  user.password = await bcrypt.hash(req.body.password, 12);
  user.passwordConfirm = await bcrypt.hash(req.body.passwordConfirm, 12);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // 3) Update passwordChangedAt property for the user
    // This can be done using a pre-save middleware in the user model
   user.passwordChangedAt = Date.now() - 1000; // Subtracting 1 second to ensure the token is created after this timestamp
   await user.save();

  // 4)generate JWT token
  const payload = { id: user._id, email: user.email, role: user.role };
  // console.log("JWT payload:", payload);
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1y" });

  // 5) Log the user in, send JWT
  return res.status(200).json({
    status: "success",
    message: token
  });

}

module.exports = { resetPassword, forgotPassword };
