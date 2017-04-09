/**
 * Created by rathi on 18/03/17.
 */
var express = require('express');
var router = express.Router();
var admindealsController = require('../controller/adminDealsController');


router.get('/', function(req, res, next) {
    res.send('Inside The Admin Route !!');
});

//add new Deals
router.route('/addNewDeal').post(admindealsController.addNewDeal);

//view the Deals
router.route('/viewDeals').get(admindealsController.viewDeal);

//Edit the deal
router.route('/editDeal').post(admindealsController.editDeal);
router.route('/overAll').get(admindealsController.overAllList);
module.exports = router;