var express = require('express');
var router = express.Router();
var userController = require('../controller/userController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({
      message : "Successfully connected to the User Route !!"
  });
});

router.route('/signup').post(userController.postUser);
router.route('/signin').post(userController.getUserToken);
router.route('/addSubjects').post(userController.addSubjects);
router.route('/userProfile').post(userController.userProfile);

//edit User Profile
router.route('/editProfile').post(userController.editProfile);
router.route('/paymentDetails').post(userController.editPaymentDetails);
router.route('/welcomeEmail').get(userController.welcomeEmail);
router.route('/forgotPassword').post(userController.forgotPassword);
module.exports = router;
