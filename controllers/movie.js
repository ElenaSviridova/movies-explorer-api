// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const Movie = require('../models/movie');


module.exports = {
  getMovies(req, res, next) {
      Movie.find({})
        .then((movies) => res.send({ data: movies }))
        .catch(next);
  },
  createMovie(req, res, next) {
    const { country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId } = req.body;
    Movie.create({ country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId })
      .then((movie) => res.send(movie))
      .catch(next);
  },
  removeMovie(req, res, next) {
    Movie.findById(req.params.movieId)
      .orFail(new Error('NotValidId'))
      .then((movie) => {
        Movie.deleteOne({ _id: movie._id })
          .then(() => {
            res.status(200).send(movie);
          })
          .catch(next);
      })
      .catch((err) => {
        if (err.message === 'NotValidId') {
          throw new Error('Карточка с указанным _id не найдена.');
        } else if (err.name === 'CastError') {
          throw new Error('Переданы некорректные данные.');
        } else {
          next(err);
        }
      })
      .catch(next);
  },
};
