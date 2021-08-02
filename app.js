const express = require('express');
const limitter = require('express-rate-limit');

require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const userRoutes = require('./routes/user');
const movieRoutes = require('./routes/movie');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-error');
const { login, createUser } = require('./controllers/user');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const centralisedErrorsHandler = require('./middlewares/centralisederrorshandler');

const { PORT = 3000, DB_ADRESS = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;
console.log(process.env.JWT_SECRET);

const app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function start() {
  await mongoose.connect(DB_ADRESS, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
}

start();

app.use(requestLogger);
app.use(limitter({
  windowsMs: 5000,
  max: 50,
  message: {
    code: 429,
    message: 'Слишком много запросов, подождите',
  },
}));

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.use(auth);

app.use('/users', userRoutes);

app.use('/movies', movieRoutes);

app.use((req, res, next) => {
  try {
    throw new NotFoundError('Запрашиваемый ресурс не найден');
  } catch (err) {
    next(err);
  }
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use(centralisedErrorsHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
