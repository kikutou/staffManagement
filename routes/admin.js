/**
 * Created by mamol on 16/06/27.
 */
require('date-utils');
var async = require('async');
var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;

var now = new Date();
var year = now.getFullYear();
var month = now.getMonth();
var day = now.getDate();
//get datestr by format(yy-mm-dd)
var datestr = now.toISOString().substring(0, 10);
//get week
var week = now.getDay();
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

router.get('/study_checking', function (req, res) {
    res.redirect('/admin')
});

router.get('/exam_checking', function (req, res) {
    res.redirect('/admin')
});

router.get('/ojt_checking', function (req, res) {
    res.redirect('/admin')
});

router.get('/opinion_view', function (req, res) {
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
    }else if (req.body.admin || req.body.back){
        res.redirect('/admin')
    }else {
        db.open(function (err, db) {
            if (err){
                throw err
            }else {

                var info = {};
                var id = req.body.staff_id;
                var name = req.body.staff_name;
                var col_attendance = db.collection('attendance');
                var col_user = db.collection('users');

                info['user_id'] = id;
                info['user_name'] = name;
                info['att_data'] = [];

                var a = [0,1,2,3,4,5,6,7,8,9];

                if (req.body.entrance_time_set){
                    col_user.update(
                        {"_id" : ObjectId(req.body.staff_id)},
                        {$set: {"entrance_time": req.body.entrance_time_set}},
                        {upsert: false},
                        function (err, result) {
                            if (err){
                                throw err
                            }else {
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
                                                    // console.log(item);
                                                    info['att_data'][i] = item;

                                                    var col_user = db.collection('users');

                                                    col_user.findOne({"_id" : ObjectId(id)}, function (err, doc) {
                                                        if (err){
                                                            throw err
                                                        }else {
                                                            //Time compare
                                                            var setted_entrance_time = doc.entrance_time;
                                                            var setted_leave_time = doc.leave_time;
                                                            if (item != null){
                                                                info['att_data'][i]['late'] = ((setted_entrance_time < item.entrance_time) || !item.entrance_time);
                                                                info['att_data'][i]['early'] = ((setted_leave_time > item.leave_time) || !item.leave_time);
                                                            }else {
                                                                info['att_data'][i]['late'] = true;
                                                                info['att_data'][i]['early'] = true;
                                                            }
                                                        }
                                                    });

                                                    if (info['att_data'][i] == null){
                                                        info['att_data'][i] = {date_id: i};
                                                    }else {
                                                        info['att_data'][i].date_id = i
                                                    }
                                                    callback();
                                                }
                                            }
                                        )
                                    }, function (err, result) {
                                        if (err){
                                            throw err
                                        }else {
                                            col_user.findOne({"_id" : ObjectId(req.body.staff_id)},
                                                function (err, doc) {
                                                    if (err){
                                                        throw err
                                                    }else {
                                                        console.log(doc);
                                                        info['entrance_time_set'] = doc.entrance_time;
                                                        info['leave_time_set'] = doc.leave_time;

                                                        console.log(info);

                                                        res.render('adminpage/att_checking', {info: info});
                                                    }
                                                }
                                            )
                                        }
                                    }
                                )
                            }
                        }
                    )
                }else if (req.body.leave_time_set){
                    col_user.update(
                        {"_id" : ObjectId(req.body.staff_id)},
                        {$set: {"leave_time": req.body.leave_time_set}},
                        {upsert: false},
                        function (err, result) {
                            if (err){
                                throw err
                            }else {
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
                                                    // console.log(item);
                                                    info['att_data'][i] = item;

                                                    var col_user = db.collection('users');

                                                    col_user.findOne({"_id" : ObjectId(id)}, function (err, doc) {
                                                        if (err){
                                                            throw err
                                                        }else {
                                                            //Time compare
                                                            var setted_entrance_time = doc.entrance_time;
                                                            var setted_leave_time = doc.leave_time;
                                                            if (item != null){
                                                                info['att_data'][i]['late'] = ((setted_entrance_time < item.entrance_time) || !item.entrance_time);
                                                                info['att_data'][i]['early'] = ((setted_leave_time > item.leave_time) || !item.leave_time);
                                                            }else {
                                                                info['att_data'][i]['late'] = true;
                                                                info['att_data'][i]['early'] = true;
                                                            }
                                                        }
                                                    });

                                                    if (info['att_data'][i] == null){
                                                        info['att_data'][i] = {date_id: i};
                                                    }else {
                                                        info['att_data'][i].date_id = i
                                                    }
                                                    callback();
                                                }
                                            }
                                        );
                                    }, function (err, result) {
                                        if (err){
                                            throw err
                                        }else {
                                            col_user.findOne({"_id" : ObjectId(req.body.staff_id)},
                                                function (err, doc) {
                                                    if (err){
                                                        throw err
                                                    }else {
                                                        info['entrance_time_set'] = doc.entrance_time;
                                                        info['leave_time_set'] = doc.leave_time;

                                                        console.log(info);

                                                        res.render('adminpage/att_checking', {info: info});
                                                    }
                                                }
                                            )
                                        }
                                    }
                                )
                            }
                        }
                    )
                }else {
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
                                        // console.log(item);
                                        info['att_data'][i] = item;

                                        var col_user = db.collection('users');

                                        col_user.findOne({"_id" : ObjectId(id)}, function (err, doc) {
                                            if (err){
                                                throw err
                                            }else {
                                                //Time compare
                                                var setted_entrance_time = doc.entrance_time;
                                                var setted_leave_time = doc.leave_time;
                                                if (item != null){
                                                    info['att_data'][i]['late'] = ((setted_entrance_time < item.entrance_time) || !item.entrance_time);
                                                    info['att_data'][i]['early'] = ((setted_leave_time > item.leave_time) || !item.leave_time);
                                                }else {
                                                    info['att_data'][i]['late'] = true;
                                                    info['att_data'][i]['early'] = true;
                                                }
                                            }
                                        });

                                        if (info['att_data'][i] == null){
                                            info['att_data'][i] = {date_id: i};
                                        }else {
                                            info['att_data'][i].date_id = i
                                        }
                                        callback();
                                    }
                                }
                            )
                        },function (err, result) {
                            if (err){
                                throw err
                            }else {
                                col_user.findOne({"_id" : ObjectId(req.body.staff_id)},
                                    function (err, doc) {
                                        if (err){
                                            throw err
                                        }else {
                                            info['entrance_time_set'] = doc.entrance_time;
                                            info['leave_time_set'] = doc.leave_time;

                                            console.log(info);

                                            res.render('adminpage/att_checking', {info: info});
                                        }
                                    }
                                )
                            }
                        }
                    )
                }
            }
        })
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
                    {"_id" : ObjectId(id_str)},
                    {$set: req.body},
                    {
                        upsert: false
                    },function (err, result) {
                        if (err){
                            throw err
                        }else {
                            col_user.find({"_id" : ObjectId(id_str)}).toArray(function (err, item) {
                                if (err){
                                    throw err
                                }else {
                                    console.log(item);
                                    res.render('adminpage/set', {info: item[0]});
                                }
                            });
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
                col_user.find({"_id" : ObjectId(req.body.staff_id)}).toArray(function (err, item) {
                    if (err){
                        throw err
                    }else {
                        res.render('adminpage/set', {info: item[0]});
                    }
                })
            }
        })
    }
});

