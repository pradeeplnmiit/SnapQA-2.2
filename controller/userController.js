/**
 * Created by rathi on 14/03/17.
 */

var User = require('../models/user');
var UserHistory = require('../models/userHistory');
var jwt = require('../node_modules/jsonwebtoken');
var config=require('../config');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');

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
                            user.rating = req.body.rating || user.rating;
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

exports.dealsHistory = function (req,res) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.param('Token');
    if (token) {
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token.', error: err});
            } else {
                var user_id;
                var dealsFromDate = new Date(req.body.date);
                if (decoded._id) {
                    console.log("Inside decoded._id if block")
                    user_id = decoded._id;
                } else {
                    console.log("Inside else block");
                    user_id = decoded._doc._id;
                }
                console.log(user_id);
                UserHistory.find({userId:user_id,createdAt:{$gte:dealsFromDate}},function (err,userHistory) {
                    if(err)
                        res.json({
                            message:'Unsuccessful',
                            error : err
                        });
                    else if(!userHistory){
                        res.json({
                            message : 'No Deals History Found'
                        })
                    }
                    else
                        res.json({
                            response : userHistory
                        });
                })
            }
        });
    }
}

exports.editPaymentDetails = function (req,res) {
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
                User.findOneAndUpdate({_id :user_id},{"$set":{"bankDetails.accNo":req.body.accountNumber,"bankDetails.iFSC":req.body.ifscCode,"bankDetails.panNumber":req.body.panNumber}},function (err,user) {
                    if(err)
                        res.json({
                            message:'Unsuccessful',
                            error : err
                        });
                    else if(!user){
                        res.json({
                            message : 'No User Found'
                        })
                    }
                    else
                        res.json({
                            message:'Successful !! Bank Details Added !!'
                        });
                })

            }
        })
    }
    else{
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }

}


exports.welcomeEmail = function (req,res) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: '', // Your email id
            pass: '' // Your password
        }
    });

    var mailOptions = {
        from: 'SnapQA Admin<rsnapqa@gmail.com>', // sender address
        to: 'rsnapqa@gmail.com', // list of receivers
        subject: 'Welcome to SnapQA', // Subject line
        //text: 'Hi User, \n\n Thank you for Registration with SnapQA !!' // plaintext body
        html: '<b><p>Hi SnapQAUser,</p></br><p>Thank you for your registration to SnapQA.</p></br></br><p>Regards,</p><p>SnapQA Team</p></b>', // You can choose to send an HTML body instead

        attachments: [

            // // String attachment
            // {
            //     filename: 'notes.txt',
            //     content: 'Some notes about this e-mail',
            //     contentType: 'text/plain' // optional, would be detected from the filename
            // },
            // // // Binary Buffer attachment
            //  {
            //     filename: 'image.png',
            //     content: new Buffer('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
            //         '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
            //         'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC', 'base64'),
            //
            //     cid: 'note@example.com' // should be as unique as possible
            // },
            // File Stream attachment
            {
                filename: 'image.png',
                path: __dirname + '/assets/image.png',
                cid: 'nyan@example.com' // should be as unique as possible
            }
        ]
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            res.json({yo: 'error'});
        }else{
            console.log('Message sent: ' + info.response);
            res.json({yo: info.response});
        };
    });

}

exports.forgotPassword = function (req,res) {
    var phone = req.body.phone || "";
    var email = req.body.email || "";

    console.log(phone);
    console.log(email);
    if(phone || email)
    {
        User.findOne({$or : [{Phone: phone}, {Email: email}]},function (err,user) {

            if(err) {
                res.json({
                    message: 'UnSuccessful',
                    error: err
                });
            }
            else if(!user){
                    res.json({
                        message:'No user with given information'
                    });
                }
            else if(phone){
                res.json({
                    message : 'User Found by Phone Number',
                    user : user.Phone
                });
            }else if(email){
                res.json({
                    message : 'User Found by Email',
                    user : user.Email
                });
            }
        });
    }
    else{
        res.json({
           message : 'No Phone or email in the body'
        });
    }
}
exports.resetPassword = function (req,res) {
    var phone = req.body.phone || "";
    var password = req.body.password ;
    console.log(phone);
    if(phone)
    {

        User.findOne({Phone:phone},function (err,user) {

            if(err) {
                res.json({
                    message: 'UnSuccessful',
                    error: err
                });
            }
            else {

                user.Password = password;
                user.save(function (err) {
                    if(err){
                        res.json({
                            message: 'UnSuccessful',
                            error: err
                        });
                    }else{
                        res.json({
                            message : 'PasswordResetSuccessfully',
                            user : user.Password
                        });
                    }
                });

            }
        });
    }
    else{
        res.json({
            message : 'No Phone in the body'
        });
    }
}

exports.otpVerified = function (req, res) {

    var phone = req.body.phone;

    User.findOneAndUpdate({Phone :phone},{"$set":{"isPhoneVerified":true}},function (err,user) {
        if(err)
            res.json({
                message:'Unsuccessful',
                error : err
            });
        else if(!user){
            res.json({
                message : 'No User Found'
            })
        }
        else
            res.json({
                message:'Successful'
            });
    })

}