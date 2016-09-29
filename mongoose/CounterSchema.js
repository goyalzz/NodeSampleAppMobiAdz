var mongoose = require('mongoose');

// create the counters schema with an _id field and a seq field
var CounterSchema = mongoose.Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});

// create a model from that schema
module.exports = mongoose.model('counter', CounterSchema);