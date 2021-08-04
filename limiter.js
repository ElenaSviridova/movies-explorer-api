const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowsMs: 5000,
  max: 50,
  message: {
    code: 429,
    message: 'Слишком много запросов, подождите',
  },
});

module.exports = limiter;
