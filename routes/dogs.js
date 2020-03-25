const router = require('express').Router();
const passport = require('passport');

// import middleware
const { jwtValidate } = require('../middleware/auth');

// import dog handlers
const {
  getDogs,
  getDog,
  postDog,
  putDog,
  deleteDog
} = require('../handlers/dogs');

// import comment handlers
const {
  postComment,
  putComment,
  deleteComment
} = require('../handlers/comments');

// import like handlers
const { likeDog, unlikeDog } = require('../handlers/likes');

// assign dog handlers to routes
router.get('/', getDogs);
router.get('/:id', getDog);
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  jwtValidate,
  postDog
);
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  jwtValidate,
  putDog
);
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  jwtValidate,
  deleteDog
);

// assign comment handlers to routes
router.post(
  '/:id/comments',
  passport.authenticate('jwt', { session: false }),
  jwtValidate,
  postComment
);
router.put(
  '/:id/comments/:commentId',
  passport.authenticate('jwt', { session: false }),
  jwtValidate,
  putComment
);
router.delete(
  '/:id/comments/:commentId',
  passport.authenticate('jwt', { session: false }),
  jwtValidate,
  deleteComment
);

// assign likehandlers to routes
router.get(
  '/:id/like',
  passport.authenticate('jwt', { session: false }),
  jwtValidate,
  likeDog
);
router.get(
  '/:id/unlike',
  passport.authenticate('jwt', { session: false }),
  jwtValidate,
  unlikeDog
);

module.exports = router;
