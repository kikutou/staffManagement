/**
 * Created by mamol on 16/06/15.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.render('work_exam');
});

module.exports = router;