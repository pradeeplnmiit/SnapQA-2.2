/**
 * Created by rathi on 18/03/17.
 */
var Deal = require('../models/deals');
var User = require('../models/user');
var jwt = require('../node_modules/jsonwebtoken');
var config=require('../config');
var UserHistory = require('../models/userHistory');
//Adding a new Deal by the admin
exports.addNewDeal = function (req,res) {
//Hello Random Comment
    var deal = new Deal();
    deal.adminName = req.body.adminName;
    deal.dealType = req.body.dealType;
    if(deal.dealType == "Live Session"){
        deal.timeFrom = new Date(req.body.timeFrom);
        console.log(deal.timeFrom.getHours());
    }
    deal.timeTo = new Date(req.body.timeTo);
    deal.statusCode = req.body.statusCode;
    deal.statusMsg = req.body.statusMsg;
    deal.duration = req.body.duration;
    deal.clientName = req.body.clientName;
    deal.subjectName = req.body.subjectName;
    deal.bookName = req.body.bookName;
    deal.amount = req.body.amount;
    if(deal.dealType=="Deadline Session"){
        deal.priceTold = req.body.priceTold;
    }
    deal.priceReceived = req.body.priceReceived;
    deal.courseNumber = req.body.courseNumber;
    deal.examType = req.body.examType;                                 //Changed to capital T from t
    deal.materialComment = req.body.materialComment;
    deal.numberOfTutor = req.body.numberOfTutor;
    deal.ratingArray = req.body.ratingArray;
    deal.resolvePayment = req.body.resolvePayment;
    deal.note = req.body.note;
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
    var dealId = req.body._id;
    console.log(dealId);
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
                deal.adminName = req.body.data.adminName || deal.adminName;
                deal.dealType = req.body.data.dealType || deal.dealType;
                if(deal.dealType == "Reporting Live" && req.body.data.timeFrom != undefined){
                    deal.timeFrom = new Date(req.body.data.timeFrom) ;
                    console.log("Inside TimeFrom If Block");
                    console.log(deal.timeFrom.getHours());
                }
                if(req.body.data.timeTo != undefined){
                    deal.timeTo = new Date(req.body.data.timeTo);
                    console.log("Inside if of Time to");
                }
                deal.duration = req.body.data.duration || deal.duration;
                deal.clientName = req.body.data.clientName || deal.clientName;
                 deal.subjectName = req.body.data.subjectName;
                deal.bookName = req.body.data.bookName || deal.bookName;
                deal.amount = req.body.data.amount || deal.amount;
                deal.priceTold = req.body.data.priceTold || deal.priceTold;
                deal.statusCode = req.body.data.statusCode || deal.statusCode;
                deal.statusMsg = req.body.data.statusMsg || deal.statusMsg;
                deal.isFloating = req.body.data.isFloating || deal.isFloating;
                deal.priceReceived = req.body.data.priceReceived || deal.priceReceived;
                deal.courseNumber = req.body.data.courseNumber || deal.courseNumber;
                deal.examType = req.body.data.examType || deal.examType;                         //Changed to capital T from t
                deal.materialComment = req.body.data.materialComment || deal.materialComment;
                deal.numberOfTutor = req.body.data.numberOfTutor || deal.numberOfTutor;
                deal.ratingArray = req.body.data.ratingArray || deal.ratingArray;
                deal.resolvePayment = req.body.data.resolvePayment || deal.resolvePayment;
                deal.isActive = req.body.data.isActive || deal.isActive;
                deal.note = req.body.data.note || deal.note;
                deal.modifiedAt = new Date();
                if(deal.statusMsg=="Got Answers,Not Payment"){
                    var userId = req.body.data.userId;
                    var userHist = new UserHistory();
                    userHist.userId = userId;
                    userHist.dealsId = dealId;
                    userHist.status = "Submitted";
                    userHist.save(function (err) {
                        if(err)
                            res.send({
                                message:'Unsuccessful in Saving details in user History',
                                error : err
                            });
                        else {
                            deal.save(function (err) {
                                if(err)
                                    res.json({
                                        message:'Unsuccessful',
                                        error : err
                                    });
                                else{
                                    res.json({
                                        message:"Successful Edit the Deal and Added deals History for the user"});
                                }

                            });
                        }
                    })
                }else if(deal.statusMsg=="Payment Done Finally"){
                    var userId = req.body.data.userId;
                    UserHistory.findOne({userId:userId,dealsId:dealId},function (err,userHistory) {
                        if(err){
                                    res.send({
                                        message:"Error in Finding the corresponding deal and user"
                                    })
                        }else{
                                var id = userHistory._id;
                                UserHistory.update({_id:id},{$set:{"status":"Earned Points 350"}},function (err,userHistoryUpdated) {
                                    if(err){
                                        res.send({
                                            message:"Couldn't update the deals History of the user"
                                        })
                                    }else{
                                        deal.save(function (err) {
                                            if(err)
                                                res.json({
                                                    message:'Unsuccessful',
                                                    error : err
                                                });
                                            else{
                                                res.json({
                                                    message:"Successful Edit the Deal and Updated deals History for the user"});
                                            }

                                        });
                                    }
                                });
                        }

                    });


                }else{
                    deal.save(function (err) {
                    if(err)
                        res.json({
                            message:'Unsuccessful',
                            error : err
                        });
                    else{
                        res.json({
                            message:"Successfully Edited the Deal"
                        });

                    }

                });}

            }
        })
    }else
{
    return res.status(403).send({
        success: false,
        message: 'No Deal Id is provided provided.'
    });
}
}

