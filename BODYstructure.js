const mongoose = require('mongoose');
//Requirment explained on server.js
const Schema = mongoose.Schema;
//const Schema now has the mongoose packages

const EntrySchema = new Schema({
  //Schema has the body required by converge
  sensorId:{
    type:String,
    required:[true]
  },
  time:{
    type:Number,
  },
  value:{
    type: Number,
  }
});

const DataBody = mongoose.model('data', EntrySchema);
//Creates a collection of these EntrySchemas

module.exports = DataBody;
//Export this model to use in our routes
