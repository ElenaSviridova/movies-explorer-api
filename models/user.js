const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('../node_modules/validator/lib/isEmail');
const NoAuthorizationError = require('../errors/no-authorization');

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
      validator: (v) => isEmail(v),
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

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NoAuthorizationError('Неправильная почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NoAuthorizationError('Неправильная почта или пароль');
          }

          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
