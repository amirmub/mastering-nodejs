const express = require('express');
const router = express();

const userRouter = require('./userRouter');
router.use(userRouter);

const tourRouter = require('./tourRouter');
router.use(tourRouter);

const userLogin = require('./userLoginRoute');
router.use(userLogin);

const passwordRoute = require('./passwordRoute');
router.use(passwordRoute);

const reviewRoute = require('./reviewRoute');
router.use(reviewRoute);

module.exports = router;
