/**
 * Created by mamol on 16/06/27.
 */
require('date-utils');
var async = require('async');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    //DBの設定
    var mongodb = require('mongodb');
    var server = new mongodb.Server('localhost', 27017);
    var db = mongodb.Db('staffManagement', server, {safe: true});

    if (!req.session.user){
        res.redirect('/login')
    }else {
        if (req.session.user.staff_occupation == '管理者'){
            db.open(function (err, db) {
                if (err){
                    throw err;
                }else {
                    var col_user = db.collection('users');
                    col_user.find().toArray(function (err, doc) {
                        if (err){
                            throw err;
                        }else {
                            // var info = [];
                            //console.log(doc);
                            res.render('adminpage/admin', {info: doc})
                        }
                    })
                }
            });
        }else {
            res.redirect('/login');
        }
    }
});


router.get('/att_checking', function (req, res) {
    res.redirect('/admin')
});

router.get('/set', function (req, res) {
    res.redirect('/admin')
});



router.post('/', function (req, res) {
    if (req.body.logout){
        req.session.destroy(function () {
            console.log('user logout');
            res.redirect('/login')
        })
    }else if (req.body.admin){
        res.redirect('/admin')
    }else {
        res.redirect('/admin')
    }
});

//出勤一覧
router.post('/att_checking', function (req, res) {
    console.log('post to att_checking');
    //DBの設定
    var mongodb = require('mongodb');
    var server = new mongodb.Server('localhost', 27017);
    var db = mongodb.Db('staffManagement', server, {safe: true});
    if (req.body.logout){
        req.session.destroy(function () {
            console.log('user logout');
            res.redirect('/login')
        })
    }else if (req.body.admin){
        res.redirect('/admin')
    }else {
        db.open(function (err, db) {
            if (err){
                throw err
            }else {
                var now = new Date();

                var info = {};
                var id = req.body.staff_id;
                var name = req.body.staff_name;
                var col_attendance = db.collection('attendance');

                info['user_id'] = id;
                info['user_name'] = name;
                info['att_data'] = [];

                var a = [0,1,2,3,4,5,6,7,8,9];

                async.eachSeries(
                    a,
                    function (i, callback) {
                        var the_day = new Date();
                        the_day.setDate(now.getDate() - i);

                        col_attendance.findOne(
                            {user_id: id, date: the_day.toFormat("YYYY-MM-DD")},
                            function (err, item) {
                                if (err){
                                    throw err;
                                }else {
                                    console.log(item);
                                    info['att_data'][i] = item;
                                    if (info['att_data'][i] == null){
                                        info['att_data'][i] = {date_id: i};
                                    }else {
                                        info['att_data'][i].date_id = i
                                    }
                                    callback();
                                }
                            }
                        );
                    },
                    function(error, results) {
                        if (error) {
                            console.log(error);
                        }

                        console.log(info);

                        res.render('adminpage/att_checking', {info:info});
                    }
                );
            }
        });
    }
});

//社員情報設定
router.post('/set', function (req, res) {
    console.log('post to set');
    //DBの設定
    var mongodb = require('mongodb');
    var server = new mongodb.Server('localhost', 27017);
    var db = mongodb.Db('staffManagement', server, {safe: true});

    if (req.body.logout){
        req.session.destroy(function () {
            console.log('user logout');
            res.redirect('/login')
        })
    }else if (req.body.admin || req.body.back){
        res.redirect('/admin')
    }else if (req.body.set_modify){
        db.open(function (err, db) {
            if (err){
                throw err
            }else {
                var col_user = db.collection('users');
                var id_str = req.body.staff_id;
                console.log(id_str);
                col_user.update(
                    {_id: id_str},
                    {$set: req.body},
                    {
                        upsert: false
                    },function (err, item) {
                        if (err){
                            throw err
                        }else {
                            console.log(item);
                            res.render('adminpage/set', {info: item});
                        }
                    }
                )
            }
        })
    }else {
        db.open(function (err, db) {
            if (err){
                throw err
            }else {
                var col_user = db.collection('users');
                col_user.findOne(req.body, function (err, item) {
                    if (err){
                        throw err
                    }else {
                        res.render('adminpage/set', {info: item});
                    }
                })
            }
        })
    }
});


module.exports = router;