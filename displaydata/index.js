// simple node.js application to receive data from eventbus store the data in memory
// and on get request print the data to console.log


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const mongoose = require('mongoose');
const MeasurementsM = require('./measurements.js').MeasurementsM;

console.log(process.env.DB_NAME);
console.log(process.env.DB_HOST);
var HOSTNAME = process.env.DB_HOST || 'localhost';
var PORT = process.env.DB_PORT || 27017;
var DATABASE = process.env.DB_NAME || 'co2Ampel';

console.log(PORT);
console.log(HOSTNAME);
console.log(DATABASE);

var DB_URI;
if (process.env.DB_USERNAME && process.env.DB_PASSWORD) {
  DB_URI = 'mongodb://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@' + HOSTNAME + ':' + PORT + '/' + DATABASE;
} else {
  DB_URI = 'mongodb://' + HOSTNAME + ':' + PORT + '/' + DATABASE;
}
mongoose.connect(DB_URI).then(() => {
  console.log("connected to mongo db");
});

// get request received - print the measurement data to console log and return it to requester
app.get('/data',(req,res)=> {
  MeasurementsM.find()
  .then((measurementdata) => {
    console.log(measurementdata);
    res.status(200).send(measurementdata);
  }).catch((err) => {
    console.log(err);
    res.status(400).send(err);
  });
}); 

// post event is received from eventbus - so put the data into memory
app.post('/events',(req,res)=> {
  const { type, measurementdata } = req.body;

  console.log(type); 
  console.log(measurementdata);
  
  const measurementsM = new MeasurementsM(measurementdata);

  measurementsM.save(function(err, measurementsM) {
    if (err) {
      console.log(err);
      return res.status(500).send;
    }
  });

  res.send({});
});

app.listen(4001, () => {
    console.log('Listening on 4001');
});