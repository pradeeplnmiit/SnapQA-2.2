/**
 * Created by rathi on 07/03/17.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var id = mongoose.Schema.Types.ObjectId();
var issueSchema = mongoose.Schema({

    userId : id,
    dealId : id,
    issueType : String,
    explanation : String,
    createdAt : {type:Date , default:new Date()}
});

module.exports = mongoose.model('issues',issueSchema);