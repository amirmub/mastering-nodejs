const express = require("express");
const router = express();
const userLoginController = require("../controllers/userLoginController");

router.post("/users/login", userLoginController.login);

module.exports = router;
