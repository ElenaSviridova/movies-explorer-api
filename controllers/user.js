// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const User = require('../models/user');


module.exports = {
  // login(req, res, next) {
  //   const { email, password } = req.body;
  //   User.findUserByCredentials(email, password)
  //     .then((user) => {
  //       const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
  //       return res.send({ token });
  //     })
  //     .catch(next);
  // },
  getUserInfo(req, res, next) {
    User.findById(req.user._id)
      .orFail(new Error('Пользователь с указанным _id не найден.'))
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
        res.status(200).send(user);
      })
      .catch(next);
  },
};
