const jwt = require('jsonwebtoken');
const NoAuthorizationError = require('../errors/no-authorization');
const { MUST_AUTHORIZED } = require('../constants');

const { JWT_SECRET = 'secret-key' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NoAuthorizationError(MUST_AUTHORIZED);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // отправим ошибку, если не получилось
    throw new NoAuthorizationError(MUST_AUTHORIZED);
  }
  req.user = payload;// записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
