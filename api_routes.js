const express = require('express');
//Requiring the express package
const router = express.Router();
//Using the express router function
const SensorData = require('./models/BODYstructure');
//SensorData inhabits the model we created in the file directed to above
const sendmessage = require('./messageclient');
//Import the routine used to send emails

//This POST request allows one to add new entries to the database
router.post('/convergeio', function(req, res, next){
  SensorData.create(req.body).then(function(sensor_data){
    res.send(sensor_data);
      }).catch(next);
    });

//PUT request allows one to update an entry in the database
router.put('/convergeio/:id', function(req, res, next){
//---------------------FULL PACKAGE ERROR CHECK-------------------------//

var timecheck = req.body.time; // Hold the values of the updated time and Id
var idcheck = req.body.sensorId;
//If the new time value is null
if(!timecheck){
console.log('oh no there is no time');
res.status(400).send({error: 'There is no time input'});
}
//If the sensorId is null
else if(!idcheck){
console.log('oh no there is no id');
res.status(400).send({error: 'There is no id input'});
}
//-----------------------DUPLICATE ERROR CHECK------------------------//
SensorData.find({
  $and : [
  {sensorId: {$in: [idcheck]}},
  {time: {$in: [timecheck]}} // Finding to see if the entry is already logged
]
}).countDocuments().then(function(copies){
  console.log(copies);
  if(copies>0)
  {
    console.log('Duplicated file')
    res.status(409).send({error: 'This is a duplicated entry'});
  }
})
//---------------------------------------------------------------------//

//Update in db and show the updated entry
SensorData.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
  SensorData.findOne({_id: req.params.id}).then(function(sensor_data){
    res.send(sensor_data);
    res.status(204)
    });
  })
});

// Define variables searching within time
var upperbound = 1550; //corresponds to time 15:50
var lowerbound = 400; // time 04:00

router.get('/convergeio/:sensorId', function(req, res, next){
//This GET request gets all the players with the inputted sensorId
    SensorData.find({
      $and : [
            {time: {$gt: lowerbound, $lt: upperbound}},
            {sensorId: req.params.sensorId}
      ]

    }).then(function(sensor_data){
      res.send(sensor_data);
    });
});

router.get('/convergeio/', function(req, res, next){
//Another GET route to get every data entry
  SensorData.find().then(function(sensor_data){
    res.send(sensor_data);
  });
});

//-------------------------EMAILS TO CLIENT----------------------------//
var toohigh = 70;
var toolow = 20; // General constraints of sensors for testing
var message =''; // The message to be emailed

// Search our database for values which are outside these constraints
SensorData.find({
$and : [
  {$or: [{value: {$gt: toohigh}}, {value:{$lt: toolow}}]},
  {sensorId: 1001}
       ]
}).countDocuments().then(function(body){
 if (!body) //If we don't count a warning value, we email saying all is in order
  {
    message = 'Just an update, all the sensors are in order';
    sendmessage(message); // Calling the email module
    console.log('Update, all good');
    return;
  }
  else //If not email a warning - this can be modified to include exact values
  {
    message = 'Warning sensor has measured dangerous value';
    console.log('Warning dangerous sensor');
    sendmessage(message);
  }
});

//--------------------------------------------------------------------//

//Export this route module to the server
module.exports = router;
