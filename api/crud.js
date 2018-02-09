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
    const sqlString = sql.toString();
    config.dbConfig.query(sqlString)
        .then((results) => {
            res.json(results);
        })
        .catch((e) => res.status(500).json({error: e.toString()}));
});

module.exports = router;
