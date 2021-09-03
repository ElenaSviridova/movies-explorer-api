const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const router = require('express').Router();
const {
  IMAGE_IS_INCORRECT, TRAILER_IS_INCORRECT, THUMBNAIL_IS_INCORRECT,
} = require('../constants');

const { getMovies, createMovie, removeMovie } = require('../controllers/movie');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(IMAGE_IS_INCORRECT);
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(TRAILER_IS_INCORRECT);
    }),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(THUMBNAIL_IS_INCORRECT);
    }),
    movieId: Joi.number().integer().required(),
  }),
}), createMovie);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), removeMovie);

module.exports = router;
