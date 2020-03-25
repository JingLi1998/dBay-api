const Like = require('../models/likes');

exports.likeDog = async (req, res) => {
  const likeDetails = {
    dogId: req.params.id,
    username: req.user.user.username
  };
  try {
    const existingLike = await Like.findOne({ likeDetails });
    if (existingLike !== null) return res.status(400).json('Already liked');
    const like = await Like.create(likeDetails);
    return res.status(201).json({ like });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.unlikeDog = async (req, res) => {
  const likeDetails = {
    dogId: req.params.id,
    username: req.user.user.username
  };
  try {
    const like = await Like.findOneAndDelete(likeDetails);
    if (like === null) return res.status(404).json({ error: 'Like not found' });
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ error });
  }
};
