var mongoose= require('mongoose');
var bcrypt=require('bcrypt-nodejs');

var UserSchema= new mongoose.Schema({

    Name:{
        type:String,
        required:true,
        trim:true
    },

    // nickName : {type: String , unique : true},
    Phone:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },

    Email:{
        type:String,
        required:true,
        unique:true
    },
    Password:{
        type:String,
        required:true
    },

    imageURL: String,
    Points : {type: Number , default:0},
    rating : {type:Number, default:0},
    Specialization : [String],
    bankDetails : {
        accNo : String,
        iFSC : String,
        panNumber : String
    },
    isPhoneVerified : {type : Boolean , default:false},
    createdAt : {type: Date , default: new Date()},
    lastLogin : {type : Date, default: new Date()},
    modifiedAt : {type : Date, default: new Date()},
    registrationFrom : String,
    Token:String
});

UserSchema.pre('save',function (cb) {
    var user=this;
    if(!user.isModified('Password')) return cb();
    bcrypt.genSalt(5,function (err,salt) {
        if(err)
            return cb(err);
        bcrypt.hash(user.Password, salt, null, function(err, hash) {
            if (err) return callback(err);
            user.Password = hash;
            cb();
        });
    });
});

UserSchema.methods.verifyPassword=function (password,cb) {
    bcrypt.compare(password,this.Password,function (err,isMatch) {
        if(err)
            return cb(err);
        return cb(null,isMatch);
    });
};


module.exports= mongoose.model('User',UserSchema);