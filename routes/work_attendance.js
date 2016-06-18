/**
 * Created by mamol on 16/06/14.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {

    if(req.session.user){
        res.render('work_attendance');
    }else{
        res.redirect('login');
    }

});

router.post('/',function (req, res) {

    if (req.body.logout){
        req.session.destroy(function () {
            console.log('user logout');
            res.redirect('/login')
        })
    }else {
        var mongodb = require('mongodb');
        var server = new mongodb.Server('localhost', 27017);
        var db = mongodb.Db('staffexam', server, {safe: true});

        db.open(function (err,db) {
            if (err){
                throw err
            }else {
                var attendance = req.body;

                attendance['user_id'] = req.session.user._id;

                var now = new Date();
                var y = now.getFullYear();
                var m = now.getMonth() + 1;
                var d = now.getDate();
                if (m < 10) {
                    m = '0' + m;
                }
                if (d < 10) {
                    d = '0' + d;
                }
                attendance['date'] = y + '-' + m + '-' + d;

                var col_attendance = db.collection('attendance');

                var col_users = db.collection('users');

                col_attendance.update(
                    {user_id: attendance['user_id'], date: attendance['date']},
                    {$set: attendance},
                    {
                        upsert: true,
                        multi: true
                    },
                    function(err, result){
                        if (err){
                            throw err;
                        }else {
                            col_attendance.find().toArray(
                                function(err, doc){
                                    console.log(doc);
                                    res.redirect('/work_attendance');
                                }
                            );
                        }
                    }
                );
            }
        })
    }
});

module.exports = router;