//学習内容
router.post('/study_checking', function (req, res) {
    console.log('post to exam_checking');
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
    }else if (req.body.admin_study){
        db.open(function (err, db) {
            if (err){
                throw err
            }else {
                var col_ojt = db.collection('study');

                var info = {};
                info['user_id'] = req.body.staff_id;
                info['user_name'] = req.body.staff_name;
                var a = [0, 1, 2, 3, 4];

                async.eachSeries(
                    a,
                    function (i, callback) {
                        var date_key = today + ".date";

                        var the_day = new Date();
                        the_day.setDate(now.getDate() - (7 * i));
                        datestr = the_day.toISOString().substring(0, 10);

                        var find_obj = {};
                        find_obj['user_id'] = req.body.staff_id;
                        find_obj[date_key] = datestr;
                        console.log(find_obj);

                        col_ojt.findOne(find_obj, function (err, item) {
                            if (err){
                                throw err
                            }else {
                                info['week'+i] = item;
                                callback();
                            }
                        })
                    },
                    function (error, results) {
                        if (error){
                            throw error
                        }else {
                            console.log(info);

                            res.render('adminpage/study_checking', {info: info})
                        }
                    }
                )
            }
        })
    }else {
        var j;
        if (req.body.ojt_admin_modify0){
            j = 0;
        }else if (req.body.ojt_admin_modify1){
            j = 1;
        }else if (req.body.ojt_admin_modify2){
            j = 2;
        }else if (req.body.ojt_admin_modify3){
            j = 3;
        }else if (req.body.ojt_admin_modify4){
            j = 4;
        }else {
            console.log('DATA NOT FOUND')
        }

        db.open(function (err, db) {
            if (err){
                throw err
            }else {
                var col_ojt = db.collection('study');

                var info = {};
                info['user_id'] = req.body.user_id;
                info['user_name'] = req.body.user_name;

                var date_key = today + ".date";

                var the_day = new Date();
                the_day.setDate(now.getDate() - (7 * j));
                datestr = the_day.toISOString().substring(0, 10);

                var update_obj = {};
                update_obj['user_id'] = req.body.user_id;
                update_obj[date_key] = datestr;


                var update_data = [];

                var a = [0, 1, 2, 3, 4, 5, 6];
                async.eachSeries(
                    a,
                    function (k, callback) {
                        var l = k + 1;
                        update_data[k] = {
                            'date': req.body['hidden_ojt_day'+ j + l],
                            'content': req.body['content'+ j + l],
                            'self_report': req.body['self_report'+ j + l],
                            'teacher_report': req.body['teacher_report'+ j + l]
                        };
                        callback()
                    },
                    function (error, result) {
                        if (error){
                            throw error
                        }else {
                            col_ojt.update(
                                update_obj,
                                {$set: {
                                    'Mon': update_data[0],
                                    'Tus': update_data[1],
                                    'Wed': update_data[2],
                                    'Thu': update_data[3],
                                    'Fri': update_data[4],
                                    'Sat': update_data[5],
                                    'Sun': update_data[6]
                                }},
                                {
                                    upsert: true,
                                    multi: true
                                },
                                function (err, result) {
                                    if (err){
                                        throw err
                                    }else {
                                        var a = [0, 1, 2, 3, 4];

                                        async.eachSeries(
                                            a,
                                            function (i, callback) {
                                                var date_key = today + ".date";

                                                var the_day = new Date();
                                                the_day.setDate(now.getDate() - (7 * i));
                                                datestr = the_day.toISOString().substring(0, 10);

                                                var find_obj = {};
                                                find_obj['user_id'] = req.body.user_id;
                                                find_obj[date_key] = datestr;
                                                col_ojt.findOne(find_obj, function (err, item) {
                                                    if (err){
                                                        throw err
                                                    }else {
                                                        info['week'+i] = item;
                                                        callback();
                                                    }
                                                })
                                            },
                                            function (error, results) {
                                                if (error){
                                                    throw error
                                                }else {
                                                    console.log(info);

                                                    res.render('adminpage/study_checking', {info: info})
                                                }
                                            }
                                        )
                                    }
                                }
                            )
                        }
                    }
                );
            }
        })
    }
});

