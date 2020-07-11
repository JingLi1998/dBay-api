const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = Schema({
  dogId: {
    type: Schema.Types.ObjectId,
    ref: 'Dog',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  imageUrl: { type: String },
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema);
