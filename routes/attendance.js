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
//Get Weekday
var w = now.getDay();
//Get Timestamp
var ts = now.getTime();
var ds = Math.floor(ts / 1000 / 60 / 60 / 24);


/* GET users listing. */
router.get('/', function(req, res) {
    if (req.session.user){
        db.open(function (err, db) {
            if (err){
                throw err;
            }else {
                var msg = [];
                var col_attendance = db.collection('attendance');

                if (w > 1){
                    var x = w - i;
                    for (i=1; i<w; i++){}
                }
                // }
                // }
                // }
                //     for (i=1; i<w; i++){
                //
                //         col_attendance.find({user_id: req.session.user._id, timestamp: ds-i}).toArray(function (err, doc) {
                //             if (err){
                //                 throw err;
                //             }else {
                //                 msg['d'+ x] = doc[0].entrance_time;
                //
                //             }
                //
                // for (i=1; i<w; i++){
                //     var x = w - i;
                //     col_attendance.find({user_id: req.session.user._id, timestamp: ds-i}).toArray(function (err, doc) {
                //         if (err){
                //             throw err;
                //         }else {
                //             if (w > 1){
                //                 msg['d'+ x] = doc[0].entrance_time;
                //             }else if(w = 1) {
                //                 msg['d'+ ]
                //             }
                //         }
                //     })
                // }

                
                
                
                
                
                
                
                
                
                
                col_attendance.find({user_id: req.session.user._id, date: datestr}).toArray(function (err, docs) {
                    console.log(docs);

                    if (err){
                        throw err;
                    }else {
                        if (docs.length==0){
                            res.render('attendance/attendance');
                        }else {
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
                attendance['timestamp'] = ds;

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