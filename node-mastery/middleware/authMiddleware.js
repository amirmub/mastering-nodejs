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
      return res.status(401).json({ msg: "Token is invalid or expired" });
    }

    req.email = decoded.email; // Attach role to request
    next();
  });
}

module.exports = { tokenVerify } 
