const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(v),
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(v),
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(v),
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    //ref: 'user',
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    //ref: 'user',
    required: true,
  },
  nameRu: {
    type: String,
    required: true,
  },
  nameEn: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('card', movieSchema);
