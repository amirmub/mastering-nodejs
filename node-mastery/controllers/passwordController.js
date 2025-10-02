// below all this code write on the user controller.js file. this one is for education purpose only
const User = require("../models/userModel");
const crypto = require("crypto");
const sendEmail = require("../utils/email");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 1) User forgot password -> send email with reset link (with token)
async function forgotPassword(req, res) {
  const {email} = req.body;

  if(!email){
    return res.status(400).json({ status: "fail", message: "Please provide your email address" });
  }
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    // Generate raw reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    // console.log("Reset token:", resetToken);

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

// 2) User resets password using the token sent to their email
async function resetPassword(req, res) {
  const { password, passwordConfirm } = req.body;

  try {
      if(password !== passwordConfirm){
    return res.status(400).json({ status: "fail", message: "Password and password confirm do not match" });
  }

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

  user.password = await bcrypt.hash(password, 12);
  user.passwordConfirm = await bcrypt.hash(passwordConfirm, 12);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // 3) Update passwordChangedAt property for the user
    // This can be done using a pre-save middleware in the user model
   user.passwordChangedAt = Date.now() - 1000; // Subtracting 1 second to ensure the token is created after this timestamp
   await user.save();

  // 4)generate JWT token
  const payload = { id: user._id, email: user.email, role: user.role };
  // console.log("JWT payload:", payload);
  const token = jwt.sign(payload, process.env.JWT_SECRET, {  expiresIn: process.env.JWT_SECRET_EXPIRES_IN });

  // Set token in HTTP-only cookie
    const cookieOptions = {
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "Strict", // Helps prevent CSRF attacks
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90), // 90 days
      httpOnly: true,
    };

    res.cookie("token", token, cookieOptions);

  // 5) Log the user in, send JWT
  return res.status(200).json({
    status: "success",
    message: "Password updated successfully"
  });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }

}



// this function is for logged in user and update their password
async function updatePassword(req,res) {
  const {currentPassword,newPassword,newPasswordConfirm} = req.body;
  
  try {
    // 1) Get user from collection
    const user = await User.findById(req.user.id);

    // 2) Check if POST current password is correct
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ status: "fail", message: "Your current password is wrong." });
    }

    if(newPassword !== newPasswordConfirm){
      return res.status(401).json({ status: "fail", message: "Password confirm not the same" });
    }
    
    // 3) If so, update password
    user.password = await bcrypt.hash(newPassword, 12);
    user.passwordConfirm = await bcrypt.hash(newPasswordConfirm, 12);
    user.passwordChangedAt = Date.now() - 1000;
    await user.save();

    // 4) Log user in, send JWT
    const payload = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_SECRET_EXPIRES_IN });

    // Set token in HTTP-only cookie
    const cookieOptions = {
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "Strict", // Helps prevent CSRF attacks
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90), // 90 days
      httpOnly: true,
    };

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      status: "success",
      message: "Password updated successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
 
}

module.exports = { resetPassword, forgotPassword, updatePassword };
