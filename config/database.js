const mongoose = require('mongoose');

mongoose
  .connect(process.env.DATABASEURL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log('Database Connected');
  })
  .catch(err => {
    console.log('ERROR', err.message);
  });
