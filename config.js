const { PORT = 3000, DB_ADRESS = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

module.exports = {
  PORT, DB_ADRESS,
};
