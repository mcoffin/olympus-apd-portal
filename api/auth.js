const express = require('express');
const passport = require('passport');
const http = require('http');
const path = require('path');
const querystring = require('querystring');
const config = require('./config');
const { HttpResponse, httpRequestF } = require('./http-utils');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const callbackURL = "http://127.0.0.1:8080/auth/google/callback";

const router = express.Router();

function encodeQueryParam(key, value, first) {
    let prefix = "&";
    if (first) {
        prefix = "?";
    }
    return `${prefix}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
}

router.get("/google", function (req, res) {
    let url = "https://accounts.google.com/o/oauth2/v2/auth";
    url = url + encodeQueryParam("client_id", config.google.clientID, true);
    url = url + encodeQueryParam("scope", "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email");
    url = url + encodeQueryParam("redirect_uri", "http://127.0.0.1:8080/auth/google/callback");
    url = url + encodeQueryParam("response_type", "code");
    res.redirect(url);
});

router.get("/google/callback", function (req, res) {
    let body = {
        code: req.query.code,
        client_id: config.google.clientID,
        client_secret: config.google.clientSecret,
        redirect_uri: callbackURL,
        grant_type: 'authorization_code',
    };
    body = querystring.stringify(body);
    console.log("body:\n" + body);
    const requestOptions = {
        protocol: 'https:',
        hostname: 'www.googleapis.com',
        port: 443,
        method: 'POST',
        path: '/oauth2/v4/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };
    httpRequestF(requestOptions, body)
        .then((tokenRes) => tokenRes.checkResponse())
        .then((tokenRes) => JSON.parse(tokenRes.body))
        .then((tokenRes) => {
            res.cookie('google_access_token', tokenRes);
            res.redirect('/');
        })
        .catch((e) => res.status(500).send(e.toString));
});

exports.router = router;
