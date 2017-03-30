/**
 * Created by rathi on 14/03/17.
 */

var User = require('../models/user');
var jwt = require('../node_modules/jsonwebtoken');
var config=require('../config');
var mongoose = require('mongoose');

exports.postUser= function(req,res){
    var user = new User();
    user._id = new mongoose.Types.ObjectId();
    user.Name = req.body.Name;
    var token=jwt.sign(user,config.secretKey, {
        expiresIn: 5184000  //expires in 2 months.
    });
    user.Phone=req.body.Phone;
    user.Password=req.body.Password;
    user.Email = req.body.Email;
    user.Token=token;
    user.save(function (err) {
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

exports.getUserToken= function (req,res) {
    User.findOne({
        Phone:req.body.Phone
    }, function (err, user) {
        if (err)
            throw err;
        if (!user) {
            res.json({
                success: false,
                message: 'User Not Registered'
            })
        }
        else if (user) {
            console.log('Inside Get user Token method of signIn');
            user.verifyPassword(req.body.Password, function (err, isMatch) {
                if (err)
                    res.json({
                        success: false,
                        message: 'Error'
                    });
                else if (isMatch) {
                    var signingData = {"_id":user._id,"Name":user.Name};
                    var token=jwt.sign(signingData, config.secretKey, {
                        expiresIn: 5184000  //expires in 2 months.
                    });
                    user.lastLogin = new Date();
                    user.save(function (err) {
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

exports.addSubjects = function (req,res) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.params('Token');
    if(token){
        jwt.verify(token, config.secretKey, function(err, decoded) {
            if(err){
                return res.json({ success: false, message: 'Failed to authenticate token.', error:err });
            }else
            {
                var user_id;
                if(decoded._id){
                    console.log("Inside decoded._id if block")
                    user_id = decoded._id;
                }else{
                    console.log("Inside else block");
                    user_id = decoded._doc._id;
                }
                console.log(user_id);
                User.findByIdAndUpdate(user_id,{"Specialization":req.body.subjects},function (err) {
                    if(err){
                        res.send({
                            success : false,
                            message : err
                        });
                    }else{
                        res.send({
                            success : true,
                            message : "Subjects added Successfully"
                        });
                    }

                })

            }
        });
    }else{
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }

}
/*exports.addSubjects = function(req, res){
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.params('Token');
    if(token){
        jwt.verify(token, config.secretKey, function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.', error:err });
            } else{
                User.findOne({Token:req.body.token}, function (err, user) {
                    if (err)
                        throw err;
                    if (!user) {
                        console.log('Inside The block if user is not found');
                        console.log(user);
                        res.json({
                            success: false,
                            message: 'Could Not get User !!',
                            error : err
                        })
                    }
                    else if (user) {
                        console.log(user);
                        user.Specialization = req.body.subjects;
                        user.save(function (err) {
                            if(err)
                                res.json({
                                    message:'Unsuccessful',
                                    error : err
                                });
                            else
                                res.json({
                                    message:'Successful !! Subjects added to user',
                                    error : err
                                });
                        });


                    }
                });
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
};
*/
exports.userProfile = function(req, res){
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.param('Token');
    if(token){
        jwt.verify(token, config.secretKey, function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                var user_id;
                if(decoded._id){
                    console.log("Inside decoded._id if block")
                    user_id = decoded._id;
                }else{
                    console.log("Inside else block");
                    user_id = decoded._doc._id;
                }
                console.log(user_id);
                User.findOne({_id :user_id}, function (err, user) {
                    if (err)
                        throw err;
                    if (!user) {
                        console.log('Inside The block if user is not found');
                        console.log(user);
                        res.json({
                            success: false,
                            message: 'Could Not get User !!'
                        })
                    }
                    else if (user) {
                        console.log(user);
                        res.json(user);
                    }
                });
            }
        });

    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
};

exports.editProfile = function (req,res) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.param('Token');
    if(token){
        jwt.verify(token,config.secretKey,function (err,decoded) {
            if(err){
                return res.json({success:false, message:'Failed to authenticate the Token'});
            }else{
                var user_id;
                if(decoded._id){
                    console.log("Inside decoded._id if block")
                    user_id = decoded._id;
                }else{
                    console.log("Inside else block");
                    user_id = decoded._doc._id;
                }
                console.log(user_id);
                    User.findOne({_id:user_id},function (err,user) {
                        if (err)
                            throw err;
                        if (!user) {
                            console.log('Inside The block if user is not found In Edit Profile');
                            console.log(user);
                            res.json({
                                success: false,
                                message: 'Could Not get User !!'
                            })
                        }
                        else if (user) {
                            console.log(user._id);
                            user.Name=req.body.Name || user.Name;
                            user.Phone=req.body.Phone || user.Phone;
                            // user.Password=req.body.Password;
                            user.Email = req.body.Email || user.Email;
                            user.modifiedAt = new Date();
                            user.Specialization = req.body.subjects || user.Specialization;
                            user.save(function (err) {
                                if(err)
                                    res.json({
                                        message:'Unsuccessful',
                                        error : err
                                    });
                                else
                                    res.json({
                                        message:'Successful !! Profile Edited !!'
                                    });
                            });
                        }
                    });
            }

        });
    }else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }

}
