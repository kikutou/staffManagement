/**
 * Created by mamol on 16/06/14.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    if (req.session.user){
        res.render('study');
    }else{
        res.redirect('login');
    }
});

router.post('/', function (req, res) {
    if (req.body.logout){
        req.session.destroy(function () {
            console.log('user logout');
            res.redirect('login')
        })
    }else{
        var mongodb = require('mongodb');
        var server = new mongodb.Server('localhost', 27017);
        var db = mongodb.Db('staffexam', server, {safe: true});

        db.open(function (err, db) {
            if (err){
                throw err
            }else{
                var study = req.body;
                var col_study = db.collection('study');
                var col_users = db.collection('users');

                col_study.insert(study, function (err, result) {
                    if (err){
                        throw err;
                    }else{
                        col_study.update(
                            {study_date1: study.study_date1},
                            {$set: {user_id: req.session.user._id, user_name: req.session.user.staff_name}},
                            {
                                upsert: true,
                                multi: true
                            }
                        );
                        //查看结果
                        col_study.find({study_date1: study.study_date1}).toArray(function (err, doc) {
                            console.log(doc);
                            res.redirect('/study')
                        })
                    }
                })
            }
        })
    }
});

module.exports = router;