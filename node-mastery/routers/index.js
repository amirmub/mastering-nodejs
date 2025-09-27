const express = require('express');
const router = express();

const userRouter = require('./userRouter');
router.use(userRouter);

const tourRouter = require('./tourRouter');
router.use(tourRouter);

const userLogin = require('./userLoginRoute');
router.use(userLogin);

module.exports = router;
