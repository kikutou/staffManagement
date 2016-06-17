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
    if (req.body.logout){
        req.session.destroy(function () {
            console.log('user logout');
            res.redirect('/login')
        })
    }else {
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
                        if (attendance.entrance_time){
                            //出席確認
                            col_users.update(
                                {staff_email: req.session.user.staff_email},
                                {$set: {Ent_Time_id: attendance['_id']}},
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
                                res.redirect('/work_attendance');
                            })
                        }else if(attendance.leave_time){
                            //退室確認
                            col_users.update(
                                {staff_email: req.session.user.staff_email},
                                {$set: {Lev_Time_id: attendance['_id']}},
                                {
                                    upsert: true,
                                    multi: true
                                }
                            );
                            col_users.find().toArray(function (err, doc) {
                                col_attendance.find({leave_time: attendance.leave_time}).toArray(function (err, docs) {
                                    console.log(docs)
                                });
                                console.log(doc);
                                res.redirect('/work_attendance');
                            })
                        }else if(attendance.late_reason){
                            //遅刻原因
                            col_users.update(
                                {staff_email: req.session.user.staff_email},
                                {$set: {Lat_Rsn_id: attendance['_id']}},
                                {
                                    upsert: true,
                                    multi: true
                                }
                            );
                            col_users.find().toArray(function (err, doc) {
                                col_attendance.find({late_reason: attendance.late_reason}).toArray(function (err, docs) {
                                    console.log(docs)
                                });
                                console.log(doc);
                                res.redirect('/work_attendance');
                            })
                        }else if(attendance.leave_reason){
                            //早退原因
                            col_users.update(
                                {staff_email: req.session.user.staff_email},
                                {$set: {Lev_Rsn_id: attendance['_id']}},
                                {
                                    upsert: true,
                                    multi: true
                                }
                            );
                            col_users.find().toArray(function (err, doc) {
                                col_attendance.find({leave_reason: attendance.leave_reason}).toArray(function (err, docs) {
                                    console.log(docs)
                                });
                                console.log(doc);
                                res.redirect('/work_attendance');
                            })
                        }else if(attendance.late_remark){
                            //遅刻リマーク
                            col_users.update(
                                {staff_email: req.session.user.staff_email},
                                {$set: {Lat_Rmk_id: attendance['_id']}},
                                {
                                    upsert: true,
                                    multi: true
                                }
                            );
                            col_users.find().toArray(function (err, doc) {
                                col_attendance.find({late_remark: attendance.late_remark}).toArray(function (err, docs) {
                                    console.log(docs)
                                });
                                console.log(doc);
                                res.redirect('/work_attendance');
                            })
                        }else if(attendance.leave_remark){
                            //早退リマーク
                            col_users.update(
                                {staff_email: req.session.user.staff_email},
                                {$set: {Lev_Rmk_id: attendance['_id']}},
                                {
                                    upsert: true,
                                    multi: true
                                }
                            );
                            col_users.find().toArray(function (err, doc) {
                                col_attendance.find({leave_remark: attendance.leave_remark}).toArray(function (err, docs) {
                                    console.log(docs)
                                });
                                console.log(doc);
                                res.redirect('/work_attendance');
                            })
                        }else {
                            res.send(result)
                        }
                    }
                })
            }
        })
    }
});

module.exports = router;