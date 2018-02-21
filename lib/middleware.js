const config = require('../config');
const Lazy = require('lazy.js');
const squel = require('squel');

function snagPlayer(f) {
    return function (req, res, next) {
        const puid = f(req);
        const sql = squel
            .select()
            .from('players')
            .where('puid = ?', puid)
            .toParam();
        return config.dbConfig.query(sql.text, sql.values)
            .then(res => Lazy(res).first())
            .then(p => {
                req.player = p;
                next();
            })
            .catch(e => res.status(404).json({error: 'Player not found'}));
    };
}

exports.snagPlayer = snagPlayer;
