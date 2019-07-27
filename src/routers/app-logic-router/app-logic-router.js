'use strict';

require('dotenv').config();

const express = require('express');
const appLogicRouter = express.Router();

appLogicRouter.post('/createGoal', (request, response) => {
  // TODO: validate required data for goal
  // TODO: add goal to database
  // TODO: respond with success/error message
});

appLogicRouter.post('/goals', (request, response) => {
  // TODO: get goals from database with matching username
  // TODO: send back goals as JSON
});

appLogicRouter.post('/updateGoal', (request, response) => {
  // TODO: update goal progress in database
  // TODO: respond with success/error message
});

appLogicRouter.post('/deleteGoal', (request, response) => {
  // TODO: delete goal progress for user in database
  // TODO: respond with success/error message
});

module.exports = appLogicRouter;
