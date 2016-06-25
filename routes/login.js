/**
 * Created by mamol on 16/06/14.
 *
 * modified by kiku on 16/06/25
 */
var express = require('express');
var router = express.Router();

/**
 * login画面を表示する
 */
router.get('/', function(req, res) {

    //すでに、ログインされたユーザーを直接出退勤画面に移動する。
    if(req.session.user){
        res.redirect('/attendance');
        return;
    }

    res.render('login');
});

/**
 * loginデータをチェックする。
 */
router.post('/',function (req,res) {

    //DB設定
    var mongodb = require('mongodb');
    var server = new mongodb.Server('localhost',27017);
    var db = new mongodb.Db('staffManagement',server, {safe:true});

    db.open(function (err,db) {

        if(err){
            console.log(err);
            throw err;
        }else{

            var user = req.body;

            var col_users = db.collection('users');

            col_users.findOne(
                {staff_email: user.username, staff_password: user.password},
                function (err, item) {
                    if(err){
                        console.log(err);
                        throw err;
                    }

                    if(item){
                        console.log('Login success');
                        req.session.user = item;
                        res.redirect('/attendance');
                    }else{
                        console.log('Wrong username or password!');
                        res.redirect('/login');
                    }
                }
            )
        }
    });
});

module.exports = router;