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
    var week = now.getDay();
    var datestr = now.toISOString().substring(0, 10);
    console.log(datestr);
    console.log('hello');

    if (req.session.user){
        var col_ojt = db.collection('ojtcard');
        db.open(function (err, db) {
            if (err){
                throw err;
            }else{
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
                }
                console.log(today);
                var today_key = today + ".date";
                var find_obj = {};
                find_obj['user_id'] = req.session.user._id;
                find_obj[today_key] = datestr;
                col_ojt.find(find_obj).toArray(function (err, doc) {
                    if (err){
                        throw err;
                    }else {
                        console.log(doc);
                        var nowday = [];
                        if (doc.length==0){
                            for (var i=1; i<8; i++) {
                                if (week == 0){
                                    week = 7;
                                }
                                var timestamp = now.getTime();
                                var timestamp_add = 1000 * 60 * 60 * 24;
                                var nowdate = new Date(timestamp - ((week - i) * timestamp_add));
                                nowday[i] = nowdate.toISOString().substring(0, 10);
                            }
                            col_ojt.insert(
                                {
                                    user_id :req.session.user._id,
                                    Mon: [nowday[1]],
                                    Tus: [nowday[2]],
                                    Wed: [nowday[3]],
                                    Thu: [nowday[4]],
                                    Fri: [nowday[5]],
                                    Sat: [nowday[6]],
                                    Sun: [nowday[7]]
                                });
                            console.log(nowday[1]);


                        }
                    }
                });

                res.render('OJTcard');
            }
        })
    }else{
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
    }else {
        db.open(function (err, db) {
            if (err){
                throw err;
            }else {
                var ojt_data = req.body;
                // var ojt = {};
                // ojt['mon'] = ojt_data.
                // ojt['user_id'] = req.session.user._id;
                // ojt['date'] = datestr;
                // ojt['timestamp'] = ds;
                
                
            }
        })
    }
});

// router.post('/', function (req, res) {
//     if (req.body.logout){
//         req.session.destroy(function () {
//             console.log('user logout');
//             res.redirect('login')
//         })
//     }else{
//         var mongodb = require('mongodb');
//         var server = new mongodb.Server('localhost', 27017);
//         var db = mongodb.Db('staffexam', server, {safe: true});
//
//         db.open(function (err, db) {
//             if (err){
//                 throw err
//             }else{
//                 var ojt = req.body;
//                 var col_ojt = db.collection('ojt');
//                 var col_users = db.collection('users');
//
//                 col_ojt.insert(ojt, function (err, result) {
//                     if (err){
//                         throw err;
//                     }else if(ojt.ojt_day1){
//                         col_ojt.update(
//                             {ojt_day1: ojt.ojt_day1},
//                             {$set: {user_id: req.session.user._id, user_name: req.session.user.staff_name}},
//                             {
//                                 upsert: true,
//                                 multi: true
//                             }
//                         );
//                         //查看结果
//                         col_ojt.find({ojt_day1: ojt.ojt_day1}).toArray(function (err, doc) {
//                             console.log(doc);
//                             res.redirect('/OJTcard')
//                         })
//                     }else if(ojt.t_evaluation){
//                         col_ojt.update(
//                             {t_evaluation: ojt.t_evaluation},
//                             {$set: {user_id: req.session.user._id, user_name: req.session.user.staff_name}},
//                             {
//                                 upsert: true,
//                                 multi: true
//                             }
//                         );
//                         //查看结果
//                         col_ojt.find({t_evaluation: ojt.t_evaluation}).toArray(function (err, doc) {
//                             console.log(doc);
//                             res.redirect('/OJTcard')
//                         })
//                     }else{
//                         res.send(result)
//                     }
//                 })
//             }
//         })
//     }
// });

module.exports = router;