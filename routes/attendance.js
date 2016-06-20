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
                var col_user = db.collection('users');

                var user_msg = col_attendance.find({user_id: req.session.user._id, date: datestr});
                user_msg.toArray(function (err, docs) {
                    // console.log(docs);
                    if (err){
                        throw err;
                    }else {
                        if (user_msg.entrance_time){
                            res.render('attendance/attendance', {result_enTime: true});
                        }
                        if (user_msg.late_reason){
                            res.render('attendance/attendance', {result_late: true});
                        }
                        if (user_msg.leave_time){
                            res.render('attendance/attendance', {result_lvTime: true});
                        }
                        if (user_msg.E_O_reason){
                            res.render('attendance/attendance', {result_E_O: true});
                        }
                    }
                })
            }
        });

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

                col_attendance.insert(attendance, function (err, result) {
                    if (err){
                        throw err;
                    }else{
                        if (attendance.entrance_time){
                            //入室確認
                            res.render('attendance/attendance', {result_enTime: true});
                        }else if (attendance.late_reason){
                            //遅刻原因
                            res.render('attendance/attendance', {result_late: true});
                        }else if (attendance.leave_time){
                            //退室確認
                            res.render('attendance/attendance', {result_lvTime: true});
                        }else if (attendance.E_O_reason){
                            //早退原因
                            res.render('attendance/attendance', {result_E_O: true});
                        }else {
                            res.redirect('/attendance');
                        }
                    }
                });

            }
        })
    }
});



module.exports = router;