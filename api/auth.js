const express = require('express');
const passport = require('passport');
const http = require('http');
const path = require('path');
const config = require('./config');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const callbackURL = "http://127.0.0.1:8080/auth/google/callback";

const router = express.Router();

class HttpResponse {
    constructor(res) {
        this.res = res;
        // TODO: hint this allocation with content-length header
        this.body = new Buffer();
    }

    updateBody(chunk) {
        this.body = Buffer.concat([this.body, chunk]);
    }
}

function httpRequestF(options, reqBody) {
    return new Promise(function (resolve, reject) {
        const req = http.request(options, function (res) {
            res = new HttpResponse(res);
            res.on('data', res.updateBody);
            res.on('end', () => resolve(res));
        });
        req.on('error', reject(e));
    });
}

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
        redirect_uri: callbackURL + "/token",
    };
    body = JSON.stringify(body);
    const requestOptions = {
        protocol: 'https:',
        hostname: 'www.googleapis.com',
        port: 443,
        method: 'GET',
        path: '/oauth2/v4/token',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
        },
    };
    httpRequestF(requestOptions)
        .then((
});

exports.router = router;
