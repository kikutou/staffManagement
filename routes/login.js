/**
 * Created by mamol on 16/06/14.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.render('login');
});

router.post('/',function (req,res) {

    var mongodb = require('mongodb');

    var server = new mongodb.Server('localhost',27017);
    var db = new mongodb.Db('staffexam',server, {safe:true});

    db.open(function (err,db) {

        if(err){
            console.log(err);
        }else{

            var user = req.body;

            var col_users = db.collection('users');

            col_users.find({staff_email: user.username, staff_password: user.password}).toArray(function (err,docs) {

                    console.log(docs);

                    if(err){
                        throw err;
                    }else if(docs.length==0){
                        console.log('Wrong username or password!');
                        res.redirect('/login');
                    }else{
                        console.log('Login success');
                        req.session.user = docs[0];
                        res.redirect('/work_attendance');
                    }
                }
            );
        }
    });
});

module.exports = router;