/**
 * Created by mamol on 16/06/14.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.render('work_attendance');
});

router.post('/',function (req, res) {
    var mongodb = require('mongodb');
    var server = new mongodb.Server('localhost', 27017);
    var db = mongodb.Db('staffexam', server, {safe: true});

    db.open(function (err,db) {
        if (err){
            throw err
        }else {
            var attendance = req.body;
            var collection = db.collection('attendance');

            collection.insert(attendance, function (err, result) {
                if (err){
                    throw err;
                }else {
                    res.send(result);
                }
            })
        }
    })
});

module.exports = router;