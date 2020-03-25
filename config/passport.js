const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/users');
const jwtStrategy = require('passport-jwt').Strategy;
const extractJWT = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');

passport.use(
  'signup',
  new localStrategy(
    {
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        const hash = await bcrypt.hash(password, 10);
        const user = await UserModel.create({ ...req.body, password: hash });
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });
        if (!user) return done({ error: 'User not found' });
        const validate = await bcrypt.compare(password, user.password);
        if (!validate)
          return done({ error: 'Username or password is incorrect' });
        return done(null, user, { message: 'Logged in successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  'jwt',
  new jwtStrategy(
    {
      secretOrKey: 'top_secret',
      jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        return done(null, token);
      } catch (error) {
        done(error);
      }
    }
  )
);
