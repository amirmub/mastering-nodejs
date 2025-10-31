const express = require("express");
const router = express();
const userController = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

// routes to create user
router.post("/users",userController.createUser);

// routes to get all users
router.get("/users",[authMiddleware.tokenVerify, authMiddleware.isAdmin],userController.getAllUsers);

// routes to get single user
router.get("/users/:id",[authMiddleware.tokenVerify, authMiddleware.isAdmin],userController.getUser);

// routes to update user
router.put("/users/:id",[authMiddleware.tokenVerify, authMiddleware.isAdmin],userController.updateUser);

// routes to delete user
router.delete("/users/:id",[authMiddleware.tokenVerify, authMiddleware.isAdmin],userController.deleteUser);

module.exports = router
