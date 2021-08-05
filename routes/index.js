const router = require('express').Router();
const userRoutes = require('./user');
const movieRoutes = require('./movie');
const NotFoundError = require('../errors/not-found-error');
const { RESOURCE_NOT_FOUND } = require('../constants');

router.use('/users', userRoutes);

router.use('/movies', movieRoutes);

router.use((req, res, next) => {
  next(new NotFoundError(RESOURCE_NOT_FOUND));
});

module.exports = router;
