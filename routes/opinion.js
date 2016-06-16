/**
 * Created by mamol on 16/06/16.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.render('opinion');
});

module.exports = router;