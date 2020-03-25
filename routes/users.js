const router = require('express').Router();
const passport = require('passport');

// import middleware
const { jwtValidate } = require('../middleware/auth');

// import handlers
const {
  signupUser,
  loginUser,
  getUser,
  getCurrentUser
} = require('../handlers/users');

// assign user handlers to routes
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  jwtValidate,
  getCurrentUser
);
router.get('/:id', getUser);

module.exports = router;
