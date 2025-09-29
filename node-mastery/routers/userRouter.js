const express = require("express");
const router = express();
const userController = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

// routes to create user
router.post("/api/v1/users",authMiddleware.tokenVerify,userController.createUser);

// routes to get all users
router.get("/api/v1/users",[authMiddleware.tokenVerify, authMiddleware.isAdmin],userController.getAllUsers);

// routes to get single user
router.get("/api/v1/users/:id",authMiddleware.tokenVerify,userController.getUser);

// routes to update user
router.put("/api/v1/users/:id",authMiddleware.tokenVerify,userController.updateUser);

// routes to delete user
router.delete("/api/v1/users/:id",[authMiddleware.tokenVerify, authMiddleware.isAdmin],userController.deleteUser);

module.exports = router
