const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const NoAuthorizationError = require('../errors/no-authorization');
const { WRONG_EMAIL_OR_PASSWORD } = require('../constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NoAuthorizationError(WRONG_EMAIL_OR_PASSWORD);
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NoAuthorizationError(WRONG_EMAIL_OR_PASSWORD);
          }

          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
