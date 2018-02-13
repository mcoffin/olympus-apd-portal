const express = require('express');
const passport = require('passport');
const http = require('http');
const path = require('path');
const querystring = require('querystring');
const Lazy = require('lazy.js');
const squel = require('squel');
const { HttpResponse, httpRequestF } = require('http-shortcut');
const config = require('./config');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const SteamStrategy = require('passport-steam').Strategy;

const callbackURL = "http://127.0.0.1:8080/auth/google/callback";

const router = express.Router();

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new SteamStrategy({
    returnURL: 'http://localhost:8080/auth/steam/callback',
    realm: 'http://localhost:8080/',
    apiKey: '2B0181C19824C83DE2319D861F7CD47C',
}, function (identifier, profile, done) {
    profile.identifier = identifier;

    const sql = squel.select()
        .from('players')
        .where('puid = ?', profile['_json']['steamid']);

    config.dbConfig.query(sql.toString())
        .then(res => {
            if (!res[0]) {
                throw new Error(`${identifier} not found in database`);
            }
            return res[0];
        })
        .then(res => Lazy(res).merge(profile).toObject())
        .then(u => done(null, u))
        .catch(e => done(e));
}));

function fixRequestUrl(req, res, next) {
    req.url = req.originalUrl;
    next();
}

router.get('/steam', passport.authenticate('steam', { failureRedirect: '/' }), (req, res) => res.redirect("/"));
router.get('/steam/callback', fixRequestUrl, passport.authenticate('steam', { failureRedirect: '/' }), (req, res) => res.redirect("/api/v1/login"));

function authenticate(onUnauthenticated) {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            if (!req.cookies['user_id']) {
                res.cookie('user_id', req.user.identifier);
            }
            return next();
        }
        res.clearCookie('user_id');
        onUnauthenticated(req, res, next);
    };
}

exports.router = router;
exports.authenticate = authenticate;
