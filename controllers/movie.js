const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const NoAccessError = require('../errors/forbidden-error');
const { OK, DATA_INCORRECT, CANT_DELETE_ANOTHERS_CARD } = require('../constants');

module.exports = {
  getMovies(req, res, next) {
    Movie.find({ owner: req.user._id })
      .then((movies) => res.send(movies))
      .catch(next);
  },
  createMovie(req, res, next) {
    const owner = req.user._id;
    const {
      country, director, duration, year, description,
      image, trailer, nameRU, nameEN, thumbnail, movieId,
    } = req.body;
    Movie.create({
      owner,
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    })
      .then((movie) => res.send(movie))
      .catch(next);
  },
  removeMovie(req, res, next) {
    Movie.findById(req.params.id)
      .orFail(new NotFoundError('NotValidId'))
      // eslint-disable-next-line consistent-return
      .then((movie) => {
        if (movie.owner.toString() !== req.user._id) {
          return Promise.reject(new NoAccessError(CANT_DELETE_ANOTHERS_CARD));
        }
        Movie.deleteOne({ _id: movie._id })
          .then(() => {
            res.status(OK).send(movie);
          })
          .catch(next);
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          throw new BadRequestError(DATA_INCORRECT);
        } else {
          next(err);
        }
      })
      .catch(next);
  },
};
