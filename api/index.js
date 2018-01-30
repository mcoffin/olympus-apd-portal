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

app.get('/login', function (req, res, next) {
    const options = {
        root: path.join(__dirname, 'static'),
        dotfiles: "ignore",
    };
    res.sendFile("login.html", options, function (err) {
        if (err) {
            next(err);
        }
    });
});

app.use('/auth', auth.router);

const v1 = express.Router();
v1.use(require('body-parser'));

app.use('/api/v1', v1);

app.listen(config.bindPort);
