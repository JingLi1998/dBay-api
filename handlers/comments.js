const Comment = require('../models/comments');

exports.postComment = async (req, res) => {
  const newComment = {
    dogId: req.params.id,
    username: req.user.user.username,
    body: req.body.body
  };
  try {
    const comment = await Comment.create(newComment);
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
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ error });
  }
};
