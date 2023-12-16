const express = require('express');
const errorHandlingMiddleware = require('./controllers/errorController');
const AppError = require('./utils/AppError');

// * Importing routers
const userRouter = require('./routers/userRoutes');
const plansRouter = require('./routers/plansRoutes');
const reviewsRouter = require('./routers/reviewRoutes');

// * App initialization
const app = express();

// * Middlewares
// * Build-in middlewares
// Built-in middleware for parsing request json payload
app.use(express.json());
// Middleware for serving static files from 'public' directory
app.use(express.static(`${__dirname}/public`));

// * Routing
app.use('/api/v1/users', userRouter);
app.use('/api/v1/plans', plansRouter);
app.use('/api/v1/reviews', reviewsRouter);

// * Basic routing
app.get('/', (req, res) => {
  console.log(req);
  res.status(200).json({
    status: 'success',
    data: 'Hello from server',
  });
});

app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} does not exists`));
});

// * Error handling middleware
app.use(errorHandlingMiddleware);

module.exports = app;
