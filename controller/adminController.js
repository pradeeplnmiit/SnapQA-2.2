/**
 * Created by rathi on 31/05/17.
 */
var Admin = require('../models/admin');
var jwt = require('../node_modules/jsonwebtoken');
var config=require('../config');
var mongoose = require('mongoose');

exports.postAdmin= function(req,res){
    var admin = new Admin();
    admin._id = new mongoose.Types.ObjectId();
    admin.Name = req.body.Name;
    var token=jwt.sign(admin,config.secretKey, {
        expiresIn: 5184000  //expires in 2 months.
    });
    admin.Phone=req.body.Phone;
    admin.Password=req.body.Password;
    admin.Email = req.body.Email;
    admin.Token=token;
    admin.save(function (err) {
        if(err)
            res.json({
                message:'Unsuccessful',
                error : err
            });
        else
            res.json({
                message:'Successful',
                token:token
            });
    });
};

exports.getAdminToken= function (req,res) {
    Admin.findOne({
        Phone:req.body.Phone
    }, function (err, admin) {
        if (err)
            throw err;
        if (!admin) {
            res.json({
                success: false,
                message: 'User Not Registered'
            })
        }
        else if (admin) {
            console.log('Inside Get admin Token method of signIn');
            admin.verifyPassword(req.body.Password, function (err, isMatch) {
                if (err)
                    res.json({
                        success: false,
                        message: 'Error'
                    });
                else if (isMatch) {
                    var signingData = {"_id":admin._id,"Name":admin.Name};
                    var token=jwt.sign(signingData, config.secretKey, {
                        expiresIn: 5184000  //expires in 2 months.
                    });
                    admin.lastLogin = new Date();
                    admin.save(function (err) {
                        if(err)
                            res.json({
                                message:'Unsuccessful'
                            });
                        else
                            res.json({
                                message:'Successful',
                                token:token
                            });
                    });
                }
                else {
                    res.json({
                        success: false,
                        message: 'Password Incorrect'
                    });
                }
            });
        }
    });
};
