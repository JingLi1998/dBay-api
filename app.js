const express = require('express');
const http = require('http');
const socketio = require('socket.io');
var socketioJwt = require('socketio-jwt');
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

// reset database
// seedDb();

// set up socket io
// io.sockets.on(
//   'connection',
//   socketioJwt
//     .authorize({
//       secret: 'top_secret',
//       timeout: 15000
//     })
//     .on('authenticated', function(socket) {
//       console.log(`hello! ${socket.decoded_token.name}`);
//       // socket.on('chat message', function(message) {
//       //   io.of('/chat').emit('new message', message);
//       // });
//     })
// );
io.sockets
  .on(
    'connection',
    socketioJwt.authorize({
      secret: 'top_secret',
      timeout: 15000
    })
  )
  .on('authenticated', socket => {
    console.log(`${socket.decoded_token.user.username} has connected`);
    socket
      .on('chat message', message => {
        io.emit('new message', message);
      })
      .on('disconnect', () => {
        console.log('A user has disconnected');
      });
  })
  .on('unauthenticated', () => {
    console.log('Unauthorized');
  });

server.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
