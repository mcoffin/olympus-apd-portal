const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
//const passport = require('passport');
const session = require('express-session');
const path = require('path');
const auth = require('./auth');
const config = require('./config');
const app = express();

//app.use(session({ secret: 'R3x15M0ng', saveUninitialized: false, resave: false }));
//app.use(passport.initialize());
//app.use(passport.session());

app.get("/version", function (req, res) {
    res.send(config.version);
});

app.use('/auth', auth.router);

const v1 = express.Router();
v1.use(cookieParser())
v1.use(auth.authorize(function (req, res, next) {
    res.status(401).send({ error: "Access denied: You must log in" });
}));
v1.use(bodyParser.json());
v1.get("/foo", function (req, res) {
    res.send(req.user);
});

app.use('/api/v1', v1);

// If all else fails, fall back on static files
app.use(express.static(path.resolve(__dirname, 'dist')));
app.use(express.static(path.resolve(__dirname, 'static')));

app.listen(config.bindPort);
