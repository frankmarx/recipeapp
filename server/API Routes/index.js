const { Router } = require('express');
const { profilesRouter } = require('./Profiles');
const { recipesRouter } = require('./Recipes');
const { awsRouter } = require('./Aws.js');

const apiRouter = Router();

apiRouter.use('/profiles', profilesRouter);
apiRouter.use('/recipes', recipesRouter);
apiRouter.use('/aws', awsRouter);


module.exports = {
  apiRouter,
}; 