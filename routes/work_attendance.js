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
            var col_attendance = db.collection('attendance');
            var col_users = db.collection('users');

            col_attendance.insert(attendance, function (err, result) {
                if (err){
                    throw err;
                }else {
                    var entrance_time = col_attendance.find({entrance_time: attendance.entrance_time}, {_id: 1});
                    col_users.update(
                        {staff_email: 'maozedong@gmail.com'},
                        {$set: {En_Time_id: entrance_time}},
                        {
                            upsert: true,
                            multi: true
                        }
                    );
                    col_users.find().toArray(function (err, doc) {
                        console.log(doc);
                    })
                }
            })
        }
    })
});

module.exports = router;