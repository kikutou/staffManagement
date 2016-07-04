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
        res.render('opinion');
    }else {
        res.redirect('/login');
    }
});

router.post('/', function (req, res) {
    if (req.body.logout){
        req.session.destroy(function () {
            console.log('user logout');
            res.redirect('/login')
        })
    }else if (req.body.admin){
        res.redirect('/admin')
    }else{
        var mongodb = require('mongodb');
        var server = new mongodb.Server('localhost', 27017);
        var db = mongodb.Db('staffManagement', server, {safe: true});

        db.open(function (err, db) {
            if (err){
                throw err
            }else{
                var opinion = req.body;
                opinion['user_id'] = req.session.user._id;
                opinion['user_name'] = req.session.user.staff_name;
                opinion['date'] = datestr;

                if (req.body.demand){
                    opinion['type'] = "要望"
                }else if (req.body.take_on){
                    opinion['type'] = "進みたい方向"
                }else if (req.body.opinion){
                    opinion['type'] = "感想と意見"
                }else {
                    opinion['type'] = ""
                }

                var col_opinion = db.collection('opinion');

                col_opinion.insert(opinion, function (err, result) {
                    if (err){
                        throw err;
                    }else{
                        //查看结果
                        console.log(result);
                        res.redirect('/opinion')
                    }
                })
            }
        })
    }
});

module.exports = router;