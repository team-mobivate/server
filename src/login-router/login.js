'use strict';

require('dotenv').config();

const express = require('express');
const passport = require('passport');
const Strategy = require('passport-twitter').Strategy;

const createUser = require('../create-user/create-user');

const loginRouter = express.Router();

let trustProxy = false;
if (process.env.DYNO) {
  trustProxy = true;
}

passport.use(
  new Strategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: '/oauth/callback',
      proxy: trustProxy,
    },
    function(token, tokenSecret, profile, cb) {
      return cb(null, profile);
    }
  )
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

loginRouter.use(passport.initialize());
loginRouter.use(passport.session());

loginRouter.get('/login/twitter', passport.authenticate('twitter'), (request, response) => {
  // this response should never be displayed to user if everything works correctly
  response.send({ hello: 'this is the auth route' });
});

loginRouter.get(
  '/oauth/callback',
  passport.authenticate('twitter', { failureRedirect: '/login/twitter' }),
  (request, response) => {
    const sessionData = request.sessionStore.sessions[request.sessionID];
    const oAuthData = JSON.parse(sessionData)['oauth:twitter'];

    const userData = {
      user_id: request.user._json.id,
      display_name: request.user._json.name,
      user_handle: request.user._json.screen_name,
      photo_link: request.user.photos[0].value,
      token: request.query.oauth_token,
      token_secret: oAuthData.oauth_token_secret,
    };

    console.log(createUser(userData));

    response.redirect(
      `exp://4z-ggk.jagdeepsing.react-native-frontend.exp.direct:80/?display_name=${userData.display_name}&user_name=${userData.user_handle}&id=${userData.user_id}`
    );
  }
);

module.exports = loginRouter;
