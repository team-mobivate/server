'use strict';

require('dotenv').config();
const express = require('express');

const loginRouter = require('./login-router/login');
const appLogicRouter = require('./app-logic-router/app-logic-router');

// -----------------------------------------------------------------------
const app = express();
app.use(express.static('public'));
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
// -----------------------------------------------------------------------

app.use('/', loginRouter);
app.use('/', appLogicRouter);

app.get('/logout', (request, response) => {
  request.session.destroy((err) => {
    response.redirect('/');
  });
});

module.exports = {
  server: app,
  start: (port) => app.listen(port, () => console.log(`Server up on port ${port}`)),
};
