const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function login (req, res)  {
  const { email, password } = req.body;

  if(!email || !password){
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "password is incorrect" });
    }

    const payload = { id: user._id, email: user.email, role: user.role };
    console.log(payload);
    

    // If you want to generate a JWT token upon successful login
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1y" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { login };
