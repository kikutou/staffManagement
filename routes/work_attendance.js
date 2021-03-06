/**
 * Created by mamol on 16/06/14.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
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

    if (req.session.user){
        db.open(function (err, db) {
            if (err){
                throw err;
            }else {
                var msg = [];
                var col_attendance = db.collection('attendance');

                if (w == 1){
                    w = 8;
                }else if (w == 0){
                    w = 7;
                }
                for (var i=0; i<w; i++){
                    //建立闭包，保证循环进行
                    (function (i) {
                        col_attendance.find({user_id: req.session.user._id, timestamp: ds-i}).toArray(function (err, doc) {
                            if (err){
                                throw err;
                            }else {
                                var x = w - i;
                                if (doc.length!=0){
                                    //     msg['et'+ x] = null;
                                    //     msg['lr'+ x] = null;
                                    //     msg['lt'+ x] = null;
                                    //     msg['eor'+ x] = null;
                                    // }else {
                                    msg['et'+ x] = doc[0].entrance_time;
                                    msg['lr'+ x] = doc[0].late_reason;
                                    msg['lt'+ x] = doc[0].leave_time;
                                    msg['eor'+ x] = doc[0].E_O_reason;
                                }
                            }
                        })
                    })(i)
                }


                col_attendance.find({user_id: req.session.user._id, date: datestr}).toArray(function (err, docs) {
                    console.log(docs);

                    if (err){
                        throw err;
                    }else {
                        if (docs.length==0){
                            res.render('work_attendance', msg);
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
                            res.render('work_attendance', msg);
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
    // //Get Weekday
    // var w = now.getDay();
    // //Get Timestamp
    var ts = now.getTime();
    var ds = Math.floor(ts / 1000 / 60 / 60 / 24);
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
                            res.redirect('/work_attendance')
                        }
                    }
                )
            }
        })
    }
});

module.exports = router;