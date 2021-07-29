const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const { getUserInfo, updateProfile } = require('../controllers/user');

router.get('/me', getUserInfo);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

module.exports = router;
