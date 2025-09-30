const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Middleware to verify JWT token
async function tokenVerify(req, res, next) {
  const authHeader = req.headers.authorization; 
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ msg: "No token provided or token format is incorrect (expected Bearer <token>)" });
  }

  const token = authHeader.split(" ")[1]; 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach full user to request (best practice)
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ msg: "User no longer exists" });
    }

    req.user = user; // now req.user.id will work in your controller
    req.role = decoded.role;
    req.email = decoded.email; // Attach email to request on the body

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ msg: "Token is invalid or expired! Please login again" });
  }
}


// Middleware to check if the user is an admin 
function isAdmin(req, res, next) {
  const role = req.role;  

  if (role === 'admin') {
    next();
  } else {
    return res.status(403).json({ msg: "Access denied: only for admin" });
  }
}

module.exports = { tokenVerify, isAdmin };
