const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config();
const app = express();

// import routes
const userRoutes = require('./routes/users');
const dogRoutes = require('./routes/dogs');

// import seed
const seedDb = require('./seed');

// application config
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(cors())

// connect database
require('./config/database');

// setup passport
require('./config/passport');

app.use('/api/user', userRoutes);
app.use('/api/dogs', dogRoutes);

seedDb();

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
