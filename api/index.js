const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackCompiler = webpack(require('./webpack.config'));
const auth = require('./auth');
const config = require('./config');
const app = express();

//app.use(session({ secret: 'R3x15M0ng', saveUninitialized: false, resave: false }));
//app.use(passport.initialize());
//app.use(passport.session());

// TODO: Make this disablable
app.use(webpackDevMiddleware(webpackCompiler, {
    publicPath: '/dist/',
}));

app.use(session({
    secret: config.sessionSecret,
    name: 'apd-session',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/version", function (req, res) {
    res.send(config.version);
});

app.use('/auth', auth.router);

const v1 = express.Router();
v1.use(cookieParser());
v1.use(auth.authenticate(function (req, res, next) {
    res.status(401).send({ error: "Access denied: You must log in" });
}));
v1.use(bodyParser.json());
v1.get("/", (req, res) => res.send({}));
v1.get("/user", (req, res) => res.json(req.user));
v1.get("/login", function (req, res) {
    return res.redirect("/");
});
v1.use("/tables", require('./crud'));

app.use('/api/v1', v1);

app.get('/logout', cookieParser(), auth.authenticate(function (req, res, next) {
    res.status(401).send({ error: "Access denied: You must log in" });
}), function (req, res) {
    req.logout();
    res.send({});
});

// If all else fails, fall back on static files
app.use(express.static(path.resolve(__dirname, 'dist')));
app.use(express.static(path.resolve(__dirname, 'static')));
app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, 'static', 'index.html'));
});

app.listen(config.bindPort);
