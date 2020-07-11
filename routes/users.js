const router = require('express').Router();
const passport = require('passport');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

// import middleware
const { jwtValidate } = require('../middleware/auth');

// import handlers
const {
  signupUser,
  loginUser,
  getUser,
  getCurrentUser,
  updateUser,
  uploadUserImage,
} = require('../handlers/users');

// config aws
s3 = new AWS.S3({ params: { Bucket: 'dbay-app' } });

// config multer
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'dbay-app',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      let fileName = `${file.fieldname}/${req.user.user._id}/${Date.now()}-${
        file.originalname
      }`;
      cb(null, fileName);
    },
  }),
});

// assign user handlers to routes
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  jwtValidate,
  getCurrentUser
);
router.put(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  jwtValidate,
  updateUser
);
router.get('/:id', getUser);
router.post(
  '/profile/uploadImage',
  passport.authenticate('jwt', { session: false }),
  jwtValidate,
  upload.single('userImages'),
  uploadUserImage
);

module.exports = router;
