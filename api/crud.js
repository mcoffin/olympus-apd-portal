const express = require('express');
const router = new express.Router();
const squel = require('squel');
const Lazy = require('lazy.js');

const config = require('./config');

router.get("/:table", function (req, res) {
    let sql = squel.select()
        .from(req.params['table']);
    Lazy(req.query)
        .pairs()
        .each(([fieldName, fieldValue]) => {
            sql = sql.where(`${fieldName} = ?`, fieldValue);
        });
    const orderBy = req.get('X-APD-OrderBy');
    if (orderBy) {
        sql = sql.order(orderBy);
    }
    const limit = req.get('X-APD-Limit');
    if (limit) {
        sql = sql.limit(parseInt(limit));
    }
    const sqlString = sql.toString();
    config.dbConfig.query(sqlString)
        .then((results) => {
            res.json(results);
        })
        .catch((e) => res.status(500).json({error: e.toString()}));
});

module.exports = router;
