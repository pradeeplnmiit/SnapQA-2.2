/**
 * Created by rathi on 31/05/17.
 */
var mongoose= require('mongoose');
var bcrypt=require('bcrypt-nodejs');

var AdminSchema= new mongoose.Schema({

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
    createdAt : {type: Date , default: new Date()},
    lastLogin : {type : Date, default: new Date()},
    modifiedAt : {type : Date, default: new Date()},
    Token:String
});

AdminSchema.pre('save',function (cb) {
    var admin=this;
    if(!admin.isModified('Password')) return cb();
    bcrypt.genSalt(5,function (err,salt) {
        if(err)
            return cb(err);
        bcrypt.hash(admin.Password, salt, null, function(err, hash) {
            if (err) return callback(err);
            admin.Password = hash;
            cb();
        });
    });
});

AdminSchema.methods.verifyPassword=function (password,cb) {
    bcrypt.compare(password,this.Password,function (err,isMatch) {
        if(err)
            return cb(err);
        return cb(null,isMatch);
    });
};


module.exports= mongoose.model('Admin',AdminSchema);