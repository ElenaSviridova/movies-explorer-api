const router = require('express').Router();
const userRoutes = require('./user');
const movieRoutes = require('./movie');

router.use('/users', userRoutes);

router.use('/movies', movieRoutes);

module.exports = router;
