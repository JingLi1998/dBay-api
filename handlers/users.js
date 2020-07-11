const jwt = require('jsonwebtoken');
const passport = require('passport');
const mongoose = require('mongoose');
// config aws
const AWS = require('aws-sdk');
s3 = new AWS.S3({ params: { Bucket: 'dbay-app' } });

// import models
const User = require('../models/users');
const Comment = require('../models/comments');
const Like = require('../models/likes');

exports.getCurrentUser = async (req, res) => {
  try {
    // find user and populate dog references
    const userQuery = User.findById(req.user.user._id).populate('dogs');
    const commentQuery = Comment.find({
      username: req.user.user.username,
    }).lean();
    const likeQuery = Like.find({ username: req.user.user.username }).lean();
    const [user, comments, likes] = await Promise.all([
      userQuery.exec(),
      commentQuery.exec(),
      likeQuery.exec(),
    ]);
    return res.json({ user, comments, likes });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.getUser = async (req, res) => {
  try {
    // find user and populate dog references
    const userQuery = User.findOne({ username: req.params.id }).populate(
      'dogs'
    );
    const commentQuery = Comment.find({ username: req.params.id }).lean();
    const likeQuery = Like.find({ username: req.params.id }).lean();
    const [user, comments, likes] = await Promise.all([
      userQuery.exec(),
      commentQuery.exec(),
      likeQuery.exec(),
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

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.user._id);
    if (user === null) return res.status(404).json({ error: 'User not found' });
    if (req.user.user.username !== user.username)
      return res
        .status(403)
        .json({ error: 'You are not authorized to perform this operation' });
    user.bio = req.body.bio;
    user.location = req.body.location;
    await user.save();
    return res.json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

exports.uploadUserImage = async (req, res) => {
  baseUrl = 'https://dbay-app.s3-ap-southeast-2.amazonaws.com';
  try {
    const user = await User.findById(req.user.user._id);
    if (user === null) return res.status(404).json({ error: 'User not found' });
    user.imageUrl = `${baseUrl}/${req.file.key}`;
    await user.save();
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    // find user and validate
    const user = await user.findById(req.user.user._id);
    if (user === null) return res.status(404).json({ error: 'User not found' });
    if (req.user.user._id !== user._id)
      return res
        .status(403)
        .json({ error: 'You are not authorized to perform this operation' });
    // delete user
    await s3
      .deleteObject({
        Bucket: 'dbay-app',
        Key: user.imageUrl.substring(49),
      })
      .promise();
    await user.remove();
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
