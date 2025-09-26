const express = require("express");
const router = express();
const userController = require("../controllers/userController")

// routes to create user
router.post("/api/v1/users",userController.createUser);

// routes to get all users
router.get("/api/v1/users",userController.getAllUsers);

// routes to get single user
router.get("/api/v1/users/:id",userController.getUser);

// routes to update user
router.put("/api/v1/users/:id",userController.updateUser);

// routes to delete user
router.delete("/api/v1/users/:id",userController.deleteUser);

module.exports = router
