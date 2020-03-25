const Dog = require('../models/dogs');
const User = require('../models/users');
const Comment = require('../models/comments');
const Like = require('../models/likes');

exports.getDogs = async (req, res) => {
  try {
    // get all dogs
    const dogs = await Dog.find({});
    return res.json(dogs);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.getDog = async (req, res) => {
  try {
    // get dog
    const dog = await Dog.findById(req.params.id)
      .lean()
      .exec();
    // get user, comments, likes
    const userQuery = User.findOne({ username: dog.owner });
    const commentQuery = Comment.find({ dogId: req.params.id }).lean();
    const likeQuery = Like.find({ dogId: req.params.id }).lean();
    const [user, comments, likes] = await Promise.all([
      userQuery.exec(),
      commentQuery.exec(),
      likeQuery.exec()
    ]);
    return res.json({ dog, user, comments, likes });
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.postDog = async (req, res) => {
  const dogDetails = { ...req.body, owner: req.user.user.username };
  try {
    // create new dog
    const dog = await Dog.create(dogDetails);
    // append dog to user doc
    const user = await User.findById(req.user.user._id);
    user.dogs.push(dog);
    await user.save();
    return res.status(201).json({ dog });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.putDog = async (req, res) => {
  try {
    // find dog and validate
    const dog = await Dog.findById(req.params.id);
    if (dog === null) return res.status(404).json({ error: 'Dog not found' });
    if (req.user.user.username !== dog.owner)
      return res
        .status(403)
        .json({ error: 'You are not authorized to perform this operation' });
    // update dog
    dog.body = req.body;
    await dog.save();
    return res.json({ dog: { ...dog.toObject(), ...req.body } });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.deleteDog = async (req, res) => {
  try {
    // find dog and validate
    const dog = await Dog.findById(req.params.id);
    if (dog === null) return res.status(404).json({ error: 'Dog not found' });
    if (req.user.user.username !== dog.owner)
      return res
        .status(403)
        .json({ error: 'You are not authorized to perform this operation' });
    // delete dog
    await dog.remove();
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
