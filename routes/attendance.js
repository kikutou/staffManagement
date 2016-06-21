/**
 * Created by mamol on 16/06/14.
 */
var express = require('express');
var router = express.Router();
//DataBase
var mongodb = require('mongodb');
var server = new mongodb.Server('localhost', 27017);
var db = mongodb.Db('staffManagement', server, {safe: true});
//現在時刻
var now = new Date();
var y = now.getFullYear();
var m = now.getMonth() + 1;
var d = now.getDate();
if (m < 10) {
    m = '0' + m;
}
if (d < 10) {
    d = '0' + d;
}
var datestr = y + '-' + m + '-' + d;


/* GET users listing. */
router.get('/', function(req, res) {
    if (req.session.user){
        db.open(function (err, db) {
            if (err){
                throw err;
            }else {
                var col_attendance = db.collection('attendance');

                col_attendance.find({user_id: req.session.user._id, date: datestr}).toArray(function (err, docs) {
                    console.log(docs);

                    if (err){
                        throw err;
                    }else {
                        if (docs.length==0){
                            res.render('attendance/attendance');
                        }else {
                            var msg = [];
                            if (docs[0].entrance_time){
                                msg['result_enTime'] = true;
                                msg['entrance'] = docs[0].entrance_time
                            }
                            if (docs[0].late_reason){
                                msg['result_late'] = true;
                                msg['rson_e'] = docs[0].late_reason
                            }
                            if (docs[0].leave_time){
                                msg['result_lvTime'] = true;
                                msg['leave'] = docs[0].leave_time
                            }
                            if (docs[0].E_O_reason){
                                msg['result_E_O'] = true;
                                msg['rson_l'] = docs[0].E_O_reason
                            }
                            console.log(msg);
                            res.render('attendance/attendance', msg);
                        }
                    }
                })
            }
        })
    }else {
        res.redirect('login')
    }
});

router.post('/', function (req, res) {
    if (req.body.logout){
        req.session.destroy(function () {
            console.log('user logout');
            res.redirect('/login')
        })
    }else {
        db.open(function (err, db) {
            if (err){
                throw err;
            }else {
                var attendance = req.body;
                attendance['user_id'] = req.session.user._id;
                attendance['date'] = datestr;

                var col_attendance = db.collection('attendance');

                col_attendance.update(
                    {user_id: attendance['user_id'], date: attendance['date']},
                    {$set: attendance},
                    {
                        upsert: true,
                        multi: true
                    }, function (err, result) {
                        if (err){
                            throw err;
                        }else {
                            res.redirect('/attendance')
                        }
                    }
                )
            }
        })
    }
});

module.exports = router;