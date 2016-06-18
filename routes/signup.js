var express = require('express');
var router = express.Router();
/* GET users listing. */
router.get('/', function(req, res) {

    console.log('hello');

    res.render('signup');
});

router.post('/',function (req,res) {

    delete req.body.staff_password_confirm;

    var mongodb = require('mongodb');
    var server = new mongodb.Server('localhost',27017);
    var db = new mongodb.Db('staffexam', server, {safe:true});

    db.open(function (err,db) {

        if(err){
            throw (err);
        }else{

            var user = req.body;

            var col_users = db.collection('users');

            col_users.find({staff_email: user.staff_email}).toArray(function (err,docs) {

                    if(docs.length!=0){
                        console.log('this user is registered already!');
                        res.redirect('signup');
                    }else{
                        collection.insert(user, function(err, result){

                            if(err){
                                console.log('err in insert');
                            }else{
                                console.log('Sign Up Success');
                                res.render('login')
                            }

                        });
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
