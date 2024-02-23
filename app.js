const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const tourRouters = require('./routes/tourRoutes');
const userRouters = require('./routes/userRoutes');
const reviewRouters = require('./routes/reviewRoutes');
const bookingRouters = require('./routes/bookingRoutes');
const bookingController = require('./controller/bookingController');
const viewRouters = require('./routes/viewRoutes');

// start express app
const app = express();
app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// console.log(tourRouter);

// 1) Global Middlewares
// Implement CORS
app.use(cors());
// Access-Control-Allow-Origin *
// api.natours.com , front-end natours.com
// app.use(
//   cors({
//     origin: 'https://www.natours.com',
//   }),
// );

app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// SET Security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP ,please try again an hour!',
});
app.use('/api', limiter);

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webHookCheckout,
);

// Body parser , reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data snitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingAverage',
      'ratingQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.use(compression());

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 3) ROUTES

app.use('/', viewRouters);
app.use('/api/v1/tours', tourRouters);
app.use('/api/v1/users', userRouters);
app.use('/api/v1/reviews', reviewRouters);
app.use('/api/v1/bookings', bookingRouters);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// 4)Start Server
module.exports = app;
