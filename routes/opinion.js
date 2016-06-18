/**
 * Created by mamol on 16/06/16.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.render('opinion');
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
                var opinion = req.body;
                var col_opinion = db.collection('opinion');
                var col_users = db.collection('users');

                col_opinion.insert(opinion, function (err, result) {
                    if (err){
                        throw err;
                    }else{
                        col_opinion.update(
                            {_id: opinion._id},
                            {$set: {user_id: req.session.user._id, user_name: req.session.user.staff_name}},
                            {
                                upsert: true,
                                multi: true
                            }
                        );
                        //查看结果
                        col_opinion.find({_id: opinion._id}).toArray(function (err, doc) {
                            console.log(doc);
                            res.redirect('/opinion')
                        })
                    }
                })
            }
        })
    }
});

module.exports = router;