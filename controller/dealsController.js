/**
 * Created by rathi on 15/03/17.
 */

var Deal = require('../models/deals');
var mongoose = require('mongoose');
var User = require('../models/user');
var jwt = require('../node_modules/jsonwebtoken');
var config=require('../config');

//For User Subject Related Deals
exports.viewDealUpComing = function (req, res) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.param('Token');
    if(token){
        jwt.verify(token, config.secretKey, function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' , error:err});
            } else {
                var userId;
                if(decoded._id){
                    console.log("Inside decoded._id if block")
                    userId = decoded._id;
                }else{
                    console.log("Inside else block");
                    userId = decoded._doc._id;
                }
                console.log(userId);
                User.findOne({_id : userId},{Specialization:1},function (err,user) {
                    if(err){
                        res.send({
                            success : false,
                            message : 'Couldn\'t find the User'
                        })
                    }else{
                        console.log(user.Specialization);
                        Deal.find({subjectName: { $in :user.Specialization} , isActive: true}, function (err, docs) {
                            if(err){
                                res.json({
                                    message : 'Couldn\'t find Any Deal',
                                    error : err
                                });
                            }else {
                                res.json({
                                    responses : docs
                                })
                            }
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

//When the user accept button
exports.acceptedDeal = function (req,res) {        //Required : Token and Deal id in the request !!
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.param('Token');
    if(token){
        jwt.verify(token, config.secretKey,function (err,decoded) {
            if(err){
                return res.json({ success: false, message: 'Failed to authenticate token.' , error:err});
            }else {
                var user_id;
                if(decoded._id){
                    console.log("Inside decoded._id if block")
                    user_id = decoded._id;
                }else{
                    console.log("Inside else block");
                    user_id = decoded._doc._id;
                }
                console.log(user_id);
                Deal.findOne({_id : req.body._id},function (err,deal) {
                    if(err) {
                        res.send({
                            status: false,
                            message: 'Couldn\'t find the Deal'
                        })
                    }
                        else{
                                console.log(deal.isActive);
                                deal.isActive = false;
                                console.log(deal.isActive);
                                var randId = new mongoose.Types.ObjectId();
                                bookedStatusdata = {
                                    "bookingId":user_id,
                                    "status":"booked"
                                }
                                Deal.update({"_id":deal._id},{ "$push": { "bookedStatus": bookedStatusdata },"$set":{"isActive":false}},function(err) {
                                    if (err) {
                                        res.json({
                                            message: 'Unsuccessful',
                                            error: err
                                        });
                                    }
                                    else {
                                        res.json({
                                            success: true,
                                            message: 'Successful !! Deal Booked !!'
                                        });
                                    }
                                });
                        }
                    });
                }
            });

        }
    else
    {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }

}

//To view Live Session Deals
exports.liveDeals = function (req,res) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.param('Token');
    if(token){
        jwt.verify(token, config.secretKey,function (err,decoded) {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token.', error: err});
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
                Deal.find({dealType:"Live Session",'bookedStatus.bookingId': user_id},function (err,deal) {
                    if(err){
                        res.send({
                            status: false,
                            message: 'Couldn\'t find the Deal'
                        })
                    }else{
                        res.send(deal);
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

//To View Home Work Deals

exports.homeworkDeals = function (req,res) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.param('Token');
    if(token){
        jwt.verify(token, config.secretKey,function (err,decoded) {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token.', error: err});
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
                Deal.find({dealType:"Home Work",'bookedStatus': {$elemMatch: {bookingId: user_id}}},function (err,deal) {
                    if(err){
                        res.send({
                            status: false,
                            message: 'Couldn\'t find the Deal'
                        })
                    }else{
                        res.send(deal);
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