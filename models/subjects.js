/**
 * Created by rathi on 07/03/17.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var subjectSchema = mongoose.Schema({

    subjectName : {type : String , unique : true},
    branch : String,
    dealsCount : Number
});

module.exports = mongoose.model('subject',subjectSchema);