const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const { getUserInfo, updateProfile } = require('../controllers/user');

router.get('/me', getUserInfo);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateProfile);

module.exports = router;