exports.paymentNotResolvedDeal=function(req,res){
    Deal.find({resolvePayment:false},function (err,deal) {
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

exports.dateSpecificDeals=function(req,res){
    var queriedDate = new Date(req.body.date);
    console.log("Queried Date :"+queriedDate);
    var queryStartDate = new Date(queriedDate.getTime() + 6*60*60*1000 + 30*60*1000);
    var queryEndDate = new Date(queryStartDate.getTime() + 24*60*60*1000);
    console.log("Start Date :"+queryStartDate);
    console.log("End Date : "+queryEndDate);
    Deal.find({"timeFrom":{$gte:queryStartDate,$lte:queryEndDate}},function (err,deal) {
        if(err) {
            res.json({
                error: err
            });
        }
        else{
            // var dateNow = new Date();
            // var twelvehrsTimeStampValue = 12*60*60*1000;
            // var dateStartOfDate = new Date(2017,5,1);
            // var test = dateStartOfDate.getTime() + twelvehrsTimeStampValue;
            // var nextDayDate = test + 24*60*60*1000;
            // console.log("Testing Date : "+(new Date(test)));
            // console.log("Next Day Date : "+new Date(nextDayDate));
            // console.log("Testing Deal Date : "+(new Date(deal[0].timeFrom)));
            res.send(deal);
        }

    })

}

exports.overAllList = function (req,res) {
    var subjects = [ 'Thermodynamics',
        'Heat Transfer',
        'Fluid Mechanics',
        'Thermo Fluids',
        'Compressible Fluid',
        'Computational Fluid Dynamics',
        'Internal Combustion',
        'Turbomachines',
        'Statics',
        'Dynamics',
        'Strength Of Materials',
        'Theory Of Machines',
        'Machine Design',
        'Vibrations',
        'System Dynamics',
        'Design of Machine',
        'Manufacturing Process',
        'Material Science',
        'Measurements',
        'Composite Material',
        'Instrumentation',
        'Finite Element Analysis',
        'Engineering Drawing',
        'Autocad',
        'Ansys',
        'Solid Works',
        'Robotics',
        'Statics',
        'Dynamics',
        'Strength of Material',
        'Environmental Engineering',
        'Structural Analysis',
        'Hydraulics',
        'Soil Mechanics',
        'Surveying',
        'Fluid Mechanics',
        'Engineering Drawing',
        'Solid Works',
        'Transportation Engineering',
        'Basic EC',
        'Circuits',
        'Measurement',
        'Control System',
        'Embedded System',
        'Power System',
        'Electrical Engineering',
        'Robotics',
        'Matlab',
        'Linear Algebra',
        'Precalculus',
        'Calculus 1',
        'Calculus 2',
        'Calculus 3',
        'Differential Equations',
        'Vectors',
        'Sequence and Series',
        'Numerical Methods',
        'Probability',
        'Statistics',
        'Complex Maths',
        'Mechanics',
        'Physics',
        'Electrostatics',
        'Modern Physics',
        'Optics',
        'Sound and Waves',
        'Gravitation',
        'Inorganic',
        'Organic',
        'Physical',
        'General Chemistry',
        'Matlab',
        'C/C++',
        'Java',
        'Solid Works',
        'Ansys',
        'Autocad',
        'VBA',
        'Visual Studio',
        'App/Web Development',
        'Finance',
        'Accountancy',
        'Engineering Economics',
        'Operations Research',
        'Statistics',
        'Probability',
        'Robotics',
        'Philosophy',
        'Humanities',
        'Powder Metallurgy',
        'Alternative Energy',
        'Essay Writing',
        'Geology',
        'Geophysics',
        'Operations Research',
        'Engineering Cost Analysis' ];
    var admins = ["Ankit","Anoop","Manish","Parveen","Vishal"];
    var examType = {"ReportingLive":[
                                        "Exam","Final Exam","Quiz","PopUp Quiz"
                                    ],
                    "Deaddline" :   [
                                        "HomeWork","Lab","Project"
                                    ]
    }

    var statusMessage = ["Successful","Unsuccessful","Cancelled"];
    res.json({
                subjectList : subjects,
                adminList : admins,
                examType : examType,
                statusMessage : statusMessage
    });
}

exports.usersList = function (req,res) {
    User.find({},{Name:1,Specialization:1,Email:1,Phone:1},function (err,users) {
        if(err){
            res.status(500);
            res.json({
                message : "Unsuccessful",
                error : err
            });
        }else{
            res.json({
                responses : users
            });
        }
    })
}