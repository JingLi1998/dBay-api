const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = Schema({
  dogId: {
    type: Schema.Types.ObjectId,
    ref: 'Dog',
    required: true
  },
  username: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Like', likeSchema);
