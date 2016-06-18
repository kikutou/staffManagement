/**
 * Created by mamol on 16/06/14.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    if (req.session.user){
        res.render('attendance/attendance')
    }else {
        res.redirect('login')
    }
});

router.post('/', function (req, res) {
    //現在時刻
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
    // attendance['date'] = y + '-' + m + '-' + d;

    if (req.body.logout){
        req.session.destroy(function () {
            console.log('user logout');
            res.redirect('/login')
        })
    }else {
        var mongodb = require('mongodb');
        var server = new mongodb.Server('localhost', 27017);
        var db = mongodb.Db('staffManagement', server, {safe: true});

        db.open(function (err, db) {
            if (err){
                throw err;
            }else {
                var attendance = req.body;
                attendance['user_id'] = req.session.user._id;
                attendance['date'] = y + '-' + m + '-' + d;

                var col_attendance = db.collection('attendance');
                col_attendance.insert(attendance, function (err, result) {
                    if (err){
                        throw err;
                    }else{
                        if (attendance.entrance_time){
                            //入室確認
                            $(function () {
                                //$('#entrance_time').attr('disabled', 'true');
                            })
                        }
                    }
                });

            }
        })
    }
});



module.exports = router;