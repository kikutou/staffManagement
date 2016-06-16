/**
 * Created by mamol on 16/06/16.
 */
var express = require('express');
var fs = require('fs');
var router = express.Router();
/* GET users listing. */
router.get('/', function(req, res) {
    fs.readFile('./views/signup.html', 'utf8', function (err, data) {

        if(!err){
            console.log(data);
            res.send(data);
        }else{
            console.log(err);
        }
    })

});