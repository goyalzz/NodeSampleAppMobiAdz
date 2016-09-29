// https://coligo.io/create-url-shortener-with-node-express-mongo/
var mongoose = require('mongoose');
var counter = require('../mongoose/CounterSchema.js');

// create a schema for our links
var urlSchema = new mongoose.Schema({
  _id: {type: Number, index: true},
  long_url: String,
  created_at: {type: Date, default: Date.now}
});

// The pre('save', callback) middleware executes the callback function
// every time before an entry is saved to the urls collection.
urlSchema.pre('save', function(next){
  var doc = this;
  // find the url_count and increment it by 1
  counter.findByIdAndUpdate({_id: 'url_count'}, {$inc: {seq: 1} }, function(error, counter) {
      if (error)
          return next(error);
      // set the _id of the urls collection to the incremented value of the counter
      doc._id = counter.seq;
      next();
  });
});

// create a model from that schema
module.exports = mongoose.model('Url', urlSchema);