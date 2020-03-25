const Dog = require('./models/dogs');
const Comment = require('./models/comments');
const Like = require('./models/likes');
const User = require('./models/users');

const seedDb = async () => {
  await Dog.deleteMany({});
  await Comment.deleteMany({});
  await Like.deleteMany({});
  await User.deleteMany({});
  return console.log('Database Seeded');
};

module.exports = seedDb;
