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

var datestr = now.toISOString().substring(0, 7);

/* GET users listing. */
router.get('/', function(req, res) {
    res.render('work_exam');
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
                    new_col['frequency_1'] = {};
                    new_col['frequency_2'] = {};
                    new_col['frequency_3'] = {};

                    col_exam.insert(new_col);
                    //     , function (err, doc) {
                    //     if (err){
                    //         throw err
                    //     }else {
                    //         //if (day<20){
                    //             console.log(doc);
                    //         //}
                    //     }
                    // })
                }
                
                // exam['user_id'] = req.session.user._id;
                // exam['date'] = datestr;
                // if (day>20){
                //     exam['frequency'] = 3
                // }else if (day>10 && day<21){
                //     exam['frequency'] = 2
                // }else {
                //     exam['frequency'] = 1
                // }
                //
                // col_exam.update(
                //     {user_id: exam['user_id'], date: exam['date'], frequency: exam['frequency']},
                //     {$set: exam},
                //     {
                //         upsert: true,
                //         multi: true
                //     }, function (err, result) {
                //         if (err){
                //             throw err
                //         }else {
                //             console.log(result);
                //             res.redirect('/work_exam')
                //         }
                //     }
                // );
            }
        })
    }
});

module.exports = router;