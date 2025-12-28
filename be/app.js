var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require("dotenv").config();

var usersRouter = require('./routes/usersRoutes');
var AccsRouter = require('./routes/accRouters');
var bannerRouter = require('./routes/bannersRoutes');
var regionsRouter = require('./routes/regionsRoutes');
var locationsRouter = require('./routes/locationsRoutes');
var tourRouter = require('./routes/toursRoutes');
var tourScheduleRouter = require('./routes/tour_scheduleRoutes');
var tourNotesRouter = require('./routes/tour_notesRoutes');
var promotionsRouter = require('./routes/promotionsRoutes');
var user_promotionsRouter = require('./routes/user_promotionsRoutes');
var booking_servicesRouter = require('./routes/booking_servicesRoutes');
var bookingsRouter = require('./routes/bookingsRoutes');
var category_serviceRouter = require('./routes/category_serviceRoutes');
var contactRouter = require('./routes/contactRoutes');
var favorite_toursRouter = require('./routes/favorite_toursRoutes');
var image_tourRouter = require('./routes/image_tourRoutes');
var reviewsRouter = require('./routes/reviewsRoutes');
var servicesRouter = require('./routes/servicesRoutes');
var tour_ticket_pricesRouter = require('./routes/tour_ticket_pricesRoutes');
var tour_guidesRouter = require('./routes/tour_guidesRoutes');
var tour_typesRouter = require('./routes/tour_typesRoutes');
var user_pointsRouter = require('./routes/user_pointsRoutes');
var combosRouter = require('./routes/combosRoutes');
var emailRouter = require('./routes/emailRoutes');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public/images', express.static(path.join(__dirname, 'public/images')));
app.use(cors());

app.use('/users', usersRouter);
app.use('/acc', AccsRouter);
app.use('/banner', bannerRouter);
app.use('/region', regionsRouter);
app.use('/location', locationsRouter);
app.use('/tour', tourRouter); 
app.use('/tour_ticket_prices', tour_ticket_pricesRouter);
app.use('/schedule', tourScheduleRouter);
app.use('/notes', tourNotesRouter);
app.use('/promotion', promotionsRouter);
app.use('/user_promotions', user_promotionsRouter);
app.use('/booking_services', booking_servicesRouter);
app.use('/bookings', bookingsRouter);
app.use('/category_service', category_serviceRouter);
app.use('/contact', contactRouter);
app.use('/favorite_tours', favorite_toursRouter);
app.use('/image_tour', image_tourRouter);
app.use('/reviews', reviewsRouter);
app.use('/services', servicesRouter);
app.use('/tour_guides', tour_guidesRouter);
app.use('/tour_types', tour_typesRouter);
app.use('/user_points', user_pointsRouter);
app.use('/combo', combosRouter);
app.use('/email', emailRouter);

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
