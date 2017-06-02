/**
 * Created by rathi on 18/03/17.
 */
var express = require('express');
var router = express.Router();
var admindealsController = require('../controller/adminDealsController');
var adminController = require('../controller/adminController');

router.get('/', function(req, res, next) {
    res.send('Inside The Admin Route !!');
});

router.route('/signUp').post(adminController.postAdmin);
router.route('/signIn').post(adminController.getAdminToken);

//add new Deals
router.route('/addNewDeal').post(admindealsController.addNewDeal);

//view the Deals
router.route('/viewDeals').get(admindealsController.viewDeal);
//view deals where Payment is not resolved
router.route('/paymentNotResolvedDeals').get(admindealsController.paymentNotResolvedDeal);
//View Date Specific deals
router.route('/viewDateSpecificDeals').post(admindealsController.dateSpecificDeals);
//Edit the deal
router.route('/editDeal').post(admindealsController.editDeal);
router.route('/overAll').get(admindealsController.overAllList);
router.route('/usersList').get(admindealsController.usersList);
module.exports = router;