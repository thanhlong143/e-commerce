const userRouter = require('./user');
const { notFound, errorHandler } = require('../middlewares/errorHandlerMiddleware');

const initRoutes = (app) => {
    app.use('/api/user', userRouter);



    app.use(notFound);
    app.use(errorHandler);
}

module.exports = initRoutes;