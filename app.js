const express = require('express');
const flashCardRouter = require('./routes/flashCardRouter');
const userRouter = require('./routes/userRouter');
const languageRouter = require('./routes/languageRouter');
const errorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());

app.use(cookieParser());

const corsOptions = {
  origin: 'http://127.0.0.1:3000',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
// app.use(cors());

app.use((req, res, next) => {
  console.log(req.cookies);
  next();
});

//routes
app.use('/api/v1/flashCard', flashCardRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/language', languageRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;
