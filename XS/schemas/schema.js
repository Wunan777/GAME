var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
	name : String,
	age : Number
})

Schema.statics = {
	fetch : function(cb){
      return this
       .find({})
       .sort('age')
       .exec(cb);
	}
}

module.exports =  Schema;