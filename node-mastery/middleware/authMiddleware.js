const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
function tokenVerify(req, res, next) {
  const authHeader = req.headers.authorization; // use lowercase 'authorization' header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ msg: "No token provided or token format is incorrect (expected Bearer <token>)" });
  }

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ msg: "Token is invalid or expired! Please Login again" });
    }

    req.email = decoded.email; // Attach email to request on the body
    req.role = decoded.role; // Attach role to request on the body
    next();
  });
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
