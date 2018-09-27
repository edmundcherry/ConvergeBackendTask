const express = require('express');
//Import express package.
const routes = require('./api_routes');
//Import our routes module
const app = express();
//Creates the express application

const mongoose = require('mongoose');
//Mongoose provides methods to save, edit and get data with ease from mongodb
const bodyParser = require('body-parser'); //req.body
//Finds the body of request, parses it and attaches it to the request object


mongoose.connect('mongodb://localhost:27017/convergeio', { useNewUrlParser: true});
//'convergeio' here is the respective db address in robomongo
mongoose.Promise = global.Promise;
//Override mongoose promise as it's deprecated

//--------------------------MIDDLEWARE--------------------------------//
app.use(express.static('public'));
//Use our express application
app.use(bodyParser.json());
//Parse JSON data and attach to object
app.use('/api',routes);
//Use our middleware routes and attach an ''/api' into our address
//---------------------------------------------------------------------//
const hostname = 'localhost';
const port = 1337;

//Deploys the app to this localhost address
app.listen(port, hostname, function(){
  console.log(`Server is up and running, find it on://${hostname}:${port}/`);
});
