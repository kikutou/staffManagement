var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.render('side_bar');
});

module.exports = router;
/**
 * Created by mamol on 16/06/13.
 */
