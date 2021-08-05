const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const { OK } = require('../constants');

const { JWT_SECRET = 'secret-key' } = process.env;

module.exports = {
  login(req, res, next) {
    const { email, password } = req.body;
    User.findUserByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        return res.send({ token });
      })
      .catch(next);
  },
  getUserInfo(req, res, next) {
    User.findById(req.user._id)
      .orFail(new NotFoundError('Пользователь с указанным _id не найден.'))
      .then((user) => {
        res.send({
          name: user.name,
          email: user.email,
          // id: user._id,
        });
      })
      .catch(next);
  },
  updateProfile(req, res, next) {
    const { name, email } = req.body;
    User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
      .then((user) => {
        res.status(OK).send(user);
      })
      .catch((err) => {
        if (err.codeName === 'DuplicateKey') {
          throw new ConflictError('Данный почтовый ящик уже использован');
        } else {
          next(err);
        }
      })
      .catch(next);
  },
  createUser(req, res, next) {
    const {
      name, email, password,
    } = req.body;
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name, email, password: hash,
      }))
      .then(() => res.status(OK).send({
        data: {
          name, email,
        },
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequestError('Переданы некорректные данные при создании пользователя');
        } else if (err.name === 'MongoError') {
          throw new ConflictError('Данный почтовый ящик уже использован');
        } else {
          next(err);
        }
      })
      .catch(next);
  },
};
