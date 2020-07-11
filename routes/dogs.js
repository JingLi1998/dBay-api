const router = require('express').Router();
const passport = require('passport');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

// import middleware
const { jwtValidate } = require('../middleware/auth');

// import dog handlers
const {
  getDogs,
  getDog,
  postDog,
  putDog,
  deleteDog,
  uploadDogImage
} = require('../handlers/dogs');

// import comment handlers
const {
  postComment,
  putComment,
  deleteComment
} = require('../handlers/comments');

// import like handlers
const { likeDog, unlikeDog } = require('../handlers/likes');

// config aws
s3 = new AWS.S3({ params: { Bucket: 'dbay-app' } });

// config multer
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'dbay-app',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function(req, file, cb) {
      let fileName = `${file.fieldname}/${
        req.params.id
      }/${Date.now()}-${file.originalname.replace(/ /g, '_')}`;
      cb(null, fileName);
    }
  })
});

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
router.post(
  '/:id/uploadImage',
  passport.authenticate('jwt', { session: false }),
  jwtValidate,
  upload.single('dogImages'),
  uploadDogImage
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
