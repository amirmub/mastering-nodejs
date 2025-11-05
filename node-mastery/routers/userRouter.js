const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

// routes to create user
router.post("/users",userController.uploadUserPhoto,userController.createUser);

// routes to get all users
router.get("/users",[authMiddleware.tokenVerify],userController.getAllUsers);

// routes to get single user
router.get("/users/:id",[authMiddleware.tokenVerify],userController.getUser);

// routes to update user
router.put("/users/:id",[authMiddleware.tokenVerify],userController.updateUser);

// routes to delete user
router.delete("/users/:id",[authMiddleware.tokenVerify],userController.deleteUser);

module.exports = router
