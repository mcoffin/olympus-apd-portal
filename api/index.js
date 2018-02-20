const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const requestProxy = require('express-request-proxy');
const squel = require('squel');
const Lazy = require('lazy.js');
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
v1.get("/players/:puid/comments", auth.ensureAdminLevel(1), function (req, res) {
    const sql = squel.select()
        .from('comments', 'c')
        .join(squel.select().from('players'), 'a', 'a.puid = c.auid')
        .where('c.puid = ?', req.params['puid'] || null)
        .order('timestamp', false);
    config.dbConfig.query(sql.toString())
        .then((results) => {
            return Lazy(results)
                .map((entry) => {
                    entry.author = {
                        puid: entry.auid,
                        p_name: entry.p_name,
                        rank: entry.rank,
                        admin_level: entry.admin_level,
                    };
                    entry.auid = undefined;
                    entry.p_name = undefined;
                    entry.rank = undefined;
                    entry.admin_level = undefined;
                    return entry;
                })
                .toArray();
        })
        .then((results) => res.json(results))
        .catch(e => res.status(500).json({error: e.toString()}));
});
v1.post("/players", auth.ensureAdminLevel(1), (req, res) => {
    const player = req.body['player'];
    const comment = req.body['comment'];
    const auid = req.user.puid;
    let commentsSql = squel
        .insert()
        .into('comments')
        .set('puid', player.puid)
        .set('auid', auid)
        .set('case_type', 'join');
    if (comment) {
        commentsSql = commentsSql
            .set('comment', comment);
    }
    let playersSql = squel
        .insert()
        .into('players');
    Lazy(player)
        .pairs()
        .each(([k, v]) => {
            sql = sql.set(k, v);
        });
    return config.dbConfig.beginTransaction()
        .then(() => {
            config.dbConfig
                .query(playersSql.toString())
                .then(() => config.dbConfig.query(commentsSql.toString()))
                .catch((e) => {
                    return config.dbConfig.rollback()
                        .then(() => {
                            throw e;
                        });
                });
        })
        .then(() => config.dbConfig.commit())
        .then(() => res.status(204))
        .catch((e) => res.status(500).json({error: e.toString()}));
});
function addHeader(headerName, headerValue) {
    return (req, res, next) => {
        res.set(headerName, headerValue);
        return next();
    };
}
v1.get('/olympus-stats', addHeader('Content-Type', 'application/json'), requestProxy({
    url: 'http://olympus-entertainment.com/olympus-stats/api.php',
    query: {
        action: 'json',
    },
}));

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
