const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/users');
const Comment = require('../models/comments');
const Like = require('../models/likes');

exports.getCurrentUser = async (req, res) => {
  try {
    const userQuery = User.findOne({ username: req.params.id }).lean();
    const dogQuery = await Dog.find({ username: req.params.id }).lean();
    const { user, dogs } = await Promise.all([
      userQuery.exec(),
      dogQuery.exec()
    ]);
    return res.json({ user, dogs });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userQuery = User.findOne({ username: req.params.id }).populate(
      'dogs'
    );
    const commentQuery = Comment.find({ username: req.params.id }).lean();
    const likeQuery = Like.find({ username: req.params.id }).lean();
    const [user, comments, likes] = await Promise.all([
      userQuery.exec(),
      commentQuery.exec(),
      likeQuery.exec()
    ]);
    return res.json({ user, comments, likes });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.signupUser = (req, res) => {
  passport.authenticate('signup', (err, user) => {
    if (err) return res.status(400).json(err);
    return res.status(201).json(user);
  })(req, res);
};

exports.loginUser = (req, res) => {
  passport.authenticate('login', (err, user) => {
    if (err || !user) return res.status(401).json(err);
    const body = { _id: user._id, username: user.username };
    const token = jwt.sign({ user: body }, 'top_secret', { expiresIn: '1hr' });
    return res.json({ token });
  })(req, res);
};

// exports.getUser = async (req, res) => {

// }
