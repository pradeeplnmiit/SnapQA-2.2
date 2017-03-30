/**
 * Created by rathi on 07/03/17.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var id = mongoose.Schema.Types.ObjectId();
var sessionSchema = mongoose.Schema({

    sessionId : {type:id , required:true},
    userId : id,
    deviceId : id,
    createdAt : {type:Date , default: new Date()},
    destroyedAt : Date

});

module.exports = mongoose.model('session',sessionSchema);
