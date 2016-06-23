/**
 * Created by mamol on 16/06/14.
 */
require('date-utils');
var async = require('async');
var express = require('express');
var router = express.Router();

/**
 * 社員の出勤退勤ボタン、及び過去１週間の出退勤状況リストを表示する
 */
router.get('/', function(req, res) {

    //DBの設定
    var mongodb = require('mongodb');
    var server = new mongodb.Server('localhost', 27017);
    var db = mongodb.Db('staffManagement', server, {safe: true});

    /*
     modified by kiku 2016/06/23
     時間の設定方法を以下のサイトを参照してください。
     http://qiita.com/n0bisuke/items/dd28122d006c95c58f9c
     */
    var now = new Date();
    //日付を取得
    var datestr = now.toFormat("YYYY-MM-DD");

    //すでに登録したユーザーのみがアクセスできる。
    if (req.session.user){
        db.open(function (err, db) {

            if (err){
                throw err;
            }else {

                var info = [];

                var col_attendance = db.collection('attendance');

                var a = [0,1,2,3,4,5,6,7];

                async.eachSeries(
                    a,
                    function (i, callback) {
                        var the_day = new Date();
                        the_day.setDate(now.getDate() - i);

                        col_attendance.findOne(
                            {user_id: req.session.user._id, date: the_day.toFormat("YYYY-MM-DD")},
                            function (err, item) {
                                if (err){
                                    throw err;
                                }else {
                                    console.log(the_day.toFormat("YYYY-MM-DD"));
                                    console.log(item);
                                    info[i] = item;
                                    if (info[i] == null){
                                        info[i] = {date_id: i};
                                    }else {
                                        info[i].date_id = i
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

                        res.render('attendance/attendance', {info:info});
                    }
                );
            }
        })
    }else {
        res.redirect('/login')
    }
});

router.post('/', function (req, res) {

    //DataBase
    var mongodb = require('mongodb');
    var server = new mongodb.Server('localhost', 27017);
    var db = mongodb.Db('staffManagement', server, {safe: true});

    //現在時刻
    /*
     modified by kiku 2016/06/23
     時間の設定方法を以下のサイトを参照してください。
     http://qiita.com/n0bisuke/items/dd28122d006c95c58f9c
     */
    var now = new Date();
    //日付を取得
    var datestr = now.toFormat("YYYY-MM-DD");

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
                            console.log(result);
                            res.redirect('/attendance');
                        }
                    }
                )
            }
        })
    }
});

module.exports = router;