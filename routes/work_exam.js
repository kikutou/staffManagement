/**
 * Created by mamol on 16/06/15.
 */
var express = require('express');
var router = express.Router();

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
        var mongodb = require('mongodb');
        var server = new mongodb.Server('localhost', 27017);
        var db = mongodb.Db('staffexam', server, {safe: true});

        db.open(function (err, db) {
            if (err){
                throw err
            }else{
                var exam = req.body;
                var col_exam = db.collection('exam');
                var col_users = db.collection('users');

                col_exam.insert(exam, function (err, result) {
                    if (err){
                        throw err;
                    }else{
                        if (req.session.user.staff_occupation=='管理者'){
                            console.log('管理者login')
                        }else{
                            console.log('普通社員login')
                        }


                        col_exam.update(
                            {_id: exam._id},
                            {$set: {user_id: req.session.user._id, user_name: req.session.user.staff_name}},
                            {
                                upsert: true,
                                multi: true
                            }
                        );
                        //查看结果
                        col_exam.find({_id: exam._id}).toArray(function (err, doc) {
                            console.log(doc);
                            res.redirect('/work_exam')
                        })
                    }
                })
            }
        })
    }
});

module.exports = router;