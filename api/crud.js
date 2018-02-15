const express = require('express');
const router = new express.Router();
const squel = require('squel');
const Lazy = require('lazy.js');

const config = require('./config');

const pageSizes = {
    players: 50,
};

function pageSize(tableName) {
    return pageSizes[tableName] || 100;
}

router.get("/:table", function (req, res) {
    let sql = squel.select()
        .from(req.params['table']);
    Lazy(req.query)
        .pairs()
        .each(([fieldName, fieldValue]) => {
            sql = sql.where(`${fieldName} = ?`, fieldValue);
        });
    const orderBy = req.get('X-APD-OrderBy') || 'puid';
    let limit = pageSize(req.params['table']);
    let userLimit = req.get('X-APD-Limit');
    if (userLimit) {
        userLimit = parseInt(userLimit);
        if (userLimit < limit) {
            limit = userLimit;
        }
    }
    sql = sql.order(orderBy).limit(limit);
    let offset = req.get('X-APD-Offset');
    if (offset) {
        offset = parseInt(offset);
        sql = sql.offset(offset);
    } else {
        offset = 0;
    }
    const sqlString = sql.toString();
    config.dbConfig.query(sqlString)
        .then((results) => {
            if (results.length >= limit) {
                res.set('X-APD-Offset', offset + results.length);
            }
            res.json(results);
        })
        .catch((e) => res.status(500).json({error: e.toString()}));
});

module.exports = router;
