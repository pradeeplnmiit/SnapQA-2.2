/**
 * Created by rathi on 07/03/17.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var id = mongoose.Schema.Types.ObjectId();
var userTransactionSchema = mongoose.Schema({

    userId : id,
    createdAt : {type : Date, default : new Date()},
    transType : String,                                      //Earned or Redeemed or Requested
    amount : Number
});

module.exports = mongoose.model('userTransactions',userTransactionSchema);