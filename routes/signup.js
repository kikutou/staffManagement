/**
 * Created by mamol on 16/06/14.
 *
 * modified by kiku on 16/06/25
 */
var express = require('express');
var router = express.Router();

/**
 * 登録画面を表示する。
 */
router.get('/', function(req, res) {
    res.render('signup');
});

/**
 * 登録画面に登録したデータをDBに保存する。
 */
router.post('/',function (req,res) {

    if(req.body.staff_password_confirm != req.body.staff_password){
        throw {msg:'the password is not the same to the password_confirm'}
    }else{
        delete req.body.staff_password_confirm;
    }

    //DB設定
    var mongodb = require('mongodb');
    var server = new mongodb.Server('localhost',27017);
    var db = new mongodb.Db('staffManagement', server, {safe:true});

    db.open(function (err,db) {

        if(err){
            throw (err);
        }else{

            var user = req.body;

            var col_users = db.collection('users');

            col_users.findOne(
                {staff_email: user.staff_email},
                function (err,item) {

                    if(item){
                        console.log('this user is registered already!');
                        res.redirect('/signup');
                    }else{
                        col_users.insert(
                            user,
                            function(err, result){

                                if(err){
                                    console.log('err in insert');
                                }else{
                                    console.log('Sign Up Success');
                                    res.redirect('/login')
                                }
                            }
                        );
                    }
                }
            );
        }
    });
});

module.exports = router;
/**
 * Created by mamol on 16/06/11.
 */
