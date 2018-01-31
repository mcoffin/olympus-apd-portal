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

/**
 * This route just acts as a shortcut for redirecting to google's OAuth2 API
 */
router.get("/google", function (req, res) {
    let url = "https://accounts.google.com/o/oauth2/v2/auth";
    url = url + encodeQueryParam("client_id", config.google.clientID, true);
    url = url + encodeQueryParam("scope", "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email");
    url = url + encodeQueryParam("redirect_uri", "http://127.0.0.1:8080/auth/google/callback");
    url = url + encodeQueryParam("response_type", "code");
    res.redirect(url);
});

/**
 * Callback route for google's OAuth2. takes the authorization_code and turns it in to an access_key, storing it in a cookie
 */
router.get("/google/callback", function (req, res) {
    let body = {
        code: req.query.code,
        client_id: config.google.clientID,
        client_secret: config.google.clientSecret,
        redirect_uri: callbackURL,
        grant_type: 'authorization_code',
    };
    body = querystring.stringify(body);
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

class User {
    constructor(id) {
        this.id = id;
    }
}

/**
 * Gets an access token given an Express request
 */
function getAccessToken(req) {
    const header = req.get('Authorization');
    if (header && header.startsWith("Bearer")) {
        return header.slice(7).pop();
    }
    const cookie = req.cookies['google_access_token'];
    if (cookie) {
        return cookie.access_token;
    }
} 

/**
 * Authorization middleware creator
 */
function authorize(onUnauthorized) {
    return function (req, res, next) {
        const token = getAccessToken(req);
        if (token) {
            const requestOptions = {
                protocol: 'https:',
                hostname: 'www.googleapis.com',
                port: 443,
                method: 'GET',
                path: `/oauth2/v3/tokeninfo?access_token=${encodeURIComponent(token)}`,
            };
            httpRequestF(requestOptions)
                .then(tokenRes => tokenRes.checkResponse())
                .then(tokenRes => JSON.parse(tokenRes.body))
                .then(tokenRes => {
                    const validClient = tokenRes.aud = config.google.clientID;
                    const validExpiration = tokenRes.expires_in > 0;
                    if (validClient && validExpiration) {
                        console.log(`token response: ${JSON.stringify(tokenRes)}`);
                        if (tokenRes.user_id) {
                            req.user = new User(tokenRes.user_id);
                        }
                        next()
                    } else {
                        onUnauthorized(req, res, next);
                    }
                });
        } else {
            console.log("Unauthorized because of missing or malformed header!");
            onUnauthorized(req, res, next);
        }
    };
}

exports.authorize = authorize;
exports.router = router;
