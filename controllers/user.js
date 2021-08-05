const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const {
  OK, NO_USER_WITH_THIS_ID,
  EMAIL_USED, DATA_INCORRECT_DURING_USER_CREATION,
} = require('../constants');

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
      .orFail(new NotFoundError(NO_USER_WITH_THIS_ID))
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
          throw new ConflictError(EMAIL_USED);
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
          throw new BadRequestError(DATA_INCORRECT_DURING_USER_CREATION);
        } else if (err.name === 'MongoError') {
          throw new ConflictError(EMAIL_USED);
        } else {
          next(err);
        }
      })
      .catch(next);
  },
};
