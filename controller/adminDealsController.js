/**
 * Created by rathi on 18/03/17.
 */
var Deal = require('../models/deals');
var jwt = require('../node_modules/jsonwebtoken');
var config=require('../config');

//Adding a new Deal by the admin
exports.addNewDeal = function (req,res) {
//Hello Random Comment
    var deal = new Deal();
    deal.adminName = req.body.adminName;
    deal.dealType = req.body.type;
    deal.dealDate = req.body.dealDate;
    deal.timeFrom = req.body.timeFrom;
    deal.endDate = req.body.endDate;
    deal.timeTo = req.body.timeTo;
    deal.clientName = req.body.clientName;
    deal.subjectName = req.body.subjectName;
    deal.pointsOffered = req.body.pointsOffered;
    deal.courseNumber = req.body.courseNumber;
    deal.duration = req.body.duration;
    deal.bookName = req.body.bookName;
    deal.numberOfTutor = req.body.numberOfTutor;
    deal.save(function (err) {
        if(err)
            res.json({
                message:'Unsuccessful',
                error : err
            });
        else {
            res.json({
                message: 'Successful!! New Deal Added'
            });
        }
    });
}



//View the Deal
exports.viewDeal=function(req,res){
    Deal.find({},function (err,deal) {
        if(err) {
            res.json({
                error: err
            });
        }
        else{
            res.send(deal);
        }

    })

}

//Editing the Deal by the Admin
exports.editDeal = function (req,res) {
    var dealId = req.body.dealId;
    if(dealId){
        Deal.findOne({_id:dealId},function (err,deal) {
            if(err){
                res.send({
                    message: 'Couldn\'t find any matching deals',
                    error: err
                });
            }else if(!deal){
                res.send({
                    message:'No Such Deal',
                    error : err
                });
            }else{
                deal.bookedStatus.bookingId = req.body.bookingId;
                deal.bookedStatus.status = req.body.status;
                deal.save(function (err) {
                    if(err)
                        res.json({
                            message:'Unsuccessful',
                            error : err
                        });
                    else
                        res.json({
                            message:'Successful !! Deal Edited !!',
                            error : err
                        });
                });
            }

        })
    }else{
        return res.status(403).send({
            success: false,
            message: 'No Deal Id is provided provided.'
        });
    }

}