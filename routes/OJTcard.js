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
    var db = mongodb.Db('staffManaement', server, {safe: true});

    if (req.session.user){
        db.open(function (err, db) {
            if (err){
                throw err;
            }else{
                res.render('OJTcard');
            }
        })
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
                var ojt = {};
                ojt['mon'] = ojt_data.
                ojt['user_id'] = req.session.user._id;
                ojt['date'] = datestr;
                ojt['timestamp'] = ds;
                
                
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