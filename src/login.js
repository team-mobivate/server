'use strict';

require('dotenv').config();

const express = require('express');
const loginRouter = express.Router();

const passport = require('passport');
const Strategy = require('passport-twitter').Strategy;

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
    const sessionId = request.sessionID;
    const sessionData = request.sessionStore.sessions[sessionId];
    const oAuthData = JSON.parse(sessionData)['oauth:twitter'];

    const userData = request.user._json;

    const savedUserData = {
      userId: userData.id,
      userName: userData.name,
      userScreenName: userData.screen_name,
      photoLink: request.user.photos[0].value,
      oAuthToken: request.query.oauth_token,
      oAuthVerifier: request.query.oauth_verifier,
      oAuthTokenSecret: oAuthData.oauth_token_secret,
    };

    // TODO: add to database

    response.redirect(
      `exp://4z-ggk.jagdeepsing.react-native-frontend.exp.direct:80/?display_name=${
        savedUserData.userScreenName
      }&user_name=${savedUserData.userName}&id=${savedUserData.userId}`
    );
  }
);
