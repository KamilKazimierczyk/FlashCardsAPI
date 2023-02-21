const express = require('express');
const flashCardRouter = require('./routes/flashCardRouter');
const userRouter = require('./routes/userRouter');
const languageRouter = require('./routes/languageRouter');
const errorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();

app.use(express.json());

//routes
app.use('/api/v1/flashCard', flashCardRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/language', languageRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;
