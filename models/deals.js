/**
 * Created by OLA on 22/02/17.
 */

var mongoose= require('mongoose');
var bcrypt=require('bcrypt-nodejs');
var id = mongoose.Schema.Types.ObjectId;
var DealSchema = mongoose.Schema({

    adminName : {type :String, required : true},
    dealType : String,                                           //Home Work or Live Session
    createdAt : {type : Date , default: new Date()},
    dealDate : { type : Date , required:true},
    timeFrom : String,
    endDate : {type: Date},
    timeTo : String,
    duration : Number,
    clientName:{
        type: String,
        required: true
    },
    subjectName: String,
    courseNumber : String,
    bookName:String,
    materialComment : String,
    numberOfTutor : Number,
    ratingsArray : [{ type : String}],
    pointsOffered : Number,
    refMaterialURL : String,
    isActive : {type : Boolean , default:true},                           //False when the deal is Completed
    bookedStatus : [{                                                      //Will be Filled Automatically when tutor accepts the deal
                        bookingId :id,
                        status : {type:String, default:"pending"}
    }],
    feedback : [{
                    rating:Number,
                    comments : String

    }]
});

module.exports = mongoose.model('Deal', DealSchema);
