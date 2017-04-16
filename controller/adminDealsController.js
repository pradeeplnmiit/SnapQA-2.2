/**
 * Created by rathi on 18/03/17.
 */
var Deal = require('../models/deals');
var User = require('../models/user');
var jwt = require('../node_modules/jsonwebtoken');
var config=require('../config');

//Adding a new Deal by the admin
exports.addNewDeal = function (req,res) {
//Hello Random Comment
    var deal = new Deal();
    deal.adminName = req.body.adminName;
    deal.dealType = req.body.dealType;
    if(deal.dealType == "Reporting Live"){
        deal.timeFrom = new Date(req.body.timeFrom);
        console.log(deal.timeFrom.getHours());
    }
    deal.timeTo = new Date(req.body.timeTo);
    deal.duration = req.body.duration;
    deal.clientName = req.body.clientName;
    // deal.subjectName = req.body.subjectName;
    deal.bookName = req.body.bookName;
    deal.amount = req.body.amount;
    if(deal.dealType=="Home Work"){
        deal.priceTold = req.body.priceTold;
    }
    deal.priceReceived = req.body.priceReceived;
    deal.courseNumber = req.body.courseNumber;
    deal.examType = req.body.examtype;
    deal.materialComment = req.body.materialComment;
    deal.numberOfTutor = req.body.numberOfTutor;
    deal.ratingArray = req.body.ratingArray;
    deal.resolvePayment = req.body.resolvePayment;
    deal.note = req.body.note;
    deal.dealStatus = req.body.dealStatus;
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
                deal.adminName = req.body.adminName || deal.adminName;
                deal.dealType = req.body.dealType || deal.dealType;
                if(deal.dealType == "Reporting Live" && req.body.timeFrom != undefined){
                    deal.timeFrom = new Date(req.body.timeFrom) ;
                    console.log("Inside TimeFrom If Block");
                    console.log(deal.timeFrom.getHours());
                }
                if(req.body.timeTo != undefined){
                    deal.timeTo = new Date(req.body.timeTo);
                    console.log("Inside if of Time to");
                }
                deal.duration = req.body.duration || deal.duration;
                deal.clientName = req.body.clientName || deal.clientName;
                // deal.subjectName = req.body.subjectName;
                deal.bookName = req.body.bookName || deal.bookName;
                deal.amount = req.body.amount || deal.amount;
                if(deal.dealType=="Home Work"){
                    deal.priceTold = req.body.priceTold || deal.priceTold;
                }
                deal.priceReceived = req.body.priceReceived || deal.priceReceived;
                deal.courseNumber = req.body.courseNumber || deal.courseNumber;
                deal.examType = req.body.examtype || deal.examType;
                deal.materialComment = req.body.materialComment || deal.materialComment;
                deal.numberOfTutor = req.body.numberOfTutor || deal.numberOfTutor;
                deal.ratingArray = req.body.ratingArray || deal.ratingArray;
                deal.resolvePayment = req.body.resolvePayment || deal.resolvePayment;
                deal.note = req.body.note || deal.note;
                deal.dealStatus = req.body.dealStatus || deal.dealStatus;
                deal.modifiedAt = new Date();
                deal.save(function (err) {
                    if(err)
                        res.json({
                            message:'Unsuccessful',
                            error : err
                        });
                    else
                        res.json({
                            message:'Successful !! Deal Edited !!'
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
        'Control System',
        'Measurements',
        'Composite Material',
        'Instrumentation',
        'Finite Element Analysis',
        'Engineering Drawing',
        'Autocad',
        'Ansys',
        'Solid Works',
        'Matlab',
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
        'Electrostatics',
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
        'VBA',
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
    var admins = ["Ankit","Anoop","Hardik","Parveen","Vishal"];
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