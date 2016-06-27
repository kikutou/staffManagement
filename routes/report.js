/**
 * Created by mamol on 16/06/16.
 */
var express = require('express');
var router = express.Router();
//現在時刻
var now = new Date();
var datestr = now.toISOString().substring(0, 10);

/* GET users listing. */
router.get('/', function(req, res) {
    if (req.session.user){
        res.render('report');
    }else {
        res.redirect('/login');
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
        var db = mongodb.Db('staffManagement', server, {safe: true});

        db.open(function (err, db) {
            if (err){
                throw err
            }else{
                var report = req.body;
                report['user_id'] = req.session.user._id;
                report['date'] = datestr;

                var col_report = db.collection('report');

                col_report.insert(report, function (err, result) {
                    if (err){
                        throw err;
                    }else{
                        //查看结果
                        console.log(result);
                        res.redirect('/report')
                    }
                })
            }
        })
    }
});

module.exports = router;