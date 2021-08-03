const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const NoAccessError = require('../errors/forbidden-error');

module.exports = {
  getMovies(req, res, next) {
    Movie.find({})
      .then((movies) => res.send({ data: movies }))
      .catch(next);
  },
  createMovie(req, res, next) {
    const {
      country, director, duration, year, description,
      image, trailer, nameRU, nameEN, thumbnail, movieId,
    } = req.body;
    Movie.create({
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
    Movie.findById(req.params.movieId)
      .orFail(new Error('NotValidId'))
      // eslint-disable-next-line consistent-return
      .then((movie) => {
        if (movie.owner.toString() !== req.user._id) {
          return Promise.reject(new NoAccessError('Невозможно удалить чужую карточку'));
        }
        Movie.deleteOne({ _id: movie._id })
          .then(() => {
            res.status(200).send(movie);
          })
          .catch(next);
      })
      .catch((err) => {
        if (err.message === 'NotValidId') {
          throw new NotFoundError('Фильм с указанным _id не найден.');
        } else if (err.name === 'CastError') {
          throw new BadRequestError('Переданы некорректные данные.');
        } else {
          next(err);
        }
      })
      .catch(next);
  },
};
