/**
 * Created by OLA on 22/02/17.
 */

var mongoose= require('mongoose');
var bcrypt=require('bcrypt-nodejs');
var id = mongoose.Schema.Types.ObjectId;
var DealSchema = mongoose.Schema({

    adminName : {type :String},
    dealType : String,                            //Reporting Live or Home Work
    timeFrom : { type : Date},
    timeTo : {type: Date},
    duration : Number,
    clientName:{type: String},
    subjectName: String,
    bookName:String,
    courseNumber : String,
    examType : String,
    amount:Number,
    priceTold:Number,
    priceReceived : String,
    materialComment : String,
    numberOfTutors : Number,
    ratingArray : [{ type : Number}],
    statusCode : Number,
    statusMsg: String,
    resolvePayment:{type : Boolean , default:false},
    note : String,
    isActive : {type : Boolean , default:true},  //False when the deal is Completed
    isFloating :{type : Boolean , default:false},
    createdAt : {type : Date , default: new Date()},
    modifiedAt : {type : Date , default: new Date()},
    contributor : [{                                                      //Will be Filled Automatically when tutor accepts the deal
                        bookingId :id,
                        userName : String,
                        rating : Number
    }],
    feedback : [{
                    rating:Number,
                    comments : String

    }]
});

module.exports = mongoose.model('Deal', DealSchema);
