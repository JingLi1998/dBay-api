const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comments');
const Like = require('./likes');
const User = require('./users');

const dogSchema = new Schema({
  breed: String,
  gender: String,
  imageUrl: String,
  ownerImageUrl: String,
  name: String,
  age: Number,
  price: Number,
  description: String,
  likeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  created: { type: Date, default: Date.now },
  owner: {
    type: String,
    required: true,
  },
});

dogSchema.pre('remove', async function () {
  const user = await User.findOne({ username: this.owner }).exec();
  const dogId = this._id;
  user.dogs = user.dogs.filter((dog) => dog.toString() !== dogId.toString());
  await Promise.all([
    Comment.deleteMany({ dogId: this._id }),
    Like.deleteMany({ dogId: this._id }),
    user.save(),
  ]);
});

module.exports = mongoose.model('Dog', dogSchema);
