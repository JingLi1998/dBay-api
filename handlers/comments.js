const Comment = require('../models/comments');
const Dog = require('../models/dogs');
const User = require('../models/users');

exports.postComment = async (req, res) => {
  const newComment = {
    dogId: req.params.id,
    username: req.user.user.username,
    body: req.body.body,
  };
  try {
    dogQuery = Dog.findById(req.params.id);
    userQuery = User.findById(req.user.user._id);
    const [user, dog] = await Promise.all([userQuery.exec(), dogQuery.exec()]);
    if (user.imageUrl) newComment.imageUrl = user.imageUrl;
    const comment = await Comment.create(newComment);
    if (dog === null) return res.status(404).json({ error: 'Dog not found' });
    if (user === null) return res.status(404).json({ error: 'User not found' });
    dog.commentCount++;
    await dog.save();
    return res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.putComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (comment === null)
      return res.status(404).json({ error: 'Comment not found' });
    if (req.user.user.username !== comment.username)
      return res
        .status(403)
        .json({ error: 'You are not authorized to perform this operation' });
    comment.body = req.body.body;
    await comment.save();
    return res.json({ ...comment.toObject(), ...req.body });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (comment === null)
      return res.status(404).json({ error: 'Comment not found' });
    if (req.user.user.username !== comment.username)
      return res
        .status(403)
        .json({ error: 'You are not authorized to perform this operation' });
    await comment.remove();
    const dog = await Dog.findById(req.params.id);
    if (dog === null) return res.status(404).json({ error: 'Dog not found' });
    dog.commentCount -= 1;
    await dog.save();
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ error });
  }
};