//社員行動基準評定
router.post('/exam_checking', function (req, res) {
    console.log('post to exam_checking');
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
    }else {
        db.open(function (err, db) {
            if (err){
                throw err
            }else {
                //評定が始めるとき、ユーザの評定クラクションを作ります
                if (req.body.exam_start){
                    var new_col = {};
                    new_col['user_id'] = req.body.staff_id;
                    new_col['user_name'] = req.body.staff_name;
                    new_col['frequency_1'] = {date: '', info: false};
                    new_col['frequency_2'] = {date: '', info: false};
                    new_col['frequency_3'] = {date: '', info: false};

                    var col_exam = db.collection('exam');

                    col_exam.insert(new_col, function (err) {
                        if (err){
                            throw err
                        }else {
                            //評定は月を単位になります
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
                            //もし評定が始める日は当月の２０日以後なら、評定は来月に始めるになります
                            if (day<20){
                                col_exam.update(
                                    {user_id: req.body.staff_id},
                                    {$set:
                                    {
                                        "frequency_1.date": datestr_1,
                                        "frequency_2.date": datestr_2,
                                        "frequency_3.date": datestr_3
                                    }
                                    }, function () {
                                        var info = {};
                                        info['staff_id'] = req.body.staff_id;
                                        info['staff_name'] = req.body.staff_name;

                                        col_exam.find({user_id: req.body.staff_id}).toArray(function (err, doc) {
                                            if (err){
                                                throw err
                                            }else {
                                                info['data'] = doc[0];
                                                console.log(info);
                                                res.render('adminpage/exam_checking', {info: info})
                                            }
                                        })
                                    }
                                )
                            }else {
                                col_exam.update(
                                    {user_id: req.body.staff_id},
                                    {$set:
                                    {
                                        "frequency_1.date": datestr_2,
                                        "frequency_2.date": datestr_3,
                                        "frequency_3.date": datestr_4
                                    }
                                    }, function () {
                                        var info = {};
                                        info['staff_id'] = req.body.staff_id;
                                        info['staff_name'] = req.body.staff_name;

                                        col_exam.find({user_id: req.body.staff_id}).toArray(function (err, doc) {
                                            if (err){
                                                throw err
                                            }else {
                                                info['data'] = doc[0];
                                                console.log(info);
                                                res.render('adminpage/exam_checking', {info: info})
                                            }
                                        })
                                    }
                                )
                            }
                        }
                    })
                }else {
                    var col_exam = db.collection('exam');
                    var exam_data = req.body;

                    var info = {};
                    info['staff_id'] = req.body.staff_id;
                    info['staff_name'] = req.body.staff_name;

                    if (req.body.fre_1){

                        col_exam.findOne({user_id: exam_data.staff_id}, function (err, doc) {
                            if (err){
                                throw err
                            }else {
                                exam_data['date'] = doc.frequency_1.date;
                                exam_data['info'] = doc.frequency_1.info;

                                col_exam.update(
                                    {"user_id": req.body.staff_id},
                                    {$set: {frequency_1: exam_data}},
                                    {upsert: true},
                                    function (err, result) {
                                        if (err){
                                            throw err
                                        }else {
                                            col_exam.find({"user_id": req.body.staff_id}).toArray(function (err, item) {
                                                if (err){
                                                    throw err
                                                }else {
                                                    info['data'] = item[0];
                                                    console.log(info);
                                                    res.render('adminpage/exam_checking', {info: info})
                                                }
                                            })
                                        }
                                    }
                                )
                            }
                        })
                    }else if (req.body.fre_2){

                        col_exam.findOne({user_id: exam_data.staff_id}, function (err, doc) {
                            if (err){
                                throw err
                            }else {
                                exam_data['date'] = doc.frequency_2.date;
                                exam_data['info'] = doc.frequency_2.info;

                                col_exam.update(
                                    {"user_id": req.body.staff_id},
                                    {$set: {frequency_2: exam_data}},
                                    {upsert: true},
                                    function (err, result) {
                                        if (err){
                                            throw err
                                        }else {
                                            col_exam.find({"user_id": req.body.staff_id}).toArray(function (err, item) {
                                                if (err){
                                                    throw err
                                                }else {
                                                    info['data'] = item[0];
                                                    console.log(info);
                                                    res.render('adminpage/exam_checking', {info: info})
                                                }
                                            })
                                        }
                                    }
                                )
                            }
                        })
                    }else if (req.body.fre_3){

                        col_exam.findOne({user_id: exam_data.staff_id}, function (err, doc) {
                            if (err){
                                throw err
                            }else {
                                exam_data['date'] = doc.frequency_3.date;
                                exam_data['info'] = doc.frequency_3.info;

                                col_exam.update(
                                    {"user_id": req.body.staff_id},
                                    {$set: {frequency_3: exam_data}},
                                    {upsert: true},
                                    function (err, result) {
                                        if (err){
                                            throw err
                                        }else {
                                            col_exam.find({"user_id": req.body.staff_id}).toArray(function (err, item) {
                                                if (err){
                                                    throw err
                                                }else {
                                                    info['data'] = item[0];
                                                    console.log(info);
                                                    res.render('adminpage/exam_checking', {info: info})
                                                }
                                            })
                                        }
                                    }
                                )
                            }
                        })
                    }else {
                        col_exam.find({"user_id": req.body.staff_id}).toArray(function (err, item) {
                            if (err){
                                throw err
                            }else {
                                info['data'] = item[0];
                                console.log(info);
                                res.render('adminpage/exam_checking', {info: info})
                            }
                        })
                    }
                }
            }
        })
    }
});

