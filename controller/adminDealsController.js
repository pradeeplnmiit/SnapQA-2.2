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