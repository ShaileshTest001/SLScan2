const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const crypto = require('crypto');

const { logger } = require('./Logger');
const registerApiRoutes = require('./api');
const registerViewRoutes = require('./views');

const app = express();
app.disable('x-powered-by'); // Disable X-Powered-By header

const port = process.env.PORT || 8088;
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

const tarpitEnv = {
  applicationPort: port
};

app.set('tarpitEnv', tarpitEnv);

// Safe logging middleware
const insider = function(req, res, next) {
  logger.log('Request:', req);
  logger.log('Request body:', req.body);
  logger.log('Request query:', REQ.query);
  next();
};

app.use(insider);

app.use(function(err, req, res, next) {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use(bodyParser.urlencoded({ 
  extended: false,
  limit: '10kb'
}));

app.use(bodyParser.json({
  limit: '10kb'
}));

app.use(cookieParser());

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict'
    }
  })
);

app.set('view engine', 'pug');
app.set('views', `./src/Views`);

registerApiRoutes(app);
registerViewRoutes(app);

app.listen(port, () =>
  logger.log(
    `Tarpit App listening on port ${port}!. Open url: http://localhost:${port}`
  )
);