//社員OJTカード研修力
router.post('/ojt_checking', function (req, res) {
    console.log('post to exam_checking');
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
    }else if (req.body.admin_ojtcard){
        db.open(function (err, db) {
            if (err){
                throw err
            }else {
                var col_ojt = db.collection('ojtcard');

                var info = {};
                info['user_id'] = req.body.staff_id;
                info['user_name'] = req.body.staff_name;
                var a = [0, 1, 2, 3, 4];

                async.eachSeries(
                    a,
                    function (i, callback) {
                        var date_key = today + ".date";

                        var the_day = new Date();
                        the_day.setDate(now.getDate() - (7 * i));
                        datestr = the_day.toISOString().substring(0, 10);

                        var find_obj = {};
                        find_obj['user_id'] = req.body.staff_id;
                        find_obj[date_key] = datestr;
                        console.log(find_obj);

                        col_ojt.findOne(find_obj, function (err, item) {
                            if (err){
                                throw err
                            }else {
                                info['week'+i] = item;
                                callback();
                            }
                        })
                    },
                    function (error, results) {
                        if (error){
                            throw error
                        }else {
                            console.log(info);

                            res.render('adminpage/ojt_checking', {info: info})
                        }
                    }
                )
            }
        })
    }else {
        if (req.body.ojt_admin_modify0){
            var j = 0;
        }else if (req.body.ojt_admin_modify1){
            var j = 1;
        }else if (req.body.ojt_admin_modify2){
            var j = 2;
        }else if (req.body.ojt_admin_modify3){
            var j = 3;
        }else if (req.body.ojt_admin_modify4){
            var j = 4;
        }else {
            console.log('DATA NOT FOUND')
        }

        db.open(function (err, db) {
            if (err){
                throw err
            }else {
                var col_ojt = db.collection('ojtcard');

                var info = {};
                info['user_id'] = req.body.user_id;
                info['user_name'] = req.body.user_name;

                var date_key = today + ".date";

                var the_day = new Date();
                the_day.setDate(now.getDate() - (7 * j));
                datestr = the_day.toISOString().substring(0, 10);

                var update_obj = {};
                update_obj['user_id'] = req.body.user_id;
                update_obj[date_key] = datestr;


                var update_data = [];

                var a = [0, 1, 2, 3, 4, 5, 6];
                async.eachSeries(
                    a,
                    function (k, callback) {
                        var l = k + 1;
                        update_data[k] = {
                            'date': req.body['hidden_ojt_day'+ j + l],
                            'content': req.body['content'+ j + l],
                            'self_report': req.body['self_report'+ j + l],
                            'percent': req.body['percent'+ j + l]
                        };
                        callback()
                    },
                    function (error, result) {
                        if (error){
                            throw error
                        }else {
                            col_ojt.update(
                                update_obj,
                                {$set: {
                                    'Mon': update_data[0],
                                    'Tus': update_data[1],
                                    'Wed': update_data[2],
                                    'Thu': update_data[3],
                                    'Fri': update_data[4],
                                    'Sat': update_data[5],
                                    'Sun': update_data[6],
                                    'teacher': req.body['teacher'+ j]
                                }},
                                {
                                    upsert: true,
                                    multi: true
                                },
                                function (err, result) {
                                    if (err){
                                        throw err
                                    }else {
                                        var a = [0, 1, 2, 3, 4];

                                        async.eachSeries(
                                            a,
                                            function (i, callback) {
                                                var date_key = today + ".date";

                                                var the_day = new Date();
                                                the_day.setDate(now.getDate() - (7 * i));
                                                datestr = the_day.toISOString().substring(0, 10);

                                                var find_obj = {};
                                                find_obj['user_id'] = req.body.user_id;
                                                find_obj[date_key] = datestr;
                                                col_ojt.findOne(find_obj, function (err, item) {
                                                    if (err){
                                                        throw err
                                                    }else {
                                                        info['week'+i] = item;
                                                        callback();
                                                    }
                                                })
                                            },
                                            function (error, results) {
                                                if (error){
                                                    throw error
                                                }else {
                                                    console.log(info);

                                                    res.render('adminpage/ojt_checking', {info: info})
                                                }
                                            }
                                        )
                                    }
                                }
                            )
                        }
                    }
                );
            }
        })
    }
});

