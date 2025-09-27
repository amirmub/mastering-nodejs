const express = require("express");
const router = express();
const userLoginController = require("../controllers/userLoginController");

router.post("/api/v1/users/login", userLoginController.login);

module.exports = router;
