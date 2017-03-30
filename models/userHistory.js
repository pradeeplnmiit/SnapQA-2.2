/**
 * Created by rathi on 07/03/17.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var id = mongoose.Schema.Types.ObjectId();
var userHistorySchema = mongoose.Schema({

        userId : id,
        dealsId : id,
        status : String,
        pointsEarned : Number

});

module.exports = mongoose.model('userHistory',userHistorySchema);