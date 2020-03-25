const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: String
  },
  bio: {
    type: String
  },
  dogs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Dog'
    }
  ]
});

userSchema.methods.toJSON = function() {
  let user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