//社員意見
router.post('/opinion_view', function (req, res) {
    console.log('post to staff_opinion');
    if (req.session.user.staff_occupation != '社長'){
        res.redirect('/admin');
    }else {
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
        }else {
            db.open(function (err, db) {
                if (err){
                    throw err
                }else {
                    var col_opinion = db.collection('opinion');

                    if(req.body.view_all){
                        col_opinion.find().toArray(function (err, doc) {
                            if (err){
                                throw err
                            }else {
                                res.render('adminpage/opinion_view', {info: doc})
                            }
                        })
                    }else if (req.body.view_demand){
                        col_opinion.find({type: '要望'}).toArray(function (err, doc) {
                            if (err){
                                throw err
                            }else {
                                res.render('adminpage/opinion_view', {info: doc})
                            }
                        })
                    }else if (req.body.view_take_on){
                        col_opinion.find({type: '進みたい方向'}).toArray(function (err, doc) {
                            if (err){
                                throw err
                            }else {
                                res.render('adminpage/opinion_view', {info: doc})
                            }
                        })
                    }else if (req.body.view_opinion){
                        col_opinion.find({type: '感想と意見'}).toArray(function (err, doc) {
                            if (err){
                                throw err
                            }else {
                                res.render('adminpage/opinion_view', {info: doc})
                            }
                        })
                    }else {
                        col_opinion.find({user_id: req.body.staff_id}).toArray(function (err, doc) {
                            if (err){
                                throw err
                            }else {
                                res.render('adminpage/opinion_view', {info: doc})
                            }
                        })
                    }
                }
            })
        }
    }
});

module.exports = router;