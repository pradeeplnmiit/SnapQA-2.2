/**
 * Created by rathi on 16/03/17.
 */

var express = require('express');
var router = express.Router();
var dealsController = require('../controller/dealsController');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('In Deals Router !!');
});

router.route('/viewDealsUpComing').post(dealsController.viewDealUpComing);
router.route('/acceptedDeal').post(dealsController.acceptedDeal);
router.route('/liveDeals').post(dealsController.liveDeals);
router.route('/homeWorkDeals').post(dealsController.homeworkDeals);
module.exports = router;