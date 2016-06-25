/**
 * Created by mamol on 16/06/15.
 */
var express = require('express');
var router = express.Router();

//現在時刻
var now = new Date();
var year = now.getFullYear();
var month = now.getMonth();
var day = now.getDate();

var second_month = new Date();
second_month.setMonth(second_month.getMonth() + 1);

var third_month = new Date();
third_month.setMonth(third_month.getMonth() + 2);

var fourth_month = new Date();
fourth_month.setMonth(fourth_month.getMonth() + 3);

var datestr_1 = now.toISOString().substring(0, 7);
var datestr_2 = second_month.toISOString().substring(0, 7);
var datestr_3 = third_month.toISOString().substring(0, 7);
var datestr_4 = fourth_month.toISOString().substring(0, 7);

/* GET users listing. */
router.get('/', function(req, res) {
    //DBの設定
    var mongodb = require('mongodb');
    var server = new mongodb.Server('localhost', 27017);
    var db = mongodb.Db('staffManagement', server, {safe: true});

    //すでに登録したユーザーのみがアクセスできる。
    if (req.session.user){
        db.open(function (err, db) {
            if (err){
                throw err
            }else {

                var col_exam = db.collection('exam');

                col_exam.findOne(
                    {user_id: req.session.user._id},
                    function (err, item) {
                        if (err){
                            throw err
                        }else {
                            res.render('work_exam', {info: item});
                            console.log(item)
                        }
                    }
                )
            }
        });
    }else {
        res.redirect('/login')
    }
});




router.post('/', function (req, res) {
    if (req.body.logout){
        req.session.destroy(function () {
            console.log('user logout');
            res.redirect('/login')
        })
    }else{
        //DataBase
        var mongodb = require('mongodb');
        var server = new mongodb.Server('localhost', 27017);
        var db = mongodb.Db('staffManagement', server, {safe: true});

        db.open(function (err, db) {
            if (err){
                throw err
            }else{
                var col_exam = db.collection('exam');

                if (req.body.exam_start){
                    var new_col = {};
                    new_col['user_id'] = req.session.user._id;
                    new_col['frequency_1'] = {date: ''};
                    new_col['frequency_2'] = {date: ''};
                    new_col['frequency_3'] = {date: ''};

                    col_exam.insert(new_col, function (err) {
                        if (err){
                            throw err
                        }else {
                            if (day<20){
                                col_exam.update(
                                    {user_id: req.session.user._id},
                                    {$set:
                                        {
                                            "frequency_1.date": datestr_1,
                                            "frequency_2.date": datestr_2,
                                            "frequency_3.date": datestr_3
                                        }
                                    }, function () {
                                        res.redirect('/work_exam')
                                    }
                                )
                            }else {
                                col_exam.update(
                                    {user_id: req.session.user._id},
                                    {$set:
                                    {
                                        "frequency_1.date": datestr_2,
                                        "frequency_2.date": datestr_3,
                                        "frequency_3.date": datestr_4
                                    }
                                    }, function () {
                                        res.redirect('/work_exam')
                                    }
                                )
                            }
                        }
                    })
                }else {
                    var exam = req.body;
                    if (exam.fre_1){
                        exam['date'] = col_exam.find({user_id: req.session.user._id}).frequency_1.date;
                        col_exam.update(
                            {user_id: req.session.user._id},
                            {$set: {frequency_1: exam}},
                            {upsert: true},
                            function (err, result) {
                                if (err){
                                    throw err
                                }else {
                                    res.redirect('/work_exam')
                                }
                        })
                    }else if (exam.fre_2) {
                        exam['date'] = col_exam.find({user_id: req.session.user._id}).frequency_2.date;
                        col_exam.update(
                            {user_id: req.session.user._id},
                            {$set: {frequency_2: exam}},
                            {upsert: true},
                            function (err, result) {
                                if (err) {
                                    throw err
                                } else {
                                    res.redirect('/work_exam')
                                }
                        })
                    }else {
                        exam['date'] = col_exam.find({user_id: req.session.user._id}).frequency_3.date;
                        col_exam.update(
                            {user_id: req.session.user._id},
                            {$set: {frequency_3: exam}},
                            {upsert: true},
                            function (err, result) {
                                if (err){
                                    throw err
                                }else {
                                    res.redirect('/work_exam')
                                }
                        })
                    }
                }
            }
        })
    }
});

module.exports = router;