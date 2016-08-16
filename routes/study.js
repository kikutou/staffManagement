/**
 * Created by mamol on 16/06/14.
 */
var async = require('async');
var express = require('express');
var router = express.Router();

//現在時刻
var now = new Date();
var week = now.getDay();
var timestamp = now.getTime();
var timestamp_add = 1000 * 60 * 60 * 24;
var datestr0 = now.toISOString().substring(0, 10);

//先週時刻
var the_day = new Date();
the_day.setDate(now.getDate() - 7);
var datestr1 = the_day.toISOString().substring(0, 10);

switch (week)
{
    case 1:
        var today = 'Mon';
        break;
    case 2:
        var today = 'Tus';
        break;
    case 3:
        var today = 'Wed';
        break;
    case 4:
        var today = 'Thu';
        break;
    case 5:
        var today = 'Fri';
        break;
    case 6:
        var today = 'Sat';
        break;
    case 0:
        var today = 'Sun'
}

/* GET users listing. */
router.get('/', function(req, res) {
    //DataBase
    var mongodb = require('mongodb');
    var server = new mongodb.Server('localhost', 27017);
    var db = mongodb.Db('staffManagement', server, {safe: true});

    if (req.session.user){
        var info = {};
        db.open(function (err, db) {
            if (err){
                throw err;
            }else{
                var col_ojt = db.collection('study');

                var date_key = today + ".date";
                var find_obj0 = {};
                find_obj0['user_id'] = req.session.user._id;
                find_obj0[date_key] = datestr0;
                col_ojt.find(find_obj0).toArray(function (err, doc) {
                    console.log(doc);
                    if (err){
                        throw err;
                    }else {
                        var nowday = [];
                        //もし今週のクラクションがありなかったら、作ります
                        if (doc.length==0){
                            for (var i=1; i<8; i++) {
                                if (week == 0){
                                    week = 7;
                                }
                                var nowdate = new Date(timestamp - ((week - i) * timestamp_add));
                                nowday[i] = nowdate.toISOString().substring(0, 10);
                            }

                            var insert_obj = {};
                            insert_obj['user_id'] = req.session.user._id;
                            //一週のデータは日を単位に、Json七つのなかで保存する
                            var week_day = ['Mon', 'Tus', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

                            week_day.forEach(function (week_name) {
                                insert_obj[week_name] = {'date': ''}
                            });

                            insert_obj['Mon']['date'] = nowday[1];
                            insert_obj['Tus']['date'] = nowday[2];
                            insert_obj['Wed']['date'] = nowday[3];
                            insert_obj['Thu']['date'] = nowday[4];
                            insert_obj['Fri']['date'] = nowday[5];
                            insert_obj['Sat']['date'] = nowday[6];
                            insert_obj['Sun']['date'] = nowday[7];

                            col_ojt.insert(insert_obj,
                                function (err, result) {
                                    if (err){
                                        throw err;
                                    }else {
                                        var a = [0, 1];

                                        var find_obj1 = {};
                                        find_obj1['user_id'] = req.session.user._id;
                                        find_obj1[date_key] = datestr1;

                                        async.eachSeries(
                                            a,
                                            function (i, callback) {
                                                var find_obj = [find_obj0, find_obj1];
                                                col_ojt.findOne(find_obj[i], function (err, item) {
                                                    if (err) {
                                                        throw err;
                                                    } else {
                                                        info['week'+i] = item;
                                                        callback();
                                                    }
                                                });
                                            },
                                            function (error, results) {
                                                if (error){
                                                    throw err;
                                                }

                                                console.log(info);

                                                res.render('study', info);
                                            }
                                        );
                                    }
                                }
                            );
                        }else {
                            var a = [0, 1];

                            var find_obj1 = {};
                            find_obj1['user_id'] = req.session.user._id;
                            find_obj1[date_key] = datestr1;

                            async.eachSeries(
                                a,
                                function (i, callback) {
                                    var find_obj = [find_obj0, find_obj1];
                                    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>');
                                    console.log(find_obj0);
                                    col_ojt.findOne(find_obj[i], function (err, item) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            info['week'+i] = item;
                                            callback();
                                        }
                                    });
                                },
                                function (error, results) {
                                    if (error){
                                        throw err;
                                    }

                                    console.log(info);

                                    res.render('study', info);
                                }
                            );
                        }
                    }
                });
            }
        })
    }else {
        res.redirect('/login');
    }
});


router.post('/', function (req, res) {
    //DataBase
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
                throw err;
            }else {
                var col_ojt = db.collection('study');
                var ojt_data = req.body;

                var day_content = {};
                for (i=1; i<8; i++){
                    day_content[i] = {
                        'date': ojt_data['ojt_day'+i],
                        'content': ojt_data['content'+i],
                        'self_report': ojt_data['self_report'+i],
                        'teacher_report': ojt_data['teacher_report'+i]
                    }
                }

                var date_key = today + ".date";
                var find_obj0 = {};
                find_obj0['user_id'] = req.session.user._id;
                find_obj0[date_key] = datestr0;

                col_ojt.update(
                    find_obj0,
                    {$set: {
                        'Mon': day_content[1],
                        'Tus': day_content[2],
                        'Wed': day_content[3],
                        'Thu': day_content[4],
                        'Fri': day_content[5],
                        'Sat': day_content[6],
                        'Sun': day_content[7]
                    }},
                    {
                        upsert: true,
                        multi: true
                    }
                );

                res.redirect('/study');
            }
        })
    }
});

module.exports = router;