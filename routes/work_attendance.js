/**
 * Created by mamol on 16/06/14.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {

    if(req.session.user){
        res.render('work_attendance');
    }else{
        res.redirect('/login');
    }

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
                    //Entrance Time
                    col_users.update(
                        {staff_email: req.session.user.staff_email},
                        {$set: {En_Time_id: attendance['_id']}},
                        {
                            upsert: true,
                            multi: true
                        }
                    );
                    col_users.find().toArray(function (err, doc) {
                        col_attendance.find({entrance_time: attendance.entrance_time}).toArray(function (err, docs) {
                            console.log(docs);
                        });
                        console.log(doc);
                        res.render('work_attendance')
                    })
                }
            })
        }
    })
});

module.exports = router;