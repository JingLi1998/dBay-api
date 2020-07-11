const express = require('express');
const AWS = require('aws-sdk');
const http = require('http');
const socketio = require('socket.io');
const multer = require('multer');
const multerS3 = require('multer-s3');
const socketioJwt = require('socketio-jwt');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// create server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// import routes
const userRoutes = require('./routes/users');
const dogRoutes = require('./routes/dogs');

// import seed
const seedDb = require('./seed');

// application config
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(cors());

// connect database
require('./config/database');

// setup passport
require('./config/passport');

app.use('/api/user', userRoutes);
app.use('/api/dogs', dogRoutes);

s3 = new AWS.S3({ params: { Bucket: 'dbay-app' } });

let upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'dbay-app',
    key: function(req, file, cb) {
      let fileName = `users/${Date.now()}-${file.originalname}`;
      console.log(fileName);
      cb(null, fileName); //use Date.now() for unique file keys
    }
  })
});

app.post('/api/upload', upload.single('image'), (req, res, next) => {
  res.send('Uploaded!');
});

// reset database
// seedDb();

// configure socket
// io.sockets
//   .on(
//     'connection',
//     socketioJwt.authorize({
//       secret: 'top_secret',
//       timeout: 15000
//     })
//   )
//   .on('authenticated', socket => {
//     console.log(`${socket.decoded_token.user.username} has connected`);
//     socket.emit('hello', `${socket.decoded_token.user.username} has connected`);
//     socket.broadcast.emit(
//       'hello',
//       `${socket.decoded_token.user.username} has connected`
//     );
//     socket
//       .on('chatMessage', message => {
//         console.log(message);
//         socket.broadcast.emit('newMessage', message);
//       })
//       .on('disconnect', () => {
//         console.log(`${socket.decoded_token.user.username} has disconnected`);
//         socket.emit(
//           'hello',
//           `${socket.decoded_token.user.username} has disconnected`
//         );
//       });
//   })
//   .on('unauthorized', () => {
//     console.log('Unauthorized');
//   });

server.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
